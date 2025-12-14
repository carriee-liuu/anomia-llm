import asyncio
import hashlib
import hmac
import json
import os
import time
from typing import Any, Dict, List, Optional, Tuple

import httpx


def _get_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required env var: {name}")
    return value


def verify_slack_signature(
    *,
    signing_secret: str,
    timestamp: str,
    signature: str,
    raw_body: bytes,
    tolerance_seconds: int = 60 * 5,
) -> bool:
    try:
        ts_int = int(timestamp)
    except Exception:
        return False

    now = int(time.time())
    if abs(now - ts_int) > tolerance_seconds:
        return False

    basestring = f"v0:{timestamp}:{raw_body.decode('utf-8')}"
    digest = hmac.new(
        signing_secret.encode("utf-8"),
        basestring.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    expected = f"v0={digest}"
    return hmac.compare_digest(expected, signature or "")


def parse_cursor_mention_command(text: str) -> Tuple[str, Optional[str], str]:
    """
    Returns (mode, workflow_file, ref).

    Supported:
      - "build frontend [ref]"
      - "deploy frontend [ref]"
      - "build ci [ref]"
      - "take a stab" / "create a pr" / "make a pr" / "open a pr"
      - "help"

    The text usually includes "<@BOTID>" mention; we strip all "<@...>" tokens.
    """
    ref = "main"
    if not text:
        return "help", None, ref

    # Remove mention tokens like "<@U123ABC>"
    parts = [p for p in text.split() if not (p.startswith("<@") and p.endswith(">"))]
    if not parts:
        return "help", None, ref

    # Allow "ref=branch" anywhere
    normalized = []
    for p in parts:
        if p.startswith("ref=") and len(p) > 4:
            ref = p[4:]
        else:
            normalized.append(p.lower())

    if not normalized:
        return "help", None, ref

    if normalized[0] in {"help", "?"}:
        return "help", None, ref

    # Heuristic: PR-request phrasing anywhere in message
    joined = " ".join(normalized)
    if (
        "take a stab" in joined
        or "create a pr" in joined
        or "make a pr" in joined
        or "open a pr" in joined
        or "create pr" in joined
        or "make pr" in joined
        or "open pr" in joined
    ):
        return "pr", "cursor-slack-pr.yml", ref

    # e.g. "build frontend"
    action = normalized[0]
    target = normalized[1] if len(normalized) > 1 else ""
    if len(parts) >= 3 and not any(p.startswith("ref=") for p in parts):
        # third token as ref shorthand (e.g., "build ci develop")
        ref = parts[2]

    if action in {"build", "deploy"} and target in {"frontend", "fe"}:
        return "build", "deploy-frontend.yml", ref
    if action == "build" and target in {"ci", "pipeline"}:
        return "build", "ci-cd.yml", ref

    return "help", None, ref


async def dispatch_github_workflow(
    *,
    owner: str,
    repo: str,
    workflow_file: str,
    ref: str,
    github_token: str,
    inputs: Optional[Dict[str, str]] = None,
) -> None:
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_file}/dispatches"
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "cursor-slack-build-bot",
    }
    payload: Dict[str, Any] = {"ref": ref}
    if inputs:
        payload["inputs"] = inputs
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        # GitHub returns 204 No Content on success
        if resp.status_code != 204:
            raise RuntimeError(f"GitHub dispatch failed ({resp.status_code}): {resp.text}")


async def get_latest_workflow_run_url(
    *,
    owner: str,
    repo: str,
    workflow_file: str,
    branch: str,
    github_token: str,
) -> Optional[str]:
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_file}/runs"
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "cursor-slack-build-bot",
    }
    params = {"branch": branch, "per_page": 1}
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(url, headers=headers, params=params)
        if resp.status_code != 200:
            return None
        data = resp.json()
        runs = data.get("workflow_runs") or []
        if not runs:
            return None
        return runs[0].get("html_url")


async def slack_post_message(
    *,
    bot_token: str,
    channel: str,
    text: str,
    thread_ts: Optional[str] = None,
) -> None:
    url = "https://slack.com/api/chat.postMessage"
    headers = {
        "Authorization": f"Bearer {bot_token}",
        "Content-Type": "application/json; charset=utf-8",
    }
    payload = {"channel": channel, "text": text}
    if thread_ts:
        payload["thread_ts"] = thread_ts
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(url, headers=headers, content=json.dumps(payload))
        data = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
        if resp.status_code != 200 or not data.get("ok"):
            raise RuntimeError(f"Slack postMessage failed ({resp.status_code}): {resp.text}")


async def slack_get_thread_context_text(
    *,
    bot_token: str,
    channel: str,
    thread_ts: str,
    limit: int = 20,
) -> str:
    """
    Fetches thread replies and returns a compact text summary.
    Requires Slack scopes: channels:history/groups:history/im:history/mpim:history (depending on channel type).
    """
    url = "https://slack.com/api/conversations.replies"
    headers = {"Authorization": f"Bearer {bot_token}"}
    params = {"channel": channel, "ts": thread_ts, "limit": limit}
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(url, headers=headers, params=params)
        data = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
        if resp.status_code != 200 or not data.get("ok"):
            # If we can't read history, return empty context (demo-friendly)
            return ""
        messages: List[Dict[str, Any]] = data.get("messages") or []
        lines: List[str] = []
        for m in messages[-limit:]:
            txt = (m.get("text") or "").strip()
            if not txt:
                continue
            user = m.get("user") or m.get("username") or "unknown"
            ts = m.get("ts") or ""
            lines.append(f"- ({ts}) {user}: {txt}")
        return "\n".join(lines)


async def handle_slack_build_request(
    *,
    channel: str,
    thread_ts: Optional[str],
    text: str,
) -> None:
    """
    Background handler: parse command, dispatch workflow, reply in Slack.
    """
    slack_bot_token = _get_env("SLACK_BOT_TOKEN")
    github_token = _get_env("GITHUB_TOKEN")
    owner = os.getenv("GITHUB_OWNER")
    repo = os.getenv("GITHUB_REPO")
    gh_repo = os.getenv("GITHUB_REPOSITORY")  # optional "owner/repo"

    if (not owner or not repo) and gh_repo and "/" in gh_repo:
        owner, repo = gh_repo.split("/", 1)
    if not owner or not repo:
        raise RuntimeError("Set GITHUB_OWNER and GITHUB_REPO (or GITHUB_REPOSITORY).")

    mode, workflow_file, ref = parse_cursor_mention_command(text)
    if not workflow_file:
        usage = (
            "Usage:\n"
            "- `@cursor build frontend [ref]`\n"
            "- `@cursor build ci [ref]`\n"
            "- `@cursor can you take a stab at this and create a pr?`\n"
            "Examples:\n"
            "- `@cursor build frontend main`\n"
            "- `@cursor build ci ref=develop`"
        )
        await slack_post_message(bot_token=slack_bot_token, channel=channel, text=usage, thread_ts=thread_ts)
        return

    if mode == "build":
        await slack_post_message(
            bot_token=slack_bot_token,
            channel=channel,
            text=f"Starting `{workflow_file}` on `{ref}`…",
            thread_ts=thread_ts,
        )

        await dispatch_github_workflow(
            owner=owner,
            repo=repo,
            workflow_file=workflow_file,
            ref=ref,
            github_token=github_token,
        )
    else:
        # PR demo flow: include Slack context and ask text as workflow inputs.
        effective_thread_ts = thread_ts
        context_text = ""
        if effective_thread_ts:
            context_text = await slack_get_thread_context_text(
                bot_token=slack_bot_token,
                channel=channel,
                thread_ts=effective_thread_ts,
                limit=20,
            )

        await slack_post_message(
            bot_token=slack_bot_token,
            channel=channel,
            text="Taking a stab and opening a PR…",
            thread_ts=thread_ts,
        )

        await dispatch_github_workflow(
            owner=owner,
            repo=repo,
            workflow_file=workflow_file,
            ref=ref,
            github_token=github_token,
            inputs={
                "slack_channel": channel,
                "slack_thread_ts": effective_thread_ts or "",
                "prompt": text[:1000],
                "context": context_text[:8000],
            },
        )

    # Give GitHub a moment to create the run record
    await asyncio.sleep(1.5)
    run_url = await get_latest_workflow_run_url(
        owner=owner,
        repo=repo,
        workflow_file=workflow_file,
        branch=ref,
        github_token=github_token,
    )

    if run_url:
        await slack_post_message(
            bot_token=slack_bot_token,
            channel=channel,
            text=f"Workflow dispatched. Latest run: {run_url}",
            thread_ts=thread_ts,
        )
    else:
        await slack_post_message(
            bot_token=slack_bot_token,
            channel=channel,
            text="Workflow dispatched. (Couldn’t fetch run URL yet—check GitHub Actions.)",
            thread_ts=thread_ts,
        )

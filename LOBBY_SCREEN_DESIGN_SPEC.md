# Lobby Screen Design Spec for Figma

## Component Structure

```
Lobby Screen
├── Exit Button (Fixed Top Right)
│   └── X Icon
├── Main Container (Full Screen, Centered)
│   └── Content Wrapper (max-width: 4xl, centered)
│       ├── Header Section
│       │   ├── "LOBBY" Title Box
│       │   ├── Room Code Box
│       │   │   ├── "ROOM CODE:" Label
│       │   │   ├── Room Code Text
│       │   │   └── Copy Button (ClipboardCopy/Check Icon)
│       │   └── Settings Button (Host Only)
│       │       └── Settings Icon + "SETTINGS" Text
│       │
│       └── Main Grid (3 Columns on Large, 1 Column on Mobile)
│           ├── Left Column (2/3 width on large screens)
│           │   └── Players List Card
│           │       ├── Header
│           │       │   ├── Users Icon
│           │       │   └── "PLAYERS (X/8)" Text
│           │       └── Player List
│           │           ├── Player Items
│           │           │   ├── Avatar Circle
│           │           │   │   ├── Crown Icon (Host) OR Initial Letter
│           │           │   ├── Player Info
│           │           │   │   ├── Player Name
│           │           │   │   │   └── "(HOST)" Badge (if host)
│           │           │   │   └── Joined Time
│           │           │   └── Crown Icon (Host indicator, right side)
│           │           └── Empty Slot Placeholder (if < 8 players)
│           │               ├── UserPlus Icon
│           │               └── "Waiting for more players..." Text
│           │
│           └── Right Column (1/3 width on large screens)
│               ├── Game Settings Card (Conditional - Host Only, when toggled)
│               │   ├── "GAME SETTINGS" Heading
│               │   └── Settings Form
│               │       ├── Rounds Selector
│               │       ├── Difficulty Selector
│               │       └── Time Limit Selector
│               │
│               ├── Start Game Card
│               │   ├── "READY TO PLAY?" Heading
│               │   ├── Status Message (if can't start)
│               │   └── "START GAME" Button
│               │       ├── Play Icon
│               │       └── "START GAME" Text
│               │
│               └── Recent Activity Card (Conditional - if messages exist)
│                   ├── MessageCircle Icon + "RECENT ACTIVITY" Heading
│                   └── Message List (max 5, scrollable)
```

## Colors

### CSS Variables (OKLCH format)
```css
--background: oklch(0.95 0.02 60) (Warm cream beige)
--foreground: oklch(0.2 0.05 280) (Navy/Dark Blue)
--card: oklch(0.98 0.01 60) (Off-white)
--primary: oklch(0.5 0.2 340) (Deep magenta/purple)
--accent: oklch(0.65 0.22 80) (Orange/Gold)
--muted: oklch(0.88 0.02 60) (Light beige)
--muted-foreground: oklch(0.45 0.05 280) (Medium gray-blue)
--destructive: oklch(0.55 0.22 25) (Red)
--border: oklch(0.35 0.08 280) (Dark navy)
```

### Color Usage
- **Page Background**: `oklch(0.95 0.02 60)` (Warm cream beige)
- **Card Background**: `oklch(0.98 0.01 60)` (Off-white)
- **Primary Text**: `oklch(0.2 0.05 280)` (Navy/Dark Blue)
- **Heading Text**: `oklch(0.5 0.2 340)` (Deep magenta/purple)
- **Primary Button Background**: `oklch(0.5 0.2 340)` (Deep magenta/purple)
- **Primary Button Text**: White
- **Disabled Button Background**: `oklch(0.88 0.02 60)` (Light beige)
- **Disabled Button Text**: `oklch(0.45 0.05 280)` (Medium gray-blue)
- **Host Player Background**: `oklch(0.65 0.22 80)` (Orange/Gold) with accent
- **Regular Player Background**: `oklch(0.95 0.02 60)` (Warm cream)
- **Host Avatar Background**: `oklch(0.5 0.2 340)` (Deep magenta/purple)
- **Regular Avatar Background**: `oklch(0.65 0.22 80)` (Orange/Gold)
- **Border Color**: `oklch(0.35 0.08 280)` (Dark navy)
- **Muted Text**: `oklch(0.45 0.05 280)` (Medium gray-blue)
- **Success/Activity Text**: `oklch(0.5 0.2 340)` (Primary purple)
- **Error Text**: `oklch(0.55 0.22 25)` (Red)

## Typography

### Font Families
- **Heading Font**: `'Press Start 2P'` (8-bit pixel font, monospace)
  - Font weight: 400 (regular)
  - Letter spacing: `0.05em`
- **Body Font**: `'Courier Prime'` (Monospace, retro serif)
  - Font weight: 400 (regular), 700 (bold)
  - Letter spacing: `-0.005em`

### Font Sizes

#### Mobile
- **Lobby Title**: `36px` (2.25rem) - `font-heading`
- **Room Code Label**: `14px` (0.875rem) - `font-sans`
- **Room Code Value**: `20px` (1.25rem) - `font-sans bold`
- **Section Headings**: `20px` (1.25rem) - `font-heading`
- **Player Names**: `16px` (1rem) - `font-sans bold`
- **Player Details**: `14px` (0.875rem) - `font-sans`
- **Button Text**: `18px` (1.125rem) - `font-heading`
- **Status Messages**: `14px` (0.875rem) - `font-sans`
- **Settings Labels**: `14px` (0.875rem) - `font-sans bold`
- **Activity Messages**: `14px` (0.875rem) - `font-sans`

#### Desktop/Tablet
- **Lobby Title**: `60px` (3.75rem) - `font-heading`
- **Room Code Label**: `14px` (0.875rem) - `font-sans`
- **Room Code Value**: `20px` (1.25rem) - `font-sans bold`
- **Section Headings**: `24px` (1.5rem) - `font-heading`
- **Player Names**: `16px` (1rem) - `font-sans bold`
- **Player Details**: `14px` (0.875rem) - `font-sans`
- **Button Text**: `18px` (1.125rem) - `font-heading`
- **Status Messages**: `14px` (0.875rem) - `font-sans`
- **Settings Labels**: `14px` (0.875rem) - `font-sans bold`
- **Activity Messages**: `14px` (0.875rem) - `font-sans`

## Spacing

### Padding
- **Page Padding**: `16px` (1rem) - `p-4`
- **Card Padding**: 
  - Mobile: `24px` (1.5rem) - `p-6`
  - Desktop: `24px` (1.5rem) - `p-6`
- **Title Box Padding**:
  - Mobile: `24px 24px 12px 24px` (horizontal), `12px` (vertical) - `px-6 py-3`
  - Desktop: `48px 48px 24px 48px` (horizontal), `24px` (vertical) - `px-12 py-6`
- **Player Item Padding**: `16px` (1rem) - `p-4`
- **Button Padding**: 
  - Mobile: `16px 24px` - `py-4 px-6`
  - Desktop: `16px 24px` - `py-4 px-6`

### Margins & Gaps
- **Header Bottom Margin**: `32px` (2rem) - `mb-8`
- **Title Box Bottom Margin**: `24px` (1.5rem) - `mb-6`
- **Section Gap**: `32px` (2rem) - `gap-8`
- **Card Gap (Right Column)**: `24px` (1.5rem) - `space-y-6`
- **Player List Gap**: `16px` (1rem) - `space-y-4`
- **Settings Form Gap**: `16px` (1rem) - `space-y-4`
- **Icon Gap**: `8px` (0.5rem) - `gap-2`

## Borders & Shadows

### Border Styles
- **Card Border**: 
  - Width: `4px` (Mobile), `6px` (Desktop)
  - Style: `solid`
  - Color: `oklch(0.35 0.08 280)` (Dark navy)
  - Radius: `0` (square corners)
- **Player Item Border**: 
  - Width: `3px`
  - Style: `solid`
  - Color: `oklch(0.35 0.08 280)` (Dark navy)
  - Radius: `0`
- **Empty Slot Border**: 
  - Width: `3px`
  - Style: `dashed`
  - Color: `oklch(0.35 0.08 280)` (Dark navy)
  - Radius: `0`

### Shadow Styles
- **Card Shadow**: 
  - Offset: `6px 6px` (Mobile), `8px 8px` (Desktop)
  - Blur: `0px`
  - Spread: `0px`
  - Color: `rgba(0, 0, 0, 0.3)`
  - Style: `shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]`
- **Player Item Shadow**: 
  - Offset: `4px 4px`
  - Blur: `0px`
  - Spread: `0px`
  - Color: `rgba(0, 0, 0, 0.3)`
  - Style: `shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`
- **Button Hover Shadow**: 
  - Offset: `8px 8px` (on hover)
  - Blur: `0px`
  - Spread: `0px`
  - Color: `rgba(0, 0, 0, 0.3)`
  - Transform on hover: `translate-x-[-2px] translate-y-[-2px]`

## Layout & Dimensions

### Container Widths
- **Max Content Width**: `896px` (56rem) - `max-w-4xl`
- **Title Box Max Width**: `512px` (32rem) - `max-w-lg`
- **Card Width**: `100%` (responsive)

### Grid Layout
- **Desktop (lg+)**: 3 columns, left column spans 2, right column spans 1
- **Mobile**: 1 column, stacked vertically

### Avatar Dimensions
- **Avatar Size**: `40px × 40px` - `w-10 h-10`
- **Avatar Border**: `3px` - `border-[3px]`
- **Icon Size**: `20px` - `w-5 h-5` (Crown, Initial)

### Button Dimensions
- **Start Game Button**: 
  - Width: `100%`
  - Height: Auto (padding-based)
  - Min Height: `56px`
- **Exit Button**: 
  - Size: `40px × 40px` (including padding)
  - Icon Size: `20px × 20px`
- **Copy Button**: 
  - Icon Size: `20px × 20px`
- **Settings Button**: 
  - Padding: `16px` - `px-4 py-2`
  - Icon Size: `20px × 20px`

## Icons

### Icon Specifications
- **Exit Button (X)**: 
  - Size: `20px × 20px`
  - Color: `oklch(0.2 0.05 280)` (Navy)
  - Icon: `lucide-react X`
- **Users Icon**: 
  - Size: `24px × 24px` (Mobile), `24px × 24px` (Desktop)
  - Color: `oklch(0.2 0.05 280)` (Navy)
  - Icon: `lucide-react Users`
- **Crown Icon**: 
  - Size: `20px × 20px` (Avatar), `24px × 24px` (Right side indicator)
  - Color: White (in avatar), `oklch(0.5 0.2 340)` (Primary purple, right side)
  - Icon: `lucide-react Crown`
- **ClipboardCopy/Check Icon**: 
  - Size: `20px × 20px`
  - Color: `oklch(0.5 0.2 340)` (Primary purple)
  - Icon: `lucide-react ClipboardCopy` or `Check`
- **Settings Icon**: 
  - Size: `20px × 20px`
  - Color: `oklch(0.2 0.05 280)` (Navy)
  - Icon: `lucide-react Settings`
- **Play Icon**: 
  - Size: `24px × 24px`
  - Color: White (in button)
  - Icon: `lucide-react Play`
- **UserPlus Icon**: 
  - Size: `32px × 32px`
  - Color: `oklch(0.45 0.05 280)` (Muted gray-blue)
  - Icon: `lucide-react UserPlus`
- **MessageCircle Icon**: 
  - Size: `20px × 20px`
  - Color: `oklch(0.2 0.05 280)` (Navy)
  - Icon: `lucide-react MessageCircle`

## Components Breakdown

### 1. Exit Button
```
Position: Fixed, top-right corner (top-4 right-4)
Padding: 8px (p-2)
Background: oklch(0.95 0.02 60) (Background beige)
Border: 3px solid oklch(0.35 0.08 280)
Shadow: 4px 4px 0px 0px rgba(0,0,0,0.3)
Hover:
  - Background: oklch(0.88 0.02 60) (Muted beige)
  - Transform: translate-x-[-2px] translate-y-[-2px]
  - Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)
```

### 2. Lobby Title Box
```
Background: oklch(0.95 0.02 60) (Background beige)
Border: 4px (mobile) / 6px (desktop) solid oklch(0.35 0.08 280)
Padding: 
  - Mobile: px-6 py-3 (24px horizontal, 12px vertical)
  - Desktop: px-12 py-6 (48px horizontal, 24px vertical)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3) (mobile) / 8px 8px 0px 0px (desktop)
Text: "LOBBY"
Font: Press Start 2P
Size: text-4.5xl (mobile) / text-6xl (desktop)
Color: oklch(0.5 0.2 340) (Primary purple)
Tracking: tracking-wider (mobile) / tracking-widest (desktop)
Alignment: Center
```

### 3. Room Code Box
```
Background: oklch(0.98 0.01 60) (Card/Off-white)
Border: 4px solid oklch(0.35 0.08 280)
Padding: px-4 py-2 (16px horizontal, 8px vertical)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)
Layout: Flex row, items center, gap-4
Contents:
  - Label: "ROOM CODE:" (font-sans, text-sm, oklch(0.2 0.05 280))
  - Value: Room code (font-sans, text-xl, bold, oklch(0.2 0.05 280))
  - Copy Button: Icon only, ml-3, primary color, hover:text-primary/80
```

### 4. Settings Button (Host Only)
```
Background: oklch(0.98 0.01 60) (Card/Off-white)
Border: 4px solid oklch(0.35 0.08 280)
Padding: px-4 py-2 (16px horizontal, 8px vertical)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)
Text: "SETTINGS" (font-sans, bold)
Icon: Settings icon, inline, mr-2
Hover: bg-muted (oklch(0.88 0.02 60))
```

### 5. Players List Card
```
Background: oklch(0.98 0.01 60) (Card/Off-white)
Border: 4px solid oklch(0.35 0.08 280)
Padding: 24px (p-6)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)

Header:
  - Layout: Flex row, items-center, gap-2
  - Text: "PLAYERS (X)" (font-heading, text-xl/title-2xl)
  - Icon: Users icon, w-6 h-6

Player List:
  - Layout: space-y-4 (16px gap)
  - Animation: Fade in from left with stagger
```

### 6. Player Item
```
Layout: Flex row, items-center, justify-between, p-4
Border: 3px solid oklch(0.35 0.08 280)
Shadow: 4px 4px 0px 0px rgba(0,0,0,0.3)

Background:
  - Host: bg-accent (oklch(0.65 0.22 80)) Orange/Gold
  - Regular: bg-background (oklch(0.95 0.02 60)) Beige

Left Side (Flex row, items-center, gap-3):
  - Avatar Circle:
    - Size: 40px × 40px (w-10 h-10)
    - Border: 3px solid oklch(0.35 0.08 280)
    - Background:
      - Host: bg-primary (oklch(0.5 0.2 340)) Purple
      - Regular: bg-accent (oklch(0.65 0.22 80)) Orange
    - Content:
      - Host: Crown icon, white, w-5 h-5
      - Regular: Initial letter, white, font-heading, text-lg
  - Player Info:
    - Name: font-sans, bold, text-foreground
      - Host badge: "(HOST)" (ml-2, text-primary, text-sm, font-heading)
    - Joined Time: font-sans, text-sm, text-muted-foreground

Right Side (Host only):
  - Crown icon, w-6 h-6, text-primary
```

### 7. Empty Slot Placeholder
```
Layout: border-[3px] border-dashed, bg-background, p-4, text-center
Border: 3px dashed oklch(0.35 0.08 280)
Shadow: 4px 4px 0px 0px rgba(0,0,0,0.3)
Icon: UserPlus, w-8 h-8, text-muted-foreground, mx-auto, mb-2
Text: "Waiting for more players..." (font-sans, text-muted-foreground)
```

### 8. Game Settings Card (Conditional, Host Only)
```
Background: oklch(0.98 0.01 60) (Card/Off-white)
Border: 4px solid oklch(0.35 0.08 280)
Padding: 24px (p-6)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)

Heading: "GAME SETTINGS" (font-heading, text-lg/text-xl, mb-4)

Form (space-y-4):
  - Label: font-sans, text-sm, bold, text-foreground, block, mb-2
  - Select: 
    - Width: 100%
    - Padding: px-3 py-2 (12px horizontal, 8px vertical)
    - Background: bg-background (oklch(0.95 0.02 60))
    - Border: 3px solid oklch(0.35 0.08 280)
    - Text: font-sans, text-foreground

Settings:
  - NUMBER OF ROUNDS: 3, 5, 7, 10
  - DIFFICULTY: Easy, Medium, Hard
  - TIME LIMIT: 20, 30, 45, 60 seconds
```

### 9. Start Game Card
```
Background: oklch(0.98 0.01 60) (Card/Off-white)
Border: 4px solid oklch(0.35 0.08 280)
Padding: 24px (p-6)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)

Heading: "READY TO PLAY?" (font-heading, text-lg/text-xl, mb-4)

Status Message (if can't start):
  - Text: font-sans, text-sm, text-muted-foreground
  - Messages:
    - "Need X more player(s) to start"
    - "Only the host can start the game"

Button:
  - Width: 100%
  - Padding: py-4 px-6 (16px vertical, 24px horizontal)
  - Font: font-heading, text-lg
  - Border: 4px solid oklch(0.35 0.08 280)
  - Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)
  
  Enabled State:
    - Background: bg-primary (oklch(0.5 0.2 340)) Purple
    - Text: White
    - Hover:
      - Background: bg-primary/90
      - Transform: translate-x-[-2px] translate-y-[-2px]
  
  Disabled State:
    - Background: bg-muted (oklch(0.88 0.02 60)) Light beige
    - Text: text-muted-foreground (oklch(0.45 0.05 280))
    - Cursor: not-allowed

Button Contents:
  - Play icon, w-6 h-6, inline, mr-2
  - Text: "START GAME"
```

### 10. Recent Activity Card (Conditional)
```
Background: oklch(0.98 0.01 60) (Card/Off-white)
Border: 4px solid oklch(0.35 0.08 280)
Padding: 24px (p-6)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)

Heading:
  - Layout: Flex row, items-center, gap-2
  - Text: "RECENT ACTIVITY" (font-heading, text-lg/text-xl, mb-4)
  - Icon: MessageCircle, w-5 h-5

Message List:
  - Max Height: 128px (max-h-32)
  - Overflow: vertical scroll (overflow-y-auto)
  - Layout: space-y-2 (8px gap)
  - Limit: Last 5 messages (slice(-5))

Message Item:
  - Timestamp: font-sans, text-sm, text-muted-foreground
  - Text: font-sans, ml-2
    - Success: text-primary (oklch(0.5 0.2 340))
    - Error: text-destructive (oklch(0.55 0.22 25))
    - Warning: text-accent (oklch(0.65 0.22 80))
    - Default: text-foreground (oklch(0.2 0.05 280))
```

## Animations

### Entrance Animations
- **Header**: Fade in from top (opacity 0 → 1, y: -20 → 0), duration 0.6s
- **Left Column (Players)**: Fade in from left (opacity 0 → 1, x: -20 → 0), duration 0.6s, delay 0.2s
- **Right Column**: Fade in from right (opacity 0 → 1, x: 20 → 0), duration 0.6s, delay 0.4s
- **Player Items**: Fade in from left with stagger (opacity 0 → 1, x: -20 → 0), duration 0.3s, delay: index * 0.1s
- **Settings Card**: Scale in (opacity 0 → 1, scale: 0.95 → 1)

### Exit Animations
- **Player Items (on leave)**: Fade out to right (opacity 1 → 0, x: 0 → 20), duration 0.3s

### Hover Animations
- **Exit Button**: Translate up and left, shadow increase
- **Start Game Button (enabled)**: Translate up and left, shadow increase
- **Settings Button**: Background color change to muted
- **Copy Button**: Icon color opacity change (text-primary → text-primary/80)

## Responsive Breakpoints

### Mobile (default, < 768px)
- Single column layout
- Smaller padding and font sizes
- Border widths: 4px
- Shadows: 6px offset

### Tablet/Desktop (md: ≥ 768px, lg: ≥ 1024px)
- Grid layout: 3 columns (2 + 1)
- Larger padding and font sizes
- Border widths: 6px
- Shadows: 8px offset

## Conditional Rendering

### Host-Only Elements
- Settings Button (header)
- Game Settings Card (when toggled)
- Start Game Button (always visible, but only host can click)

### State-Based Rendering
- **Settings Card**: Visible only when `showSettings === true` and `isHost === true`
- **Activity Card**: Visible only when `messages.length > 0`
- **Empty Slot**: Always visible (no player limit)
- **Status Message**: Visible only when `!canStartGame`

### Button States
- **Start Game Button**:
  - Enabled: `canStartGame === true` (players.length >= 2 && isHost)
  - Disabled: `canStartGame === false`

### Copy Button States
- **Default**: ClipboardCopy icon
- **Copied**: Check icon (2 second timeout)

## Sample Data

### Sample Players List
```javascript
players = [
  {
    id: "player-1",
    name: "Alice",
    isHost: true,
    joinedAt: "2024-01-15T10:00:00Z",
    score: 0
  },
  {
    id: "player-2",
    name: "Bob",
    isHost: false,
    joinedAt: "2024-01-15T10:05:00Z",
    score: 0
  },
  {
    id: "player-3",
    name: "Charlie",
    isHost: false,
    joinedAt: "2024-01-15T10:10:00Z",
    score: 0
  }
]
```

### Sample Room Code
```
"ABCD12"
```

### Sample Messages
```javascript
messages = [
  {
    text: "Alice joined the game",
    type: "success",
    timestamp: "2024-01-15T10:00:00Z"
  },
  {
    text: "Bob joined the game",
    type: "success",
    timestamp: "2024-01-15T10:05:00Z"
  },
  {
    text: "Room is ready",
    type: "info",
    timestamp: "2024-01-15T10:10:00Z"
  }
]
```

## Tailwind Class Reference

### Common Classes Used
```css
/* Layout */
flex, flex-col, flex-row
grid, grid-cols-1, lg:grid-cols-3
items-center, justify-between, justify-center
gap-2, gap-4, gap-8
space-y-4, space-y-6

/* Sizing */
w-full, w-10, h-10, w-6, h-6, w-5, h-5
max-w-4xl, max-w-lg, max-w-md
p-2, p-4, p-6
px-4, px-6, px-12
py-2, py-3, py-4, py-6
mb-2, mb-4, mb-6, mb-8

/* Typography */
font-heading, font-sans
text-xl, text-lg, text-sm
text-primary, text-foreground, text-muted-foreground
text-white, text-center
font-bold
tracking-wider, tracking-widest

/* Colors */
bg-background, bg-card, bg-primary, bg-accent, bg-muted
text-primary, text-foreground, text-muted-foreground
border-foreground

/* Borders */
border-[3px], border-[4px], md:border-[6px]
border-solid, border-dashed

/* Shadows */
shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]
md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]

/* Effects */
hover:bg-muted, hover:bg-primary/90
hover:translate-x-[-2px], hover:translate-y-[-2px]
hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]
cursor-not-allowed
transition-all

/* Positioning */
fixed, top-4, right-4
z-50
```

## Design Notes

1. **Retro Arcade Aesthetic**: All components use sharp corners (border-radius: 0), pixelated shadows, and bold borders to maintain the retro arcade game feel.

2. **Color Hierarchy**: 
   - Purple (`oklch(0.5 0.2 340)`) for primary actions and host indicators
   - Orange/Gold (`oklch(0.65 0.22 80)`) for accents and regular player avatars
   - Navy (`oklch(0.2 0.05 280)`) for text and borders
   - Beige (`oklch(0.95 0.02 60)`) for backgrounds

3. **Visual Hierarchy**: 
   - Host players are visually distinct with orange/gold background and purple avatar
   - Disabled buttons use muted colors
   - Empty states are subtle with dashed borders

4. **Interaction Feedback**: 
   - All interactive elements have hover states with translation and shadow effects
   - Copy button changes icon to provide visual feedback
   - Buttons have clear enabled/disabled states

5. **Accessibility**: 
   - High contrast between text and backgrounds
   - Clear visual indicators for interactive elements
   - Status messages provide feedback on game readiness

6. **Responsive Design**: 
   - Layout adapts from single column (mobile) to 3-column grid (desktop)
   - Font sizes scale appropriately
   - Border widths and shadows increase on larger screens


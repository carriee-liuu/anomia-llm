# Game Over Screen Design Spec for Figma

## Component Structure

```
Game Over Screen
├── Container (Full Screen)
│   └── Content Wrapper (max-width: 2xl, centered)
│       └── Main Card
│           ├── Trophy Icon
│           ├── "GAME OVER!" Heading
│           ├── Winner Section (conditional)
│           │   ├── "WINNER:" Label
│           │   ├── Winner Name
│           │   └── Winner Score
│           ├── Final Scores Section
│           │   ├── "FINAL SCORES" Heading
│           │   └── Score List
│           │       └── Player Score Items (ranked)
│           └── Action Button (conditional - host only)
│               └── "PLAY AGAIN" Button
│           └── Waiting Message (conditional - non-host)
```

## Colors

### CSS Variables (OKLCH format)
```css
--background: #f9ece2 (Warm cream)
--foreground: oklch(0.35 0.08 280) (Navy/Dark Blue)
--card: oklch(1.0 0.0 0) (White)
--primary: #a71b86 (Deep magenta)
--accent: oklch(0.7 0.15 60) (Orange/Gold)
--muted-foreground: oklch(0.35 0.08 280) (Navy/Dark Blue)
--border: oklch(0.35 0.08 280) (Navy/Dark Blue)
```

### Color Usage
- **Background**: `#f9ece2` (warm cream)
- **Card Background**: White (`#ffffff`)
- **Primary Text/Icon**: `#a71b86` (deep magenta)
- **Heading Text**: `#a71b86` (deep magenta)
- **Winner Name**: `oklch(0.7 0.15 60)` (orange/gold)
- **Winner Background (1st place)**: `oklch(0.7 0.15 60)` (orange/gold)
- **Regular Text**: `oklch(0.35 0.08 280)` (navy/dark blue margin-bottom)
- **Muted Text**: `oklch(0.35 0.08 280)` (navy/dark blue with reduced opacity)
- **Button Background**: `#a71b86` (deep magenta)
- **Button Text**: White
- **Border Color**: `oklch(0.35 0.08 280)` (navy/dark blue)

## Typography

### Heading Font (font-heading)
- **Family**: 'Press Start 2P', 'Courier New', monospace
- **Weight**: 400
- **Letter Spacing**: 0.1em (10% of font size)

### Body Font (font-sans)
- **Family**: 'Bitter', 'Georgia', 'Times New Roman', serif
- **Weight**: 400 (regular), 700 (bold)

### Font Sizes (Responsive)
- Mobile first, then desktop (md: breakpoint at 768px)

**"GAME OVER!" Heading**:
- Mobile: `text-4xl` (2.25rem / 36px)
- Desktop: `text-5xl` (3rem / 48px)

**Winner Name**:
- Mobile: `text-3xl` (1.875rem / 30px)
- Desktop: `text-4xl` (2.25rem / 36px)

**"FINAL SCORES" Heading**:
- Mobile: `text-2xl` (1.5rem / 24px)
- Desktop: `text-3xl` (1.875rem / 30px)

**Player Names**:
- Mobile: `text-lg` (1.125rem / 18px)
- Desktop: `text-xl` (1.25rem / 20px)
- **Weight**: Bold (700)

**Player Scores**:
- Mobile: `text-xl` (1.25rem / 20px)
- Desktop: `text-2xl` (1.5rem / 24px)

**"WINNER:" Label**:
- Mobile: `text-lg` (1.125rem / 18px)
- Desktop: `text-xl` (1.25rem / 20px)

**Winner Score**:
- Mobile: `text-xl` (1.25rem / 20px)
- Desktop: `text-2xl` (1.5rem / 24px)

**Button Text**:
- Mobile: `text-xl` (1.25rem / 20px)
- Desktop: `text-2xl` (1.5rem / 24px)

**Waiting Message**:
- Mobile/Desktop: `text-lg` (1.125rem / 18px)

## Spacing

### Padding
- **Container**: `p-4` (1rem / 16px) on all sides
- **Main Card**: 
  - Mobile: `p-8` (2rem / 32px)
  - Desktop: `p-12` (3rem / 48px)

### Margins
- **Trophy Icon Bottom**: `mb-6` (1.5rem / 24px)
- **"GAME OVER!" Bottom**: `mb-4` (1rem / 16px)
- **Winner Section Bottom**: `mb-8` (2rem / 32px)
- **"WINNER:" Label Bottom**: `mb-2` (0.5rem / 8px)
- **Winner Score Top**: `mt-2` (0.5rem / 8px)
- **Final Scores Section Bottom**: `mb-8` (2rem / 32px)
- **"FINAL SCORES" Heading Bottom**: `mb-4` (1rem / 16px)
- **Score List Items Gap**: `space-y-3` (0.75rem / 12px between items)
- **Player Score Item Padding**: `p-4` (1rem / 16px)

### Gaps
- **Button Icon Gap**: `mr-2` (0.5rem / 8px)

## Layout

### Container
- Full viewport height: `min-h-screen`
- Center content: `flex items-center justify-center`
- Padding: `p-4` (1rem / 16px)

### Content Wrapper
- Max width: `max-w-2xl` (42rem / 672px)
- Full width: `w-full`
- Text align: `text-center`

### Main Card
- Background: White (`bg-card`)
- Border: `border-[4px]` (4px solid)
- Border color: Navy (`border-foreground`)
- Shadow: `shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]` (offset: 8px, blur: 0, spread: 0, obtuse black 30% opacity)

### Score List Items
- Layout: `flex justify-between items-center`
- Border: `border-[3px]` (3px solid)
- Shadow: `shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]` (offset: 4px)
- **1st Place**: Background `bg-accent` (orange/gold)
- **Other Places**: Background `bg-background` (cream)

### Button
- Width: Mobile `w-full`, Desktop `md:w-auto`
- Padding: `px-8 py-4` (348px horizontal, 1rem / 16px vertical)
- Background: `bg-primary` (deep magenta)
- Text color: White
- Border: `border-[4px]` (4px solid)
- Shadow: `shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]`
- **Hover State**:
  - Background: `bg-primary/90` (90% opacity)
  - Transform: `translate-x-[-2px] translate-y-[-2px]` (move up-left 2px)
  - Shadow: `shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]` (bigger shadow)
  - Transition: `transition-all`

## Icons

### Trophy Icon
- **Source**: Lucide React `Trophy` icon
- **Size**: 
  - Mobile: `w-16 h-16` (4rem / 64px)
  - Desktop: `md:w-20 md:h-20` (5rem / 80px)
- **Color**: `text-primary` (#a71b86 - deep magenta)
- **Position**: `mx-auto` (centered horizontally)
- **Margin Bottom**: `mb-6` (1.5rem / 24px)

### Play Button Icon
- **Source**: Lucide React `Play` icon
- **Size**: `w-6 h-6` (1.5rem / 24px)
- **Color**: Inherited from button (white)
- **Position**: `inline` with `mr-2` gap

## Border Radius
- All elements use square corners (no border radius)
- `border-radius: 0`

## Shadows

### Card Shadow
- **Value**: `8px 8px 0px 0px rgba(0,0,0,0.3)`
- **Breakdown**: 
  - X offset: 8px
  - Y offset: 8px
  - Blur: 0px
  - Spread: 0px
  - Color: Black at 30% opacity

### Score Item Shadow
- **Value**: `4px 4px detached 0px rgba(0,0,0,0.3)`
- Same style, smaller offset

### Button Shadow
- **Default**: `6px 6px 0px 0px rgba(0,0,0,0.3)`
- **Hover**: `8px 8px 0px 0px rgba(0,0,0,0.3)`

## Responsive Breakpoints

- **Base (Mobile)**: < 768px
- **md (Desktop)**: ≥ 768px

Most elements have responsive sizing:
- Font sizes increase on desktop
- Padding increases on desktop
- Button width switches from full-width to auto on desktop

## Conditional Rendering

### Winner Section
- Only shows if `winner` exists
- Displays:
  - "WINNER:" label
  - Winner name ((`font-heading`, accent color)
  - Winner score with "point" or "points" pluralization

### Final Scores List
- Always shows (empty array handled)
- Sorted by score (highest first)
- First item (winner) has accent background
- Each item shows: `{rank}. {name}` and `{score} pt/pts`

### Action Button
- **If Host**: Shows "PLAY AGAIN" button
- **If Not Host**: Shows "Waiting for host to start a new game..." message

## Sample Data Structure

```javascript
// Winner object
{
  name: "Player Name",
  finalScore: 5,
  playerId: "player-id-123"
}

// Final Scores array
[
  { name: "Winner", finalScore: 5, playerId: "id1" },
  { name: "Second", finalScore: 3, playerId: "id2" },
  { name: "Third", finalScore: 2, playerId: "id3" }
]
```

## Tailwind CSS Classes Reference

```
Container:
- min-h-screen: Full viewport height
- bg-background: Cream background
- flex items-center justify-center: Center content
- p-4: Padding all sides

Content Wrapper:
- text-center: Center align text
- max-w-2xl: Max width 672px
- w-full: Full width

Main Card:
- bg-card: White background
- border-[4px]: 4px border
- border-foreground: Navy border
- shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]: Retro shadow
- p-8 md:p-12: Responsive padding

Trophy:
- w-16 h-16 md:w- saf20 md:h-20: Responsive size
- text-primary: Magenta color
- mx-auto: Center horizontally
- mb-6: Bottom margin

Heading (GAME OVER!):
- font-heading: Pixel font
- text-4xl md:text-5xl: Responsive size
- text-primary: Magenta color
- mb-4: Bottom margin

Winner Name:
- font-heading: Pixel font
- text-3xl md:text-4xl: Responsive size
- text-accent: Orange/gold color

Score Item (1st place):
- bg-accent: Orange/gold background
- border-[3px]: 3px border
- border-foreground: Navy border
- shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]: Shadow

Score Item (other places):
- bg-background: Cream background
- Same border and shadow as above

Button:
- w-full md:w-auto: Responsive width
- px-8 py-4: Padding
- bg-primary: Magenta background
- text-white: White text
- font-heading: Pixel font
- border-[4px]: 4px border
- shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]: Shadow
- hover:bg-primary/90: Hover background
- hover:translate-x-[-2px]: Hover transform
- hover:translate-y-[-2px]: Hover transform
- hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]: Hover shadow
- transition-all: Smooth transitions
```

## Complete JSX Structure (for reference)

```jsx
<div className="min-h-screen bg-background flex items-center justify-center p-4">
  <div className="text-center max-w-2xl w-full">
    <div className="bg-card border-[4px] border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] p-8 md:p-12">
      {/* Trophy Icon */}
      <Trophy className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6" />
      
      {/* Main Heading */}
      <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4">GAME OVER!</h1>
      
      {/* Winner Section */}
      {winner && (
        <div className="mb-8">
          <p className="font-sans text-lg md:text-xl text-foreground mb-2">WINNER:</p>
          <p className="font-heading text-3xl md:text-4xl text-accent">{winner.name}</p>
          <p className="font-sans text-xl md:text-2xl text-foreground mt-2">
            {winner.finalScore} {winner.finalScore === 1 ? 'point' : 'points'}
          </p>
        </div>
      )}
      
      {/* Final Scores */}
      <div className="mb-8">
        <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">FINAL SCORES</h2>
        <div className="space-y-3">
          {finalScores.map((player, index) => (
            <div 
              key={player.playerId}
              className={`flex justify-between items-center p-4 border-[3px] ${
                index === 0 ? 'bg-accent border-foreground' : 'bg-background border-foreground'
              } shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}
            >
              <span className="font-sans text-lg md:text-xl text-foreground font-bold">
                {index + 1}. {player.name}
              </span>
              <span className="font-heading text-xl md:text-2xl text-foreground">
                {player.finalScore} {player.finalScore === 1 ? 'pt' : 'pts'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Button (Host) */}
      {isHost && (
        <button className="w-full md:w-auto px-8 py-4 bg-primary text-white font-heading text-xl md:text-2xl border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:bg-primary/90 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transition-all">
          <Play className="w-6 h-6 inline mr-2" />
          PLAY AGAIN
        </button>
      )}
      
      {/* Waiting Message (Non-Host) */}
      {!isHost && (
        <p className="font-sans text-lg text-muted-foreground">
          Waiting for host to start a new game...
        </p>
      )}
    </div>
  </div>
</div>
```

## Design Notes

- **Retro Aesthetic**: All elements use hard shadows (no blur) for a retro, flat design
- **No Border Radius**: All corners are sharp/squared
- **Pixel Font Headings**: Main headings use pixel-style font for retro game feel
- **Serif Body Text**: Body text uses serif font for readability contrast
- **Offset Shadows**: Shadows create depth without blur for retro look
- **Flat Colors**: No gradients except for wild cards (not applicable here)
- **Bold Borders**: Thick borders (3-4px) for definition
- **Responsive**: Mobile-first design with desktop enhancements


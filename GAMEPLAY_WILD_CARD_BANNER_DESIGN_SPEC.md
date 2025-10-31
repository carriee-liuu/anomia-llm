# Gameplay Screen with Wild Card Banner - Design Spec for Figma

## Overview
This document details the gameplay screen layout and styling when a wild card banner is active. The wild card banner appears between the scores header and the main game card, and affects the spacing and sizing of elements below it.

## Component Structure (Wild Card Banner Active)

```
Gameplay Screen (Wild Card Banner Active)
├── Exit Button (Fixed Top Right)
│   └── X Icon
├── Scores Header (Reduced Padding When Banner Active)
│   ├── "SCORES" Title Box
│   └── Player Score Boxes (Top 3)
├── Wild Card Banner (Active)
│   ├── Gradient Background (Translucent)
│   ├── "Wild Card:" Label
│   ├── First Shape Container (with Shape Icon)
│   ├── "=" Separator
│   └── Second Shape Container (with Shape Icon)
├── Main Game Area
│   ├── Current Player's Card (Reduced Height)
│   │   ├── Card Background (Regular Purple or Wild Card Gradient)
│   │   ├── Top Category Text (Upside Down, Regular Cards Only)
│   │   ├── Center Symbol/Shape
│   │   │   ├── Wild Card Content (if wild card)
│   │   │   │   ├── "WILD CARD" Top Text (Upside Down)
│   │   │   │   ├── Shape Icons with "="
│   │   │   │   └── "WILD CARD" Bottom Text
│   │   │   └── Regular Shape Icon (if regular card)
│   │   └── Bottom Category Text (Regular Cards Only)
│   └── Action Buttons
│       ├── Draw Button
│       └── "I LOST" Button
```

## Colors

### CSS Variables (OKLCH format)
```css
--background: oklch(0.95 0.02 60) (Warm cream beige)
--foreground: oklch(0.2 0.05 280) (Navy/Dark Blue)
--card: oklch(0.98 0.01 60) (Off-white)
--primary: oklch(0.5 0.2 340) (Deep magenta/purple)
--secondary: oklch(0.55 0.18 180) (Teal/Cyan)
--accent: oklch(0.65 0.22 80) (Orange/Gold)
--muted: oklch(0.88 0.02 60) (Light beige)
--muted-foreground: oklch(0.45 0.05 280) (Medium gray-blue)
--destructive: oklch(0.55 0.22 25) (Red)
--border: oklch(0.35 0.08 280) (Dark navy)
```

### Wild Card Banner Gradient Colors
```css
From: oklch(0.75 0.15 60) with 85% opacity (Light orange/gold)
Via: oklch(0.65 0.2 350) with 85% opacity (Medium purple/magenta)
To: oklch(0.55 0.18 310) with 85% opacity (Deep purple)
```

### Shape Colors (for icons)
- **Circle**: `#3B82F6` (Blue)
- **Square**: `#E8A54A` (Orange/Gold)
- **Plus**: `#9333EA` (Purple)
- **Waves**: `#06B6D4` (Cyan)
- **Diamond**: `#FF7F50` (Coral)
- **Asterisk**: `#EF4444` (Red)
- **Dots**: `#EC4899` (Pink)
- **Equals**: `#84CC16` (Lime Green)

## Typography

### Font Families
- **Heading Font**: `'Press Start 2P'` (8-bit pixel font, monospace)
  - Font weight: 400 (regular)
  - Letter spacing: `0.05em` (tracking-wider), `0.1em` (tracking-widest)
- **Body Font**: `'Courier Prime'` (Monospace, retro serif)
  - Font weight: 400 (regular), 700 (bold)
  - Letter spacing: `-0.005em`

### Font Sizes

#### Mobile
- **Scores Title**: `30px` (1.875rem / text-3xl) - `font-heading`
- **Player Names**: `14px` (0.875rem / text-sm) - `font-sans bold`
- **Player Scores**: `14px` (0.875rem / text-sm) - `font-heading`
- **Wild Card Banner Label**: `10px` (0.625rem / text-[10px])` - `font-heading uppercase`
- **Wild Card Banner Equals**: `14px` (0.875rem / text-sm) - `font-heading`
- **Card Category Text**: Dynamic (text-xl to text-4xl) based on word length - `font-heading`
- **Wild Card Text**: `30px` (1.875rem / text-3xl) - `font-heading`
- **Button Text**: `18px` (1.125rem / text-lg) - `font-heading`

#### Desktop/Tablet
- **Scores Title**: `36px` (2.25rem / text-4xl) - `font-heading`
- **Player Names**: `16px` (1rem / text-base) - `font-sans bold`
- **Player Scores**: `16px` (1rem / text-base) - `font-heading`
- **Wild Card Banner Label**: `12px` (0.75rem / text-xs)` - `font-heading uppercase`
- **Wild Card Banner Equals**: `16px` (1rem / text-base) - `font-heading`
- **Card Category Text**: Dynamic (text-xl to text-4xl) based on word length - `font-heading`
- **Wild Card Text**: `30px` (1.875rem / text-3xl) - `font-heading`
- **Button Text**: `18px` (1.125rem / text-lg) - `font-heading`

## Spacing (Wild Card Banner Active)

### Padding Adjustments
- **Scores Header Padding** (when banner active):
  - Top: `16px` (1rem / pt-4)
  - Bottom: `4px` (0.25rem / pb-1)
  - Margin Bottom: `4px` (0.25rem / mb-1)

- **Scores Header Padding** (when banner inactive):
  - Top/Bottom: `16px` (1rem / py-4)

- **Wild Card Banner**:
  - Container Padding: `8px 12px` (py-2 px-3)
  - Horizontal Margin: `16px` (1rem / px-4 on parent)
  - Bottom Margin: `8px` (0.5rem / mb-2)
  - Gap between elements: `8px` (0.5rem / gap-2)

- **Main Game Area**:
  - Padding: `0px 16px 24px 16px` (px-4 py-0 pb-6)
  - Card Margin Bottom: `16px` (1rem / mb-4)
  - Buttons Gap: `24px` (1.5rem / space-y-6)

- **Main Card** (when banner active):
  - Fixed Height: `485px` (h-[485px])
  - Padding: `16px` (1rem / p-4)

- **Main Card** (when banner inactive):
  - Aspect Ratio: `2/3` (aspect-[2/3])
  - Padding: `16px` (1rem / p-4)

## Layout & Dimensions

### Container Widths
- **Max Content Width**: `448px` (28rem) - `max-w-md`
- **Scores Box Max Width**: `512px` (32rem) - `max-w-lg`
- **Wild Card Banner Max Width**: `448px` (28rem) - `max-w-md`

### Wild Card Banner Dimensions
- **Container**: Full width of max-w-md (448px), auto height
- **Shape Container Size**:
  - Mobile: `32px × 32px` (w-8 h-8)
  - Desktop: `40px × 40px` (md:w-10 md:h-10)
- **Shape Icon Size**: `28px` (size={28})
- **Shape Container Border**: `2px solid` (border-[2px])

### Main Card Dimensions (Wild Card Active)
- **Width**: `100%` of max-w-md (448px)
- **Height**: Fixed `485px` (h-[485px])
- **Border**: `4px solid oklch(0.35 0.08 280)`
- **Shadow**: `6px 6px 0px 0px rgba(0,0,0,0.3)`

### Shape Sizes in Main Card
- **Regular Card Shape**: `140px` (size={140})
- **Wild Card Shapes**: `110px` (size={110})
- **Shape Gap**: `16px` (0.25rem / gap-4)

## Wild Card Banner Component

### Banner Container
```
Background: 
  - Gradient: from-[oklch(0.75_0.15_60/0.85)] 
             via-[oklch(0.65_0.2_350/0.85)] 
             to-[oklch(0.55_0.18_310/0.85)]
  - Backdrop Filter: blur-sm (backdrop-blur-sm)
Border: None (removed)
Border Radius: rounded-sm (small radius)
Padding: py-2 px-3 (8px vertical, 12px horizontal)
Shadow: 4px 4px 0px 0px rgba(0,0,0,0.3)
Max Width: max-w-md (448px)
Margin: mx-auto (centered), mb-2 (8px bottom)
```

### Banner Layout
```
Layout: Flex row, items-center, justify-center, gap-2 (8px gap)

Elements (left to right):
1. "Wild Card:" Label
   - Font: font-heading
   - Size: text-[10px] md:text-xs
   - Color: text-white
   - Style: uppercase, tracking-wide
   - Shadow: drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]

2. First Shape Container
   - Background: bg-background/90 (90% opacity beige)
   - Border: 2px solid border-foreground/80
   - Size: w-8 h-8 md:w-10 md:h-10
   - Border Radius: rounded-sm
   - Display: flex items-center justify-center

3. "=" Separator
   - Font: font-heading
   - Size: text-sm md:text-base
   - Color: text-white
   - Shadow: drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]

4. Second Shape Container
   - Same as First Shape Container
```

## Scores Header (With Wild Card Banner)

### Header Container (Reduced Padding)
```
Padding (when banner active):
  - Top: pt-4 (16px)
  - Bottom: pb-1 (4px)
  - Margin Bottom: mb-1 (4px)

Padding (when banner inactive):
  - Vertical: py-4 (16px)
  - No margin bottom
```

### Scores Box
```
Background: bg-background (oklch(0.95 0.02 60))
Border: 4px (mobile) / 6px (desktop) solid oklch(0.35 0.08 280)
Padding: 
  - Mobile: px-6 py-3 (24px horizontal, 12px vertical)
  - Desktop: px-12 py-6 (48px horizontal, 24px vertical)
Shadow: 
  - Mobile: 6px 6px 0px 0px rgba(0,0,0,0.3)
  - Desktop: 8px 8px 0px 0px rgba(0,0,0,0.3)
Max Width: max-w-lg (512px)
Width: w-full
```

### Scores Content
```
Title: "SCORES"
  - Font: font-heading, text-3xl md:text-4xl
  - Color: text-primary (oklch(0.5 0.2 340))
  - Tracking: tracking-wider md:tracking-widest
  - Margin Bottom: mb-4 (16px)

Player Scores:
  - Layout: Flex row, justify-center, items-center, gap-4 md:gap-6
  - Display: Top 3 players only
  - Each Score Box:
    - Size: w-8 h-8 md:w-10 md:h-10
    - Border: 3px solid oklch(0.35 0.08 280)
    - Font: font-heading, text-sm md:text-base
    - Current Player: bg-accent text-white
    - Other Players: bg-secondary text-foreground
  - Player Name:
    - Font: font-sans, text-sm md:text-base, bold
    - Color: text-foreground
    - Margin Top: mt-1 (4px)
```

## Main Card (Wild Card Banner Active)

### Card Container
```
Height: Fixed 485px (h-[485px] md:h-[485px])
Width: 100% of max-w-md (448px)
Border: 4px solid oklch(0.35 0.08 280)
Padding: p-4 (16px)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)
Layout: flex flex-col justify-between

Backgrounds:
  - Regular Card: bg-primary (oklch(0.5 0.2 340))
  - Wild Card: bg-gradient-to-br 
              from-[oklch(0.75_0.15_60)] 
              via-[oklch(0.65_0.2_350)] 
              to-[oklch(0.55_0.18_310)]
  - Wild Card Animation: wild-card-float (CSS animation)
```

### Regular Card Content
```
Top Category Text:
  - Position: Top of card
  - Font: font-heading
  - Size: Dynamic (text-xl to text-4xl based on word length)
  - Color: text-white
  - Transform: rotate-180 (upside down)
  - Shadow: textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
  - Padding: px-2 (8px horizontal)
  - Margin Bottom: mb-4 (16px)

Center Shape:
  - Size: 140px (size={140})
  - Color: Based on shape type (see Shape Colors)
  - Position: Centered (flex-1, flex-col, items-center, justify-center)

Bottom Category Text:
  - Position: Bottom of card
  - Font: font-heading
  - Size: Dynamic (text-xl to text-4xl based on word length)
  - Color: text-white
  - Shadow: textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
  - Padding: px-2 (8px horizontal)
  - Margin Bottom: mb-4 (16px)
```

### Wild Card Content
```
Layout: flex flex-col items-center justify-between h-full w-full

Top Text (Upside Down):
  - Text: "WILD CARD"
  - Font: font-heading, bold
  - Size: text-3xl (30px)
  - Color: text-white
  - Transform: rotate-180
  - Tracking: tracking-wider
  - Shadow: drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]

Center Section (flex-1):
  - Layout: flex flex-col items-center justify-center gap-6 (24px)
  - Shapes Container:
    - Layout: flex items-center gap-4 (16px)
    - First Shape: size={110}, color based on wild_shapes[0]
    - Equals Sign: text-2xl font-heading font-bold text-white
    - Second Shape: size={110}, color based on wild_shapes[1]

Bottom Text:
  - Text: "WILD CARD"
  - Font: font-heading, bold
  - Size: text-3xl (30px)
  - Color: text-white
  - Tracking: tracking-wider
  - Shadow: drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]
```

## Action Buttons

### Draw Button
```
Width: 100% of max-w-md (448px)
Padding: py-4 px-6 (16px vertical, 24px horizontal)
Font: font-heading, text-lg (18px)
Border: 4px solid oklch(0.35 0.08 280)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)

States:
  - Enabled:
    - Background: bg-accent (oklch(0.65 0.22 80))
    - Text: text-white
    - Hover:
      - Background: bg-accent/90
      - Transform: translate-x-[-2px] translate-y-[-2px]
      - Shadow: 8px 8px 0px 0px rgba(0,0,0,0.3)
  
  - Disabled:
    - Background: bg-muted (oklch(0.88 0.02 60))
    - Text: text-muted-foreground (oklch(0.45 0.05 280))
    - Cursor: not-allowed

Button Text Variations:
  - Flipping: "FLIPPING..." with spinner
  - Flipped & Wild Card: "WILD CARD! DRAW NEXT" with CheckCircle icon
  - Not My Turn: "DRAW" with Clock icon
  - My Turn: "DRAW" with Play icon
```

### "I LOST" Button
```
Width: 100% of max-w-md (448px)
Padding: py-4 px-6 (16px vertical, 24px horizontal)
Font: font-heading, text-lg (18px)
Border: 4px solid oklch(0.35 0.08 280)
Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)

Background: bg-destructive (oklch(0.55 0.22 25))
Text: text-white
Icon: RotateCcw (w-5 h-5)

Hover:
  - Background: bg-destructive/90
  - Transform: translate-x-[-2px] translate-y-[-2px]
  - Shadow: 8px 8px 0px 0px rgba(0,0,0,0.3)
```

## Animations

### Wild Card Banner Entrance
```
Animation: Framer Motion
Initial: opacity: 0, y: -20, scale: 0.95
Animate: opacity: 1, y: 0, scale: 1
Exit: opacity: 0, y: -20, scale: 0.95
Transition: type: "spring", stiffness: 300, damping: 20
```

### Wild Card Floating Animation
```
Animation: CSS keyframes (wild-card-float)
Duration: 1.75s
Timing: ease-in-out
Iteration: infinite
Keyframes:
  0%, 100%: translateY(0px)
  50%: translateY(-4px)
```

### Card Hover Animation
```
Animation: Framer Motion whileHover
Transform: scale: 1.02
Transition: type: "spring", stiffness: 300
```

## Borders & Shadows

### Border Styles
- **Card Border**: `4px solid oklch(0.35 0.08 280)`
- **Shape Container Border**: `2px solid oklch(0.35 0.08 280)`
- **Shape Container Border Opacity**: `border-foreground/80` (80% opacity)

### Shadow Styles
- **Card Shadow**: `6px 6px 0px 0px rgba(0,0,0,0.3)`
- **Banner Shadow**: `4px 4px 0px 0px rgba(0,0,0,0.3)`
- **Button Shadow**: `6px 6px 0px 0px rgba(0,0,0,0.3)`
- **Button Hover Shadow**: `8px 8px 0px 0px rgba(0,0,0,0.3)`

### Text Shadows
- **Category Text**: `2px 2px 0px rgba(0,0,0,0.5)`
- **Wild Card Text**: `drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]`
- **Banner Label**: `drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]`

## Exit Button

### Position & Styling
```
Position: Fixed, top-4 right-4 (16px from top and right)
Z-Index: z-50
Padding: p-2 (8px)
Background: bg-background (oklch(0.95 0.02 60))
Border: 3px solid oklch(0.35 0.08 280)
Shadow: 4px 4px 0px 0px rgba(0,0,0,0.3)
Icon Size: w-5 h-5 (20px)
Icon Color: text-foreground

Hover:
  - Background: bg-muted (oklch(0.88 0.02 60))
  - Transform: translate-x-[-2px] translate-y-[-2px]
  - Shadow: 6px 6px 0px 0px rgba(0,0,0,0.3)
```

## Responsive Breakpoints

### Mobile (default, < 768px)
- Scores header padding: pt-4 pb-1 mb-1 (when banner active)
- Banner label: text-[10px]
- Banner equals: text-sm
- Banner shape containers: w-8 h-8
- Card height: h-[485px]
- Player scores box: w-8 h-8, text-sm

### Desktop/Tablet (md: ≥ 768px)
- Scores header padding: pt-4 pb-1 mb-1 (when banner active)
- Banner label: text-xs
- Banner equals: text-base
- Banner shape containers: md:w-10 md:h-10
- Card height: md:h-[485px]
- Player scores box: md:w-10 md:h-10, md:text-base

## Conditional Rendering

### Wild Card Banner Visibility
- **Visible**: When `gameState?.currentWildCard` exists
- **Hidden**: When `gameState?.currentWildCard` is null/undefined

### Card Height Adjustment
- **When Banner Active**: Fixed height `h-[485px]`
- **When Banner Inactive**: Aspect ratio `aspect-[2/3]` (maintains proportional height)

### Header Padding Adjustment
- **When Banner Active**: `pt-4 pb-1 mb-1` (reduced bottom padding)
- **When Banner Inactive**: `py-4` (normal padding)

### Draw Button Text
- **Flipping**: Shows spinner + "FLIPPING..."
- **Flipped & Wild Card**: Shows CheckCircle icon + "WILD CARD! DRAW NEXT"
- **Not My Turn**: Shows Clock icon + "DRAW"
- **My Turn**: Shows Play icon + "DRAW"

## Dynamic Category Text Sizing

The category text size is dynamically calculated based on:
- Longest word length in the category
- Total word count

### Size Logic
```javascript
if (longestWordLength > 12) → text-xl
else if (longestWordLength > 9) → text-2xl
else if (longestWordLength > 7) → text-3xl
else if (wordCount >= 3 && longestWordLength <= 7) → text-2xl
else if (longestWordLength > 5) → text-3xl
else → text-4xl
```

## Sample Data

### Sample Wild Card
```javascript
currentWildCard = {
  id: "wild-123",
  shape: "WILD",
  category: "Wild Card",
  is_wild: true,
  wild_shapes: ["circle", "square"]
}
```

### Sample Regular Card
```javascript
currentCard = {
  id: "card-456",
  shape: "diamond",
  category: "Cheese",
  is_wild: false
}
```

### Sample Player Scores
```javascript
scores = [
  { id: "player-1", name: "Alice", score: 5 },
  { id: "player-2", name: "Bob", score: 3 },
  { id: "player-3", name: "Charlie", score: 1 }
]
```

## Tailwind Class Reference

### Common Classes Used
```css
/* Layout */
flex, flex-col, flex-row
items-center, justify-center, justify-between
gap-2, gap-4, gap-6
space-y-6

/* Sizing */
w-full, w-8, h-8, w-10, h-10
max-w-md, max-w-lg
p-4, px-4, py-2, py-4, px-6
mb-1, mb-2, mb-4

/* Typography */
font-heading, font-sans
text-xl, text-2xl, text-3xl, text-4xl
text-sm, text-base, text-lg
text-white, text-foreground, text-muted-foreground
font-bold
tracking-wider, tracking-widest
uppercase

/* Colors */
bg-background, bg-primary, bg-accent, bg-muted, bg-destructive
bg-gradient-to-br
text-primary, text-foreground, text-white
border-foreground

/* Borders */
border-[2px], border-[3px], border-[4px]
border-solid, border-dashed
rounded-sm

/* Shadows */
shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]
drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]

/* Effects */
backdrop-blur-sm
rotate-180
opacity-80, opacity-90, /0.85
hover:bg-accent/90, hover:bg-destructive/90
hover:translate-x-[-2px], hover:translate-y-[-2px]
transition-all

/* Positioning */
fixed, top-4, right-4
mx-auto
z-50
```

## Design Notes

1. **Height Compensation**: When the wild card banner is active, the main card height is reduced from aspect ratio to fixed 485px to compensate for the banner space, keeping the draw button in a consistent position.

2. **Translucent Banner**: The wild card banner uses 85% opacity (`/0.85`) and backdrop blur (`backdrop-blur-sm`) for a translucent, glass-like effect.

3. **No Border on Banner**: The banner has no border (removed white border) for a cleaner, more integrated look.

4. **Compact Banner Design**: The banner is intentionally compact with reduced padding and smaller shape containers to minimize vertical space usage.

5. **Consistent Spacing**: The mb-2 (8px) gap between banner and card ensures consistent spacing, and the reduced header padding (pb-1 mb-1) maintains overall vertical rhythm.

6. **Shape Color Mapping**: Each shape type has a specific color that matches across the banner icons and main card shapes for visual consistency.

7. **Wild Card Animation**: The wild card itself uses a subtle floating animation (wild-card-float) that moves it 4px up and down over 1.75 seconds.

8. **Responsive Shape Sizes**: Banner shapes are smaller (28px) than main card shapes (110px for wild, 140px for regular) to maintain hierarchy.


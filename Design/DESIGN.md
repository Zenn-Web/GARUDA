---
name: Garuda
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#404944'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#442800'
  on-tertiary: '#ffffff'
  tertiary-container: '#623c00'
  on-tertiary-container: '#f69f0d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  button:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-mobile: 1.5rem
  gutter-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
  touch-target-min: 3.5rem
---

## Brand & Style
The design system is engineered for the Indonesian Baby Boomer demographic, focusing on trust, clarity, and reassurance. The brand personality is "The Wise Protector"—authoritative yet gentle, like a guardian who looks out for the family. 

The visual style follows a **Modern Humanist** approach. It avoids the cold, technical aesthetic often associated with cybersecurity, instead using soft edges, high-contrast legibility, and ample white space to reduce cognitive load. The goal is to make the user feel safe and in control, rather than overwhelmed by technical jargon or complex interfaces.

## Colors
The palette is rooted in a deep, prestigious "Hutan" (Forest) Green to evoke a sense of established security and Indonesian natural heritage. 

- **Primary (#064E3B):** Used for navigation, headers, and primary actions to signify authority.
- **Safe (#10B981):** A vibrant green used exclusively for positive scan results and "safe" statuses.
- **Warning (#F59E0B):** An amber tone for cautionary messages that require attention but aren't immediate threats.
- **Danger (#EF4444):** A high-visibility red for phishing alerts and scam detections.
- **Surface (#FFFFFF / #F9FAFB):** High-brightness backgrounds to ensure maximum text contrast.

## Typography
This design system prioritizes accessibility for aging eyes. **Atkinson Hyperlegible Next** is selected for its focus on letterform distinction, which aids users with declining vision or presbyopia.

- **Size:** Minimum body text is 18px. Critical instructions use 20px.
- **Contrast:** Text must always maintain at least a 7:1 contrast ratio against the background.
- **Language Support:** All typography scales are optimized for Indonesian sentence lengths, which tend to be longer than English.

## Layout & Spacing
The layout follows a simplified **Single-Column Fluid Grid** on mobile to prevent distraction.

- **Safe Zones:** Generous 24px (1.5rem) side margins prevent the thumb from accidentally triggering edge-based OS gestures.
- **Vertical Rhythm:** Elements are spaced using a 8px baseline grid, but primary content blocks use "Stack-LG" (32px) to clearly separate different scan results or news items.
- **Touch Targets:** Every interactive element has a minimum height of 56px (3.5rem) to accommodate reduced motor precision.

## Elevation & Depth
To aid cognitive processing, this design system uses **Tonal Layering** and **Soft Ambient Shadows**.

- **Depth Levels:** Use depth to signify "priority." A detected scam alert should have a higher elevation (larger, softer shadow) than a standard menu item.
- **Shadow Profile:** Shadows are highly diffused (20px-40px blur) with low opacity (8-10%) using a tint of the Primary color rather than pure black. This creates a "soft" feel that looks less "digital" and more "tactile."
- **Focus:** No glassmorphism or complex blurs; surfaces are solid to maintain maximum text legibility.

## Shapes
The shape language is "Friendly-Geometric."

- **Corner Radius:** Standard components use a 16px (rounded-lg) radius.
- **Container Radius:** Primary cards and status containers use a 24px (rounded-xl) radius to feel welcoming and soft.
- **Icons:** Use thick 2px or 2.5px strokes with rounded end-caps. Avoid sharp "tech" icons; prefer "organic" and "illustrative" styles.

## Components

### Buttons
- **Primary:** High-contrast background (Primary Green), white text, 56px height.
- **Secondary:** Thick 2px border matching the Primary Green, with a white background.
- **State Labels:** Always include a clear verb (e.g., "Periksa Sekarang" or "Hapus Pesan").

### Cards
- **Status Cards:** Use a top-border accent color (Safe, Warning, or Danger) to communicate status immediately without reading text.
- **Padding:** Minimum internal padding of 24px to ensure text doesn't feel "crowded."

### Inputs
- **Scanning Bar:** Large, prominent input fields for pasting links or phone numbers. 
- **Validation:** Use large icons (Checkmarks or Warning Triangles) alongside text, as color alone is insufficient for status communication.

### Lists
- **Scam History:** Each list item must have a minimum height of 72px with a clear separator line.
- **Icons:** Every list item should lead with an icon to help users scan the list visually before reading.

### Feedback Elements
- **Modals:** Use "Center-Focused" modals with a darkened backdrop to force focus. Avoid "bottom sheets" which can be accidentally swiped away by users unfamiliar with gesture navigation.
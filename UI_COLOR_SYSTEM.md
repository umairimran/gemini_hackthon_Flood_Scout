# FloodScout UI - Professional Color System

## Overview

The application has been redesigned with a professional dark theme and consistent color mapping system applied throughout all pages.

## Color Mapping Schema

### Risk/Status Levels

- **Low**: Emerald (Green) `emerald-50` to `emerald-600`
- **Medium**: Yellow `yellow-50` to `yellow-600`
- **High**: Orange `orange-50` to `orange-600`
- **Critical**: Red `red-50` to `red-600`

### Applied Colors for Specific Elements

#### Severity Badge (3 levels: low, medium, critical)

- Low → Emerald: `bg-emerald-100 text-emerald-800 border-emerald-300`
- Medium → Yellow: `bg-yellow-100 text-yellow-800 border-yellow-300`
- Critical → Red: `bg-red-100 text-red-800 border-red-300`

#### Structural Status (4 levels: intact, damaged, critical, unknown)

- Intact → Emerald: `bg-emerald-50 border-emerald-200`
- Damaged → Yellow: `bg-yellow-50 border-yellow-200`
- Critical → Red: `bg-red-50 border-red-200`
- Unknown → Slate (gray): `bg-slate-700 border-slate-600` (dark theme)

#### Hazard Risk Levels (4 levels: low, medium, high, critical)

- Low → Emerald: `bg-emerald-50 border-emerald-200`
- Medium → Yellow: `bg-yellow-50 border-yellow-200`
- High → Orange: `bg-orange-50 border-orange-200`
- Critical → Red: `bg-red-50 border-red-200`

#### Indicators (Highlighted vs. Normal)

- Highlighted: Emerald `bg-emerald-50 border-emerald-200`
- Normal: Slate (dark) `bg-slate-700 border-slate-600`

## Theme Design

### Background

- **Gradient**: `from-slate-900 via-slate-800 to-slate-900` (professional dark theme)
- **Cards**: `bg-slate-800/50 border-slate-700` with `backdrop-blur-sm` for modern glass effect

### Primary Accent Colors

- **Logo/Branding**: Gradient from emerald to teal `from-emerald-400 to-teal-500`
- **Primary Buttons**: `from-emerald-500 to-teal-500` with hover state `from-emerald-600 to-teal-600`
- **Accent Icons**: Emerald `text-emerald-400`

### Text Colors

- **Headings**: White `text-white`
- **Primary Text**: Slate 300 `text-slate-300`
- **Secondary Text**: Slate 400 `text-slate-400`
- **Muted Text**: Slate 200 `text-slate-200`

### Warning/Disclaimer

- **Background**: `bg-orange-900/20`
- **Border**: `border-orange-700/50`
- **Text**: Amber `text-orange-200` to `text-orange-100`

## Pages Updated

### 1. Landing Page (`app/page.tsx`)

- Dark theme with gradient background
- Emerald/teal gradient branding
- Professional feature cards with hover effects
- Orange warning disclaimer section

### 2. Analyze Page (`app/analyze/page.tsx`)

- Drag & drop upload with professional styling
- Real-time progress with emerald gradient
- Inline results display with color-coded sections
- All components use the consistent color system

### 3. Report Page (`app/report/[id]/page.tsx`)

- Identical styling to analyze page results
- Professional report layout
- Color-coded findings and hazards
- Orange warning disclaimer

## Color System Constants

Each page includes a `RISK_COLORS` constant:

`typescript
const RISK_COLORS = {
  low: { bg, border, text, icon, badge, badgeText },
  medium: { bg, border, text, icon, badge, badgeText },
  high: { bg, border, text, icon, badge, badgeText },
  critical: { bg, border, text, icon, badge, badgeText }
};
`

This ensures consistent color application across all risk-based UI elements.

## Design Principles

1. **Professionalism**: Dark theme suitable for disaster response context
2. **Clarity**: High contrast text on dark backgrounds
3. **Hierarchy**: Color coding communicates severity at a glance
4. **Consistency**: Same color means same severity level across all pages
5. **Accessibility**: Clear status indicators with both color and icons
6. **Modern**: Glass morphism effects with `backdrop-blur-sm`

## Icon Usage

- **Intact**: `CheckCircle` (green)
- **Damaged**: `AlertCircle` (yellow)
- **Critical**: `XCircle` (red)
- **Unknown**: `AlertTriangle` (gray)
- **Hazards**: `AlertTriangle` (orange accent)
- **Structural**: `Home` (emerald accent)

## Responsive Design

- All components maintain color consistency across responsive breakpoints
- Grid layouts adapt from 1-3 columns while preserving color scheme
- Mobile-first design with proper spacing and sizing
  "

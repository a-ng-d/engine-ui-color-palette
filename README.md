![GitHub package.json version](https://img.shields.io/github/package-json/v/a-ng-d/engine-ui-color-palette?color=informational) ![GitHub last commit](https://img.shields.io/github/last-commit/a-ng-d/engine-ui-color-palette?color=informational) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/a-ng-d/engine-ui-color-palette/npm.yml?label=npm)
![GitHub](https://img.shields.io/github/license/a-ng-d/engine-ui-color-palette?color=informational)

# UI Color Palette Engine

Core utilities library for UI Color Palette - a color management plugin for design tools. This library provides the foundational color manipulation, contrast calculation, and palette generation features used in the plugin.

## Design Tools Compatibility

UI Color Palette is available for:

- Figma - Create and manage color primitives directly in your Figma designs
- FigJam - Collaborate on color decisions with your team
- Penpot - Open-source design tool alternative with full color management support

## Features

- **Color Contrast Tools**:

  - APCA contrast calculations
  - WCAG 2.1 compliance checking
  - Contrast ratio calculations between colors
  - Pre-computed text contrast scores (light/dark) per shade

- **Color Manipulation**:

  - Color space conversions (RGB, HSL, HSLuv, LAB)
  - Color mixing and blending
  - Brightness and saturation adjustments

- **Dominant Colors Extraction**:

  - Extract dominant colors from images using K-means clustering
  - Configurable number of colors to extract
  - Automatic color frequency calculation
  - Support for transparent pixel filtering

- **Color Harmony Generation**:

  - Generate analogous, complementary, triadic, tetradic, square, and compound color harmonies
  - Configurable analogous spread angle
  - Automatic color relationship calculations
  - Support for all major color harmony types

- **Color System & Semantic Tokens**:

  - Build a semantic color system from a taxonomy schema and palette data
  - Bind semantic tokens to primitive shades with optional per-theme overrides
  - Exclude specific tokens from code generation via the `isExcluded` flag
  - Generate semantic token files for CSS, SCSS, LESS, DTCG, Tailwind v3/v4, SwiftUI, UIKit, Compose, Native, Universal, CSV, Android Resources, and Style Dictionary v3

- **Palette Generation**:
  - Create harmonious color schemes
  - Generate accessible color combinations
  - Scale generation for design systems

## Installation

```bash
npm install @uicp/engine
# or
yarn add @uicp/engine
```

## Usage

```typescript
import {
  Color,
  Contrast,
  Data,
  DominantColors,
  ColorHarmony,
} from '@uicp/engine'

// Use Color class for color manipulation
const color = new Color({
  sourceColor: [255, 0, 0], // RGB values
  lightness: 50,
  hueShifting: 0,
  chromaShifting: 100,
})

// Use Contrast class for accessibility checks
const contrast = new Contrast({
  backgroundColor: [255, 255, 255],
  textColor: '#000000',
})

// Use Data class for palette generation
const data = new Data({
  base: baseConfig,
  themes: themesConfig,
  meta: metaConfig,
})
```

## Examples

### Color Manipulation

```typescript
import { Color } from '@uicp/engine'

// Create a color instance
const color = new Color({
  sourceColor: [255, 0, 0], // Red in RGB
  lightness: 50,
  chromaShifting: 100,
})

// Convert to different color spaces
const lchColor = color.lch() // Returns LCH color
const oklchColor = color.oklch() // Returns OKLCH color
const hslColor = color.hsl() // Returns HSL color
const labColor = color.lab() // Returns LAB color

// Mix colors
const mixedRgb = color.mixColorsRgb(
  [255, 0, 0, 0.5], // Semi-transparent red
  [0, 0, 255, 1] // Solid blue
)

const mixedHex = color.mixColorsHex('#FF0000', '#0000FF')
```

### Contrast Calculations

```typescript
import { Contrast } from '@uicp/engine'

// Create a contrast checker instance
const contrast = new Contrast({
  backgroundColor: [255, 255, 255], // White background
  textColor: '#000000', // Black text
})

// Get contrast values
const wcagContrast = contrast.getWCAGContrast() // WCAG 2.1 contrast ratio
const apcaContrast = contrast.getAPCAContrast() // APCA contrast value
const wcagScore = contrast.getWCAGScore() // Returns: 'AAA', 'AA', or 'A'

// Get accessibility recommendations
const usage = contrast.getRecommendedUsage() // Returns usage recommendation
const minSizes = contrast.getMinFontSizes() // Returns minimum font sizes

// Find specific contrast values
const lightness = contrast.getLightnessForContrastRatio(4.5) // For WCAG AA
```

### Dominant Colors Extraction

```typescript
import { DominantColors } from '@uicp/engine'

// Prepare your image data (from canvas, file, etc.)
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
// ... load your image into the canvas
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

// Create a dominant colors extractor
const dominantColors = new DominantColors({
  imageData: imageData,
  colorCount: 5, // Extract top 5 colors
  maxIterations: 50, // K-means algorithm iterations
  tolerance: 0.01, // Convergence tolerance
  skipTransparent: true, // Skip transparent pixels
})

// Extract the dominant colors
const colors = dominantColors.extractDominantColors()

// Results array contains:
colors.forEach((result) => {
  console.log({
    color: result.color, // RGB array: [r, g, b]
    hex: result.hex, // Hex string: "#ff0000"
    percentage: result.percentage, // Percentage of image: 25.5
    count: result.count, // Number of pixels: 1000
  })
})

// Update settings dynamically
dominantColors.setColorCount(8) // Change to 8 colors
dominantColors.updateOptions({
  maxIterations: 100,
  tolerance: 0.005,
})

// Get current configuration
const options = dominantColors.getOptions()
```

#### Working with File Uploads (ArrayBuffer)

For modern web applications that need to extract colors from uploaded image files:

```typescript
import { DominantColors } from '@uicp/engine'

// Handle file upload from user input
const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Convert file to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()

  try {
    // Simple usage: extract 5 dominant colors
    const colors = await DominantColors.extract(arrayBuffer, 5)

    console.log('Extracted colors:', colors)
    // Each color object contains: { color, hex, percentage, count }
  } catch (error) {
    console.error('Error extracting colors:', error)
  }
}

// Advanced usage with custom options
const extractColorsAdvanced = async (arrayBuffer: ArrayBuffer) => {
  const colors = await DominantColors.fromArrayBuffer(arrayBuffer, {
    colorCount: 8,
    maxIterations: 100,
    tolerance: 0.005,
    skipTransparent: true,
    maxImageSize: 300, // Resize large images for faster processing
  })

  return colors
}

// HTML file input example
// <input type="file" accept="image/*" onChange={handleImageUpload} />
```

**Note**: ArrayBuffer extraction requires a browser environment with Canvas API support.

### Color Harmony Generation

```typescript
import { ColorHarmony } from '@uicp/engine'

// Create a color harmony generator
const colorHarmony = new ColorHarmony({
  baseColor: [255, 0, 0], // Red base color
  analogousSpread: 30, // 30 degrees for analogous colors
})

// Generate specific harmony types
const analogous = colorHarmony.generateAnalogous()
const complementary = colorHarmony.generateComplementary()
const triadic = colorHarmony.generateTriadic()
const tetradic = colorHarmony.generateTetradic()
const square = colorHarmony.generateSquare()
const compound = colorHarmony.generateCompound()

// Generate harmony by type
const harmony = colorHarmony.generateHarmony('TRIADIC')

// Generate all harmonies at once (now includes 6 harmonies)
const allHarmonies = colorHarmony.getAllHarmonies()

// Results contain both RGB and hex values
console.log(triadic.colors) // [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
console.log(triadic.hexColors) // ['#ff0000', '#00ff00', '#0000ff']

// Update settings
colorHarmony.setBaseColor([0, 128, 255])
colorHarmony.setAnalogousSpread(45)
colorHarmony.updateOptions({
  analogousSpread: 60,
  returnFormat: 'hex',
})
```

### Palette Generation

```typescript
import { Data } from '@uicp/engine'

// Configure your palette
const config = {
  base: {
    name: 'My Palette',
    colors: [
      /* your colors */
    ],
    colorSpace: 'LAB',
    algorithmVersion: 'v3',
  },
  themes: [
    {
      id: 'light',
      name: 'Light Theme',
      scale: {
        /* lightness values */
      },
      visionSimulationMode: 'NONE',
    },
  ],
  meta: {
    /* metadata */
  },
}

// Create a data instance
const data = new Data(config)

// Generate palette data
const paletteData = data.makePaletteData()
const fullData = data.makePaletteFullData()

// Access pre-computed text contrast scores
paletteData.themes[0].colors[0].shades.forEach((shade) => {
  if (shade.textContrast) {
    // WCAG scores for light/dark text on this shade
    console.log(shade.textContrast.wcag.light) // { ratio: 4.5, score: 'AA' }
    console.log(shade.textContrast.wcag.dark) // { ratio: 12.6, score: 'AAA' }

    // APCA scores for light/dark text on this shade
    console.log(shade.textContrast.apca.light) // { lc: -60.2, recommendedUsage: 'BODY_TEXT' }
    console.log(shade.textContrast.apca.dark) // { lc: 85.1, recommendedUsage: 'FLUENT_TEXT' }
  }
})
```

### Color System & Semantic Tokens

```typescript
import { System, Code } from '@uicp/engine'

// Define a taxonomy schema (groups of semantic dimensions)
const system = new System({
  paletteData,
  system: {
    schema: {
      groups: [
        {
          id: 'role',
          name: 'Role',
          members: [
            { id: 'brand', name: 'Brand' },
            { id: 'neutral', name: 'Neutral' },
          ],
        },
        {
          id: 'prominence',
          name: 'Prominence',
          members: [
            { id: 'default', name: 'Default' },
            { id: 'subtle', name: 'Subtle' },
          ],
        },
      ],
    },
    bindings: [
      {
        path: ['brand', 'default'],
        description: 'Primary brand color',
        ref: 'blue:500',
        overrides: { dark: 'blue:400' }, // per-theme override
      },
      {
        path: ['neutral', 'subtle'],
        ref: 'gray:200',
        isExcluded: true, // skip this token in code generation
      },
    ],
  },
})

// Resolve the system data (tokens + refs)
const systemData = system.makeSystemData()

// Generate semantic token files alongside primitives
const code = new Code({ paletteData, systemData })
const files = code.makeCssFiles()
// files[0].content includes both --color-blue-500 primitives
// and --brand-default / --neutral-default semantic custom properties
```

## Testing

```bash
npm test
# or
yarn test
```

## Code Coverage

Current test coverage results:

| File            | % Stmts   | % Branch  | % Funcs   | % Lines   |
| --------------- | --------- | --------- | --------- | --------- |
| **All files**   | **91.61** | **87.27** | **91.59** | **91.61** |
| code            | 100       | 100       | 100       | 100       |
| color           | 93.54     | 77.51     | 83.33     | 93.54     |
| color-harmony   | 100       | 96.66     | 100       | 100       |
| contrast        | 89        | 93.33     | 100       | 89        |
| data            | 93.48     | 89.74     | 100       | 93.48     |
| dominant-colors | 77.58     | 89.06     | 90.47     | 77.58     |

To run coverage tests:

```bash
npm run test:coverage
```

## Credits

This project relies on several excellent open source packages:

### Color Processing

- [chroma.js](https://gka.github.io/chroma.js/) - A powerful library for color manipulations and conversions
  - Author: Gregor Aisch
  - License: BSD-3-Clause

### Contrast Calculation

- [APCA-W3](https://github.com/Myndex/SAPC-APCA) - Advanced Perceptual Contrast Algorithm
  - Author: Andrew Somers
  - License: W3C Software and Document Notice and License

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

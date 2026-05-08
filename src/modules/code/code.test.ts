import { describe, it, expect } from 'vitest'
import {
  BaseConfiguration,
  ThemeConfiguration,
  MetaConfiguration,
} from '@tps/configuration.types'
import { CodeFile } from '@tps/code.types'
import Data from '@modules/data/data'
import Code from './code'

const first = (files: Array<CodeFile>): string => files[0].content

describe('Code with primitives', () => {
  const mockBase: BaseConfiguration = {
    name: 'Test Palette',
    description: 'Test Description',
    preset: {
      id: 'custom',
      name: 'Custom',
      stops: [1, 2, 3],
      min: 0,
      max: 100,
      easing: 'LINEAR',
    },
    shift: {
      chroma: 100,
      hue: 0,
    },
    colors: [
      {
        id: 'color1',
        name: 'Test Color A',
        description: 'A test color',
        rgb: { r: 1, g: 0, b: 0 },
        alpha: {
          isEnabled: false,
          backgroundColor: '#FFFFFF',
        },
        hue: { shift: 0, isLocked: false },
        chroma: { shift: 100, isLocked: false },
      },
      {
        id: 'color2',
        name: 'Test Color B',
        description: 'A test color',
        rgb: { r: 0, g: 1, b: 0 },
        alpha: {
          isEnabled: false,
          backgroundColor: '#FFFFFF',
        },
        hue: { shift: 0, isLocked: false },
        chroma: { shift: 100, isLocked: false },
      },
      {
        id: 'color3',
        name: 'Test Color C',
        description: 'A test color',
        rgb: { r: 0, g: 0, b: 1 },
        alpha: {
          isEnabled: true,
          backgroundColor: '#FFFFFF',
        },
        hue: { shift: 0, isLocked: false },
        chroma: { shift: 100, isLocked: false },
      },
    ],
    colorSpace: 'LCH',
    algorithmVersion: 'v3',
    areSourceColorsLocked: false,
  }

  const mockTheme: ThemeConfiguration = {
    id: 'theme1',
    name: 'Test Theme',
    description: 'A test theme',
    type: 'default theme',
    scale: {
      '100': 100,
      '50': 50,
    },
    visionSimulationMode: 'NONE',
    textColorsTheme: {
      lightColor: '#FFFFFF',
      darkColor: '#000000',
    },
    paletteBackground: '#FFFFFF',
    isEnabled: true,
  }

  const mockThemes: Array<ThemeConfiguration> = [
    {
      id: '00000000000',
      name: 'Default Theme',
      description: 'A test theme',
      type: 'default theme',
      scale: {
        '100': 100,
        '50': 50,
      },
      visionSimulationMode: 'NONE',
      textColorsTheme: {
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      },
      paletteBackground: '#FFFFFF',
      isEnabled: true,
    },
    {
      id: '00000000001',
      name: 'Custom Theme A',
      description: 'A custom theme',
      type: 'custom theme',
      scale: {
        '100': 75,
        '50': 25,
      },
      visionSimulationMode: 'NONE',
      textColorsTheme: {
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      },
      paletteBackground: '#FFFFFF',
      isEnabled: true,
    },
    {
      id: '00000000002',
      name: 'Custom Theme B',
      description: 'A custom theme',
      type: 'custom theme',
      scale: {
        '100': 50,
        '50': 0,
      },
      visionSimulationMode: 'NONE',
      textColorsTheme: {
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      },
      paletteBackground: '#FFFFFF',
      isEnabled: true,
    },
  ]

  const mockMeta: MetaConfiguration = {
    id: 'palette1',
    dates: {
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      publishedAt: '2023-01-01',
      openedAt: '2023-01-01',
    },
    creatorIdentity: {
      creatorFullName: 'Test Creator',
      creatorId: 'testcreator',
      creatorAvatar: 'https://example.com/avatar.png',
    },
    publicationStatus: {
      isPublished: false,
      isShared: false,
    },
  }

  const data = new Data({
    base: mockBase,
    themes: [mockTheme],
    meta: mockMeta,
  }).makePaletteData()

  const code = new Code({ paletteData: data })

  it('should generate native tokens with makeNativeTokens', () => {
    const result = first(code.makeNativeTokens())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should generate DTCG tokens with makeDtcgTokens', () => {
    const resultRgb = first(code.makeDtcgTokens('RGB'))
    expect(resultRgb).toBeDefined()
    expect(typeof resultRgb).toBe('string')
    expect(resultRgb.length).toBeGreaterThan(0)

    const resultHsl = first(code.makeDtcgTokens('HSL'))
    expect(resultHsl).toBeDefined()
    expect(typeof resultHsl).toBe('string')
  })

  it('should generate Style Dictionary tokens with makeStyleDictionaryTokens', () => {
    const result = first(code.makeStyleDictionaryV3Tokens())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should generate Universal JSON with makeUniversalJson', () => {
    const result = first(code.makeUniversalJson())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should generate CSS custom properties with makeCSS', () => {
    const resultRgb = first(code.makeCssCustomProps('RGB'))
    expect(resultRgb).toBeDefined()
    expect(typeof resultRgb).toBe('string')
    expect(resultRgb).toContain(':root')

    const resultLch = first(code.makeCssCustomProps('LCH'))
    expect(resultLch).toBeDefined()
    expect(resultLch).toContain('lch')
  })

  it('should handle default theme (mono theme) correctly in makeCssCustomProps', () => {
    const dataWithDefaultThemeOnly = new Data({
      base: mockBase,
      themes: [mockThemes[0]],
      meta: mockMeta,
    }).makePaletteData()

    const codeWithDefaultTheme = new Code({
      paletteData: dataWithDefaultThemeOnly,
    })
    const result = first(codeWithDefaultTheme.makeCssCustomProps('RGB'))

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toContain(':root')

    mockBase.colors.forEach((color) => {
      const kebabCaseName = color.name.toLowerCase().replace(/\s+/g, '-')
      expect(result.toLowerCase()).toContain(`--${kebabCaseName}`)
    })
  })

  it('should handle multiple custom themes correctly in makeCssCustomProps', () => {
    const dataWithMultipleCustomThemes = new Data({
      base: mockBase,
      themes: [mockThemes[0], mockThemes[1], mockThemes[2]],
      meta: mockMeta,
    }).makePaletteData()

    const codeWithCustomThemes = new Code({
      paletteData: dataWithMultipleCustomThemes,
    })
    const result = first(codeWithCustomThemes.makeCssCustomProps('RGB'))

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toContain(':root')

    mockThemes.slice(1).forEach((theme) => {
      const themeName = theme.name.toLowerCase().replace(/\s+/g, '-')
      expect(result.toLowerCase()).toContain(themeName)
    })
  })

  it('should generate Tailwind v3 config with makeTailwindConfigV3', () => {
    const result = first(code.makeTailwindV3Config())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle default theme (mono theme) correctly in makeTailwindV3Config', () => {
    const dataWithDefaultThemeOnly = new Data({
      base: mockBase,
      themes: [mockThemes[0]],
      meta: mockMeta,
    }).makePaletteData()

    const codeWithDefaultTheme = new Code({
      paletteData: dataWithDefaultThemeOnly,
    })
    const result = first(codeWithDefaultTheme.makeTailwindV3Config())

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toContain('module.exports')
    expect(result).not.toContain('none')

    mockBase.colors.forEach((color) => {
      const kebabCaseName = color.name.toLowerCase().replace(/\s+/g, '-')
      expect(result).toContain(kebabCaseName)
    })
  })

  it('should handle multiple custom themes correctly in makeTailwindV3Config', () => {
    const dataWithMultipleCustomThemes = new Data({
      base: mockBase,
      themes: [mockThemes[0], mockThemes[1], mockThemes[2]],
    }).makePaletteData()

    const codeWithCustomThemes = new Code({
      paletteData: dataWithMultipleCustomThemes,
    })
    const result = first(codeWithCustomThemes.makeTailwindV3Config())

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')

    expect(result).toContain('custom-theme-a')
    expect(result).toContain('custom-theme-b')

    mockBase.colors.forEach((color) => {
      const kebabCaseName = color.name.toLowerCase().replace(/\s+/g, '-')
      expect(result).toContain(kebabCaseName)
    })
  })

  it('should generate Tailwind v4 config with makeTailwindConfigV4', () => {
    const result = first(code.makeTailwindV4Config())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle default theme (mono theme) correctly in makeTailwindV4Config', () => {
    const dataWithDefaultThemeOnly = new Data({
      base: mockBase,
      themes: [mockThemes[0]],
      meta: mockMeta,
    }).makePaletteData()

    const codeWithDefaultTheme = new Code({
      paletteData: dataWithDefaultThemeOnly,
    })
    const result = first(codeWithDefaultTheme.makeTailwindV4Config())

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toContain('@import "tailwindcss"')
    expect(result).toContain('@theme')

    mockBase.colors.forEach((color) => {
      const kebabCaseName = color.name.toLowerCase().replace(/\s+/g, '-')
      expect(result).toContain(kebabCaseName)
    })
  })

  it('should handle multiple custom themes correctly in makeTailwindV4Config', () => {
    const dataWithMultipleCustomThemes = new Data({
      base: mockBase,
      themes: [mockThemes[0], mockThemes[1], mockThemes[2]],
      meta: mockMeta,
    }).makePaletteData()

    const codeWithCustomThemes = new Code({
      paletteData: dataWithMultipleCustomThemes,
    })
    const result = first(codeWithCustomThemes.makeTailwindV4Config())

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')

    const themeNames = ['custom-theme-a', 'custom-theme-b'].map((name) =>
      name.toLowerCase().replace(/\s+/g, '-')
    )

    themeNames.forEach((name) => {
      expect(result.toLowerCase()).toContain(name)
    })
  })

  it('should generate SwiftUI code with makeSwiftUI', () => {
    const result = first(code.makeSwiftUI())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toContain('struct')
    expect(result).toContain('Color')
  })

  it('should generate UIKit code with makeUIKit', () => {
    const result = first(code.makeUIKit())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toContain('UIColor')
  })

  it('should generate Jetpack Compose code with makeCompose', () => {
    const result = first(code.makeCompose())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toContain('Color')
  })

  it('should generate resource files with makeResources', () => {
    const result = first(code.makeResources())
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should generate SCSS variables with makeScssVariable', () => {
    const resultRgb = first(code.makeScssVariables('RGB'))
    expect(resultRgb).toBeDefined()
    expect(typeof resultRgb).toBe('string')
    expect(resultRgb).toContain('$')

    const resultLch = first(code.makeScssVariables('LCH'))
    expect(resultLch).toBeDefined()
    expect(resultLch).toContain('lch')
  })

  it('should generate Less variables with makeLessVariables', () => {
    const resultRgb = first(code.makeLessVariables('RGB'))
    expect(resultRgb).toBeDefined()
    expect(typeof resultRgb).toBe('string')
    expect(resultRgb).toContain('@')

    const resultLch = first(code.makeLessVariables('LCH'))
    expect(resultLch).toBeDefined()
    expect(resultLch).toContain('lch')
  })

  it('should generate CSV data with makeCsv', () => {
    const files = code.makeCsv()
    expect(Array.isArray(files)).toBe(true)
    expect(files.length).toBeGreaterThan(0)
    const result = JSON.parse(files[0].content)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    const firstMode = result[0]
    expect(firstMode.name).toBe(mockTheme.name)
    expect(firstMode.type).toBe(mockTheme.type)
    expect(Array.isArray(firstMode.colors)).toBe(true)

    if (firstMode.colors.length > 0) {
      const firstColor = firstMode.colors[0]
      expect(firstColor.name).toBeDefined()
      expect(typeof firstColor.csv).toBe('string')
      expect(firstColor.csv).toContain('Lightness,Chroma,Hue')
    }
  })

  describe('Code with systemData', () => {
    const systemData = {
      type: 'system' as const,
      schema: {
        groups: [
          {
            id: 'g1',
            name: 'Type',
            members: [
              { id: 'm_bg', name: 'background' },
              { id: 'm_txt', name: 'text' },
            ],
          },
          {
            id: 'g2',
            name: 'State',
            members: [
              { id: 'm_def', name: 'default' },
              { id: 'm_hov', name: 'hover' },
            ],
          },
        ],
      },
      tokens: [
        {
          path: ['m_bg', 'm_def'],
          pathNames: ['background', 'default'],
          description: 'Main surface',
          isExcluded: false,
          refs: [{ themeId: 'theme1', shadeId: 'theme1:color1:50' }],
        },
        {
          path: ['m_bg', 'm_hov'],
          pathNames: ['background', 'hover'],
          isExcluded: false,
          refs: [{ themeId: 'theme1', shadeId: 'theme1:color1:100' }],
        },
        {
          path: ['m_txt', 'm_def'],
          pathNames: ['text', 'default'],
          isExcluded: false,
          refs: [{ themeId: 'theme1', shadeId: null }],
        },
      ],
    }

    const codeWithSystem = new Code({ paletteData: data, systemData })

    it('returns 2 files for CSS (primitives + semantics)', () => {
      const files = codeWithSystem.makeCssCustomProps('RGB')
      expect(files).toHaveLength(2)
      expect(files[0].filename).toBe('primitives.css')
      expect(files[1].filename).toBe('semantics.css')
      expect(files[1].content).toContain('--background-default')
      expect(files[1].content).toContain('var(--test-color-a-50)')
    })

    it('emits unbound tokens as comments in CSS semantics', () => {
      const semantics = codeWithSystem.makeCssCustomProps('RGB')[1].content
      expect(semantics).toContain('Unbound')
      expect(semantics).toContain('text-default')
    })

    it('returns 2 files for SCSS', () => {
      const files = codeWithSystem.makeScssVariables('RGB')
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('background-default')
    })

    it('returns 2 files for Less', () => {
      const files = codeWithSystem.makeLessVariables('RGB')
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('background-default')
    })

    it('returns 2 files for DTCG with alias references', () => {
      const files = codeWithSystem.makeDtcgTokens('RGB')
      expect(files).toHaveLength(2)
      const semantics = JSON.parse(files[1].content)
      expect(semantics.background.default.$value).toBe('{test-color-a.50}')
    })

    it('returns 2 files for Style Dictionary v3 with alias references', () => {
      const files = codeWithSystem.makeStyleDictionaryV3Tokens()
      expect(files).toHaveLength(2)
      const semantics = JSON.parse(files[1].content)
      expect(semantics.semantic.background.default.value).toBe(
        '{color.test-color-a.50}'
      )
    })

    it('returns 2 files for Universal JSON with $ref', () => {
      const files = codeWithSystem.makeUniversalJson()
      expect(files).toHaveLength(2)
      const semantics = JSON.parse(files[1].content)
      expect(semantics.background.default.$ref).toBe('test-color-a.50')
    })

    it('returns 1 merged file for Native Tokens', () => {
      const files = codeWithSystem.makeNativeTokens()
      expect(files).toHaveLength(1)
      expect(files[0].filename).toBe('tokens.json')
      const json = JSON.parse(files[0].content)
      // The semantic set is merged in
      expect(JSON.stringify(json)).toContain('{test_color_a.50}')
    })

    it('returns 2 files for Tailwind v3', () => {
      const files = codeWithSystem.makeTailwindV3Config()
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('module.exports')
      expect(files[1].content).toContain("primitives['test-color-a']['50']")
    })

    it('returns 2 files for Tailwind v4', () => {
      const files = codeWithSystem.makeTailwindV4Config()
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('var(--color-test-color-a-50)')
    })

    it('returns 2 files for Swift UI', () => {
      const files = codeWithSystem.makeSwiftUI()
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('SemanticTokenColor')
      expect(files[1].content).toContain('backgroundDefault')
    })

    it('returns 2 files for UIKit', () => {
      const files = codeWithSystem.makeUIKit()
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('SemanticToken')
      expect(files[1].content).toContain('backgroundDefault')
    })

    it('returns 2 files for Compose', () => {
      const files = codeWithSystem.makeCompose()
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('val background_default')
      expect(files[1].content).toContain('test_color_a_50')
    })

    it('returns 2 files for Android Resources XML', () => {
      const files = codeWithSystem.makeResources()
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('@color/test_color_a_50')
    })

    it('returns 2 files for CSV semantics (rows of refs)', () => {
      const files = codeWithSystem.makeCsv()
      expect(files).toHaveLength(2)
      expect(files[1].filename).toBe('semantics.csv')
      expect(files[1].content).toContain(
        'path,themeId,colorId,shadeName,shadeId'
      )
      expect(files[1].content).toContain('background/default,theme1,color1,50')
    })
  })
})

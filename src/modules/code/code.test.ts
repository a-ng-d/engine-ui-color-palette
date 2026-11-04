import { describe, it, expect } from 'vitest'
import {
  BaseConfiguration,
  ThemeConfiguration,
  MetaConfiguration,
} from '@tps/configuration.types'
import { CodeFile } from '@tps/code.types'
import Data from '@modules/data/data'
import { srgbToDisplayP3 } from '../../formats/_shared/colorOutput'
import Code from './code'

const first = (files: Array<CodeFile>): string => files[0].content

type Node = { [key: string]: unknown }

const leaves = (node: unknown, key: string): Array<string> =>
  node && typeof node === 'object'
    ? Object.entries(node as Node).flatMap(([k, v]) =>
        k === key && typeof v === 'string' ? [v] : leaves(v, key)
      )
    : []

const lookup = (doc: unknown, path: string) =>
  path
    .split('.')
    .reduce<unknown>(
      (node, segment) =>
        node && typeof node === 'object' ? (node as Node)[segment] : undefined,
      doc
    )

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
      chroma: { min: 100, max: 100, value: 100, curve: 'LINEAR' },
      hue: { min: 0, max: 0, value: 0, curve: 'LINEAR' },
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
        hue: {
          shift: { min: 0, max: 0, value: 0, curve: 'LINEAR' },
          isLocked: false,
        },
        chroma: {
          shift: { min: 100, max: 100, value: 100, curve: 'LINEAR' },
          isLocked: false,
        },
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
        hue: {
          shift: { min: 0, max: 0, value: 0, curve: 'LINEAR' },
          isLocked: false,
        },
        chroma: {
          shift: { min: 100, max: 100, value: 100, curve: 'LINEAR' },
          isLocked: false,
        },
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
        hue: {
          shift: { min: 0, max: 0, value: 0, curve: 'LINEAR' },
          isLocked: false,
        },
        chroma: {
          shift: { min: 100, max: 100, value: 100, curve: 'LINEAR' },
          isLocked: false,
        },
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
      expect(semantics.background.default.$value).toBe('{Test Color A.50}')
    })

    it('returns 2 files for Style Dictionary v3 with alias references', () => {
      const files = codeWithSystem.makeStyleDictionaryV3Tokens()
      expect(files).toHaveLength(2)
      const semantics = JSON.parse(files[1].content)
      expect(semantics.semantic.background.default.value).toBe(
        '{color.Test Color A.50}'
      )
    })

    it('returns 2 files for Universal JSON with $ref', () => {
      const files = codeWithSystem.makeUniversalJson()
      expect(files).toHaveLength(2)
      const semantics = JSON.parse(files[1].content)
      expect(semantics.background.default.$ref).toBe('Test Color A.50')
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

    it('keeps the Tailwind v4 semantics on variable references in OKLCH', () => {
      const files = codeWithSystem.makeTailwindV4Config('OKLCH')
      expect(files).toHaveLength(2)
      expect(files[1].content).toContain('var(--color-test-color-a-50)')
      expect(files[1].content).not.toContain('oklch(')
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

    describe('Aliases resolve against the primitives', () => {
      it('resolves every DTCG alias in the primitives file', () => {
        const [primitives, semantics] = codeWithSystem.makeDtcgTokens('RGB')
        const aliases = leaves(JSON.parse(semantics.content), '$value')

        expect(aliases.length).toBeGreaterThan(0)
        aliases.forEach((alias) => {
          expect(
            lookup(JSON.parse(primitives.content), alias.slice(1, -1))
          ).toBeDefined()
        })
      })

      it('resolves every Style Dictionary v3 alias in the primitives file', () => {
        const [primitives, semantics] =
          codeWithSystem.makeStyleDictionaryV3Tokens()
        const aliases = leaves(JSON.parse(semantics.content), 'value')

        expect(aliases.length).toBeGreaterThan(0)
        aliases.forEach((alias) => {
          expect(
            lookup(JSON.parse(primitives.content), alias.slice(1, -1))
          ).toBeDefined()
        })
      })

      it('resolves every Universal JSON reference in the primitives file', () => {
        const [primitives, semantics] = codeWithSystem.makeUniversalJson()
        const refs = leaves(JSON.parse(semantics.content), '$ref')

        expect(refs.length).toBeGreaterThan(0)
        refs.forEach((ref) => {
          expect(lookup(JSON.parse(primitives.content), ref)).toBeDefined()
        })
      })

      it('references SwiftUI primitives that the primitives file declares', () => {
        const [primitives, semantics] = codeWithSystem.makeSwiftUI()
        const refs = [...semantics.content.matchAll(/= Color\.Token\.(\w+)/g)]

        expect(refs.length).toBeGreaterThan(0)
        expect(semantics.content).not.toContain('Token()')
        refs.forEach(([, name]) => {
          expect(primitives.content).toContain(`public let ${name} =`)
        })
      })

      it('references UIKit primitives that the primitives file declares', () => {
        const [primitives, semantics] = codeWithSystem.makeUIKit()
        const refs = [...semantics.content.matchAll(/= UIColor\.Token\.(\w+)/g)]

        expect(refs.length).toBeGreaterThan(0)
        refs.forEach(([, name]) => {
          expect(primitives.content).toContain(`static let ${name} =`)
        })
      })

      it('does not declare a top-level Color type in the UIKit files', () => {
        const [primitives, semantics] = codeWithSystem.makeUIKit()

        expect(primitives.content).toContain('extension UIColor {')
        expect(primitives.content).toContain('struct Token {')
        expect(semantics.content).toContain('extension UIColor {')
        ;[primitives, semantics].forEach((file) => {
          expect(file.content).not.toMatch(/^struct (Color|SemanticToken)/m)
        })
      })
    })
  })

  describe('Notation of transparent and wide-gamut colors', () => {
    const linesOf = (content: string, name: string) =>
      content.split('\n').filter((line) => line.includes(name))

    it('writes the OKLCH lightness of transparent shades in CSS and SCSS', () => {
      const cases: Array<[string, string]> = [
        [first(code.makeCssCustomProps('OKLCH')), '--test-color-c-'],
        [first(code.makeScssVariables('OKLCH')), '$test-color-c-'],
      ]

      cases.forEach(([content, name]) => {
        const transparent = linesOf(content, name).filter((line) =>
          line.includes(' / ')
        )

        expect(transparent.length).toBeGreaterThan(0)
        transparent.forEach((line) => {
          const lightness = Number(/oklch\((\d+)%/.exec(line)?.[1])

          expect(lightness).toBeGreaterThan(40)
          expect(lightness).toBeLessThan(50)
        })
      })
    })

    it('converts sRGB to Display P3 instead of reusing the sRGB values', () => {
      const [r, g, b] = srgbToDisplayP3([1, 0, 0])

      expect(r).toBeCloseTo(0.9175, 3)
      expect(g).toBeCloseTo(0.2003, 3)
      expect(b).toBeCloseTo(0.1386, 3)
      srgbToDisplayP3([1, 1, 1]).forEach((channel) => {
        expect(channel).toBeCloseTo(1, 5)
      })
      expect(srgbToDisplayP3([0, 0, 0])).toEqual([0, 0, 0])

      const source = linesOf(
        first(code.makeCssCustomProps('P3')),
        '--test-color-a-source'
      )[0]
      const [pr, pg, pb] = [...source.matchAll(/(\d\.\d{3})/g)].map(([value]) =>
        Number(value)
      )

      expect(pr).toBeCloseTo(r, 3)
      expect(pg).toBeCloseTo(g, 3)
      expect(pb).toBeCloseTo(b, 3)
    })

    it('gives every UIKit color an alpha, as UIColor requires', () => {
      const result = first(code.makeUIKit())
      const initializers = result.match(/UIColor\([^)]*\)/g) ?? []

      expect(initializers.length).toBeGreaterThan(0)
      initializers.forEach((initializer) => {
        expect(initializer).toContain('alpha:')
      })
    })

    it('keeps the blue channel of the source color for transparent SwiftUI shades', () => {
      const transparent = linesOf(first(code.makeSwiftUI()), '.opacity(')

      expect(transparent.length).toBeGreaterThan(0)
      transparent.forEach((line) => {
        expect(line).toContain('red: 0.000, green: 0.000, blue: 1.000')
      })
    })

    it('writes transparent Compose colors as 0xAARRGGBB', () => {
      const lines = linesOf(first(code.makeCompose()), 'test_color_c_')
      const transparent = lines.filter((line) => !line.includes('0XFF'))

      expect(transparent.length).toBeGreaterThan(0)
      lines.forEach((line) => {
        expect(line).toMatch(/Color\(0X[0-9A-F]{8}\)/)
      })
      transparent.forEach((line) => {
        expect(line).toMatch(/Color\(0X[0-9A-F]{2}0000FF\)/)
      })
    })

    it('writes transparent Android colors as #AARRGGBB', () => {
      const lines = linesOf(first(code.makeResources()), 'test_color_c_')
      const transparent = lines.filter((line) => /#[0-9a-f]{8}</.test(line))

      expect(transparent.length).toBeGreaterThan(0)
      transparent.forEach((line) => {
        expect(line).toMatch(/#[0-9a-f]{2}0000ff</)
      })
    })
  })

  describe('Code with DTCG resolver (multi-theme)', () => {
    const dataWithMultipleCustomThemes = new Data({
      base: mockBase,
      themes: [mockThemes[0], mockThemes[1], mockThemes[2]],
      meta: mockMeta,
    }).makePaletteData()

    it('emits one standard primitives document per custom theme plus a resolver, with no legacy $extensions.mode', () => {
      const codeWithCustomThemes = new Code({
        paletteData: dataWithMultipleCustomThemes,
      })
      const files = codeWithCustomThemes.makeDtcgTokens('RGB')

      expect(files.map((f) => f.filename)).toEqual([
        'custom-theme-a.primitives.tokens.json',
        'custom-theme-b.primitives.tokens.json',
        'tokens.resolver.json',
      ])

      const [primitivesA, primitivesB, resolverFile] = files

      expect(
        JSON.parse(primitivesA.content)['Test Color A']['50'].$value
      ).toBeDefined()
      expect(
        JSON.parse(primitivesB.content)['Test Color A']['50'].$value
      ).toBeDefined()

      expect(primitivesA.content).toContain('com.uicp.wcag')
      expect(primitivesA.content).toContain('com.uicp.apca')
      files.forEach((f) => expect(f.content).not.toContain('"mode"'))

      const resolver = JSON.parse(resolverFile.content)
      expect(resolver.version).toBe('2025.10')
      expect(resolver.resolutionOrder).toEqual([
        { $ref: '#/modifiers/color-mode' },
      ])
      expect(resolver.modifiers['color-mode'].default).toBe('custom-theme-a')
      expect(resolver.modifiers['color-mode'].contexts).toEqual({
        'custom-theme-a': [{ $ref: './custom-theme-a.primitives.tokens.json' }],
        'custom-theme-b': [{ $ref: './custom-theme-b.primitives.tokens.json' }],
      })
    })

    it('emits primitives+semantics per theme, each aliasing its own theme, plus a resolver referencing both', () => {
      const dtcgSystemData = {
        type: 'system' as const,
        schema: {
          groups: [
            {
              id: 'g1',
              name: 'Type',
              members: [{ id: 'm_bg', name: 'background' }],
            },
          ],
        },
        tokens: [
          {
            path: ['m_bg'],
            pathNames: ['background'],
            isExcluded: false,
            refs: [
              {
                themeId: mockThemes[1].id,
                shadeId: `${mockThemes[1].id}:color1:50`,
              },
              {
                themeId: mockThemes[2].id,
                shadeId: `${mockThemes[2].id}:color2:100`,
              },
            ],
          },
        ],
      }

      const codeWithCustomThemesAndSystem = new Code({
        paletteData: dataWithMultipleCustomThemes,
        systemData: dtcgSystemData,
      })
      const files = codeWithCustomThemesAndSystem.makeDtcgTokens('RGB')

      expect(files.map((f) => f.filename)).toEqual([
        'custom-theme-a.primitives.tokens.json',
        'custom-theme-a.semantics.tokens.json',
        'custom-theme-b.primitives.tokens.json',
        'custom-theme-b.semantics.tokens.json',
        'tokens.resolver.json',
      ])

      const semanticsA = JSON.parse(files[1].content)
      expect(semanticsA.background.$value).toBe('{Test Color A.50}')

      const semanticsB = JSON.parse(files[3].content)
      expect(semanticsB.background.$value).toBe('{Test Color B.100}')

      const resolver = JSON.parse(files[4].content)

      expect(
        resolver.modifiers['color-mode'].contexts['custom-theme-a']
      ).toEqual([
        { $ref: './custom-theme-a.primitives.tokens.json' },
        { $ref: './custom-theme-a.semantics.tokens.json' },
      ])
      expect(
        resolver.modifiers['color-mode'].contexts['custom-theme-b']
      ).toEqual([
        { $ref: './custom-theme-b.primitives.tokens.json' },
        { $ref: './custom-theme-b.semantics.tokens.json' },
      ])

      files.forEach((f) => expect(f.content).not.toContain('"mode"'))
    })

    it('falls back to a single primitives file with no resolver when only one theme is active', () => {
      const codeWithDefaultTheme = new Code({ paletteData: data })
      const files = codeWithDefaultTheme.makeDtcgTokens('RGB')

      expect(files.map((f) => f.filename)).toEqual(['primitives.tokens.json'])
    })
  })

  describe('Tailwind v4 color space', () => {
    const variables = (content: string, name: string) =>
      new Map(
        content
          .split('\n')
          .filter((line) => line.trim().startsWith(`--${name}`))
          .map((line) => {
            const [key, value] = line.trim().split(/: (.*);$/)

            return [key, value] as [string, string]
          })
      )

    it('writes hex values by default', () => {
      const result = first(code.makeTailwindV4Config())
      const red = variables(result, 'color-test-color-a-')

      expect(red.size).toBeGreaterThan(0)
      red.forEach((value) => expect(value).toMatch(/^#[0-9a-f]{6}$/))
    })

    it('writes oklch() values when asked, for every shade', () => {
      const result = first(code.makeTailwindV4Config('OKLCH'))
      const red = variables(result, 'color-test-color-a-')

      expect(result).toContain('@import "tailwindcss";')
      expect(result).toContain('--color-*: initial;')
      expect(red.size).toBeGreaterThan(0)
      red.forEach((value) =>
        expect(value).toMatch(/^oklch\(\d+% \d\.\d{3} \d+\)$/)
      )
    })

    it('writes the same oklch() values as the CSS export', () => {
      const tailwind = variables(
        first(code.makeTailwindV4Config('OKLCH')),
        'color-test-color-a-'
      )
      const css = variables(
        first(code.makeCssCustomProps('OKLCH')),
        'test-color-a-'
      )

      expect(tailwind.size).toBe(css.size)
      tailwind.forEach((value, key) => {
        expect(css.get(key.replace('--color-', '--'))).toBe(value)
      })
    })

    it('keeps the transparency of the shades', () => {
      const blue = variables(
        first(code.makeTailwindV4Config('OKLCH')),
        'color-test-color-c-'
      )
      const transparent = [...blue.values()].filter((value) =>
        value.includes(' / ')
      )

      expect(transparent.length).toBeGreaterThan(0)
      transparent.forEach((value) =>
        expect(value).toMatch(/^oklch\(\d+% \d\.\d{3} \d+ \/ \d\.\d{2}\)$/)
      )
    })
  })

  describe('Aliases with several color modes', () => {
    const dataWithModes = new Data({
      base: mockBase,
      themes: [mockThemes[0], mockThemes[1], mockThemes[2]],
      meta: mockMeta,
    }).makePaletteData()

    const modeA = mockThemes[1]
    const modeB = mockThemes[2]
    const codeWithModes = new Code({
      paletteData: dataWithModes,
      systemData: {
        type: 'system' as const,
        schema: {
          groups: [
            {
              id: 'g1',
              name: 'Type',
              members: [{ id: 'm_bg', name: 'background' }],
            },
          ],
        },
        tokens: [
          {
            path: ['m_bg'],
            pathNames: ['background'],
            isExcluded: false,
            refs: [
              { themeId: modeA.id, shadeId: `${modeA.id}:color1:50` },
              { themeId: modeB.id, shadeId: `${modeB.id}:color2:100` },
            ],
          },
        ],
      },
    })

    it('points Style Dictionary v3 aliases at the primitives of their own color mode', () => {
      const [primitives, semantics] =
        codeWithModes.makeStyleDictionaryV3Tokens()
      const doc = JSON.parse(semantics.content)
      const aliases = leaves(doc, 'value')

      expect(doc.semantic).toBeUndefined()
      expect(Object.keys(doc).sort()).toEqual([
        'custom-theme-a',
        'custom-theme-b',
      ])
      expect(doc['custom-theme-a'].background.value).toBe(
        '{color.Test Color A.Custom Theme A.50}'
      )
      expect(doc['custom-theme-b'].background.value).toBe(
        '{color.Test Color B.Custom Theme B.100}'
      )
      aliases.forEach((alias) => {
        expect(
          lookup(JSON.parse(primitives.content), alias.slice(1, -1))
        ).toBeDefined()
      })
    })

    it('points Universal JSON references at the primitives of their own color mode', () => {
      const [primitives, semantics] = codeWithModes.makeUniversalJson()
      const doc = JSON.parse(semantics.content)
      const refs = leaves(doc, '$ref')

      expect(refs).toEqual([
        'Custom Theme A.Test Color A.50',
        'Custom Theme B.Test Color B.100',
      ])
      refs.forEach((ref) => {
        expect(lookup(JSON.parse(primitives.content), ref)).toBeDefined()
      })
    })

    it('points UIKit and SwiftUI references at declared primitives, per color mode', () => {
      const [uikitPrimitives, uikitSemantics] = codeWithModes.makeUIKit()
      const uikit = [
        ...uikitSemantics.content.matchAll(/= UIColor\.Token\.(\w+)\.(\w+)/g),
      ]

      expect(uikit.length).toBeGreaterThan(0)
      uikit.forEach(([, mode, name]) => {
        expect(uikitPrimitives.content).toContain(`struct ${mode} {`)
        expect(uikitPrimitives.content).toContain(`static let ${name} =`)
      })
    })
  })
})

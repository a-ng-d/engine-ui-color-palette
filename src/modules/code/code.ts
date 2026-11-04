import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData, PaletteDataThemeItem } from '@tps/data.types'
import { ColorSpaceConfiguration } from '@tps/configuration.types'
import { CodeFile } from '@tps/code.types'
import makeUniversalSemantics from '../../formats/semantics/makeUniversalSemantics'
import makeUIKitSemantics from '../../formats/semantics/makeUIKitSemantics'
import makeTailwindV4Semantics from '../../formats/semantics/makeTailwindV4Semantics'
import makeTailwindV3Semantics from '../../formats/semantics/makeTailwindV3Semantics'
import makeSwiftUISemantics from '../../formats/semantics/makeSwiftUISemantics'
import makeStyleDictionaryV3Semantics from '../../formats/semantics/makeStyleDictionaryV3Semantics'
import makeScssSemantics from '../../formats/semantics/makeScssSemantics'
import makeResourcesSemantics from '../../formats/semantics/makeResourcesSemantics'
import makeNativeSemantics from '../../formats/semantics/makeNativeSemantics'
import makeLessSemantics from '../../formats/semantics/makeLessSemantics'
import makeDtcgSemantics from '../../formats/semantics/makeDtcgSemantics'
import makeCsvSemantics from '../../formats/semantics/makeCsvSemantics'
import makeCssSemantics from '../../formats/semantics/makeCssSemantics'
import makeComposeSemantics from '../../formats/semantics/makeComposeSemantics'
import { workingThemes } from '../../formats/semantics/_helpers'
import makeUniversalTokens from '../../formats/primitives/makeUniversalTokens'
import makeUIKit from '../../formats/primitives/makeUIKit'
import makeTailwindV4Config from '../../formats/primitives/makeTailwindV4Config'
import makeTailwindV3Config from '../../formats/primitives/makeTailwindV3Config'
import makeSwiftUI from '../../formats/primitives/makeSwiftUI'
import makeStyleDictionaryV3Tokens from '../../formats/primitives/makeStyleDictionaryV3Tokens'
import makeScssVariables from '../../formats/primitives/makeScssVariables'
import makeResources from '../../formats/primitives/makeResources'
import makeNativeTokens from '../../formats/primitives/makeNativeTokens'
import makeLessVariables from '../../formats/primitives/makeLessVariables'
import makeDtcgTokens from '../../formats/primitives/makeDtcgTokens'
import makeCsv from '../../formats/primitives/makeCsv'
import makeCssCustomProps from '../../formats/primitives/makeCssCustomProps'
import makeCompose from '../../formats/primitives/makeCompose'
import makeDtcgResolver from '../../formats/makeDtcgResolver'

export default class Code {
  private paletteData: PaletteData
  private systemData?: SystemData

  constructor({
    paletteData,
    systemData,
  }: {
    paletteData: PaletteData
    systemData?: SystemData
  }) {
    this.paletteData = paletteData
    this.systemData = systemData
  }

  private wrap = (
    primitivesFilename: string,
    primitivesContent: string,
    mimeType: string,
    semanticsFilename: string,
    semanticsContent: string | null
  ): Array<CodeFile> => {
    const files: Array<CodeFile> = [
      { filename: primitivesFilename, content: primitivesContent, mimeType },
    ]
    if (semanticsContent !== null)
      files.push({
        filename: semanticsFilename,
        content: semanticsContent,
        mimeType,
      })
    return files
  }

  makeCssCustomProps = (
    colorSpace: ColorSpaceConfiguration = 'RGB'
  ): Array<CodeFile> =>
    this.wrap(
      'primitives.css',
      makeCssCustomProps(this.paletteData, colorSpace),
      'text/css',
      'semantics.css',
      this.systemData
        ? makeCssSemantics(this.paletteData, this.systemData)
        : null
    )

  makeScssVariables = (
    colorSpace: ColorSpaceConfiguration = 'RGB'
  ): Array<CodeFile> =>
    this.wrap(
      'primitives.scss',
      makeScssVariables(this.paletteData, colorSpace),
      'text/x-scss',
      'semantics.scss',
      this.systemData
        ? makeScssSemantics(this.paletteData, this.systemData)
        : null
    )

  makeLessVariables = (
    colorSpace: ColorSpaceConfiguration = 'RGB'
  ): Array<CodeFile> =>
    this.wrap(
      'primitives.less',
      makeLessVariables(this.paletteData, colorSpace),
      'text/x-less',
      'semantics.less',
      this.systemData
        ? makeLessSemantics(this.paletteData, this.systemData)
        : null
    )

  makeTailwindV3Config = (): Array<CodeFile> =>
    this.wrap(
      'primitives.js',
      makeTailwindV3Config(this.paletteData),
      'text/javascript',
      'semantics.js',
      this.systemData
        ? makeTailwindV3Semantics(this.paletteData, this.systemData)
        : null
    )

  makeTailwindV4Config = (
    colorSpace: ColorSpaceConfiguration = 'HEX'
  ): Array<CodeFile> =>
    this.wrap(
      'primitives.css',
      makeTailwindV4Config(this.paletteData, colorSpace),
      'text/css',
      'semantics.css',
      this.systemData
        ? makeTailwindV4Semantics(this.paletteData, this.systemData)
        : null
    )

  makeDtcgTokens = (
    colorSpace: ColorSpaceConfiguration = 'RGB'
  ): Array<CodeFile> => {
    const themes = workingThemes(this.paletteData)

    if (themes.length <= 1)
      return this.wrap(
        'primitives.tokens.json',
        makeDtcgTokens(colorSpace, themes[0]),
        'application/json',
        'semantics.tokens.json',
        this.systemData
          ? makeDtcgSemantics(this.paletteData, this.systemData, themes[0])
          : null
      )

    const files: Array<CodeFile> = []
    const resolverInputs: Array<{
      theme: PaletteDataThemeItem
      primitivesFilename: string
      semanticsFilename?: string
    }> = []

    themes.forEach((theme) => {
      const slug = new Case(theme.name).doKebabCase()
      const primitivesFilename = `${slug}.primitives.tokens.json`
      files.push({
        filename: primitivesFilename,
        content: makeDtcgTokens(colorSpace, theme),
        mimeType: 'application/json',
      })

      let semanticsFilename: string | undefined
      if (this.systemData) {
        semanticsFilename = `${slug}.semantics.tokens.json`
        files.push({
          filename: semanticsFilename,
          content: makeDtcgSemantics(this.paletteData, this.systemData, theme),
          mimeType: 'application/json',
        })
      }

      resolverInputs.push({ theme, primitivesFilename, semanticsFilename })
    })

    files.push({
      filename: 'tokens.resolver.json',
      content: makeDtcgResolver(
        this.paletteData.name,
        this.paletteData.description,
        resolverInputs
      ),
      mimeType: 'application/json',
    })

    return files
  }

  makeStyleDictionaryV3Tokens = (): Array<CodeFile> =>
    this.wrap(
      'primitives.json',
      makeStyleDictionaryV3Tokens(this.paletteData),
      'application/json',
      'semantics.json',
      this.systemData
        ? makeStyleDictionaryV3Semantics(this.paletteData, this.systemData)
        : null
    )

  makeUniversalJson = (): Array<CodeFile> =>
    this.wrap(
      'primitives.json',
      makeUniversalTokens(this.paletteData),
      'application/json',
      'semantics.json',
      this.systemData
        ? makeUniversalSemantics(this.paletteData, this.systemData)
        : null
    )

  makeNativeTokens = (): Array<CodeFile> => {
    if (!this.systemData)
      return [
        {
          filename: 'tokens.json',
          content: makeNativeTokens(this.paletteData),
          mimeType: 'application/json',
        },
      ]
    return [
      {
        filename: 'tokens.json',
        content: makeNativeSemantics(this.paletteData, this.systemData),
        mimeType: 'application/json',
      },
    ]
  }

  makeSwiftUI = (): Array<CodeFile> =>
    this.wrap(
      'Primitives.swift',
      makeSwiftUI(this.paletteData),
      'text/swift',
      'SemanticTokens.swift',
      this.systemData
        ? makeSwiftUISemantics(this.paletteData, this.systemData)
        : null
    )

  makeUIKit = (): Array<CodeFile> =>
    this.wrap(
      'Primitives.swift',
      makeUIKit(this.paletteData),
      'text/swift',
      'SemanticTokens.swift',
      this.systemData
        ? makeUIKitSemantics(this.paletteData, this.systemData)
        : null
    )

  makeCompose = (): Array<CodeFile> =>
    this.wrap(
      'Primitives.kt',
      makeCompose(this.paletteData),
      'text/x-kotlin',
      'SemanticTokens.kt',
      this.systemData
        ? makeComposeSemantics(this.paletteData, this.systemData)
        : null
    )

  makeResources = (): Array<CodeFile> =>
    this.wrap(
      'primitives.xml',
      makeResources(this.paletteData),
      'text/xml',
      'semantics.xml',
      this.systemData
        ? makeResourcesSemantics(this.paletteData, this.systemData)
        : null
    )

  makeCsv = (): Array<CodeFile> => {
    const primitives = makeCsv(this.paletteData)
    const files: Array<CodeFile> = [
      {
        filename: 'primitives.csv',
        content: JSON.stringify(primitives),
        mimeType: 'text/csv',
      },
    ]
    if (this.systemData)
      files.push({
        filename: 'semantics.csv',
        content: makeCsvSemantics(this.paletteData, this.systemData),
        mimeType: 'text/csv',
      })
    return files
  }
}

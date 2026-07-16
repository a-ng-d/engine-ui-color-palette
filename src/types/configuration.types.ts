import { Easing } from '@unoff/utils'
import { ColorFormat } from './model.types'
import { LibraryData } from './data.types'
import { HexModel, RgbModel } from './color.types'

export type ThirdParty = 'COOLORS' | 'REALTIME_COLORS' | 'COLOUR_LOVERS'

export interface FullConfiguration {
  base: BaseConfiguration
  themes: Array<ThemeConfiguration>
  meta: MetaConfiguration
  libraryData: Array<LibraryData>
  version: string
  type: 'UI_COLOR_PALETTE'
}

export interface BaseConfiguration {
  [key: string]: string | number | boolean | object | undefined
  name: string
  description: string
  preset: PresetConfiguration
  shift: ShiftConfiguration
  areSourceColorsLocked: LockedSourceColorsConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: ColorSpaceConfiguration
  algorithmVersion: AlgorithmVersionConfiguration
}

export interface SourceColorConfiguration {
  name: string
  rgb: RgbModel
  source:
    | 'CANVAS'
    | 'REMOTE'
    | 'DEFAULT'
    | 'IMAGE'
    | 'HARMONY'
    | 'AI'
    | ThirdParty
  id: string
  isRemovable: boolean
  hue?: {
    shift: number
    isLocked: boolean
  }
  chroma?: {
    shift: number
    isLocked: boolean
  }
}

export interface ExchangeConfiguration {
  [key: string]: string | number | boolean | object | undefined
  name: string
  description: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  shift: ShiftConfiguration
  areSourceColorsLocked: LockedSourceColorsConfiguration
  colorSpace: ColorSpaceConfiguration
  visionSimulationMode: VisionSimulationModeConfiguration
  textColorsTheme: TextColorsThemeConfiguration<'HEX'>
  algorithmVersion: AlgorithmVersionConfiguration
}

export interface ExtractOfBaseConfiguration {
  id: string
  name: string
  preset: string
  colors: Array<ColorConfiguration>
  themes: Array<ThemeConfiguration>
  screenshot: Uint8Array | null
  devStatus: string | null
}

export type EasingConfiguration = Easing

export interface PresetConfiguration {
  id: string
  name: string
  stops: Array<number>
  min: number
  max: number
  easing: Easing
  family?: string
}

export type ScaleConfiguration = Record<string, number>

export interface ShiftConfiguration {
  chroma: number
  hue: number
}

export type LockedSourceColorsConfiguration = boolean

export interface ColorConfiguration {
  id: string
  name: string
  description: string
  rgb: RgbModel
  hue: {
    shift: number
    isLocked: boolean
  }
  chroma: {
    shift: number
    isLocked: boolean
  }
  alpha: {
    isEnabled: boolean
    backgroundColor: HexModel
  }
}

export interface ThemeConfiguration {
  id: string
  name: string
  description: string
  scale: ScaleConfiguration
  visionSimulationMode: VisionSimulationModeConfiguration
  textColorsTheme: TextColorsThemeConfiguration<'HEX'>
  paletteBackground: HexModel
  isEnabled: boolean
  type: 'default theme' | 'custom theme'
}

export interface ExportConfiguration {
  format:
    | 'JSON'
    | 'CSS'
    | 'SCSS'
    | 'LESS'
    | 'JS'
    | 'SWIFT'
    | 'KT'
    | 'XML'
    | 'CSV'
  context:
    | 'TOKENS_NATIVE'
    | 'TOKENS_DTCG'
    | 'TOKENS_STYLE_DICTIONARY_V3'
    | 'TOKENS_UNIVERSAL'
    | 'STYLESHEET_CSS'
    | 'STYLESHEET_SCSS'
    | 'STYLESHEET_LESS'
    | 'TAILWIND_V3'
    | 'TAILWIND_V4'
    | 'APPLE_SWIFTUI'
    | 'APPLE_UIKIT'
    | 'ANDROID_COMPOSE'
    | 'ANDROID_XML'
    | 'CSV'
  mimeType:
    | 'application/json'
    | 'text/css'
    | 'text/x-scss'
    | 'text/x-less'
    | 'text/javascript'
    | 'text/swift'
    | 'text/x-kotlin'
    | 'text/xml'
    | 'text/csv'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export type ColorSpaceConfiguration =
  | 'LCH'
  | 'OKLCH'
  | 'LAB'
  | 'OKLAB'
  | 'HSL'
  | 'HSLUV'
  | 'HSV'
  | 'CMYK'
  | 'RGB'
  | 'HEX'
  | 'P3'

export type VisionSimulationModeConfiguration =
  | 'NONE'
  | 'PROTANOMALY'
  | 'PROTANOPIA'
  | 'DEUTERANOMALY'
  | 'DEUTERANOPIA'
  | 'TRITANOMALY'
  | 'TRITANOPIA'
  | 'ACHROMATOMALY'
  | 'ACHROMATOPSIA'

export interface TextColorsThemeConfiguration<T extends 'HEX' | 'RGB'> {
  lightColor: ColorFormat<T>
  darkColor: ColorFormat<T>
}

export type ViewConfiguration = 'PALETTE_WITH_PROPERTIES' | 'PALETTE' | 'SHEET'

export type AlgorithmVersionConfiguration = 'v1' | 'v2' | 'v3'

export interface DatesConfiguration {
  createdAt: Date | string
  updatedAt: Date | string
  publishedAt: Date | string
  openedAt: Date | string
}

export interface PublicationConfiguration {
  isPublished: boolean
  isShared: boolean
}

export interface CreatorConfiguration {
  creatorFullName: string
  creatorAvatar: string
  creatorId: string
}

export type StatusConfiguration = 'IS_READY_TO_DEV' | 'DEFAULT'

export interface UserConfiguration {
  id: string
  fullName: string
  avatar: string
}

export interface MetaConfiguration {
  id: string
  dates: DatesConfiguration
  publicationStatus: PublicationConfiguration
  creatorIdentity: CreatorConfiguration
}

export interface DocumentConfiguration {
  id?: string
  view?: ViewConfiguration
  isLinkedToPalette?: boolean
  updatedAt?: Date | string
}

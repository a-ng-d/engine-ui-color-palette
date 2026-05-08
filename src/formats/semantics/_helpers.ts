import { SystemData, SystemDataToken } from '@tps/system.types'
import { PaletteData, PaletteDataThemeItem } from '@tps/data.types'

export interface ParsedRef {
  themeId: string
  colorId: string
  shadeName: string
}

export const parseShadeId = (shadeId: string): ParsedRef | null => {
  const parts = shadeId.split(':')
  if (parts.length !== 3) return null
  const [themeId, colorId, shadeName] = parts
  if (!themeId || !colorId || !shadeName) return null
  return { themeId, colorId, shadeName }
}

export const findColorName = (
  paletteData: PaletteData,
  themeId: string,
  colorId: string
): string | null => {
  const theme = paletteData.themes.find((t) => t.id === themeId)
  const color = theme?.colors.find((c) => c.id === colorId)
  return color?.name ?? null
}

export const findThemeName = (
  paletteData: PaletteData,
  themeId: string
): string | null =>
  paletteData.themes.find((t) => t.id === themeId)?.name ?? null

export const workingThemes = (
  paletteData: PaletteData
): Array<PaletteDataThemeItem> =>
  paletteData.themes.filter((t) => t.type === 'custom theme').length === 0
    ? paletteData.themes.filter((t) => t.type === 'default theme')
    : paletteData.themes.filter((t) => t.type === 'custom theme')

export const isSourceShade = (shadeName: string): boolean =>
  shadeName === 'source'

export interface ResolvedTokenForTheme {
  themeId: string
  themeName: string | null
  colorName: string | null
  shadeName: string | null
  isUnbound: boolean
}

export const resolveTokenPerTheme = (
  paletteData: PaletteData,
  token: SystemDataToken
): Array<ResolvedTokenForTheme> =>
  token.refs.map((r) => {
    if (r.shadeId === null)
      return {
        themeId: r.themeId,
        themeName: findThemeName(paletteData, r.themeId),
        colorName: null,
        shadeName: null,
        isUnbound: true,
      }
    const parsed = parseShadeId(r.shadeId)
    if (!parsed)
      return {
        themeId: r.themeId,
        themeName: findThemeName(paletteData, r.themeId),
        colorName: null,
        shadeName: null,
        isUnbound: true,
      }
    return {
      themeId: r.themeId,
      themeName: findThemeName(paletteData, r.themeId),
      colorName: findColorName(paletteData, r.themeId, parsed.colorId),
      shadeName: parsed.shadeName,
      isUnbound: false,
    }
  })

export const partitionTokens = (
  paletteData: PaletteData,
  systemData: SystemData
): {
  bound: Array<SystemDataToken>
  unbound: Array<SystemDataToken>
  excluded: Array<SystemDataToken>
} => {
  const bound: Array<SystemDataToken> = []
  const unbound: Array<SystemDataToken> = []
  const excluded: Array<SystemDataToken> = []
  systemData.tokens.forEach((token) => {
    if (token.isExcluded) {
      excluded.push(token)
      return
    }
    const resolved = resolveTokenPerTheme(paletteData, token)
    if (resolved.every((r) => r.isUnbound)) unbound.push(token)
    else bound.push(token)
  })
  return { bound, unbound, excluded }
}

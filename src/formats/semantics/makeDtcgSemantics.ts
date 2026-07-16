import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { partitionTokens, resolveTokenPerTheme, workingThemes } from './_helpers'

const makeDtcgSemantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')

  const root: Record<string, unknown> = {}
  if (unbound.length > 0)
    root['$description'] =
      'Unbound semantic tokens (no resolution): ' +
      unbound.map((t) => t.pathNames.join('.')).join(', ')

  const setNested = (
    obj: Record<string, unknown>,
    keys: Array<string>,
    value: unknown
  ) => {
    let cur: Record<string, unknown> = obj
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {}
      cur = cur[k] as Record<string, unknown>
    }
    cur[keys[keys.length - 1]] = value
  }

  const aliasFor = (colorName: string, shadeName: string) =>
    `{${new Case(colorName).doKebabCase()}.${shadeName}}`

  bound.forEach((t) => {
    const keys = t.pathNames.map((p) => new Case(p).doKebabCase())
    const resolved = resolveTokenPerTheme(paletteData, t)
    const def =
      resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
      resolved.find((r) => !r.isUnbound)
    if (!def || !def.colorName || !def.shadeName) return
    const tokenObj: Record<string, unknown> = {
      $type: 'color',
      $value: aliasFor(def.colorName, def.shadeName),
    }
    if (t.description) tokenObj.$description = t.description

    const overrides: Record<string, unknown> = {}
    customThemes.forEach((theme) => {
      const themeRef = resolved.find((r) => r.themeId === theme.id)
      if (
        !themeRef ||
        themeRef.isUnbound ||
        !themeRef.colorName ||
        !themeRef.shadeName
      )
        return
      if (
        def.colorName === themeRef.colorName &&
        def.shadeName === themeRef.shadeName
      )
        return
      overrides[new Case(theme.name).doKebabCase()] = {
        $value: aliasFor(themeRef.colorName, themeRef.shadeName),
      }
    })
    if (Object.keys(overrides).length > 0)
      tokenObj.$extensions = { mode: overrides }

    setNested(root, keys, tokenObj)
  })

  return JSON.stringify(root, null, 2)
}

export default makeDtcgSemantics

import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { partitionTokens, resolveTokenPerTheme, workingThemes } from './_helpers'

const makeStyleDictionaryV3Semantics = (
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
    root['_unbound'] = unbound.map((t) => t.pathNames.join('.'))

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
    `{color.${new Case(colorName).doKebabCase()}.${shadeName}}`

  // Default tokens nested under 'semantic'
  const semantic: Record<string, unknown> = {}
  bound.forEach((t) => {
    const keys = t.pathNames.map((p) => new Case(p).doKebabCase())
    const resolved = resolveTokenPerTheme(paletteData, t)
    const def =
      resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
      resolved.find((r) => !r.isUnbound)
    if (!def || !def.colorName || !def.shadeName) return
    const tokenObj: Record<string, unknown> = {
      type: 'color',
      value: aliasFor(def.colorName, def.shadeName),
    }
    if (t.description) tokenObj.comment = t.description
    setNested(semantic, keys, tokenObj)
  })
  root['semantic'] = semantic

  // Per-theme overrides as additional nested groups
  customThemes.forEach((theme) => {
    const themeKey = new Case(theme.name).doKebabCase()
    const themeBlock: Record<string, unknown> = {}
    bound.forEach((t) => {
      const keys = t.pathNames.map((p) => new Case(p).doKebabCase())
      const resolved = resolveTokenPerTheme(paletteData, t)
      const r = resolved.find((rr) => rr.themeId === theme.id)
      const def =
        resolved.find((rr) => rr.themeId === defaultTheme.id && !rr.isUnbound) ??
        resolved.find((rr) => !rr.isUnbound)
      if (!r || r.isUnbound || !r.colorName || !r.shadeName) return
      if (def && def.colorName === r.colorName && def.shadeName === r.shadeName)
        return
      const tokenObj: Record<string, unknown> = {
        type: 'color',
        value: aliasFor(r.colorName, r.shadeName),
      }
      setNested(themeBlock, keys, tokenObj)
    })
    if (Object.keys(themeBlock).length > 0) root[themeKey] = themeBlock
  })

  return JSON.stringify(root, null, 2)
}

export default makeStyleDictionaryV3Semantics

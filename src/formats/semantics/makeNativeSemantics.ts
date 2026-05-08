import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { Case } from '@a_ng_d/figmug-utils'
import makeNativeTokens from '../primitives/makeNativeTokens'
import {
  partitionTokens,
  resolveTokenPerTheme,
  workingThemes,
} from './_helpers'

// Tokens Studio requires a single JSON containing both primitive and semantic
// token sets. This emitter parses the primitives JSON and merges a semantics
// set in.
const makeNativeSemantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const primitivesJson = JSON.parse(makeNativeTokens(paletteData)) as Record<
    string,
    unknown
  >
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')
  const paletteName = paletteData.name

  const aliasFor = (colorName: string, shadeName: string) =>
    `{${new Case(colorName).doSnakeCase()}.${shadeName}}`

  const setKey =
    customThemes.length === 0 ? paletteName : `${paletteName}/semantic`
  primitivesJson[setKey] = primitivesJson[setKey] ?? {}
  const semanticSet = primitivesJson[setKey] as Record<string, unknown>

  bound.forEach((t) => {
    const keyPath = t.pathNames.map((p) => new Case(p).doSnakeCase()).join('.')
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
    semanticSet[keyPath] = tokenObj
  })

  // Per-theme overrides → separate sets
  customThemes.forEach((theme) => {
    const themeSemanticKey = `${paletteName}/${new Case(theme.name).doSnakeCase()}-semantic`
    const themeSet: Record<string, unknown> = {}
    bound.forEach((t) => {
      const keyPath = t.pathNames
        .map((p) => new Case(p).doSnakeCase())
        .join('.')
      const resolved = resolveTokenPerTheme(paletteData, t)
      const r = resolved.find((rr) => rr.themeId === theme.id)
      const def =
        resolved.find(
          (rr) => rr.themeId === defaultTheme.id && !rr.isUnbound
        ) ?? resolved.find((rr) => !rr.isUnbound)
      if (!r || r.isUnbound || !r.colorName || !r.shadeName) return
      if (def && def.colorName === r.colorName && def.shadeName === r.shadeName)
        return
      themeSet[keyPath] = {
        $type: 'color',
        $value: aliasFor(r.colorName, r.shadeName),
      }
    })
    if (Object.keys(themeSet).length > 0)
      primitivesJson[themeSemanticKey] = themeSet
  })

  if (unbound.length > 0)
    primitivesJson['_unbound'] = unbound.map((t) => t.pathNames.join('.'))

  return JSON.stringify(primitivesJson, null, '  ')
}

export default makeNativeSemantics

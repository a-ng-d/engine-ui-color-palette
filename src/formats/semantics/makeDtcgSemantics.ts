import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData, PaletteDataThemeItem } from '@tps/data.types'
import { partitionTokens, resolveTokenPerTheme } from './_helpers'

const makeDtcgSemantics = (
  paletteData: PaletteData,
  systemData: SystemData,
  theme: PaletteDataThemeItem
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)

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
    `{${colorName}.${shadeName}}`

  bound.forEach((t) => {
    const keys = t.pathNames.map((p) => new Case(p).doKebabCase())
    const resolved = resolveTokenPerTheme(paletteData, t)
    const ref = resolved.find((r) => r.themeId === theme.id && !r.isUnbound)
    if (!ref || !ref.colorName || !ref.shadeName) return

    const tokenObj: Record<string, unknown> = {
      $type: 'color',
      $value: aliasFor(ref.colorName, ref.shadeName),
    }
    if (t.description) tokenObj.$description = t.description

    setNested(root, keys, tokenObj)
  })

  return JSON.stringify(root, null, 2)
}

export default makeDtcgSemantics

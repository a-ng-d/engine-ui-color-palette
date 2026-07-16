import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { partitionTokens, resolveTokenPerTheme, workingThemes } from './_helpers'

const makeUniversalSemantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
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

  const refFor = (colorName: string, shadeName: string) => ({
    $ref: `${new Case(colorName).doKebabCase()}.${shadeName}`,
  })

  if (customThemes.length === 0) {
    bound.forEach((t) => {
      const keys = t.pathNames.map((p) => new Case(p).doKebabCase())
      const resolved = resolveTokenPerTheme(paletteData, t)
      const r = resolved.find((rr) => !rr.isUnbound)
      if (!r || !r.colorName || !r.shadeName) return
      setNested(root, keys, refFor(r.colorName, r.shadeName))
    })
  } else {
    themes.forEach((theme) => {
      const themeKey = new Case(theme.name).doKebabCase()
      const themeBlock: Record<string, unknown> = {}
      bound.forEach((t) => {
        const keys = t.pathNames.map((p) => new Case(p).doKebabCase())
        const resolved = resolveTokenPerTheme(paletteData, t)
        const r = resolved.find((rr) => rr.themeId === theme.id)
        if (!r || r.isUnbound || !r.colorName || !r.shadeName) return
        setNested(themeBlock, keys, refFor(r.colorName, r.shadeName))
      })
      root[themeKey] = themeBlock
    })
  }

  return JSON.stringify(root, null, 2)
}

export default makeUniversalSemantics

import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { Case } from '@a_ng_d/figmug-utils'
import { partitionTokens, resolveTokenPerTheme, workingThemes } from './_helpers'

const makeResourcesSemantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')

  const out: Array<string> = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources>',
  ]

  if (unbound.length > 0) {
    out.push('  <!-- Unbound semantic tokens -->')
    unbound.forEach((t) => out.push(`  <!--   ${t.pathNames.join('-')} -->`))
  }

  const tokenName = (parts: Array<string>) =>
    parts.map((p) => new Case(p).doSnakeCase()).join('_')
  const primitiveRef = (themeName: string | null, colorName: string, shadeName: string) => {
    const c = new Case(colorName).doSnakeCase()
    const s = shadeName === 'source' ? 'source' : shadeName
    if (themeName) {
      const t = new Case(themeName).doSnakeCase()
      return `@color/${t}_${c}_${s}`
    }
    return `@color/${c}_${s}`
  }

  if (customThemes.length === 0) {
    bound.forEach((t) => {
      const resolved = resolveTokenPerTheme(paletteData, t)
      const def =
        resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
        resolved.find((r) => !r.isUnbound)
      if (!def || !def.colorName || !def.shadeName) return
      out.push(
        `  <color name="${tokenName(t.pathNames)}">${primitiveRef(null, def.colorName, def.shadeName)}</color>`
      )
    })
  } else {
    themes.forEach((theme) => {
      const themeKey = new Case(theme.name).doSnakeCase()
      out.push(`  <!-- ${theme.name} -->`)
      bound.forEach((t) => {
        const resolved = resolveTokenPerTheme(paletteData, t)
        const r = resolved.find((rr) => rr.themeId === theme.id)
        if (!r || r.isUnbound || !r.colorName || !r.shadeName) return
        out.push(
          `  <color name="${themeKey}_${tokenName(t.pathNames)}">${primitiveRef(theme.name, r.colorName, r.shadeName)}</color>`
        )
      })
    })
  }

  out.push('</resources>')

  return out.join('\n')
}

export default makeResourcesSemantics

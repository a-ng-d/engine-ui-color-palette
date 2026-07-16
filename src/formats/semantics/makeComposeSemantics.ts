import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import {
  partitionTokens,
  resolveTokenPerTheme,
  workingThemes,
} from './_helpers'

const makeComposeSemantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')

  const out: Array<string> = ['import androidx.compose.ui.graphics.Color', '']

  if (unbound.length > 0) {
    out.push('// Unbound semantic tokens')
    unbound.forEach((t) => out.push(`//   ${t.pathNames.join('-')}`))
    out.push('')
  }

  const tokenName = (parts: Array<string>) =>
    parts.map((p) => new Case(p).doSnakeCase()).join('_')
  const primitiveRef = (
    themeName: string | null,
    colorName: string,
    shadeName: string
  ) => {
    const c = new Case(colorName).doSnakeCase()
    const s = shadeName === 'source' ? 'source' : shadeName
    if (themeName) {
      const t = new Case(themeName).doSnakeCase()
      return `${t}_${c}_${s}`
    }
    return `${c}_${s}`
  }

  if (customThemes.length === 0) {
    bound.forEach((t) => {
      const resolved = resolveTokenPerTheme(paletteData, t)
      const def =
        resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
        resolved.find((r) => !r.isUnbound)
      if (!def || !def.colorName || !def.shadeName) return
      out.push(
        `val ${tokenName(t.pathNames)} = ${primitiveRef(null, def.colorName, def.shadeName)}`
      )
    })
  } else {
    themes.forEach((theme) => {
      const themeKey = new Case(theme.name).doSnakeCase()
      out.push(`// ${theme.name}`)
      bound.forEach((t) => {
        const resolved = resolveTokenPerTheme(paletteData, t)
        const r = resolved.find((rr) => rr.themeId === theme.id)
        if (!r || r.isUnbound || !r.colorName || !r.shadeName) return
        out.push(
          `val ${themeKey}_${tokenName(t.pathNames)} = ${primitiveRef(theme.name, r.colorName, r.shadeName)}`
        )
      })
      out.push('')
    })
  }

  return out.join('\n').replace(/\n+$/, '\n')
}

export default makeComposeSemantics

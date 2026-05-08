import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { Case } from '@a_ng_d/figmug-utils'
import {
  partitionTokens,
  resolveTokenPerTheme,
  workingThemes,
} from './_helpers'

const makeScssSemantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')

  const out: Array<string> = []

  if (unbound.length > 0) {
    out.push('// Unbound semantic tokens')
    unbound.forEach((t) => out.push(`//   ${t.pathNames.join('-')}`))
    out.push('')
  }

  const tokenName = (parts: Array<string>) =>
    parts.map((p) => new Case(p).doKebabCase()).join('-')
  const primitiveRefScss = (colorName: string, shadeName: string) =>
    `$${new Case(colorName).doKebabCase()}-${shadeName}`
  const primitiveRefVar = (colorName: string, shadeName: string) =>
    `var(--${new Case(colorName).doKebabCase()}-${shadeName})`

  if (customThemes.length === 0) {
    bound.forEach((t) => {
      const resolved = resolveTokenPerTheme(paletteData, t)
      const def =
        resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
        resolved.find((r) => !r.isUnbound)
      if (!def || !def.colorName || !def.shadeName) return
      out.push(
        `$${tokenName(t.pathNames)}: ${primitiveRefScss(def.colorName, def.shadeName)};`
      )
    })
    return out.join('\n')
  }

  // With custom themes: emit a mixin per theme that sets CSS custom props,
  // plus a top-level $... = var(--...) shortcut.
  bound.forEach((t) => {
    out.push(`$${tokenName(t.pathNames)}: var(--${tokenName(t.pathNames)});`)
  })
  out.push('')

  themes.forEach((theme) => {
    const isDefault = theme.type === 'default theme'
    const mixinName = `${new Case(theme.name).doKebabCase()}-semantics`
    out.push(`@mixin ${mixinName} {`)
    bound.forEach((t) => {
      const resolved = resolveTokenPerTheme(paletteData, t)
      const ref = resolved.find((r) => r.themeId === theme.id)
      if (!ref || ref.isUnbound || !ref.colorName || !ref.shadeName) return
      out.push(
        `  --${tokenName(t.pathNames)}: ${primitiveRefVar(ref.colorName, ref.shadeName)};`
      )
    })
    out.push('}')
    out.push('')
    if (isDefault) {
      out.push(':root {')
      out.push(`  @include ${mixinName};`)
      out.push('}')
    } else {
      out.push(`:root[data-theme='${new Case(theme.name).doKebabCase()}'] {`)
      out.push(`  @include ${mixinName};`)
      out.push('}')
    }
    out.push('')
  })

  return out.join('\n').replace(/\n+$/, '\n')
}

export default makeScssSemantics

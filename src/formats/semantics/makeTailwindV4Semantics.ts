import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import {
  partitionTokens,
  resolveTokenPerTheme,
  workingThemes,
} from './_helpers'

const makeTailwindV4Semantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')

  const out: Array<string> = ['@import "tailwindcss";', '']

  if (unbound.length > 0) {
    out.push('/* Unbound semantic tokens */')
    unbound.forEach((t) => out.push(`/*   ${t.pathNames.join('-')} */`))
    out.push('')
  }

  const tokenName = (parts: Array<string>) =>
    `--color-${parts.map((p) => new Case(p).doKebabCase()).join('-')}`
  const primitiveRef = (colorName: string, shadeName: string) =>
    `var(--color-${new Case(colorName).doKebabCase()}-${shadeName})`

  out.push('@theme {')
  bound.forEach((t) => {
    const resolved = resolveTokenPerTheme(paletteData, t)
    const def =
      resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
      resolved.find((r) => !r.isUnbound)
    if (!def || !def.colorName || !def.shadeName) return
    out.push(
      `  ${tokenName(t.pathNames)}: ${primitiveRef(def.colorName, def.shadeName)};`
    )
  })
  out.push('}')

  customThemes.forEach((theme) => {
    const overrideLines: Array<string> = []
    bound.forEach((t) => {
      const resolved = resolveTokenPerTheme(paletteData, t)
      const themeRef = resolved.find((r) => r.themeId === theme.id)
      const defRef =
        resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
        resolved.find((r) => !r.isUnbound)
      if (
        !themeRef ||
        themeRef.isUnbound ||
        !themeRef.colorName ||
        !themeRef.shadeName
      )
        return
      if (
        defRef &&
        defRef.colorName === themeRef.colorName &&
        defRef.shadeName === themeRef.shadeName
      )
        return
      overrideLines.push(
        `  ${tokenName(t.pathNames)}: ${primitiveRef(themeRef.colorName, themeRef.shadeName)};`
      )
    })
    if (overrideLines.length === 0) return
    out.push('')
    out.push(`/* ${theme.name} */`)
    out.push(`[data-theme='${new Case(theme.name).doKebabCase()}'] {`)
    out.push(...overrideLines)
    out.push('}')
  })

  return out.join('\n')
}

export default makeTailwindV4Semantics

import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { partitionTokens, resolveTokenPerTheme, workingThemes } from './_helpers'

const makeSwiftUISemantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')

  const out: Array<string> = ['import SwiftUI', '']

  if (unbound.length > 0) {
    out.push('// Unbound semantic tokens')
    unbound.forEach((t) => out.push(`//   ${t.pathNames.join('-')}`))
    out.push('')
  }

  const camelToken = (parts: Array<string>) => new Case(parts.join(' ')).doCamelCase()
  const primitiveRef = (themeName: string | null, colorName: string, shadeName: string) => {
    const colorCamel = new Case(colorName).doCamelCase()
    const shadeCamel =
      shadeName === 'source' ? 'Source' : new Case(shadeName).doPascalCase()
    if (themeName) {
      const themeCamel = new Case(themeName).doCamelCase()
      return `Color.Token().${themeCamel}${new Case(colorName).doPascalCase()}${shadeCamel}`
    }
    return `Color.Token().${colorCamel}${shadeCamel}`
  }

  out.push('public extension Color {')
  out.push('  static let SemanticToken = Color.SemanticTokenColor()')
  out.push('  struct SemanticTokenColor {')

  if (customThemes.length === 0) {
    bound.forEach((t) => {
      const resolved = resolveTokenPerTheme(paletteData, t)
      const def =
        resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
        resolved.find((r) => !r.isUnbound)
      if (!def || !def.colorName || !def.shadeName) return
      out.push(
        `    public let ${camelToken(t.pathNames)} = ${primitiveRef(null, def.colorName, def.shadeName)}`
      )
    })
  } else {
    themes.forEach((theme) => {
      const themePrefix = new Case(theme.name).doCamelCase()
      bound.forEach((t) => {
        const resolved = resolveTokenPerTheme(paletteData, t)
        const r = resolved.find((rr) => rr.themeId === theme.id)
        if (!r || r.isUnbound || !r.colorName || !r.shadeName) return
        const tokenName =
          themePrefix +
          new Case(t.pathNames.join(' ')).doPascalCase().replace(/\s+/g, '')
        out.push(
          `    public let ${tokenName} = ${primitiveRef(theme.name, r.colorName, r.shadeName)}`
        )
      })
    })
  }

  out.push('  }')
  out.push('}')

  return out.join('\n')
}

export default makeSwiftUISemantics

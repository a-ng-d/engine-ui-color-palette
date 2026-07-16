import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { partitionTokens, resolveTokenPerTheme, workingThemes } from './_helpers'

const makeUIKitSemantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')

  const out: Array<string> = ['import UIKit', '']

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
      const themePascal = new Case(themeName).doPascalCase()
      return `Color.${themePascal}.${colorCamel}${shadeCamel}`
    }
    return `Color.${colorCamel}${shadeCamel}`
  }

  out.push('struct SemanticToken {')

  if (customThemes.length === 0) {
    bound.forEach((t) => {
      const resolved = resolveTokenPerTheme(paletteData, t)
      const def =
        resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
        resolved.find((r) => !r.isUnbound)
      if (!def || !def.colorName || !def.shadeName) return
      out.push(
        `  static let ${camelToken(t.pathNames)} = ${primitiveRef(null, def.colorName, def.shadeName)}`
      )
    })
  } else {
    themes.forEach((theme) => {
      const themePascal = new Case(theme.name).doPascalCase()
      out.push(`  struct ${themePascal} {`)
      bound.forEach((t) => {
        const resolved = resolveTokenPerTheme(paletteData, t)
        const r = resolved.find((rr) => rr.themeId === theme.id)
        if (!r || r.isUnbound || !r.colorName || !r.shadeName) return
        out.push(
          `    static let ${camelToken(t.pathNames)} = ${primitiveRef(theme.name, r.colorName, r.shadeName)}`
        )
      })
      out.push('  }')
    })
  }

  out.push('}')

  return out.join('\n')
}

export default makeUIKitSemantics

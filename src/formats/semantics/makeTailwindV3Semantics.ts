import { Case } from '@unoff/utils'
import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import {
  partitionTokens,
  resolveTokenPerTheme,
  workingThemes,
} from './_helpers'

const makeTailwindV3Semantics = (
  paletteData: PaletteData,
  systemData: SystemData
): string => {
  const { bound, unbound } = partitionTokens(paletteData, systemData)
  const themes = workingThemes(paletteData)
  const defaultTheme =
    paletteData.themes.find((t) => t.type === 'default theme') ?? themes[0]
  const customThemes = themes.filter((t) => t.type === 'custom theme')

  const out: Array<string> = []
  out.push('// Semantic token map. Import alongside primitives.js:')
  out.push("//   const primitives = require('./primitives.js')")
  out.push("//   const semantics  = require('./semantics.js')(primitives)")
  out.push('')

  if (unbound.length > 0) {
    out.push('// Unbound semantic tokens')
    unbound.forEach((t) => out.push(`//   ${t.pathNames.join('-')}`))
    out.push('')
  }

  const tokenKey = (parts: Array<string>) =>
    `'${parts.map((p) => new Case(p).doKebabCase()).join('-')}'`
  const ref = (
    themeKey: string | null,
    colorName: string,
    shadeName: string
  ) => {
    const c = new Case(colorName).doKebabCase()
    if (themeKey) return `primitives['${themeKey}']['${c}']['${shadeName}']`
    return `primitives['${c}']['${shadeName}']`
  }

  out.push('module.exports = function (primitives) {')
  out.push('  return {')

  if (customThemes.length === 0) {
    bound.forEach((t) => {
      const resolved = resolveTokenPerTheme(paletteData, t)
      const def =
        resolved.find((r) => r.themeId === defaultTheme.id && !r.isUnbound) ??
        resolved.find((r) => !r.isUnbound)
      if (!def || !def.colorName || !def.shadeName) return
      out.push(
        `    ${tokenKey(t.pathNames)}: ${ref(null, def.colorName, def.shadeName)},`
      )
    })
  } else {
    themes.forEach((theme) => {
      const themeKey = new Case(theme.name).doKebabCase()
      out.push(`    '${themeKey}': {`)
      bound.forEach((t) => {
        const resolved = resolveTokenPerTheme(paletteData, t)
        const r = resolved.find((rr) => rr.themeId === theme.id)
        if (!r || r.isUnbound || !r.colorName || !r.shadeName) return
        out.push(
          `      ${tokenKey(t.pathNames)}: ${ref(themeKey, r.colorName, r.shadeName)},`
        )
      })
      out.push('    },')
    })
  }

  out.push('  }')
  out.push('}')

  return out.join('\n')
}

export default makeTailwindV3Semantics

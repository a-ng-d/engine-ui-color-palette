import chroma from 'chroma-js'
import { PaletteData, PaletteDataShadeItem } from '@tps/data.types'
import { ColorSpaceConfiguration } from '@tps/configuration.types'
import { Case } from '@a_ng_d/figmug-utils'

const makeScssVariables = (
  paletteData: PaletteData,
  colorSpace: ColorSpaceConfiguration
) => {
  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    scss: Array<string> = [],
    globalVars: Array<string> = []

  const setValueAccordingToColorSpace = (shade: PaletteDataShadeItem) => {
    if (isNaN(shade.hsl[0])) shade.hsl[0] = 0
    if (isNaN(shade.lch[2])) shade.lch[2] = 0
    if (isNaN(shade.oklch[2])) shade.oklch[2] = 0

    const actions: { [action: string]: () => void } = {
      RGB: () =>
        `rgb(${Math.floor(shade.rgb[0])} ${Math.floor(
          shade.rgb[1]
        )} ${Math.floor(shade.rgb[2])})`,
      HEX: () => shade.hex,
      HSL: () =>
        `hsl(${Math.floor(shade.hsl[0])} ${Math.floor(
          shade.hsl[1] * 100
        )}% ${Math.floor(shade.hsl[2] * 100)}%)`,
      LCH: () =>
        `lch(${Math.floor(shade.lch[0])}% ${Math.floor(
          shade.lch[1]
        )} ${Math.floor(shade.lch[2])})`,
      OKLCH: () =>
        `oklch(${Math.floor(shade.oklch[0] * 100)}% ${shade.oklch[1].toFixed(3)} ${Math.floor(shade.oklch[2])})`,
    }

    return actions[colorSpace ?? 'RGB']?.()
  }

  const setValueAccordingToAlpha = (
    shade: PaletteDataShadeItem,
    source: PaletteDataShadeItem
  ) => {
    if (isNaN(shade.hsl[0])) shade.hsl[0] = 0
    if (isNaN(shade.lch[2])) shade.lch[2] = 0
    if (isNaN(shade.oklch[2])) shade.oklch[2] = 0

    const actions: { [action: string]: () => void } = {
      RGB: () =>
        `rgb(${Math.floor(source.rgb[0])} ${Math.floor(
          source.rgb[1]
        )} ${Math.floor(source.rgb[2])} / ${shade.alpha?.toFixed(2) ?? 1})`,
      HEX: () =>
        chroma(source.hex)
          .alpha(shade.alpha ?? 1)
          .hex(),
      HSL: () =>
        `hsl(${Math.floor(source.hsl[0])} ${Math.floor(
          source.hsl[1] * 100
        )}%, ${Math.floor(source.hsl[2] * 100)}% / ${shade.alpha?.toFixed(2) ?? 1})`,
      LCH: () =>
        `lch(${Math.floor(source.lch[0])}% ${Math.floor(
          source.lch[1]
        )} ${Math.floor(source.lch[2])} / ${shade.alpha?.toFixed(2) ?? 1})`,
      OKLCH: () =>
        `oklch(${Math.floor(source.oklch[0 * 100])}% ${source.oklch[1].toFixed(3)} ${Math.floor(source.oklch[2])} / ${shade.alpha?.toFixed(2) ?? 1})`,
    }

    return actions[colorSpace ?? 'RGB']?.()
  }

  const defaultTheme = workingThemes.find(
    (theme) => theme.type === 'default theme'
  )

  if (defaultTheme) {
    const defaultVars: Array<string> = []

    defaultTheme.colors.forEach((color, index) => {
      if (index > 0) {
        defaultVars.push('')
      }

      defaultVars.push(`// ${color.name}`)
      color.shades.reverse().forEach((shade) => {
        const source = color.shades.find((c) => c.type === 'source color')
        const variableName = `$${new Case(color.name).doKebabCase()}-${shade.name}`

        if (source) {
          defaultVars.push(
            `${variableName}: ${shade.isTransparent ? setValueAccordingToAlpha(shade, source) : setValueAccordingToColorSpace(shade)};`
          )
        }
      })
    })

    scss.push(defaultVars.join('\n'))

    return scss.join('\n')
  }

  workingThemes.forEach((theme) => {
    const themeName = new Case(theme.name).doKebabCase()
    const themeVars: Array<string> = []

    themeVars.push(`// ${theme.name}`)
    themeVars.push(`@mixin ${themeName} {`)

    theme.colors.forEach((color, index) => {
      if (index > 0) {
        themeVars.push('')
      }

      themeVars.push(`  // ${color.name}`)
      color.shades.reverse().forEach((shade) => {
        const source = color.shades.find((c) => c.type === 'source color')
        const colorName = new Case(color.name).doKebabCase()
        const cssVarName = `--${colorName}-${shade.name}`

        if (source) {
          themeVars.push(
            `  ${cssVarName}: ${shade.isTransparent ? setValueAccordingToAlpha(shade, source) : setValueAccordingToColorSpace(shade)};`
          )
        }
      })
    })

    themeVars.push('}')
    scss.push(themeVars.join('\n'))
  })

  const colorVariables = new Set<string>()

  workingThemes.forEach((theme) => {
    theme.colors.forEach((color) => {
      color.shades.forEach((shade) => {
        const source = color.shades.find((c) => c.type === 'source color')
        if (source) {
          const colorName = new Case(color.name).doKebabCase()
          const cssVarName = `--${colorName}-${shade.name}`
          colorVariables.add(cssVarName)
        }
      })
    })
  })

  if (colorVariables.size > 0) {
    const colorGroups = new Map<string, Array<string>>()

    colorVariables.forEach((cssVarName) => {
      const match = cssVarName.match(/--([a-zA-Z0-9-]+)-([a-zA-Z0-9-]+)/)
      if (match) {
        const colorName = match[1]
        if (!colorGroups.has(colorName)) {
          colorGroups.set(colorName, [])
        }
        const scssVarName = `$${cssVarName.substring(2)}`
        colorGroups.get(colorName)!.push(`${scssVarName}: var(${cssVarName});`)
      }
    })

    colorGroups.forEach((vars, colorName) => {
      globalVars.push(
        `// ${colorName.charAt(0).toUpperCase() + colorName.slice(1)}`
      )
      globalVars.push(...vars)
      globalVars.push('')
    })

    if (globalVars.length > 0 && globalVars[globalVars.length - 1] === '') {
      globalVars.pop()
    }

    scss.push(globalVars.join('\n'))
  }

  const rootBlock: string[] = [`:root {`]

  workingThemes.forEach((theme, index) => {
    const themeName = new Case(theme.name).doKebabCase()
    rootBlock.push(`  &[data-theme="${themeName}"] {
    @include ${themeName};
  }`)
    if (index !== workingThemes.length - 1) rootBlock.push('')
  })

  rootBlock.push(`}`)
  scss.push(rootBlock.join('\n'))

  const classBlocks: string[] = []

  workingThemes.forEach((theme) => {
    const themeName = new Case(theme.name).doKebabCase()
    classBlocks.push(`.${themeName} {
  @include ${themeName};
}`)
  })

  scss.push(classBlocks.join('\n\n'))

  return scss.join('\n\n')
}

export default makeScssVariables

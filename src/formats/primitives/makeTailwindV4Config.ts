import chroma from 'chroma-js'
import { PaletteData } from '@tps/data.types'
import { Case } from '@a_ng_d/figmug-utils'

const makeTailwindV4Config = (paletteData: PaletteData) => {
  const workingThemes =
    paletteData.themes.filter((theme) => theme.type === 'custom theme')
      .length === 0
      ? paletteData.themes.filter((theme) => theme.type === 'default theme')
      : paletteData.themes.filter((theme) => theme.type === 'custom theme')

  let cssOutput =
    '@import "tailwindcss";\n\n@theme {\n  --color-*: initial;\n\n'

  if (workingThemes[0].type !== 'custom theme') {
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        const colorName = new Case(color.name).doKebabCase()
        cssOutput += `  /* ${color.name} */\n`

        color.shades.sort().forEach((shade) => {
          const colorValue = shade.isTransparent
            ? chroma(source?.hex ?? '#000000')
                .alpha(shade.alpha ?? 1)
                .hex()
            : shade.hex

          const shadeName = new Case(shade.name).doKebabCase()
          cssOutput += `  --color-${colorName}-${shadeName}: ${colorValue};\n`
        })

        const isLastColor = color === theme.colors[theme.colors.length - 1]
        const isLastTheme = theme === workingThemes[workingThemes.length - 1]
        if (!(isLastColor && isLastTheme)) {
          cssOutput += '\n'
        }
      })
    })
  } else {
    workingThemes.forEach((theme) => {
      const themeName = new Case(theme.name).doKebabCase()

      //cssOutput += `  /* ${theme.name} */\n`

      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        const colorName = new Case(color.name).doKebabCase()
        cssOutput += `  /* ${theme.name} - ${color.name} */\n`

        color.shades.forEach((shade) => {
          const colorValue = shade.isTransparent
            ? chroma(source?.hex ?? '#000000')
                .alpha(shade.alpha ?? 1)
                .hex()
            : shade.hex

          const shadeName = new Case(shade.name).doKebabCase()
          cssOutput += `  --color-${themeName}-${colorName}-${shadeName}: ${colorValue};\n`
        })

        const isLastColor = color === theme.colors[theme.colors.length - 1]
        const isLastTheme = theme === workingThemes[workingThemes.length - 1]
        if (!(isLastColor && isLastTheme)) {
          cssOutput += '\n'
        }
      })
    })
  }

  cssOutput += '}\n'

  return cssOutput
}

export default makeTailwindV4Config

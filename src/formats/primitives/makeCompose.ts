import chroma from 'chroma-js'
import { PaletteData } from '@tps/data.types'
import { Case } from '@a_ng_d/figmug-utils'

const makeCompose = (paletteData: PaletteData) => {
  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    kotlin: Array<string> = []

  workingThemes.forEach((theme) => {
    theme.colors.forEach((color) => {
      const source = color.shades.find((shade) => shade.type === 'source color')
      const colors: Array<string> = []

      colors.push(
        `// ${
          workingThemes[0].type === 'custom theme' ? theme.name + ' - ' : ''
        }${color.name}`
      )
      color.shades.reverse().forEach((shade) => {
        colors.push(
          `val ${
            workingThemes[0].type === 'custom theme'
              ? new Case(theme.name + ' ' + color.name).doSnakeCase()
              : new Case(color.name).doSnakeCase()
          }_${shade.name} = Color(${
            shade.isTransparent
              ? chroma(source?.hex ?? '#000000')
                  .alpha(shade.alpha ?? 1)
                  .hex()
                  .replace('#', '0xFF')
                  .toUpperCase()
              : shade.hex.replace('#', '0xFF').toUpperCase()
          })`
        )
      })
      colors.push('')
      colors.forEach((color) => kotlin.push(color))
    })
  })

  kotlin.pop()

  return `import androidx.compose.ui.graphics.Color\n\n${kotlin.join('\n')}`
}

export default makeCompose

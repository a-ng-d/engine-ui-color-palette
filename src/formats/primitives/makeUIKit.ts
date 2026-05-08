import { PaletteData } from '@tps/data.types'
import { Case } from '@a_ng_d/figmug-utils'

const makeUIKit = (paletteData: PaletteData) => {
  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    swift: Array<string> = []

  workingThemes.forEach((theme) => {
    const UIColors: Array<string> = []
    theme.colors.forEach((color) => {
      const source = color.shades.find((shade) => shade.type === 'source color')

      UIColors.push(`// ${color.name}`)
      color.shades.reverse().forEach((shade) => {
        UIColors.push(
          shade.isTransparent
            ? `static let ${new Case(color.name).doPascalCase()}${
                shade.name === 'source' ? 'Source' : shade.name
              } = UIColor(red: ${source?.gl[0].toFixed(
                3
              )}, green: ${source?.gl[1].toFixed(3)}, blue: ${source?.gl[2].toFixed(
                3
              )}, alpha: ${shade.alpha ?? 1})`
            : `static let ${new Case(color.name).doPascalCase()}${
                shade.name === 'source' ? 'Source' : shade.name
              } = UIColor(red: ${shade.gl[0].toFixed(
                3
              )}, green: ${shade.gl[1].toFixed(3)}, blue: ${shade.gl[2].toFixed(
                3
              )})`
        )
      })
      UIColors.push('')
    })
    UIColors.pop()
    if (workingThemes[0].type === 'custom theme')
      swift.push(
        `// ${theme.name}\n  struct ${new Case(theme.name).doPascalCase()} {\n    ${UIColors.join(
          '\n    '
        )}\n  }`
      )
    else swift.push(`${UIColors.join('\n  ')}`)
  })

  return `import UIKit\n\nstruct Color {\n  ${swift.join('\n\n  ')}\n}`
}

export default makeUIKit

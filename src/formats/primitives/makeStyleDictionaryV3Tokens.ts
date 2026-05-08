import chroma from 'chroma-js'
import {
  PaletteData,
  PaletteDataColorItem,
  PaletteDataShadeItem,
} from '@tps/data.types'

const makeStyleDictionaryV3Tokens = (paletteData: PaletteData) => {
  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [key: string]: any } = {
      color: {},
    }

  const model = (
    color: PaletteDataColorItem,
    shade: PaletteDataShadeItem,
    source: PaletteDataShadeItem
  ) => {
    return {
      type: 'color',
      value: shade.isTransparent
        ? chroma(source.hex)
            .alpha(shade.alpha ?? 1)
            .hex()
        : shade.hex,
      comment:
        color.description !== ''
          ? color.description + ' - ' + shade.description
          : shade.description,
    }
  }

  paletteData.themes[0].colors.forEach((color) => {
    json['color'][color.name] = {}
  })

  if (workingThemes[0].type === 'custom theme')
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json['color'][color.name][theme.name] = {}
        color.shades.forEach((shade) => {
          if (shade && source)
            json['color'][color.name][theme.name][shade.name] = model(
              color,
              shade,
              source
            )
        })
      })
    })
  else
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json['color'][color.name] = {}
        color.shades.forEach((shade) => {
          if (shade && source)
            json['color'][color.name][shade.name] = model(color, shade, source)
        })
      })
    })

  return JSON.stringify(json, null, '  ')
}

export default makeStyleDictionaryV3Tokens

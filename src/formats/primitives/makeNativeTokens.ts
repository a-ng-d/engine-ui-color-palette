import chroma from 'chroma-js'
import {
  PaletteData,
  PaletteDataColorItem,
  PaletteDataShadeItem,
} from '@tps/data.types'
import { Case } from '@a_ng_d/figmug-utils'

const makeNativeTokens = (paletteData: PaletteData) => {
  const paletteName = paletteData.name

  const colorModel = (
    color: PaletteDataColorItem,
    shade: PaletteDataShadeItem,
    source: PaletteDataShadeItem
  ) => {
    return {
      $type: 'color',
      $value: shade.isTransparent
        ? chroma(source.hex)
            .alpha(shade.alpha ?? 1)
            .hex()
        : shade.hex,
      $description:
        color.description !== ''
          ? color.description + ' - ' + shade.description
          : shade.description,
    }
  }

  const themeModel = (name: string, description: string) => {
    return {
      name: name,
      group: 'Modes',
      description: description,
      selectedTokenSets: {
        [`${paletteName}/${name}`]: 'enabled',
      },
    }
  }

  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [key: string]: any } = {
      $themes: workingThemes
        .filter((theme) => theme.type === 'custom theme')
        .map((theme) => themeModel(theme.name, theme.description)),
      $metadata: {
        activeThemes: [],
        tokenSetOrder: workingThemes
          .filter((theme) => theme.type === 'custom theme')
          .map(
            (theme) =>
              `${new Case(paletteName).doSnakeCase()}/${new Case(theme.name).doSnakeCase()}`
          ),
        activeSets: [],
      },
    }

  if (workingThemes[0].type === 'custom theme')
    workingThemes.forEach((theme) => {
      json[`${paletteName}/${theme.name}`] = {}

      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        color.shades.forEach((shade) => {
          if (shade && source)
            json[`${paletteName}/${theme.name}`][
              `${new Case(color.name).doSnakeCase()}.${shade.name}`
            ] = colorModel(color, shade, source)
        })
      })
    })
  else
    workingThemes.forEach((theme) => {
      json[paletteName] = {}

      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        color.shades.forEach((shade) => {
          if (shade && source)
            json[paletteName][
              `${new Case(color.name).doSnakeCase()}.${shade.name}`
            ] = colorModel(color, shade, source)
        })
      })
    })

  return JSON.stringify(json, null, '  ')
}

export default makeNativeTokens

import chroma from 'chroma-js'
import { PaletteData } from '@tps/data.types'
import { Case } from '@a_ng_d/figmug-utils'

const makeTailwindV3Config = (paletteData: PaletteData) => {
  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [key: string]: any } = {
      theme: {
        colors: {},
      },
    }

  paletteData.themes[0].colors.forEach((color) => {
    json['theme']['colors'][new Case(color.name).doKebabCase()] = {}
  })

  if (workingThemes[0].type === 'custom theme')
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json['theme']['colors'][new Case(color.name).doKebabCase()][
          new Case(theme.name).doKebabCase()
        ] = {}
        color.shades.forEach((shade) => {
          json['theme']['colors'][new Case(color.name).doKebabCase()][
            new Case(theme.name).doKebabCase()
          ][new Case(shade.name).doKebabCase()] = shade.isTransparent
            ? chroma(source?.hex ?? '#000000')
                .alpha(shade.alpha ?? 1)
                .hex()
            : shade.hex
        })
      })
    })
  else
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json['theme']['colors'][new Case(color.name).doKebabCase()] = {}
        color.shades.sort().forEach((shade) => {
          json['theme']['colors'][new Case(color.name).doKebabCase()][
            new Case(shade.name).doKebabCase()
          ] = shade.isTransparent
            ? chroma(source?.hex ?? '#000000')
                .alpha(shade.alpha ?? 1)
                .hex()
            : shade.hex
        })
      })
    })

  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(json, null, '  ')}`
}

export default makeTailwindV3Config

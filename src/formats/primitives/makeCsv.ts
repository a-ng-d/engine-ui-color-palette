import { PaletteData } from '@tps/data.types'

interface colorCsv {
  name: string
  csv: string
}

export interface modeCsv {
  name: string
  colors: Array<colorCsv>
  type: string
}

const makeCsv = (paletteData: PaletteData) => {
  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    colorCsv: Array<colorCsv> = [],
    modeCsv: Array<modeCsv> = [],
    lightness: Array<string> = [],
    l: Array<number | string> = [],
    c: Array<number | string> = [],
    h: Array<number | string> = []

  workingThemes.forEach((theme) => {
    theme.colors.forEach((color) => {
      color.shades.forEach((shade) => {
        lightness.push(shade.name)
        l.push(Math.floor(shade.lch[0]))
        c.push(Math.floor(shade.lch[1]))
        h.push(Math.floor(shade.lch[2]))
      })
      colorCsv.push({
        name: color.name,
        csv: `${color.name},Lightness,Chroma,Hue\n${lightness
          .map((stop, index) => `${stop},${l[index]},${c[index]},${h[index]}`)
          .join('\n')}`,
      })
      lightness.splice(0, lightness.length)
      l.splice(0, l.length)
      c.splice(0, c.length)
      h.splice(0, h.length)
    })
    modeCsv.push({
      name: theme.name,
      colors: colorCsv.map((c) => {
        return c
      }),
      type: theme.type,
    })
    colorCsv.splice(0, colorCsv.length)
  })

  return modeCsv
}

export default makeCsv

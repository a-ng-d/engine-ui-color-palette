import chroma from 'chroma-js'
import { PaletteData, PaletteDataShadeItem } from '@tps/data.types'
import { ColorSpaceConfiguration } from '@tps/configuration.types'
import { Case } from '@a_ng_d/figmug-utils'

const makeCssCustomProps = (
  paletteData: PaletteData,
  colorSpace: ColorSpaceConfiguration
) => {
  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    css: Array<string> = []

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
      P3: () =>
        `color(display-p3 ${shade.gl[0].toFixed(3)} ${shade.gl[1].toFixed(
          3
        )} ${shade.gl[2].toFixed(3)})`,
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
        )}% ${Math.floor(source.hsl[2] * 100)}% / ${shade.alpha?.toFixed(2) ?? 1})`,
      LCH: () =>
        `lch(${Math.floor(source.lch[0])}% ${Math.floor(
          source.lch[1]
        )} ${Math.floor(source.lch[2])} / ${shade.alpha?.toFixed(2) ?? 1})`,
      OKLCH: () =>
        `oklch(${Math.floor(source.oklch[0 * 100])}% ${source.oklch[1].toFixed(3)} ${Math.floor(source.oklch[2])} / ${shade.alpha?.toFixed(2) ?? 1})`,
      P3: () =>
        `color(display-p3 ${source.gl[0].toFixed(3)} ${source.gl[1].toFixed(
          3
        )} ${source.gl[2].toFixed(3)} / ${shade.alpha?.toFixed(2) ?? 1})`,
    }

    return actions[colorSpace ?? 'RGB']?.()
  }

  workingThemes.forEach((theme) => {
    const rowCss: Array<string> = []
    theme.colors.forEach((color) => {
      rowCss.push(`/* ${color.name} */`)
      color.shades.reverse().forEach((shade) => {
        const source = color.shades.find((c) => c.type === 'source color')

        if (source)
          rowCss.push(
            `--${new Case(color.name).doKebabCase()}-${shade.name}: ${shade.isTransparent ? setValueAccordingToAlpha(shade, source) : setValueAccordingToColorSpace(shade)};`
          )
      })

      rowCss.push('')
    })
    rowCss.pop()
    css.push(
      `${theme.type === 'custom theme' ? `/* ${theme.name} */\n` : ''}:root${
        theme.type === 'custom theme'
          ? `[data-theme='${new Case(theme.name).doKebabCase()}']`
          : ''
      } {\n  ${rowCss.join('\n  ')}\n}`
    )
  })

  return css.join('\n\n')
}

export default makeCssCustomProps

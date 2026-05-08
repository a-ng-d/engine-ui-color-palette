import { PaletteData, PaletteDataShadeItem } from '@tps/data.types'
import { ColorSpaceConfiguration } from '@tps/configuration.types'

const makeDtcgTokens = (
  paletteData: PaletteData,
  colorSpace: ColorSpaceConfiguration
) => {
  const workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [key: string]: any } = {}

  const setValueAccordingToColorSpace = (shade: PaletteDataShadeItem) => {
    if (isNaN(shade.oklch[2])) shade.oklch[2] = 0

    const actions: { [action: string]: () => void } = {
      RGB: () => {
        return {
          colorSpace: 'srgb',
          components: [
            parseFloat(shade.gl[0].toFixed(3)),
            parseFloat(shade.gl[1].toFixed(3)),
            parseFloat(shade.gl[2].toFixed(3)),
          ],
          hex: shade.hex,
        }
      },
      OKLCH: () => {
        return {
          colorSpace: 'oklch',
          components: [
            parseFloat(shade.oklch[0].toFixed(3)),
            parseFloat(shade.oklch[1].toFixed(3)),
            parseFloat(shade.oklch[2].toFixed(0)),
          ],
          hex: shade.hex,
        }
      },
    }

    return actions[colorSpace ?? 'RGB']?.()
  }

  const setValueAccordingToColorSpaceAndAlpha = (
    source: PaletteDataShadeItem,
    shade: PaletteDataShadeItem
  ) => {
    if (isNaN(shade.oklch[2])) shade.oklch[2] = 0

    const actions: { [action: string]: () => void } = {
      RGB: () => {
        return {
          colorSpace: 'srgb',
          components: [
            parseFloat(source.gl[0].toFixed(3)),
            parseFloat(source.gl[1].toFixed(3)),
            parseFloat(source.gl[2].toFixed(3)),
          ],
          hex: source.hex,
          alpha: shade.alpha,
        }
      },
      OKLCH: () => {
        return {
          colorSpace: 'oklch',
          components: [
            parseFloat(source.oklch[0].toFixed(3)),
            parseFloat(source.oklch[1].toFixed(3)),
            parseFloat(source.oklch[2].toFixed(0)),
          ],
          hex: source.hex,
          alpha: shade.alpha,
        }
      },
    }

    return actions[colorSpace ?? 'RGB']?.()
  }

  if (workingThemes[0].type === 'custom theme')
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        if (!json[color.name])
          json[color.name] = {
            $type: 'color',
          }

        color.shades.forEach((shade) => {
          if (!json[color.name][shade.name] && source)
            json[color.name][shade.name] = {
              $type: 'color',
              $value: shade.isTransparent
                ? setValueAccordingToColorSpaceAndAlpha(source, shade)
                : setValueAccordingToColorSpace(shade),
              $description:
                color.description !== ''
                  ? color.description + ' - ' + shade.description
                  : shade.description,
              $extensions: {
                mode: {},
                'com.uicp.wcag': {},
                'com.uicp.apca': {},
              },
            }
          if (source) {
            json[color.name][shade.name].$extensions.mode[theme.name] =
              shade.isTransparent
                ? setValueAccordingToColorSpaceAndAlpha(source, shade)
                : setValueAccordingToColorSpace(shade)
            if (shade.textContrast) {
              json[color.name][shade.name].$extensions['com.uicp.wcag'][
                theme.name
              ] = {
                light: {
                  score: shade.textContrast.wcag.light.score,
                  ratio: shade.textContrast.wcag.light.ratio,
                },
                dark: {
                  score: shade.textContrast.wcag.dark.score,
                  ratio: shade.textContrast.wcag.dark.ratio,
                },
              }
              json[color.name][shade.name].$extensions['com.uicp.apca'][
                theme.name
              ] = {
                light: {
                  score: shade.textContrast.apca.light.lc,
                  recommendation:
                    shade.textContrast.apca.light.recommendedUsage,
                },
                dark: {
                  score: shade.textContrast.apca.dark.lc,
                  recommendation: shade.textContrast.apca.dark.recommendedUsage,
                },
              }
            }
          }
        })
      })
    })
  else
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json[color.name] = {}
        color.shades.forEach((shade) => {
          if (shade && source) {
            json[color.name][shade.name] = {
              $type: 'color',
              $value: shade.isTransparent
                ? setValueAccordingToColorSpaceAndAlpha(source, shade)
                : setValueAccordingToColorSpace(shade),
              $description:
                color.description !== ''
                  ? color.description + ' - ' + shade.description
                  : shade.description,
              ...(shade.textContrast && {
                $extensions: {
                  'com.uicp.wcag': {
                    light: {
                      score: shade.textContrast.wcag.light.score,
                      ratio: shade.textContrast.wcag.light.ratio,
                    },
                    dark: {
                      score: shade.textContrast.wcag.dark.score,
                      ratio: shade.textContrast.wcag.dark.ratio,
                    },
                  },
                  'com.uicp.apca': {
                    light: {
                      score: shade.textContrast.apca.light.lc,
                      recommendation:
                        shade.textContrast.apca.light.recommendedUsage,
                    },
                    dark: {
                      score: shade.textContrast.apca.dark.lc,
                      recommendation:
                        shade.textContrast.apca.dark.recommendedUsage,
                    },
                  },
                },
              }),
            }
          }
        })
      })
    })

  return JSON.stringify(json, null, '  ')
}

export default makeDtcgTokens

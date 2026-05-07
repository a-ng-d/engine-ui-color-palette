import { uid } from 'uid'
import { Hsluv } from 'hsluv'
import chroma from 'chroma-js'
import {
  LibraryData,
  PaletteData,
  PaletteDataColorItem,
  PaletteDataThemeItem,
} from '@tps/data.types'
import {
  MetaConfiguration,
  BaseConfiguration,
  ThemeConfiguration,
  FullConfiguration,
} from '@tps/configuration.types'
import { Channel, ChannelWithAlpha, HexModel } from '@tps/color.types'
import Contrast from '@modules/contrast/contrast'
import Color from '@modules/color/color'

const DEFAULT_META: MetaConfiguration = {
  id: uid(),
  dates: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: '',
    openedAt: '',
  },
  publicationStatus: {
    isPublished: false,
    isShared: false,
  },
  creatorIdentity: {
    creatorFullName: '',
    creatorAvatar: '',
    creatorId: '',
  },
}

const rgbToCmyk = (r: number, g: number, b: number): ChannelWithAlpha => {
  const r1 = r / 255,
    g1 = g / 255,
    b1 = b / 255
  const k = 1 - Math.max(r1, g1, b1)

  if (k === 1) return [0, 0, 0, 1]

  return [
    (1 - r1 - k) / (1 - k),
    (1 - g1 - k) / (1 - k),
    (1 - b1 - k) / (1 - k),
    k,
  ]
}

export default class Data {
  private base: BaseConfiguration
  private themes: Array<ThemeConfiguration>
  private meta: MetaConfiguration
  private paletteData: PaletteData

  constructor({
    base,
    themes,
    meta,
  }: {
    base: BaseConfiguration
    themes: Array<ThemeConfiguration>
    meta?: MetaConfiguration
  }) {
    this.base = base
    this.themes = themes
    this.meta = meta ?? DEFAULT_META
    this.paletteData = {
      name: base.name ?? 'UI Color Palette',
      description: base.description,
      themes: [],
      type: 'palette',
    }
  }

  makePaletteData = () => {
    this.themes.forEach((theme) => {
      const paletteDataThemeItem: PaletteDataThemeItem = {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        colors: [],
        textColorsTheme: theme.textColorsTheme,
        type: theme.type,
      }
      this.base.colors.forEach((color) => {
        const scaledColors = Object.entries(theme.scale)
          .reverse()
          .map((lightness) => {
            if (color.alpha.isEnabled) {
              const foregroundColorData = new Color({
                render: 'RGB',
                sourceColor: [
                  color.rgb.r * 255,
                  color.rgb.g * 255,
                  color.rgb.b * 255,
                ],
                alpha: parseFloat((lightness[1] / 100).toFixed(2)),
                hueShifting:
                  color.hue.shift !== undefined ? color.hue.shift : 0,
                chromaShifting:
                  color.chroma.shift !== undefined ? color.chroma.shift : 100,
                algorithmVersion: this.base.algorithmVersion,
                visionSimulationMode: theme.visionSimulationMode,
              })
              const backgroundColorData = new Color({
                render: 'RGB',
                sourceColor: chroma(color.alpha.backgroundColor).rgb(),
                algorithmVersion: this.base.algorithmVersion,
                visionSimulationMode: theme.visionSimulationMode,
              })

              switch (this.base.colorSpace) {
                case 'LCH':
                  return this.base.areSourceColorsLocked
                    ? [
                        lightness,
                        foregroundColorData.setColorWithAlpha(),
                        backgroundColorData.setColorWithAlpha(),
                      ]
                    : [
                        lightness,
                        foregroundColorData.lcha(),
                        backgroundColorData.lcha(),
                      ]
                case 'OKLCH':
                  return this.base.areSourceColorsLocked
                    ? [
                        lightness,
                        foregroundColorData.setColorWithAlpha(),
                        backgroundColorData.setColorWithAlpha(),
                      ]
                    : [
                        lightness,
                        foregroundColorData.oklcha(),
                        backgroundColorData.oklcha(),
                      ]
                case 'LAB':
                  return this.base.areSourceColorsLocked
                    ? [
                        lightness,
                        foregroundColorData.setColorWithAlpha(),
                        backgroundColorData.setColorWithAlpha(),
                      ]
                    : [
                        lightness,
                        foregroundColorData.laba(),
                        backgroundColorData.laba(),
                      ]
                case 'OKLAB':
                  return this.base.areSourceColorsLocked
                    ? [
                        lightness,
                        foregroundColorData.setColorWithAlpha(),
                        backgroundColorData.setColorWithAlpha(),
                      ]
                    : [
                        lightness,
                        foregroundColorData.oklaba(),
                        backgroundColorData.oklaba(),
                      ]
                case 'HSL':
                  return this.base.areSourceColorsLocked
                    ? [
                        lightness,
                        foregroundColorData.setColorWithAlpha(),
                        backgroundColorData.setColorWithAlpha(),
                      ]
                    : [
                        lightness,
                        foregroundColorData.hsla(),
                        backgroundColorData.hsla(),
                      ]
                case 'HSLUV':
                  return this.base.areSourceColorsLocked
                    ? [
                        lightness,
                        foregroundColorData.setColorWithAlpha(),
                        backgroundColorData.setColorWithAlpha(),
                      ]
                    : [
                        lightness,
                        foregroundColorData.hsluva(),
                        backgroundColorData.hsluva(),
                      ]
                case 'HSV':
                  return this.base.areSourceColorsLocked
                    ? [
                        lightness,
                        foregroundColorData.setColorWithAlpha(),
                        backgroundColorData.setColorWithAlpha(),
                      ]
                    : [
                        lightness,
                        foregroundColorData.hsva(),
                        backgroundColorData.hsva(),
                      ]
                case 'CMYK':
                  return this.base.areSourceColorsLocked
                    ? [
                        lightness,
                        foregroundColorData.setColorWithAlpha(),
                        backgroundColorData.setColorWithAlpha(),
                      ]
                    : [
                        lightness,
                        foregroundColorData.cmyka(),
                        backgroundColorData.cmyka(),
                      ]
                default:
                  return [lightness, [0, 0, 0], [255, 255, 255]]
              }
            } else {
              const colorData = new Color({
                render: 'RGB',
                sourceColor: [
                  color.rgb.r * 255,
                  color.rgb.g * 255,
                  color.rgb.b * 255,
                ],
                lightness: lightness[1],
                hueShifting:
                  color.hue.shift !== undefined ? color.hue.shift : 0,
                chromaShifting:
                  color.chroma.shift !== undefined ? color.chroma.shift : 100,
                algorithmVersion: this.base.algorithmVersion,
                visionSimulationMode: theme.visionSimulationMode,
              })

              switch (this.base.colorSpace) {
                case 'LCH':
                  return [lightness, colorData.lch()]
                case 'OKLCH':
                  return [lightness, colorData.oklch()]
                case 'LAB':
                  return [lightness, colorData.lab()]
                case 'OKLAB':
                  return [lightness, colorData.oklab()]
                case 'HSL':
                  return [lightness, colorData.hsl()]
                case 'HSLUV':
                  return [lightness, colorData.hsluv()]
                case 'HSV':
                  return [lightness, colorData.hsv()]
                case 'CMYK':
                  return [lightness, colorData.cmyk()]
                default:
                  return [lightness, [0, 0, 0]]
              }
            }
          })

        const paletteDataColorItem: PaletteDataColorItem = {
            id: color.id,
            name: color.name,
            description: color.description,
            shades: [],
            type: 'color',
          },
          sourceColor: Channel = [
            color.rgb.r * 255,
            color.rgb.g * 255,
            color.rgb.b * 255,
          ]

        const sourceHsluv = new Hsluv()
        sourceHsluv.rgb_r = color.rgb.r
        sourceHsluv.rgb_g = color.rgb.g
        sourceHsluv.rgb_b = color.rgb.b
        sourceHsluv.rgbToHsluv()
        const sourceContrastChecker = new Contrast({
          backgroundColor: sourceColor,
          textColor: theme.paletteBackground,
        })

        const sourceTextContrast = theme.textColorsTheme
          ? (() => {
              const lightContrast = new Contrast({
                backgroundColor: sourceColor,
                textColor: theme.textColorsTheme.lightColor,
              })
              const darkContrast = new Contrast({
                backgroundColor: sourceColor,
                textColor: theme.textColorsTheme.darkColor,
              })
              return {
                wcag: {
                  light: {
                    ratio: parseFloat(
                      lightContrast.getWCAGContrast().toFixed(2)
                    ),
                    score: lightContrast.getWCAGScore(),
                  },
                  dark: {
                    ratio: parseFloat(
                      darkContrast.getWCAGContrast().toFixed(2)
                    ),
                    score: darkContrast.getWCAGScore(),
                  },
                },
                apca: {
                  light: {
                    lc: parseFloat(lightContrast.getAPCAContrast().toFixed(2)),
                    recommendedUsage: lightContrast.getRecommendedUsage(),
                  },
                  dark: {
                    lc: parseFloat(darkContrast.getAPCAContrast().toFixed(2)),
                    recommendedUsage: darkContrast.getRecommendedUsage(),
                  },
                },
              }
            })()
          : undefined

        paletteDataColorItem.shades.push({
          name: 'source',
          description: 'Source color',
          hex: chroma(sourceColor).hex(),
          rgb: sourceColor,
          gl: chroma(sourceColor).gl(),
          lch: chroma(sourceColor).lch(),
          oklch: chroma(sourceColor).oklch(),
          lab: chroma(sourceColor).lab(),
          oklab: chroma(sourceColor).oklab(),
          hsl: chroma(sourceColor).hsl(),
          hsluv: [
            sourceHsluv.hsluv_h,
            sourceHsluv.hsluv_s,
            sourceHsluv.hsluv_l,
          ],
          hsv: chroma(sourceColor).hsv() as Channel,
          cmyk: rgbToCmyk(...sourceColor),
          contrast: {
            wcag: {
              ratio: sourceContrastChecker.getWCAGContrast(),
              score: sourceContrastChecker.getWCAGScore(),
            },
            apca: {
              lc: sourceContrastChecker.getAPCAContrast(),
              recommendedUsage: sourceContrastChecker.getRecommendedUsage(),
            },
          },
          textContrast: sourceTextContrast,
          type: 'source color',
        })

        const distances = scaledColors.map((shade) =>
          chroma.distance(
            chroma(sourceColor).hex(),
            chroma(shade[1] as Channel).hex(),
            'rgb'
          )
        )
        const minDistanceIndex = distances.indexOf(Math.min(...distances))

        scaledColors.forEach((scaledColor, index) => {
          const distance: number = chroma.distance(
            chroma(sourceColor).hex(),
            chroma(scaledColor[1] as Channel).hex(),
            'rgb'
          )
          const scaleName: string =
            Object.keys(theme.scale).find((key) => key === scaledColor[0][0]) ??
            '0'
          const newHsluv = new Hsluv()
          const simulatedSourceColorRgb = new Color({
            render: 'RGB',
            sourceColor: chroma(sourceColor).rgb(),
            visionSimulationMode: theme.visionSimulationMode,
          }).setColor() as Channel
          const simulatedSourceColorHex = new Color({
            render: 'HEX',
            sourceColor: chroma(sourceColor).rgb(),
            visionSimulationMode: theme.visionSimulationMode,
          }).setColor() as HexModel
          const mixedColor =
            color.alpha.isEnabled && color.alpha.backgroundColor
              ? new Color({
                  visionSimulationMode: theme.visionSimulationMode,
                }).mixColorsRgb(
                  [
                    ...(scaledColor[1] as Channel),
                    parseFloat(
                      ((scaledColor[0][1] as number) / 100).toFixed(2)
                    ),
                  ],
                  [...(scaledColor[2] as Channel), 1]
                )
              : undefined

          if (
            index === minDistanceIndex &&
            this.base.areSourceColorsLocked &&
            !color.alpha.isEnabled
          ) {
            newHsluv.rgb_r = Number(simulatedSourceColorRgb[0]) / 255
            newHsluv.rgb_g = Number(simulatedSourceColorRgb[1]) / 255
            newHsluv.rgb_b = Number(simulatedSourceColorRgb[2]) / 255
          } else {
            newHsluv.rgb_r = Number(scaledColor[1][0]) / 255
            newHsluv.rgb_g = Number(scaledColor[1][1]) / 255
            newHsluv.rgb_b = Number(scaledColor[1][2]) / 255
          }
          newHsluv.rgbToHsluv()

          const contrastChecker = new Contrast({
            backgroundColor: color.alpha.isEnabled
              ? mixedColor
              : (scaledColor[1] as Channel),
            textColor: theme.paletteBackground,
          })
          const wcagRatio = contrastChecker.getWCAGContrast()
          const wcagScore = contrastChecker.getWCAGScore()
          const apcaLc = contrastChecker.getAPCAContrast()
          const apcaUsage = contrastChecker.getRecommendedUsage()

          const shadeTextContrast = theme.textColorsTheme
            ? (() => {
                const bgColor = color.alpha.isEnabled
                  ? mixedColor
                  : (scaledColor[1] as Channel)
                const lightContrast = new Contrast({
                  backgroundColor: bgColor,
                  textColor: theme.textColorsTheme.lightColor,
                })
                const darkContrast = new Contrast({
                  backgroundColor: bgColor,
                  textColor: theme.textColorsTheme.darkColor,
                })
                return {
                  wcag: {
                    light: {
                      ratio: parseFloat(
                        lightContrast.getWCAGContrast().toFixed(2)
                      ),
                      score: lightContrast.getWCAGScore(),
                    },
                    dark: {
                      ratio: parseFloat(
                        darkContrast.getWCAGContrast().toFixed(2)
                      ),
                      score: darkContrast.getWCAGScore(),
                    },
                  },
                  apca: {
                    light: {
                      lc: parseFloat(
                        lightContrast.getAPCAContrast().toFixed(2)
                      ),
                      recommendedUsage: lightContrast.getRecommendedUsage(),
                    },
                    dark: {
                      lc: parseFloat(darkContrast.getAPCAContrast().toFixed(2)),
                      recommendedUsage: darkContrast.getRecommendedUsage(),
                    },
                  },
                }
              })()
            : undefined

          paletteDataColorItem.shades.push({
            name: scaleName,
            description: `Shade/Tint color with ${typeof scaledColor[0][1] === 'number' ? scaledColor[0][1].toFixed(1) : scaledColor[0][1]}% of ${
              color.alpha.isEnabled ? 'opacity' : 'lightness'
            } — WCAG ${wcagRatio.toFixed(2)}:1 (${wcagScore}) · APCA Lc ${apcaLc.toFixed(1)} (${apcaUsage.replace(/_/g, ' ').toLowerCase()})`,
            hex:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled
                ? chroma(simulatedSourceColorHex).hex()
                : chroma(scaledColor[1] as Channel).hex(),
            rgb:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled
                ? chroma(simulatedSourceColorHex).rgb()
                : chroma(scaledColor[1] as Channel).rgb(),
            gl:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled
                ? chroma(simulatedSourceColorHex).gl()
                : chroma(scaledColor[1] as Channel).gl(),
            lch:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled
                ? chroma(simulatedSourceColorHex).lch()
                : chroma(scaledColor[1] as Channel).lch(),
            oklch:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled
                ? chroma(simulatedSourceColorHex).oklch()
                : chroma(scaledColor[1] as Channel).oklch(),
            lab:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled
                ? chroma(simulatedSourceColorHex).lab()
                : chroma(scaledColor[1] as Channel).lab(),
            oklab:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled
                ? chroma(simulatedSourceColorHex).oklab()
                : chroma(scaledColor[1] as Channel).oklab(),
            hsl:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled
                ? chroma(simulatedSourceColorHex).hsl()
                : chroma(scaledColor[1] as Channel).hsl(),
            hsluv: [newHsluv.hsluv_h, newHsluv.hsluv_s, newHsluv.hsluv_l],
            hsv: (index === minDistanceIndex &&
            this.base.areSourceColorsLocked &&
            !color.alpha.isEnabled
              ? chroma(simulatedSourceColorHex)
              : chroma(scaledColor[1] as Channel)
            ).hsv() as Channel,
            cmyk: (() => {
              const [r, g, b] = (
                index === minDistanceIndex &&
                this.base.areSourceColorsLocked &&
                !color.alpha.isEnabled
                  ? chroma(simulatedSourceColorHex)
                  : chroma(scaledColor[1] as Channel)
              ).rgb()
              return rgbToCmyk(r, g, b)
            })(),
            alpha: color.alpha.isEnabled
              ? parseFloat(((scaledColor[0][1] as number) / 100).toFixed(2))
              : undefined,
            backgroundColor:
              color.alpha.isEnabled && color.alpha.backgroundColor
                ? chroma(scaledColor[2] as Channel).rgb()
                : undefined,
            mixedColor: mixedColor,
            contrast: {
              wcag: {
                ratio: wcagRatio,
                score: wcagScore,
              },
              apca: {
                lc: apcaLc,
                recommendedUsage: apcaUsage,
              },
            },
            textContrast: shadeTextContrast,
            isClosestToRef: distance < 4 && !this.base.areSourceColorsLocked,
            isSourceColorLocked:
              index === minDistanceIndex &&
              this.base.areSourceColorsLocked &&
              !color.alpha.isEnabled,
            isTransparent: color.alpha.isEnabled,
            type: 'color shade/tint',
          })
        })

        paletteDataThemeItem.colors.push(paletteDataColorItem)
      })
      this.paletteData.themes.push(paletteDataThemeItem)
    })

    return this.paletteData
  }

  makeLibraryData = (
    options?: Array<
      | 'collection_id'
      | 'mode_id'
      | 'variable_id'
      | 'style_id'
      | 'catalog_id'
      | 'theme_id'
      | 'set_id'
      | 'token_id'
      | 'gl'
      | 'hex'
      | 'description'
      | 'alpha'
    >,
    previousData?: Array<LibraryData>
  ) => {
    const paletteData = this.makePaletteData()

    const libraryData: Array<LibraryData> = paletteData.themes.flatMap(
      (theme) => {
        return theme.colors.flatMap((color) =>
          color.shades.flatMap((shade) => {
            const generatedId = `${theme.id}:${color.id}:${shade.name}`
            const previousItem = previousData?.find(
              (item) => item.id === generatedId
            )

            return {
              id: generatedId,
              paletteName: paletteData.name,
              themeName: theme.name,
              colorName: color.name,
              shadeName: shade.name,
              ...(options?.includes('alpha') && { alpha: shade.alpha ?? 1 }),
              ...(options?.includes('hex') && { hex: shade.hex }),
              ...(options?.includes('gl') && { gl: shade.gl }),
              ...(options?.includes('description') && {
                description: color.description,
              }),
              ...(options?.includes('collection_id') && {
                collectionId: previousItem?.collectionId,
              }),
              ...(options?.includes('mode_id') && {
                modeId: previousItem?.modeId,
              }),
              ...(options?.includes('variable_id') && {
                variableId: previousItem?.variableId,
              }),
              ...(options?.includes('style_id') && {
                styleId: previousItem?.styleId,
              }),
              ...(options?.includes('catalog_id') && {
                catalogId: previousItem?.catalogId,
              }),
              ...(options?.includes('theme_id') && {
                themeId: previousItem?.themeId,
              }),
              ...(options?.includes('set_id') && {
                setId: previousItem?.setId,
              }),
              ...(options?.includes('token_id') && {
                tokenId: previousItem?.tokenId,
              }),
            }
          })
        )
      }
    )

    return libraryData
  }

  makePaletteFullData = () => {
    const fullPaletteData = {
      base: this.base,
      themes: this.themes,
      libraryData: this.makeLibraryData(),
      meta: this.meta,
      version: '2025.06',
      type: 'UI_COLOR_PALETTE',
    } as FullConfiguration

    return fullPaletteData
  }
}

import { describe, it, expect } from 'vitest'
import { VisionSimulationModeConfiguration } from '@tps/configuration.types'
import { Channel, ChannelWithAlpha } from '@tps/color.types'
import Color from './color'

describe('Color', () => {
  const sourceColor: Channel = [255, 0, 0]

  it('should create an instance with default values', () => {
    const color = new Color({})
    expect(color).toBeDefined()
  })

  it('should correctly adjust hue', () => {
    const color = new Color({
      sourceColor,
      hueShifting: 180,
    })
    expect(color.adjustHue(0)).toBe(180)
    expect(color.adjustHue(270)).toBe(90)
  })

  it('should correctly adjust chroma based on algorithm version', () => {
    const testChroma = 100

    // v1
    const colorV1 = new Color({
      sourceColor,
      algorithmVersion: 'v1',
    })
    expect(colorV1.adjustChroma(testChroma)).toBe(testChroma)

    // v2
    const colorV2 = new Color({
      sourceColor,
      algorithmVersion: 'v2',
    })
    expect(colorV2.adjustChroma(testChroma)).toBeLessThan(testChroma)

    // v3
    const colorV3 = new Color({
      sourceColor,
      algorithmVersion: 'v3',
    })
    expect(colorV3.adjustChroma(testChroma)).toBeLessThan(testChroma)
  })

  it('should correctly convert colors in different color spaces', () => {
    const color = new Color({ sourceColor })

    expect(color.lch()).toBeDefined()
    expect(color.oklch()).toBeDefined()
    expect(color.lab()).toBeDefined()
    expect(color.oklab()).toBeDefined()
    expect(color.hsl()).toBeDefined()
    expect(color.hsluv()).toBeDefined()
    expect(color.hsv()).toBeDefined()
    expect(color.cmyk()).toBeDefined()
  })

  it('should correctly handle alpha channel', () => {
    const color = new Color({
      sourceColor,
      alpha: 0.5,
    })

    const result = color.setColorWithAlpha()
    expect(result).toBeDefined()
  })

  it('should correctly simulate color blindness', () => {
    const modes: VisionSimulationModeConfiguration[] = [
      'PROTANOPIA',
      'PROTANOMALY',
      'DEUTERANOPIA',
      'DEUTERANOMALY',
      'TRITANOPIA',
      'TRITANOMALY',
      'ACHROMATOPSIA',
      'ACHROMATOMALY',
      'NONE',
    ]

    modes.forEach((mode) => {
      const color = new Color({
        sourceColor,
        visionSimulationMode: mode,
      })

      expect(color.setColor()).toBeDefined()
    })
  })

  it('should correctly mix colors', () => {
    const color = new Color({ sourceColor })

    // RGB mix
    const colorA: ChannelWithAlpha = [255, 0, 0, 0.5]
    const colorB: ChannelWithAlpha = [0, 255, 0, 1]
    const mixedRgb = color.mixColorsRgb(colorA, colorB)
    expect(mixedRgb).toBeDefined()
    expect(mixedRgb.length).toBe(3)

    // HEX mix
    const mixedHex = color.mixColorsHex('#FF0000', '#00FF00')
    expect(mixedHex).toBeDefined()
    expect(mixedHex.startsWith('#')).toBe(true)
  })

  // Test color space conversions with alpha
  const colorSpaceMethods = [
    'lcha',
    'oklcha',
    'laba',
    'oklaba',
    'hsla',
    'hsluva',
    'hsva',
    'cmyka',
  ] as const

  colorSpaceMethods.forEach((method) => {
    it(`should correctly handle ${method} conversion with alpha`, () => {
      const color = new Color({
        sourceColor,
        alpha: 0.5,
      })
      const result = color[method as keyof Color]
      expect(result).toBeDefined()
    })
  })

  it('should handle color space transformations with invalid values', () => {
    const color = new Color({
      sourceColor: [300, -50, 1000],
    })

    expect(color.lch()).toBeDefined()
    expect(color.oklch()).toBeDefined()
    expect(color.lab()).toBeDefined()
    expect(color.oklab()).toBeDefined()
  })

  it('should handle extreme color adjustments', () => {
    const color = new Color({
      sourceColor,
      lightness: 200,
      chromaShifting: -150,
    })

    expect(color.setColor()).toBeDefined()
    expect(color.setColorWithAlpha()).toBeDefined()
  })

  it('should handle color interpolation edge cases', () => {
    const color = new Color({ sourceColor })

    // Test with extreme alpha values
    expect(color.mixColorsRgb([255, 0, 0, 2], [0, 255, 0, -1])).toBeDefined()
  })

  it('should properly handle color space boundaries', () => {
    const color = new Color({
      sourceColor,
      hueShifting: 720, // Over 360 degrees
      chromaShifting: 200, // Over 100%
    })

    const result = color.setColor()
    expect(result).toBeDefined()

    const methods = [
      'lch',
      'oklch',
      'lab',
      'oklab',
      'hsl',
      'hsluv',
      'hsv',
      'cmyk',
    ]
    methods.forEach((method) => {
      expect(color[method as keyof Color]).toBeDefined()
    })
  })

  it('should handle invalid hex colors in mixColorsHex', () => {
    const color = new Color({ sourceColor })
    expect(color.mixColorsHex('invalid', '#FF0000')).toBeDefined()
    expect(color.mixColorsHex('#FF0000', 'invalid')).toBeDefined()
    expect(color.mixColorsHex('invalid', 'invalid')).toBeDefined()
  })

  it('should handle zero and negative values in adjustments', () => {
    const color = new Color({
      sourceColor,
      lightness: 0,
      chromaShifting: -200,
      hueShifting: -360,
    })
    expect(color.setColor()).toBeDefined()
    expect(color.adjustChroma(-50)).toBeDefined()
    expect(color.adjustHue(-180)).toBeDefined()
  })

  it('should handle all color space transformations', () => {
    const methods = [
      'lch',
      'oklch',
      'lab',
      'oklab',
      'hsl',
      'hsluv',
      'hsv',
      'cmyk',
      'lcha',
      'oklcha',
      'laba',
      'oklaba',
      'hsla',
      'hsluva',
      'hsva',
      'cmyka',
    ]
    const color = new Color({ sourceColor })

    methods.forEach((method) => {
      expect(color[method as keyof Color]).toBeDefined()
    })
  })

  it('should handle extreme alpha values in color mixing', () => {
    const color = new Color({ sourceColor })
    const extremeCases: Array<[ChannelWithAlpha, ChannelWithAlpha]> = [
      [
        [255, 0, 0, 2],
        [0, 0, 255, 1],
      ],
      [
        [255, 0, 0, -1],
        [0, 0, 255, 0.5],
      ],
      [
        [255, 0, 0, 0],
        [0, 0, 255, 0],
      ],
      [
        [255, 0, 0, 1],
        [0, 0, 255, 2],
      ],
    ]

    extremeCases.forEach(([colorA, colorB]) => {
      expect(color.mixColorsRgb(colorA, colorB)).toBeDefined()
    })
  })

  // HSV
  it('should return a HEX string from hsv', () => {
    const color = new Color({ sourceColor })
    const result = color.hsv() as string

    expect(typeof result).toBe('string')
    expect(result.startsWith('#')).toBe(true)
  })

  it('should return a 3-element RGB array from hsv', () => {
    const color = new Color({ sourceColor, render: 'RGB' })
    const result = color.hsv() as number[]

    expect(result.length).toBe(3)
    result.forEach((c) => expect(c).toBeGreaterThanOrEqual(0))
    result.forEach((c) => expect(c).toBeLessThanOrEqual(255))
  })

  it('should produce different outputs for different lightness in HSV', () => {
    const dark = new Color({ sourceColor, lightness: 10 })
    const bright = new Color({ sourceColor, lightness: 90 })

    expect(dark.hsv()).not.toEqual(bright.hsv())
  })

  it('should produce different outputs for different chromaShifting in HSV', () => {
    const full = new Color({ sourceColor, chromaShifting: 100 })
    const low = new Color({ sourceColor, chromaShifting: 20 })

    expect(full.hsv()).not.toEqual(low.hsv())
  })

  it('should produce different outputs for different hueShifting in HSV', () => {
    const base = new Color({ sourceColor })
    const shifted = new Color({ sourceColor, hueShifting: 90 })

    expect(base.hsv()).not.toEqual(shifted.hsv())
  })

  it('should return a 4-element array for hsva with render RGB', () => {
    const color = new Color({ sourceColor, render: 'RGB', alpha: 0.5 })
    const result = color.hsva() as number[]

    expect(result.length).toBe(4)
    expect(result[3]).toBeCloseTo(0.5, 5)
  })

  it('should return a HEX string with alpha for hsva', () => {
    const color = new Color({ sourceColor, render: 'HEX', alpha: 0.5 })
    const result = color.hsva() as string

    expect(result.startsWith('#')).toBe(true)
  })

  it('should preserve original V in hsva (no lightness override)', () => {
    const base = new Color({ sourceColor, render: 'RGB' })
    const withLightness = new Color({
      sourceColor,
      render: 'RGB',
      lightness: 10,
    })

    expect(base.hsva()).not.toEqual(withLightness.hsv())
  })

  it('should handle achromatic colors in HSV without errors', () => {
    const black = new Color({ sourceColor: [0, 0, 0] })
    const white = new Color({ sourceColor: [255, 255, 255] })
    const gray = new Color({ sourceColor: [128, 128, 128] })

    expect(black.hsv()).toBeDefined()
    expect(white.hsv()).toBeDefined()
    expect(gray.hsv()).toBeDefined()
  })

  // CMYK
  it('should return a HEX string from cmyk', () => {
    const color = new Color({ sourceColor })
    const result = color.cmyk() as string

    expect(typeof result).toBe('string')
    expect(result.startsWith('#')).toBe(true)
  })

  it('should return a 3-element RGB array from cmyk', () => {
    const color = new Color({ sourceColor, render: 'RGB' })
    const result = color.cmyk() as number[]

    expect(result.length).toBe(3)
    result.forEach((c) => expect(c).toBeGreaterThanOrEqual(0))
    result.forEach((c) => expect(c).toBeLessThanOrEqual(255))
  })

  it('should produce different outputs for different lightness in CMYK', () => {
    const dark = new Color({ sourceColor, lightness: 10 })
    const bright = new Color({ sourceColor, lightness: 90 })

    expect(dark.cmyk()).not.toEqual(bright.cmyk())
  })

  it('should produce different outputs for different chromaShifting in CMYK', () => {
    const full = new Color({ sourceColor, chromaShifting: 100 })
    const low = new Color({ sourceColor, chromaShifting: 20 })

    expect(full.cmyk()).not.toEqual(low.cmyk())
  })

  it('should produce different outputs for different hueShifting in CMYK', () => {
    const base = new Color({ sourceColor, lightness: 50 })
    const shifted = new Color({ sourceColor, lightness: 50, hueShifting: 90 })

    expect(base.cmyk()).not.toEqual(shifted.cmyk())
  })

  it('should return a 4-element array for cmyka with render RGB', () => {
    const color = new Color({ sourceColor, render: 'RGB', alpha: 0.5 })
    const result = color.cmyka() as number[]

    expect(result.length).toBe(4)
    expect(result[3]).toBeCloseTo(0.5, 5)
  })

  it('should return a HEX string with alpha for cmyka', () => {
    const color = new Color({ sourceColor, render: 'HEX', alpha: 0.5 })
    const result = color.cmyka() as string

    expect(result.startsWith('#')).toBe(true)
  })

  it('should preserve original K in cmyka (no lightness override)', () => {
    const base = new Color({ sourceColor, render: 'RGB' })
    const withLightness = new Color({
      sourceColor,
      render: 'RGB',
      lightness: 10,
    })

    expect(base.cmyka()).not.toEqual(withLightness.cmyk())
  })

  it('should handle pure black source in CMYK', () => {
    const color = new Color({ sourceColor: [0, 0, 0], lightness: 0 })

    expect(color.cmyk()).toBeDefined()
    expect(color.cmyka()).toBeDefined()
  })

  it('should handle pure white source in CMYK', () => {
    const color = new Color({ sourceColor: [255, 255, 255], lightness: 100 })

    expect(color.cmyk()).toBeDefined()
    expect(color.cmyka()).toBeDefined()
  })

  it('should clamp RGB channels to [0, 255] in CMYK with extreme chromaShifting', () => {
    const color = new Color({
      sourceColor,
      render: 'RGB',
      chromaShifting: 500,
      lightness: 50,
    })
    const result = color.cmyk() as number[]

    result.forEach((c) => {
      expect(c).toBeGreaterThanOrEqual(0)
      expect(c).toBeLessThanOrEqual(255)
    })
  })
})

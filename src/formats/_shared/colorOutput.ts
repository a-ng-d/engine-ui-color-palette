/**
 * Small helpers shared by the primitive generators for platforms whose color
 * notation differs from CSS.
 */

const toLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4

const toGamma = (channel: number) =>
  channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export const srgbToDisplayP3 = (
  rgb: [number, number, number, ...Array<number>] | Array<number>
): [number, number, number] => {
  const [r, g, b] = rgb.slice(0, 3).map(toLinear)

  return [
    0.8224621 * r + 0.177538 * g,
    0.0331941 * r + 0.9668058 * g,
    0.0170827 * r + 0.0723974 * g + 0.9105199 * b,
  ].map((channel) => clamp(toGamma(clamp(channel)))) as [number, number, number]
}

export const alphaByte = (alpha: number | undefined) =>
  Math.round(clamp(alpha ?? 1) * 255)
    .toString(16)
    .padStart(2, '0')

/**
 * An `oklch()` value as the CSS, SCSS and Less exports write it: lightness as
 * a whole percentage, chroma with 3 decimals, hue as a whole degree. An
 * achromatic color has no hue, so it gets 0.
 */
export const oklchNotation = (
  oklch: Array<number>,
  alpha?: number | undefined
) => {
  const hue = isNaN(oklch[2]) ? 0 : oklch[2]

  return `oklch(${Math.floor(oklch[0] * 100)}% ${oklch[1].toFixed(3)} ${Math.floor(hue)}${
    alpha === undefined ? '' : ` / ${alpha.toFixed(2)}`
  })`
}

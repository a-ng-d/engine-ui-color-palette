import { SystemData } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import { parseShadeId } from './_helpers'

const escapeCsv = (s: string): string =>
  /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s

const makeCsvSemantics = (
  _paletteData: PaletteData,
  systemData: SystemData
): string => {
  const rows: Array<string> = ['path,themeId,colorId,shadeName,shadeId']
  systemData.tokens.forEach((token) => {
    const path = token.pathNames.join('/')
    token.refs.forEach((ref) => {
      if (ref.shadeId === null) {
        rows.push(`${escapeCsv(path)},${escapeCsv(ref.themeId)},,,`)
        return
      }
      const parsed = parseShadeId(ref.shadeId)
      if (!parsed) {
        rows.push(
          `${escapeCsv(path)},${escapeCsv(ref.themeId)},,,${escapeCsv(ref.shadeId)}`
        )
        return
      }
      rows.push(
        `${escapeCsv(path)},${escapeCsv(ref.themeId)},${escapeCsv(parsed.colorId)},${escapeCsv(parsed.shadeName)},${escapeCsv(ref.shadeId)}`
      )
    })
  })
  return rows.join('\n')
}

export default makeCsvSemantics

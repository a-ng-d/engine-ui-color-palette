import {
  SystemConfiguration,
  SystemData,
  SystemDataRef,
  SystemDataToken,
  TaxonomyBinding,
  TaxonomyExclusion,
  TaxonomyGroup,
  TaxonomySchema,
} from '@tps/system.types'
import { PaletteData } from '@tps/data.types'

export default class System {
  private paletteData: PaletteData
  private system: SystemConfiguration

  constructor({
    paletteData,
    system,
  }: {
    paletteData: PaletteData
    system: SystemConfiguration
  }) {
    this.paletteData = paletteData
    this.system = system
  }

  makeSystemData = (): SystemData => {
    const validPaths = this.computeValidPaths(this.system.schema)
    const tokens = validPaths.map((path) => this.resolveToken(path))
    return {
      schema: this.system.schema,
      tokens,
      type: 'system',
    }
  }

  private computeValidPaths = (
    schema: TaxonomySchema
  ): Array<Array<string>> => {
    const groups = schema.groups
    if (groups.length === 0) return []

    const allPaths: Array<Array<string>> = groups.reduce<Array<Array<string>>>(
      (acc, group) => {
        if (acc.length === 0) return group.members.map((m) => [m.id])
        const next: Array<Array<string>> = []
        for (const path of acc)
          for (const member of group.members) next.push([...path, member.id])
        return next
      },
      []
    )

    const exclusions = schema.exclusions ?? []
    if (exclusions.length === 0) return allPaths

    return allPaths.filter(
      (path) => !this.isPathExcluded(path, groups, exclusions)
    )
  }

  private isPathExcluded = (
    path: Array<string>,
    groups: Array<TaxonomyGroup>,
    exclusions: Array<TaxonomyExclusion>
  ): boolean => {
    const indexOfGroup = (groupId: string) =>
      groups.findIndex((g) => g.id === groupId)

    for (const rule of exclusions) {
      const whenKeys = Object.keys(rule.when)
      const whenMatches = whenKeys.every((groupId) => {
        const idx = indexOfGroup(groupId)
        if (idx === -1) return false
        return rule.when[groupId].includes(path[idx])
      })
      if (!whenMatches) continue

      const excludeKeys = Object.keys(rule.exclude)
      const excludeMatches = excludeKeys.some((groupId) => {
        const idx = indexOfGroup(groupId)
        if (idx === -1) return false
        return rule.exclude[groupId].includes(path[idx])
      })
      if (excludeMatches) return true
    }
    return false
  }

  private resolveToken = (path: Array<string>): SystemDataToken => {
    const groups = this.system.schema.groups
    const pathNames = path.map((memberId, i) => {
      const member = groups[i]?.members.find((m) => m.id === memberId)
      return member?.name ?? memberId
    })

    const binding = this.findBinding(path)
    const refs: Array<SystemDataRef> = this.paletteData.themes.map((theme) => {
      if (!binding) return { themeId: theme.id, shadeId: null }
      const themeRef = binding.overrides?.[theme.id] ?? binding.ref
      const parsed = this.parseRef(themeRef)
      if (!parsed) return { themeId: theme.id, shadeId: null }
      const exists = this.shadeExists(
        theme.id,
        parsed.colorId,
        parsed.shadeName
      )
      return {
        themeId: theme.id,
        shadeId: exists
          ? `${theme.id}:${parsed.colorId}:${parsed.shadeName}`
          : null,
      }
    })

    return {
      path,
      pathNames,
      description: binding?.description,
      refs,
    }
  }

  private findBinding = (path: Array<string>): TaxonomyBinding | undefined => {
    const bindings = this.system.bindings ?? []
    return bindings.find(
      (b) =>
        b.path.length === path.length &&
        b.path.every((seg, i) => seg === path[i])
    )
  }

  private parseRef = (
    ref: string
  ): { colorId: string; shadeName: string } | null => {
    const idx = ref.indexOf(':')
    if (idx === -1) return null
    const colorId = ref.slice(0, idx)
    const shadeName = ref.slice(idx + 1)
    if (!colorId || !shadeName) return null
    return { colorId, shadeName }
  }

  private shadeExists = (
    themeId: string,
    colorId: string,
    shadeName: string
  ): boolean => {
    const theme = this.paletteData.themes.find((t) => t.id === themeId)
    if (!theme) return false
    const color = theme.colors.find((c) => c.id === colorId)
    if (!color) return false
    return color.shades.some((s) => s.name === shadeName)
  }
}

export interface TaxonomyGroupMember {
  id: string
  name: string
}

export interface TaxonomyGroup {
  id: string
  name: string
  members: Array<TaxonomyGroupMember>
}

export interface TaxonomyExclusion {
  when: Record<string, Array<string>>
  exclude: Record<string, Array<string>>
}

export interface TaxonomySchema {
  groups: Array<TaxonomyGroup>
  exclusions?: Array<TaxonomyExclusion>
}

export interface TaxonomyBinding {
  path: Array<string>
  description?: string
  ref: string
  overrides?: Record<string, string>
}

export interface SystemConfiguration {
  schema: TaxonomySchema
  bindings?: Array<TaxonomyBinding>
}

export interface SystemDataRef {
  themeId: string
  shadeId: string | null
}

export interface SystemDataToken {
  path: Array<string>
  pathNames: Array<string>
  description?: string
  refs: Array<SystemDataRef>
}

export interface SystemData {
  schema: TaxonomySchema
  tokens: Array<SystemDataToken>
  type: 'system'
}

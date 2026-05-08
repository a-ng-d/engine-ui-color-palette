export interface TaxonomyGroupMember {
  id: string
  name: string
}

export interface TaxonomyGroup {
  id: string
  name: string
  members: Array<TaxonomyGroupMember>
}

export interface TaxonomySchema {
  groups: Array<TaxonomyGroup>
}

export interface TaxonomyBinding {
  path: Array<string>
  description?: string
  ref: string
  overrides?: Record<string, string>
  isExcluded?: boolean
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
  isExcluded: boolean
  refs: Array<SystemDataRef>
}

export interface SystemData {
  schema: TaxonomySchema
  tokens: Array<SystemDataToken>
  type: 'system'
}

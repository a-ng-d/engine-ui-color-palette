import { describe, it, expect } from 'vitest'
import { SystemConfiguration } from '@tps/system.types'
import { PaletteData } from '@tps/data.types'
import System from './system'

const paletteData = {
  name: 'Test',
  description: '',
  type: 'palette',
  themes: [
    {
      id: 'lightId',
      name: 'Light',
      description: '',
      type: 'default theme',
      colors: [
        {
          id: 'blueId',
          name: 'Blue',
          description: '',
          type: 'color',
          shades: [{ name: '400' }, { name: '600' }, { name: 'source' }],
        },
        {
          id: 'redId',
          name: 'Red',
          description: '',
          type: 'color',
          shades: [{ name: '400' }, { name: 'source' }],
        },
      ],
    },
    {
      id: 'darkId',
      name: 'Dark',
      description: '',
      type: 'default theme',
      colors: [
        {
          id: 'blueId',
          name: 'Blue',
          description: '',
          type: 'color',
          shades: [{ name: '400' }, { name: '600' }, { name: 'source' }],
        },
        {
          id: 'redId',
          name: 'Red',
          description: '',
          type: 'color',
          shades: [{ name: '400' }, { name: 'source' }],
        },
      ],
    },
  ],
} as unknown as PaletteData

const baseSchema: SystemConfiguration['schema'] = {
  groups: [
    {
      id: 'g1',
      name: 'Type',
      members: [
        { id: 'm_bg', name: 'background' },
        { id: 'm_txt', name: 'text' },
      ],
    },
    {
      id: 'g2',
      name: 'Surface',
      members: [
        { id: 'm_pri', name: 'primary' },
        { id: 'm_obrd', name: 'onbrand' },
      ],
    },
    {
      id: 'g3',
      name: 'State',
      members: [
        { id: 'm_def', name: 'default' },
        { id: 'm_hov', name: 'hover' },
      ],
    },
  ],
}

describe('System', () => {
  it('produces the full cartesian product without exclusions', () => {
    const sys = new System({
      paletteData,
      system: { schema: baseSchema },
    }).makeSystemData()

    expect(sys.tokens).toHaveLength(8)
    expect(sys.type).toBe('system')
    expect(sys.tokens[0].path).toEqual(['m_bg', 'm_pri', 'm_def'])
    expect(sys.tokens[0].pathNames).toEqual([
      'background',
      'primary',
      'default',
    ])
  })

  it('applies conditional blacklist exclusions', () => {
    const sys = new System({
      paletteData,
      system: {
        schema: {
          ...baseSchema,
          exclusions: [{ when: { g1: ['m_txt'] }, exclude: { g2: ['m_pri'] } }],
        },
      },
    }).makeSystemData()

    expect(sys.tokens).toHaveLength(6)
    const hasTextPrimary = sys.tokens.some(
      (t) => t.path[0] === 'm_txt' && t.path[1] === 'm_pri'
    )
    expect(hasTextPrimary).toBe(false)
  })

  it('resolves a global binding into a full ref per theme', () => {
    const sys = new System({
      paletteData,
      system: {
        schema: baseSchema,
        bindings: [{ path: ['m_bg', 'm_pri', 'm_def'], ref: 'blueId:400' }],
      },
    }).makeSystemData()

    const token = sys.tokens.find(
      (t) => t.path.join('/') === 'm_bg/m_pri/m_def'
    )!
    expect(token.refs).toEqual([
      { themeId: 'lightId', shadeId: 'lightId:blueId:400' },
      { themeId: 'darkId', shadeId: 'darkId:blueId:400' },
    ])
  })

  it('applies the per-theme override', () => {
    const sys = new System({
      paletteData,
      system: {
        schema: baseSchema,
        bindings: [
          {
            path: ['m_bg', 'm_pri', 'm_def'],
            ref: 'blueId:400',
            overrides: { darkId: 'blueId:600' },
          },
        ],
      },
    }).makeSystemData()

    const token = sys.tokens.find(
      (t) => t.path.join('/') === 'm_bg/m_pri/m_def'
    )!
    expect(token.refs.find((r) => r.themeId === 'lightId')!.shadeId).toBe(
      'lightId:blueId:400'
    )
    expect(token.refs.find((r) => r.themeId === 'darkId')!.shadeId).toBe(
      'darkId:blueId:600'
    )
  })

  it('returns null for paths without a binding', () => {
    const sys = new System({
      paletteData,
      system: { schema: baseSchema, bindings: [] },
    }).makeSystemData()

    sys.tokens.forEach((t) => {
      expect(t.refs).toEqual([
        { themeId: 'lightId', shadeId: null },
        { themeId: 'darkId', shadeId: null },
      ])
    })
  })

  it('returns null for a ref pointing to a non-existent shade', () => {
    const sys = new System({
      paletteData,
      system: {
        schema: baseSchema,
        bindings: [{ path: ['m_bg', 'm_pri', 'm_def'], ref: 'blueId:999' }],
      },
    }).makeSystemData()

    const token = sys.tokens.find(
      (t) => t.path.join('/') === 'm_bg/m_pri/m_def'
    )!
    expect(token.refs).toEqual([
      { themeId: 'lightId', shadeId: null },
      { themeId: 'darkId', shadeId: null },
    ])
  })

  it('returns null for a ref pointing to a non-existent color', () => {
    const sys = new System({
      paletteData,
      system: {
        schema: baseSchema,
        bindings: [{ path: ['m_bg', 'm_pri', 'm_def'], ref: 'unknownId:400' }],
      },
    }).makeSystemData()

    const token = sys.tokens.find(
      (t) => t.path.join('/') === 'm_bg/m_pri/m_def'
    )!
    expect(token.refs).toEqual([
      { themeId: 'lightId', shadeId: null },
      { themeId: 'darkId', shadeId: null },
    ])
  })

  it('silently ignores a binding pointing to an excluded path', () => {
    const sys = new System({
      paletteData,
      system: {
        schema: {
          ...baseSchema,
          exclusions: [{ when: { g1: ['m_txt'] }, exclude: { g2: ['m_pri'] } }],
        },
        bindings: [
          { path: ['m_txt', 'm_pri', 'm_def'], ref: 'blueId:400' },
          { path: ['m_bg', 'm_pri', 'm_def'], ref: 'blueId:400' },
        ],
      },
    }).makeSystemData()

    const invalidToken = sys.tokens.find(
      (t) => t.path.join('/') === 'm_txt/m_pri/m_def'
    )
    expect(invalidToken).toBeUndefined()

    const validToken = sys.tokens.find(
      (t) => t.path.join('/') === 'm_bg/m_pri/m_def'
    )!
    expect(validToken.refs.find((r) => r.themeId === 'lightId')!.shadeId).toBe(
      'lightId:blueId:400'
    )
  })

  it('resolves pathNames from member ids', () => {
    const sys = new System({
      paletteData,
      system: {
        schema: baseSchema,
        bindings: [{ path: ['m_txt', 'm_obrd', 'm_hov'], ref: 'redId:400' }],
      },
    }).makeSystemData()

    const token = sys.tokens.find(
      (t) => t.path.join('/') === 'm_txt/m_obrd/m_hov'
    )!
    expect(token.pathNames).toEqual(['text', 'onbrand', 'hover'])
  })

  it('propagates the binding description to the token', () => {
    const sys = new System({
      paletteData,
      system: {
        schema: baseSchema,
        bindings: [
          {
            path: ['m_bg', 'm_pri', 'm_def'],
            ref: 'blueId:400',
            description: 'Main surface',
          },
        ],
      },
    }).makeSystemData()

    const token = sys.tokens.find(
      (t) => t.path.join('/') === 'm_bg/m_pri/m_def'
    )!
    expect(token.description).toBe('Main surface')
  })

  it("rejects a malformed ref (missing ':')", () => {
    const sys = new System({
      paletteData,
      system: {
        schema: baseSchema,
        bindings: [{ path: ['m_bg', 'm_pri', 'm_def'], ref: 'malformed' }],
      },
    }).makeSystemData()

    const token = sys.tokens.find(
      (t) => t.path.join('/') === 'm_bg/m_pri/m_def'
    )!
    expect(token.refs.every((r) => r.shadeId === null)).toBe(true)
  })

  it('[demo] prints a realistic color system (Type × Surface × State)', () => {
    const realisticSchema: SystemConfiguration['schema'] = {
      groups: [
        {
          id: 'g_type',
          name: 'Type',
          members: [
            { id: 'tp_bg', name: 'background' },
            { id: 'tp_txt', name: 'text' },
            { id: 'tp_ico', name: 'icon' },
            { id: 'tp_bdr', name: 'border' },
          ],
        },
        {
          id: 'g_surf',
          name: 'Surface',
          members: [
            { id: 'sf_pri', name: 'primary' },
            { id: 'sf_sec', name: 'secondary' },
            { id: 'sf_brd', name: 'brand' },
            { id: 'sf_dgr', name: 'danger' },
            { id: 'sf_onbrd', name: 'onbrand' },
            { id: 'sf_ondgr', name: 'ondanger' },
          ],
        },
        {
          id: 'g_state',
          name: 'State',
          members: [
            { id: 'st_def', name: 'default' },
            { id: 'st_hov', name: 'hover' },
            { id: 'st_prs', name: 'pressed' },
          ],
        },
      ],
      exclusions: [
        {
          when: { g_type: ['tp_txt', 'tp_ico'] },
          exclude: { g_surf: ['sf_pri', 'sf_sec', 'sf_brd', 'sf_dgr'] },
        },
      ],
    }

    const sys = new System({
      paletteData,
      system: {
        schema: realisticSchema,
        bindings: [
          {
            path: ['tp_bg', 'sf_pri', 'st_def'],
            ref: 'blueId:400',
            overrides: { darkId: 'blueId:600' },
            description: 'Main surface',
          },
          {
            path: ['tp_bg', 'sf_pri', 'st_hov'],
            ref: 'blueId:600',
            overrides: { darkId: 'blueId:400' },
          },
          {
            path: ['tp_txt', 'sf_onbrd', 'st_def'],
            ref: 'redId:source',
          },
          {
            path: ['tp_txt', 'sf_pri', 'st_def'],
            ref: 'blueId:400',
          },
        ],
      },
    }).makeSystemData()

    expect(sys.tokens).toHaveLength(48)

    expect(
      sys.tokens.find((t) => t.path.join('/') === 'tp_txt/sf_pri/st_def')
    ).toBeUndefined()

    console.log('\n=== SystemData (full output) ===\n')
    console.log(JSON.stringify(sys, null, 2))
  })
})

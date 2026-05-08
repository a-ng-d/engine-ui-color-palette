# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.1] - 2026-05-08

### Added

- Token exclusion mechanism: `isExcluded` flag on `TaxonomyBinding` and `SystemDataToken` to skip specific semantic tokens from code generation

## [1.10.0] - 2026-05-08

### Added

- New `System` class for building a color system from a taxonomy schema and palette data
- Full set of semantic token types: `SystemConfiguration`, `SystemData`, `TaxonomySchema`, `TaxonomyGroup`, `TaxonomyGroupMember`, `TaxonomyBinding`, `SystemDataToken`, `SystemDataRef`
- Semantic code generation for all supported formats: CSS Custom Properties, SCSS, LESS, DTCG, Tailwind v3, Tailwind v4, SwiftUI, UIKit, Compose, Native, Universal, CSV, Android Resources, and Style Dictionary v3
- Optional `systemData` parameter on the `Code` class to include semantic layers alongside primitives
- Default metadata configuration (`DEFAULT_META`) on the `Data` class

### Changed

- Primitive format generators moved to `formats/primitives/` subfolder

## [1.9.0] - 2026-04-19

### Added

- Pre-computed text contrast scores (`textContrast`) on each shade in `PaletteData`, with WCAG (ratio, score) and APCA (Lc, recommendedUsage) values for both light and dark text colors

## [1.8.2] - 2026-04-02

### Added

- New fields in `LibraryData` and updated `makeLibraryData` options to support additional features

## [1.8.1] - 2026-03-09

### Added

- `com.uicp.wcag` and `com.uicp.apca` `$extensions` to DTCG tokens, exposing WCAG (score, ratio) and APCA (score, recommendation) contrast data against the theme's light and dark text colors for each shade
- `textColorsTheme` field to `PaletteDataThemeItem` to carry light and dark text colors through `PaletteData`

## [1.8.0] - 2026-03-09

### Added

- HSV and CMYK color models with corresponding tests and data handling
- GitHub Actions workflow for automated release on PR merge

### Fixed

- Update workflow name for clarity in tests configuration

## [1.7.9] - 2026-02-01

### Fixed

- Add `hue` property to `ShiftConfiguration` interface and data tests
- Streamline npm publish workflow (auth token, permissions, Node version, public access)
- Update repository URL format in `package.json`

## [1.7.8] - 2026-01-12

### Fixed

- Update npm workflow permissions and streamline install step

## [1.7.7] - 2026-01-12

### Changed

- Update coverage reports and improve search functionality
- Remove unused scale configuration and update scale name retrieval
- Downgrade `@vitest/coverage-v8` to 3.1.4 for compatibility
- Update repository field format in `package.json`
- Bump `validator`, `glob`, `@vitest/coverage-v8`, and `vite` dependencies

## [1.7.6] - 2025-10-26

### Added

- `star_count` and `add_count` fields to `ExternalPalettes` interface

## [1.7.5] - 2025-10-26

### Added

- Optional organization fields to `ExternalPalettes` interface

## [1.7.4] - 2025-10-19

### Changed

- Format `source` property in `SourceColorConfiguration` for improved readability

## [1.7.3] - 2025-10-19

### Added

- Support for compound color harmony generation with updated tests
- Harmony type strings updated to uppercase for consistency

## [1.7.2] - 2025-10-17

### Added

- `DominantColors` class now supports `ArrayBuffer` input with corresponding tests
- Usage examples for `ArrayBuffer` file uploads in README

## [1.7.1] - 2025-10-16

### Fixed

- Expand `SourceColorConfiguration` source options for better flexibility
- Update package name to include scope
- Update README and `index.ts` for improved formatting and coverage metrics

### Changed

- Add coverage report for `dominant-colors`

## [1.7.0] - 2025-10-16

### Added

- Color Harmony generation with multiple harmony types and options
- Dominant Colors extraction using K-means clustering

### Fixed

- Update package name and repository format in `package.json`

## [1.6.4] - 2025-09-05

### Fixed

- Correct RGB and HSL formatting in `makeCssCustomProps`, `makeLessVariables`, and `makeScssVariables`

## [1.6.3] - 2025-08-27

### Changed

- Improve theme management for native tokens

## [1.6.2] - 2025-08-16

### Fixed

- Correct property names for creator details in `ExternalPalettes` interface

## [1.6.1] - 2025-08-16

### Changed

- Remove unused token generation methods from `Data` class

## [1.6.0] - 2025-08-16

### Added

- `Code` class with associated methods for palette data handling

## [1.5.15] - 2025-08-14

### Fixed

- Remove JSDoc type annotation from Tailwind config export

## [1.5.14] - 2025-08-14

### Fixed

- Update export configuration for Style Dictionary version

## [1.5.13] - 2025-08-14

### Fixed

- Remove unused properties from `ExportConfiguration` interface

## [1.5.12] - 2025-08-14

### Changed

- Simplify return statement in `makeTailwindV3Config`

## [1.5.11] - 2025-08-13

### Fixed

- Handle NaN values for `oklch` in color space functions

## [1.5.10] - 2025-08-09

### Changed

- Extract `prefix` and `suffix` variables in Tailwind config export for better readability

## [1.5.9] - 2025-08-09

### Fixed

- Add newline for better formatting in Tailwind config export

## [1.5.8] - 2025-08-08

### Fixed

- Use more descriptive stylesheet type names in export configuration

## [1.5.7] - 2025-08-08

### Fixed

- Conditionally add theme name comment in CSS custom properties generation

## [1.5.6] - 2025-08-08

### Fixed

- Add comments for theme struct generation and clean up console logs in tests
- Refactor `makeScssVariables` to streamline variable generation

## [1.5.5] - 2025-08-08

### Fixed

- Add `TAILWIND_V3` and `TAILWIND_V4` to `ExportConfiguration`

## [1.5.4] - 2025-08-08

### Fixed

- Use `JS` instead of `JAVASCRIPT` in `ExportConfiguration`

## [1.5.3] - 2025-08-08

### Fixed

- Remove redundant theme color checks in `makeTailwindV3Config` test

## [1.5.2] - 2025-08-08

### Fixed

- Expand `ExportConfiguration` formats and contexts to include SCSS, LESS, and additional token contexts

## [1.5.1] - 2025-08-08

### Fixed

- Update return statement in `makeTailwindV3Config` to include Tailwind CSS config format

## [1.5.0] - 2025-08-08

### Added

- `makeStyleDictionaryV3Tokens`, `makeTailwindV3Config`, and `makeTailwindV4Config` functions
- Handle NaN values in OKLCH properties and improve CSS variable generation

### Fixed

- Update README formatting for test coverage table and ensure consistent newlines

## [1.4.3] - 2025-08-08

### Fixed

- Correct method name from `makeScssVariable` to `makeScssVariables`

## [1.4.2] - 2025-08-08

### Added

- Handle NaN values in color shade properties for valid CSS variable generation

## [1.4.1] - 2025-08-08

### Added

- Handle null values in color shade properties for CSS variable generation
- Integrate `makeCsv` function for CSV data generation in `Data` class

## [1.4.0] - 2025-08-07

### Added

- `makeLessVariables` and `makeScssVariables` functions for color palette generation
- `type` property to color model in `makeStyleDictionaryTokens`
- New formatters for color palette generation
- CODEOWNERS file

## [1.3.20] - 2025-07-04

### Changed

- Update `@a_ng_d/figmug-utils` dependency to version 0.4.0
- Format test coverage results for improved readability

## [1.3.19] - 2025-07-01

### Changed

- Change `StatusConfiguration` from interface to type

## [1.3.18] - 2025-07-01

### Changed

- Rename `DevStatusConfiguration` to `StatusConfiguration`

## [1.3.17] - 2025-07-01

### Added

- `DevStatusConfiguration` interface to manage development readiness

## [1.3.16] - 2025-07-01

### Fixed

- Check for `alpha` option instead of `hex` in `makeLibraryData`

## [1.3.15] - 2025-07-01

No substantive changes — version bump only.

## [1.3.14] - 2025-07-01

### Fixed

- Remove redundant `type` field from `LibraryData` interface and add `alpha` option in `makeLibraryData`

## [1.3.13] - 2025-07-01

### Fixed

- Simplify description handling in `makeLibraryData` by removing unnecessary concatenation

## [1.3.12] - 2025-07-01

### Fixed

- Simplify item lookup in `makeLibraryData` using `id` instead of `path` and `name`

## [1.3.11] - 2025-07-01

### Fixed

- Update library data structure for improved clarity and consistency

## [1.3.10] - 2025-07-01

### Fixed

- Refactor library data generation for improved readability

## [1.3.9] - 2025-06-28

### Fixed

- Improve path formatting in `makeLibraryData`

## [1.3.8] - 2025-06-27

### Fixed

- Update description formatting in `makeLibraryData`

## [1.3.7] - 2025-06-27

### Fixed

- Add `version` property to `fullPaletteData` in `makePaletteFullData`

## [1.3.6] - 2025-06-27

### Fixed

- Conditionally include `hex` and `gl` properties in `makeLibraryData`
- Accept `model` parameter in `makePaletteFullData`

## [1.3.5] - 2025-06-20

### Added

- Unique ID generation for data items; update `LibraryData` interface with `id` property

## [1.3.4] - 2025-06-20

### Changed

- Retrieve `styleId` based on name, path, and hex changes; remove `id` from `LibraryData`
- Remove `uid` package

## [1.3.3] - 2025-06-20

### Fixed

- Prioritize previous item ID in ID assignment logic

## [1.3.2] - 2025-06-20

### Added

- Unique IDs in library data with tests to verify `styleId` retrieval

### Fixed

- Update logic to find previous item in data handling
- Bump `brace-expansion` package versions

## [1.3.1] - 2025-06-20

### Changed

- Add unit test to retrieve `styleId`, `variableId`, `collectionId`, and `modeId` from `previousData`

## [1.3.0] - 2025-06-20

### Changed

- Refactor library data handling and update configuration types

## [1.2.2] - 2025-06-19

### Fixed

- Add `LibraryIds` type export in `index.ts`

## [1.2.1] - 2025-06-19

### Fixed

- Update `libraryIds` type in `FullConfiguration` to an array

## [1.2.0] - 2025-06-19

### Changed

- Remove `data` property from `FullConfiguration` and add `LibraryIds` interface

## [1.1.0] - 2025-06-14

### Added

- `searchForShadeVariableId` method and update `PaletteDataShadeItem` interface

### Fixed

- Remove unnecessary `data` property from `FullConfiguration`

## [1.0.26] - 2025-06-12

### Fixed

- Export `ExternalPalettes` and `ColourLovers` types in `index.ts`

## [1.0.25] - 2025-06-10

### Fixed

- Export `ShiftConfiguration` type in `index.ts`

## [1.0.24] - 2025-06-06

### Fixed

- Make `are_source_colors_locked` required in `ExternalPalettes` interface

## [1.0.23] - 2025-06-06

No substantive changes — version bump only.

## [1.0.22] - 2025-06-06

### Fixed

- Make `description`, `shift`, `color_space`, and `algorithm_version` required in `ExternalPalettes`

## [1.0.21] - 2025-06-06

### Fixed

- Add optional `shift` property to `ExternalPalettes` interface

## [1.0.20] - 2025-06-06

### Fixed

- Add missing properties to `ExternalPalettes` interface

## [1.0.19] - 2025-06-06

No substantive changes — version bump only.

## [1.0.18] - 2025-06-05

### Changed

- Add `.npmrc` file for public npm registry access

## [1.0.17] - 2025-06-05

### Fixed

- Make `meta` property optional in `Data` class constructor and definition

## [1.0.16] - 2025-06-05

### Changed

- Reorganize import statements across multiple files for consistency
- Add `import/order` ESLint rule and `eslint-plugin-import`
- Update README

## [1.0.15] - 2025-06-03

### Fixed

- Update easing type to `EasingConfiguration` in data tests

## [1.0.14] - 2025-06-03

### Fixed

- Set npm auth token before installing dependencies in workflow

## [1.0.13] - 2025-06-03

### Fixed

- Import `Easing` from `figmug-utils` and rename type to `EasingConfiguration`
- Add `@a_ng_d/figmug-utils` dependency
- Add newline at end of `package.json`

## [1.0.12] - 2025-06-03

### Fixed

- Update easing types to standardized naming conventions

## [1.0.11] - 2025-06-02

### Fixed

- Add missing `openedAt` date field in `MetaConfiguration`

## [1.0.10] - 2025-06-02

### Fixed

- Remove `version` property from `PaletteData` and `FullConfiguration` interfaces

## [1.0.9] - 2025-05-27

### Changed

- Update version identifier to `2025.06` in palette data

## [1.0.8] - 2025-05-27

### Fixed

- Update version in `fullPaletteData` to `2025.06`

## [1.0.7] - 2025-05-27

### Fixed

- Update return type of `getRecommendedUsage` for better type safety

## [1.0.6] - 2025-05-25

### Fixed

- Fix hex color validation regex in `mixColorsHex`
- Correct configuration import path

## [1.0.5] - 2025-05-25

### Changed

- Remove unused `ActionsList` interface and update action type definitions in `Color` class
- Update usage examples and enhance color manipulation features in README
- Bump `esbuild`, `@vitest/coverage-v8`, `vite`, and `vitest`

## [1.0.4] - 2025-05-24

### Changed

- Update keywords in `package.json`

## [1.0.3] - 2025-05-24

### Changed

- Improve code formatting and consistency in tests and README

## [1.0.2] - 2025-05-24

### Fixed

- Set `private` to `false` and restore metadata fields in `package.json`

## [1.0.1] - 2025-05-24

### Added

- Initial release: color handling, coverage tests, GitHub Actions npm publishing workflow
- Refactor type exports in `index.ts`
- Add type declaration for `apca-w3` module

[Unreleased]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.8.0...HEAD
[1.8.0]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.10...v1.8.0
[1.7.10]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.9...v1.7.10
[1.7.9]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.8...v1.7.9
[1.7.8]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.7...v1.7.8
[1.7.7]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.6...v1.7.7
[1.7.6]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.5...v1.7.6
[1.7.5]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.4...v1.7.5
[1.7.4]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.3...v1.7.4
[1.7.3]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.2...v1.7.3
[1.7.2]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.1...v1.7.2
[1.7.1]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.6.4...v1.7.0
[1.6.4]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.6.3...v1.6.4
[1.6.3]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.6.2...v1.6.3
[1.6.2]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.6.1...v1.6.2
[1.6.1]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.15...v1.6.0
[1.5.15]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.14...v1.5.15
[1.5.14]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.13...v1.5.14
[1.5.13]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.12...v1.5.13
[1.5.12]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.11...v1.5.12
[1.5.11]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.10...v1.5.11
[1.5.10]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.9...v1.5.10
[1.5.9]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.8...v1.5.9
[1.5.8]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.7...v1.5.8
[1.5.7]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.6...v1.5.7
[1.5.6]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.5...v1.5.6
[1.5.5]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.4...v1.5.5
[1.5.4]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.3...v1.5.4
[1.5.3]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.2...v1.5.3
[1.5.2]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.4.3...v1.5.0
[1.4.3]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.20...v1.4.0
[1.3.20]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.19...v1.3.20
[1.3.19]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.18...v1.3.19
[1.3.18]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.17...v1.3.18
[1.3.17]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.16...v1.3.17
[1.3.16]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.15...v1.3.16
[1.3.15]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.14...v1.3.15
[1.3.14]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.13...v1.3.14
[1.3.13]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.12...v1.3.13
[1.3.12]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.11...v1.3.12
[1.3.11]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.10...v1.3.11
[1.3.10]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.9...v1.3.10
[1.3.9]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.8...v1.3.9
[1.3.8]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.7...v1.3.8
[1.3.7]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.6...v1.3.7
[1.3.6]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.5...v1.3.6
[1.3.5]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.4...v1.3.5
[1.3.4]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.26...v1.1.0
[1.0.26]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.25...v1.0.26
[1.0.25]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.24...v1.0.25
[1.0.24]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.23...v1.0.24
[1.0.23]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.22...v1.0.23
[1.0.22]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.21...v1.0.22
[1.0.21]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.20...v1.0.21
[1.0.20]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.19...v1.0.20
[1.0.19]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.18...v1.0.19
[1.0.18]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.17...v1.0.18
[1.0.17]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.16...v1.0.17
[1.0.16]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.15...v1.0.16
[1.0.15]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.14...v1.0.15
[1.0.14]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.13...v1.0.14
[1.0.13]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.12...v1.0.13
[1.0.12]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.11...v1.0.12
[1.0.11]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.10...v1.0.11
[1.0.10]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/a-ng-d/utils-ui-color-palette/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/a-ng-d/utils-ui-color-palette/releases/tag/v1.0.1

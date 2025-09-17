# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0] - 2025-09-17

- Migrate to Chakra UI v3.
- Bump the version of the library to 3.0.0 so it is consistent with Chakra UI v3.
- Add minimum requirement for Chakra UI version 

## [0.3.1] - 2025-06-23

- Remove `dayzed` dependency and add internal implementation

## [0.3.0] - 2024-04-13

### Changed

- breaking: default `<input>` -> `<button>` so it can't be editable, old `<input>` as varaint will have an addtional trigger to ensure the correct sementic

### Added

- add `variant` to fix input trigger (PR #73)
- fix position inside modal
- allow selected styling while being disabled (kudos @namolnad PR #77)

## [0.2.10] - 2023-09-13

### Added

- add `calendarPanelProps`

## [0.2.9] - 2023-06-19

### Added

- add `dateHeadingProp` and `weekdayLabelProps` into `PropsConfigs` (kudos @Qadra42, PR #57)

## [0.2.8] - 2023-04-24

### Added

- add `disabledDates` props
- export `Calendar` components

### Fixed

- fix `hover disabled stylings`

## [0.2.7] - 2023-01-29

### Fixed

- change to `isDisabled` props

## [0.2.6] - 2022-12-21

### Added

- add `closeOnSelect` props

## [0.2.5] - 2022-11-08

### Added

- add `popoverCompProps` into `propsConfigs` (kudos @stieludv, PR #31)

## [0.2.4] - 2022-10-03

### Added

- add `firstDayOfWeek` into `configs` (kudos @biko8, PR #26)
- add `configs` in documentation

## [0.2.3] - 2022-08-22

### Fixed

- ArrowKeysReact.config isn't define
- remove arrow-keys-react dependency
- range picker input doesn't open when `space` key was pressed

## [0.2.2] - 2022-07-30

### Added

- add `minDate` and `maxDate` for `SingleDatepicker`

### Fixed

- focus issue when activate navigation button inside calendar

## [0.2.1] - 2022-07-11

### Added

- add `defaultIsOpen`
- doc clarification regarding the RangeDatepicker date state

### Fixed

- duplicate key error when labels use the same name (kudos @david-morris)

## [0.2.0] - 2022-04-29

### Changed

- breaking: update `dayOfMonthBtnProps` to allow customizable styles based on date button state
  ```ts
  dayOfMonthBtnProps = {
    defaultBtnProps,
    isInRangeBtnProp,
    selectedBtnProps,
    todayBtnProps,
  };
  ```

## [0.1.6] - 2022-03-25

### Added

- add `usePortal` to avoid parent's container clipping (kudos @adobs)

## [0.1.5] - 2022-01-27

### Changed

- allow `undefined` date (kudos @jcdogo)

## [0.1.4] - 2021-11-25

### Added

- add `inputProps` to customize `Input` element

### Changed

- breaking: `styleConfigs` -> `propsConfigs` for its true intent

### Fixed

- custom `selectedBg` was wrongly passed into `Button` component

## [0.1.3] - 2021-11-16

### Added

- Range Picker

### Changed

### Fixed

## [0.1.1] - 2021-07-29

### Added

- Single Picker

### Changed

### Fixed

# A Simple Chakra Datepicker based on Dayzed.

[![npm version](https://badge.fury.io/js/chakra-dayzed-datepicker.svg)](https://badge.fury.io/js/chakra-dayzed-datepicker) ![Downloads](https://img.shields.io/npm/dm/chakra-dayzed-datepicker.svg)


Every individual component is using Chakra UI. So it should respect all [Chakra UI](https://github.com/chakra-ui/chakra-ui) Configs without problem.

<img src="https://user-images.githubusercontent.com/35160613/141594524-35a0c536-d9fd-4528-bd56-f647b98755be.gif" height="50%"/>
<img src="https://user-images.githubusercontent.com/35160613/141594549-31f55369-6e0e-4818-9351-6f515e3f1f84.gif" height="50%"/>

The componenent itself has to use some `date` library

Highly recommend just copy/paste the source code from `/src` to customize however you want. 

## Install the dependency
Npm
```
npm i date-fns dayzed
```
```
npm i chakra-dayzed-datepicker
```

Yarn:
```
yarn add date-fns dayzed
```
```
yarn add chakra-dayzed-datepicker
```

## Basic usage
### Single
```jsx
  const [date, setDate] = useState(new Date());
  
  <SingleDatepicker
    name="date-input"
    date={date}
    onDateChange={setDate}
  />

```
### Range:
Note that this list will have one value during the selection process. Your system won't work if you try to control this directly as `[startDate, endDate]` because we'll try to set `selectedDates` to `[intermediateSelection]` and the length of the resulting `selectedDates` is meaningful to the datepicker.
```jsx
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  
  <RangeDatepicker
    selectedDates={selectedDates}
    onDateChange={setSelectedDates}
  />
```
### propsConfigs: 
`dateNavBtnProps` extends from `ButtonProps` of Chakra-UI
This allows you to override the default behavior however your want as long as supported by Chakra-UI.</br>

```ts
dayOfMonthBtnProps = {
  defaultBtnProps,
  isInRangeBtnProp,
  selectedBtnProps,
  todayBtnProps
}
```
`dayOfMonthBtnProps` allows you to customzie date btn style based on the state. </br>
Style precedence: `default` < `isInRange` < `seleted` < `today`.

`popoverCompProps` might be useful when you want to setup some simple styles like text color globally
```ts
popoverCompProps = {
  popoverContentProps,
  popoverBodyProps
}
```

<br/>Example:
```js
  propsConfigs={{
    dateNavBtnProps: {
      colorScheme: "blue",
      variant: "outline"
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        borderColor: "red.300",
        _hover: {
          background: 'blue.400',
        }
      },
      isInRangeBtnProps: {
        color: "yellow",
      },
      selectedBtnProps: {
        background: "blue.200",
        color: "green",
      },
      todayBtnProps: {
        background: "teal.400",
      }
    },
    inputProps: {
      size: "sm"
    },
    popoverCompProps: {
      popoverContentProps: {
        background: "gray.700",
        color: "white",
      },
    },
  }}
```

### configs: 
Non Chakra-related configurations :
```
  configs={{
    dateFormat: 'yyyy-MM-dd',
    dayNames: 'abcdefg'.split(''), // length of 7
    monthNames: 'ABCDEFGHIJKL'.split(''), // length of 12
    firstDayOfWeek: 2, // default is 0, the dayNames[0], which is Sunday if you don't specify your own dayNames,
  }}
```

### other props: 

Name                  | Type                   | Default value           | Description
----------------------|------------------------|-------------------------|--------------
name                  | string                 | undefined               | name attribute for `<input />` element
usePortal             | boolean                | undefined               | to prevent parent styles from clipping or hiding content
defaultIsOpen         | boolean                | undefined               | open the date panel at the beginning
minDate               | Date                   | undefined               | minimum date
maxDate               | Date                   | undefined               | maximum date

For version < `npm@0.1.6`:</br>
`dayOfMonthBtnProps` extends from `ButtonProps` and has only `selectedBg` support,
```ts
  dayOfMonthBtnProps: {
    borderColor: "red.300",
    selectedBg: "blue.200",
    _hover: {
      bg: 'blue.400',
    }
  },
```

# A Simple Chakra Datepicker based on Dayzed.

[![npm version](https://badge.fury.io/js/chakra-dayzed-datepicker.svg)](https://badge.fury.io/js/chakra-dayzed-datepicker) ![Downloads](https://img.shields.io/npm/dm/chakra-dayzed-datepicker.svg)


Every individual component is using Chakra UI. So it should respect all [Chakra UI](https://github.com/chakra-ui/chakra-ui) Configs without problem.

<img src="https://user-images.githubusercontent.com/35160613/141594524-35a0c536-d9fd-4528-bd56-f647b98755be.gif" height="50%"/>
<img src="https://user-images.githubusercontent.com/35160613/141594549-31f55369-6e0e-4818-9351-6f515e3f1f84.gif" height="50%"/>

The componenent itself has to use some `date` library

Highly recommend just copy/paste the source code from `/src` to customize however you want. 

## Install the dependency
```
npm i date-fns dayzed
```
```
npm i chakra-dayzed-datepicker
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
```jsx
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  
  <RangeDatepicker
    selectedDates={selectedDates}
    onDateChange={setSelectedDates}
  />
```
### StyleConfigs: 
`dateNavBtnProps` and `dayOfMonthBtnProps` extends from `ButtonProps` of Chakra-UI

<br/>Example:
```js
  styleConfigs={{
    dateNavBtnProps: {
      colorScheme: "blue",
      variant: "outline"
    },
    dayOfMonthBtnProps: {
      borderColor: "red.300",
      selectedBg: "blue.200",
      _hover: {
        bg: 'blue.400',
      }
    }
  }}
```
# A Simple Chakra Datepicker based on Dayzed.

Every individual component is using Chakra UI. So it should respect all Chakra UI Configs without problem.

![datepicker](https://user-images.githubusercontent.com/35160613/127602650-ca858edc-eb8d-4c9b-af70-d16f472a12dc.gif)


The componenent itself has to use some `date` library

Highly recommend just copy/paste the source code from `/src/index.tsx` to customize however you want. 

## Install the dependency
```
npm i date-fns dayzed
```
```
npm i chakra-dayzed-datepicker
```

## Basic usage
```js
  const [date, setDate] = useState(new Date());
  
  <SingleDatepicker
    name="date-input"
    date={date}
    onDateChange={setDate}
  />

```

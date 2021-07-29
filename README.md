# A Simple Chakra Datepicker based on Dayzed.

The componenent itself has to use some `date` library

Highly recommend just copy/paste the source code from `/scr/index.tsx` to customize however you want. 

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

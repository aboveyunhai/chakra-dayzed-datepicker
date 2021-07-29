# A Simple Chakra Datepicker based on Dayzed.

Highly recommend just copy/paste the source code from `/scr/index.tsx` to customize however you want. 

Basic usage: 
```js
  const [date, setDate] = useState(new Date());
  
  <SingleDatepicker
    name="date-input"
    date={date}
    onDateChange={setDate}
  />

```

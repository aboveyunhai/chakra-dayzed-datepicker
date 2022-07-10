import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, VStack } from '@chakra-ui/react';
import { SingleDatepicker, RangeDatepicker } from '../src';
import { useState } from 'react';

const App = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);
  return (
    <ChakraProvider>
      <VStack padding={'1em'} spacing={5} minHeight={'600px'}>
        <SingleDatepicker
          name="date-input"
          date={date}
          onDateChange={setDate}
        />
        <RangeDatepicker
          selectedDates={selectedDates}
          onDateChange={setSelectedDates}
        />
        <RangeDatepicker
          selectedDates={selectedDates}
          onDateChange={setSelectedDates}
          propsConfigs={{
            dateNavBtnProps: {
              colorScheme: 'blue',
              variant: 'outline',
            },
            dayOfMonthBtnProps: {
              defaultBtnProps: {
                borderColor: 'red.300',
                _hover: {
                  background: 'blue.400',
                },
              },
              isInRangeBtnProps: {
                color: 'yellow',
              },
              selectedBtnProps: {
                background: 'blue.200',
                color: 'green',
              },
              todayBtnProps: {
                background: 'teal.400',
              },
            },
            inputProps: {
              size: 'sm',
            },
          }}
        />
        <RangeDatepicker
          selectedDates={selectedDates}
          onDateChange={setSelectedDates}
          defaultIsOpen={true}
          configs={{
            dateFormat: 'yyyy-MM-dd',
            dayNames: Array(7).fill('day'),
            monthNames: Array(12).fill('month'),
          }}
        />
      </VStack>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

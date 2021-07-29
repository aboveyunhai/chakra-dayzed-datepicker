import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Center, ChakraProvider } from '@chakra-ui/react';
import { SingleDatepicker } from '../.';
import { useState } from 'react';

const App = () => {
  const [date, setDate] = useState(new Date());
  return (
    <ChakraProvider>
      <Center padding={'1em'} minHeight="500px">
        <SingleDatepicker
          name="date-input"
          date={date}
          onDateChange={setDate}
        />
      </Center>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

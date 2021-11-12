import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RangeDatepicker } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <RangeDatepicker
        selectedDates={[new Date(), new Date()]}
        onDateChange={() => {}}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

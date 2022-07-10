import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RangeDatepicker } from '../src';

describe('it', () => {
  it('check children without the same key', () => {
    var consoleError = jest.spyOn(global.console, 'error');
    const div = document.createElement('div');
    ReactDOM.render(
      <RangeDatepicker
        selectedDates={[new Date(), new Date()]}
        onDateChange={() => {}}
        defaultIsOpen={true}
        configs={{
          dateFormat: 'yyyy-MM-dd',
          monthNames: Array(12).fill('m'),
          dayNames: Array(7).fill('d'),
        }}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
    expect(consoleError).not.toHaveBeenCalled();
  });
});

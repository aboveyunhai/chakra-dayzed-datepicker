import * as React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { RangeDatepicker } from '../src';

describe('it', () => {
  it('check children without the same key', () => {
    var consoleError = jest.spyOn(global.console, 'error');
    const div = document.createElement('div');

    const root = createRoot(div);
    root.render(
      <RangeDatepicker
        selectedDates={[new Date(), new Date()]}
        onDateChange={() => {}}
        defaultIsOpen={true}
        configs={{
          dateFormat: 'yyyy-MM-dd',
          monthNames: Array(12).fill('m'),
          dayNames: Array(7).fill('d'),
        }}
      />
    );

    root.unmount();
    expect(consoleError).not.toHaveBeenCalled();
  });
});

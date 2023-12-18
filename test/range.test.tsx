import * as React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { RangeDatepicker } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');

    const root = createRoot(div);
    root.render(
      <RangeDatepicker
        selectedDates={[new Date(), new Date()]}
        onDateChange={() => {}}
      />
    );

    root.unmount();
  });
});

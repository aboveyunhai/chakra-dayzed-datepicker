import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SingleDatepicker } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SingleDatepicker date={new Date()} onDateChange={()=>{}}/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

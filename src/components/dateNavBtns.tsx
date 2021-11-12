import { Button, ButtonProps } from '@chakra-ui/react';
import { Calendar, GetBackForwardPropsOptions } from 'dayzed';
import React, { Fragment } from 'react';

export interface DatepickerBackBtnsProps {
  calendars: Calendar[];
  getBackProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
}

const DefaultBtnStyle: ButtonProps = {
  variant: 'ghost',
  size: 'sm',
};

export const DatepickerBackBtns: React.FC<DatepickerBackBtnsProps> = (
  props
) => {
  const { calendars, getBackProps } = props;
  return (
    <Fragment>
      <Button
        {...getBackProps({
          calendars,
          offset: 12,
        })}
        {...DefaultBtnStyle}
      >
        {'<<'}
      </Button>
      <Button {...getBackProps({ calendars })} {...DefaultBtnStyle}>
        {'<'}
      </Button>
    </Fragment>
  );
};

export interface DatepickerForwardBtnsProps {
  calendars: Calendar[];
  getForwardProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
}

export const DatepickerForwardBtns = (props: DatepickerForwardBtnsProps) => {
  const { calendars, getForwardProps } = props;
  return (
    <Fragment>
      <Button {...getForwardProps({ calendars })} {...DefaultBtnStyle}>
        {'>'}
      </Button>
      <Button
        {...getForwardProps({
          calendars,
          offset: 12,
        })}
        {...DefaultBtnStyle}
      >
        {'>>'}
      </Button>
    </Fragment>
  );
};

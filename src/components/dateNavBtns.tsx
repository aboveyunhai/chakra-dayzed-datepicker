import { Button, ButtonProps } from '@chakra-ui/react';
import { Calendar, GetBackForwardPropsOptions } from 'dayzed';
import React from 'react';
import {
  DatepickerProps,
  OnMonthViewChange,
} from '../utils/commonTypes';

export interface DatepickerBackBtnsProps extends DatepickerProps {
  calendars: Calendar[];
  getBackProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
  onMonthViewChange?: OnMonthViewChange;
}

const DefaultBtnStyle: ButtonProps = {
  variant: 'ghost',
  size: 'sm',
};

export const DatepickerBackBtns: React.FC<DatepickerBackBtnsProps> = (
  props
) => {
  const { calendars, getBackProps, onMonthViewChange } = props;
  const customBtnProps = props.propsConfigs?.dateNavBtnProps;

  const backProps = getBackProps({ calendars });
  const backPropsWithOffset = getBackProps({ calendars, offset: 12 });
  return (
    <>
      <Button
        {...backPropsWithOffset}
        {...DefaultBtnStyle}
        {...customBtnProps}
        onClick={(e) => {
          onMonthViewChange && onMonthViewChange({ calendars, offset: -12 })
          backPropsWithOffset.onClick(e)
        }}
      >
        {'<<'}
      </Button>
      <Button
        {...backProps}
        {...DefaultBtnStyle}
        {...customBtnProps}
        onClick={(e) => {
          onMonthViewChange && onMonthViewChange({ calendars, offset: -1 })
          backProps.onClick(e)
        }}
      >
        {'<'}
      </Button>
    </>
  );
};

export interface DatepickerForwardBtnsProps extends DatepickerProps {
  calendars: Calendar[];
  getForwardProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
  onMonthViewChange?: OnMonthViewChange;
}

export const DatepickerForwardBtns: React.FC<DatepickerForwardBtnsProps> = (
  props
) => {
  const { calendars, getForwardProps, onMonthViewChange } = props;
  const customBtnProps = props.propsConfigs?.dateNavBtnProps;

  const forwardProps = getForwardProps({ calendars });
  const forwardPropsWithOffset = getForwardProps({ calendars, offset: 12 });
  return (
    <>
      <Button
        {...forwardProps}
        {...DefaultBtnStyle}
        {...customBtnProps}
        onClick={(e) => {
          onMonthViewChange && onMonthViewChange({ calendars, offset: 1 })
          forwardProps.onClick(e)
        }}
      >
        {'>'}
      </Button>
      <Button
        {...forwardPropsWithOffset}
        {...DefaultBtnStyle}
        {...customBtnProps}
        onClick={(e) => {
          onMonthViewChange && onMonthViewChange({ calendars, offset: 12 })
          forwardPropsWithOffset.onClick(e)
        }}
      >
        {'>>'}
      </Button>
    </>
  );
};

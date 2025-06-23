/*
 * credit:
 * This is a Typescript rewrite of: https://github.com/deseretdigital/dayzed
 */

import { HTMLProps, useCallback, useMemo, useState } from 'react';
import {
  composeEventHandlers,
  subtractMonth,
  addMonth,
  isBackDisabled,
  isForwardDisabled,
  getCalendars,
  DateObj,
  Props,
  RenderProps,
} from './utils';

function isOffsetControlled(
  propOffset: number | undefined
): propOffset is number {
  return propOffset !== undefined;
}

function getOffset(propOffset: number | undefined, stateOffset: number) {
  return isOffsetControlled(propOffset) ? propOffset : stateOffset;
}

const defaultObj = {};

export interface GetDatePropsOptions extends HTMLProps<HTMLButtonElement> {
  dateObj: DateObj;
}

function getDateProps(
  onDateSelected: UserDayzedProps['onDateSelected'],
  // @ts-ignore
  { onClick, dateObj, ...rest } = defaultObj
) {
  return {
    // @ts-ignore
    onClick: composeEventHandlers(onClick, (event) => {
      onDateSelected(dateObj, event);
    }),
    disabled: !dateObj.selectable,
    'aria-label': dateObj.date.toDateString(),
    'aria-pressed': dateObj.selected,
    role: 'button',
    ...rest,
  };
}

type BackArg0 = {
  minDate: Date | undefined;
  offsetMonth: number;
  handleOffsetChanged: (newOffset: number) => void;
};

function getBackProps(
  { minDate, offsetMonth, handleOffsetChanged }: BackArg0,
  // @ts-ignore
  { onClick, offset = 1, calendars, ...rest } = {}
) {
  return {
    onClick: composeEventHandlers(onClick, () => {
      handleOffsetChanged(
        offsetMonth - subtractMonth({ calendars, offset, minDate })
      );
    }),
    disabled: isBackDisabled({ calendars, minDate }),
    'aria-label': `Go back ${offset} month${offset === 1 ? '' : 's'}`,
    ...rest,
  };
}

type ForwardArg0 = {
  maxDate: Date | undefined;
  offsetMonth: number;
  handleOffsetChanged: (newOffset: number) => void;
};

function getForwardProps(
  { maxDate, offsetMonth, handleOffsetChanged }: ForwardArg0,
  // @ts-ignore
  { onClick, offset = 1, calendars, ...rest } = {}
) {
  return {
    onClick: composeEventHandlers(onClick, () => {
      handleOffsetChanged(
        offsetMonth + addMonth({ calendars, offset, maxDate })
      );
    }),
    disabled: isForwardDisabled({ calendars, maxDate }),
    'aria-label': `Go forward ${offset} month${offset === 1 ? '' : 's'}`,
    ...rest,
  };
}

function onOffsetChangedDefault() {}

export type UserDayzedProps = Omit<Props, 'children' | 'render'>;
export function useDayzed({
  date = new Date(),
  maxDate,
  minDate,
  monthsToDisplay = 1,
  firstDayOfWeek = 0,
  showOutsideDays = false,
  offset,
  onDateSelected,
  onOffsetChanged = onOffsetChangedDefault,
  selected,
}: UserDayzedProps): RenderProps {
  const [stateOffset, setStateOffset] = useState(0);
  const offsetMonth = getOffset(offset, stateOffset);

  const calendars = useMemo(
    () =>
      getCalendars({
        date: date,
        selected,
        monthsToDisplay,
        minDate,
        maxDate,
        offset: offsetMonth,
        firstDayOfWeek,
        showOutsideDays,
      }),
    [
      date,
      firstDayOfWeek,
      maxDate,
      minDate,
      monthsToDisplay,
      offsetMonth,
      selected,
      showOutsideDays,
    ]
  );

  const handleOffsetChanged = useCallback(
    (newOffset: number) => {
      if (!isOffsetControlled(offset)) {
        setStateOffset(newOffset);
      }
      onOffsetChanged(newOffset);
    },
    [offset, onOffsetChanged]
  );

  const getDatePropsMemo = useMemo(
    () => getDateProps.bind(null, onDateSelected),
    [onDateSelected]
  );

  const getBackPropsMemo = useMemo(
    () =>
      getBackProps.bind(null, {
        minDate,
        offsetMonth,
        handleOffsetChanged,
      }),
    [handleOffsetChanged, minDate, offsetMonth]
  );

  const getForwardPropsMemo = useMemo(
    () =>
      getForwardProps.bind(null, {
        maxDate,
        offsetMonth,
        handleOffsetChanged,
      }),
    [handleOffsetChanged, maxDate, offsetMonth]
  );

  return {
    calendars,
    getDateProps: getDatePropsMemo,
    //@ts-ignore
    getBackProps: getBackPropsMemo,
    //@ts-ignore
    getForwardProps: getForwardPropsMemo,
  };
}

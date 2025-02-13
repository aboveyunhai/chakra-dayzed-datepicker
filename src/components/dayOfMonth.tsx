import { Button } from '@chakra-ui/react';
import { DateObj, RenderProps } from '../utils/dayzed/utils';
import React from 'react';
import { DatepickerProps, DayOfMonthBtnStyleProps } from '../utils/commonTypes';

interface DayOfMonthProps extends DatepickerProps {
  getDateProps: RenderProps['getDateProps'];
  isInRange: boolean;
  disabledDates?: Set<number>;
  dateObj: DateObj;
  onMouseEnterHighlight?: (date: Date) => void;
  styleBtnProps: DayOfMonthBtnStyleProps;
}

export const DayOfMonth: React.FC<DayOfMonthProps> = ({
  dateObj,
  isInRange,
  disabledDates,
  getDateProps,
  onMouseEnterHighlight,
  styleBtnProps,
}) => {
  const { selected, selectable, today, date } = dateObj;
  const disabled = !selectable || !!disabledDates?.has(dateObj.date.getTime());

  return (
    <Button
      {...getDateProps({
        dateObj: dateObj,
        disabled: disabled,
        onMouseEnter: () => {
          if (onMouseEnterHighlight) {
            onMouseEnterHighlight(dateObj.date);
          }
        },
      })}
      {...styleBtnProps.defaultBtnProps}
      {...(isInRange && !disabled && styleBtnProps.isInRangeBtnProps)}
      {...(selected && styleBtnProps.selectedBtnProps)}
      {...(today && styleBtnProps.todayBtnProps)}
    >
      {date.getDate()}
    </Button>
  );
};

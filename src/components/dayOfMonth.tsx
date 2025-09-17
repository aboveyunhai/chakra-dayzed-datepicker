import { Button, ButtonProps } from '@chakra-ui/react';
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

  const styleProps = React.useMemo(() => {
    let output: ButtonProps = { ...styleBtnProps.defaultBtnProps };
    if (isInRange && !disabled) {
      Object.assign(output, styleBtnProps.isInRangeBtnProps);
    }
    if (selected) {
      Object.assign(output, styleBtnProps.selectedBtnProps);
    }
    if (today) {
      Object.assign(output, styleBtnProps.todayBtnProps);
    }
    return output;
  }, [disabled, isInRange, selected, styleBtnProps, today]);

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
      {...styleProps}
    >
      {date.getDate()}
    </Button>
  );
};

import { Button } from '@chakra-ui/react';
import { DateObj, RenderProps } from 'dayzed';
import React from 'react';
import { DatepickerProps } from '../utils/commonTypes';

interface DayOfMonthProps extends DatepickerProps {
  renderProps: RenderProps;
  isInRange?: boolean | null;
  dateObj: DateObj;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const DayOfMonth: React.FC<DayOfMonthProps> = ({
  dateObj,
  propsConfigs,
  isInRange,
  renderProps,
  onMouseEnter,
}) => {
  const { date, selected, selectable, today } = dateObj;
  const { getDateProps } = renderProps;
  const { selectedBg, ...customBtnProps } =
    propsConfigs?.dayOfMonthBtnProps || {};
  let bg = selected || isInRange ? selectedBg || 'purple.200' : 'transparent';
  bg = !selectable ? customBtnProps?.disabledBg || 'red.200' : bg;
  const halfGap = 0.125; //default Chakra-gap-space-1 is 0.25rem
  return (
    <Button
      {...getDateProps({
        dateObj,
        disabled: !selectable,
        onMouseEnter: onMouseEnter,
      })}
      disabled={!selectable}
      size="sm"
      variant="outline"
      bg={bg}
      _hover={{
        bg: 'purple.400',
      }}
      // this intends to fill the visual gap from Grid to improve the UX
      // so the button active area is actually larger than when it's seen
      _after={{
        content: "''",
        position: 'absolute',
        top: `-${halfGap}rem`,
        left: `-${halfGap}rem`,
        bottom: `-${halfGap}rem`,
        right: `-${halfGap}rem`,
        borderWidth: `${halfGap}rem`,
        borderColor: 'transparent',
      }}
      {...customBtnProps}
      borderColor={
        today ? customBtnProps?.borderColor || 'blue.400' : 'transparent'
      }
    >
      {selectable ? date.getDate() : 'X'}
    </Button>
  );
};

import { Button } from '@chakra-ui/react';
import { DateObj, RenderProps } from 'dayzed';
import React from 'react';

interface DayOfMonthProps {
  renderProps: RenderProps;
  isInRange?: boolean | null;
  dateObj: DateObj;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const DayOfMonth: React.FC<DayOfMonthProps> = ({
  dateObj,
  isInRange,
  renderProps,
  onMouseEnter,
}) => {
  const { date, selected, selectable, today } = dateObj;
  const { getDateProps } = renderProps;
  let bg = selected || isInRange ? 'purple.200' : 'transparent';
  bg = !selectable ? 'red.200' : bg;
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
      borderColor={today ? 'blue.400' : 'transparent'}
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
    >
      {selectable ? date.getDate() : 'X'}
    </Button>
  );
};

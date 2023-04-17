import { Button, ButtonProps } from '@chakra-ui/react';
import { DateObj, RenderProps } from 'dayzed';
import React, { useMemo } from 'react';
import { DatepickerProps, DayOfMonthBtnStyleProps } from '../utils/commonTypes';

interface DayOfMonthProps extends DatepickerProps {
  renderProps: RenderProps;
  isInRange?: boolean | null;
  disabledDates?: Set<number>;
  dateObj: DateObj;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

type HoverStyle =
  | (ButtonProps['_hover'] & { _disabled: ButtonProps['_disabled'] })
  | undefined;

const halfGap = 0.125; //default Chakra-gap-space-1 is 0.25rem

export const DayOfMonth: React.FC<DayOfMonthProps> = ({
  dateObj,
  propsConfigs,
  isInRange,
  disabledDates,
  renderProps,
  onMouseEnter,
}) => {
  const { date, selected, selectable, today } = dateObj;
  const { getDateProps } = renderProps;
  const {
    defaultBtnProps,
    isInRangeBtnProps,
    selectedBtnProps,
    todayBtnProps,
  } = propsConfigs?.dayOfMonthBtnProps || {};
  const disabled = !selectable || disabledDates?.has(date.getTime());
  const styleBtnProps: DayOfMonthBtnStyleProps = useMemo(
    () => ({
      defaultBtnProps: {
        size: 'sm',
        variant: 'ghost',
        // this intends to fill the visual gap from Grid to improve the UX
        // so the button active area is actually larger than what it's seen
        ...defaultBtnProps,
        _after: {
          content: "''",
          position: 'absolute',
          top: `-${halfGap}rem`,
          left: `-${halfGap}rem`,
          bottom: `-${halfGap}rem`,
          right: `-${halfGap}rem`,
          borderWidth: `${halfGap}rem`,
          borderColor: 'transparent',
          ...defaultBtnProps?._after,
        },
        _hover: {
          bg: 'purple.400',
          ...defaultBtnProps?._hover,
          _disabled: {
            bg: 'gray.100',
            // temperory hack to persist the typescript checking
            ...(defaultBtnProps?._hover as HoverStyle)?._disabled,
          },
        },
      },
      isInRangeBtnProps: {
        background: 'purple.200',
        ...isInRangeBtnProps,
      },
      selectedBtnProps: {
        background: 'purple.200',
        ...selectedBtnProps,
      },
      todayBtnProps: {
        borderColor: 'blue.400',
        ...todayBtnProps,
      },
    }),
    [defaultBtnProps, isInRangeBtnProps, selectedBtnProps, todayBtnProps]
  );

  return (
    <Button
      {...getDateProps({
        dateObj,
        disabled: disabled,
        onMouseEnter: onMouseEnter,
      })}
      isDisabled={disabled}
      {...styleBtnProps.defaultBtnProps}
      {...(isInRange && !disabled && styleBtnProps.isInRangeBtnProps)}
      {...(selected && !disabled && styleBtnProps.selectedBtnProps)}
      {...(today && styleBtnProps.todayBtnProps)}
    >
      {date.getDate()}
    </Button>
  );
};

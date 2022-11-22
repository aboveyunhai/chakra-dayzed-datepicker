import { ButtonProps } from '@chakra-ui/button';
import { InputProps, PopoverBodyProps } from '@chakra-ui/react';
import { PopoverContentProps } from '@chakra-ui/react';
import { DateObj, Calendar } from 'dayzed';
import { ReactElement } from 'react';

export type OnDateSelected = (
  selectedDate: DateObj,
  event: React.SyntheticEvent<Element, Event>
) => void;

export interface DatepickerProps {
  minDate?: Date;
  maxDate?: Date;
  propsConfigs?: PropsConfigs;
}

export interface DayOfMonthBtnStyleProps {
  defaultBtnProps?: ButtonProps;
  isInRangeBtnProps?: ButtonProps;
  selectedBtnProps?: ButtonProps;
  todayBtnProps?: ButtonProps;
}

export interface PopoverCompProps {
  popoverContentProps?: PopoverContentProps;
  popoverBodyProps?: PopoverBodyProps;
}

export interface PropsConfigs {
  dateNavBtnProps?: ButtonProps;
  dayOfMonthBtnProps?: DayOfMonthBtnStyleProps;
  inputProps?: InputProps;
  popoverCompProps?: PopoverCompProps;
}

export interface DatepickerConfigs {
  dateFormat?: string;
  monthNames?: string[];
  dayNames?: string[];
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CalendarConfigs {
  dateFormat: string;
  monthNames: string[];
  dayNames: string[];
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export type DateObjExtended = DateObj & {
  isInRange: boolean | null | undefined;
};

export type CustomDateButtonProps = {
  dateProps: Record<string, unknown>;
  btnProps: DayOfMonthBtnStyleProps;
};

export type OnMonthViewChange = ({
  calendars,
  offset,
}: {
  calendars: Calendar[];
  offset: number;
}) => void;

export type CustomDateButton = (
  dateObj: DateObjExtended,
  { dateProps, btnProps }: CustomDateButtonProps
) => ReactElement;

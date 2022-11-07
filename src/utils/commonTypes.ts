import { ButtonProps } from '@chakra-ui/button';
import { InputProps } from '@chakra-ui/react';
import { PopoverProps } from '@chakra-ui/react'
import { DateObj } from 'dayzed';

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

export interface PropsConfigs {
  dateNavBtnProps?: ButtonProps;
  dayOfMonthBtnProps?: DayOfMonthBtnStyleProps;
  inputProps?: InputProps;
  popoverProps?: PopoverProps;
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

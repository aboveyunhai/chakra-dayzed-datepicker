import { ButtonProps } from '@chakra-ui/button';
import { BackgroundProps } from '@chakra-ui/react';
import { DateObj } from 'dayzed';

export type OnDateSelected = (
  selectedDate: DateObj,
  event: React.SyntheticEvent<Element, Event>
) => void;

export interface DatepickerProps {
  styleConfigs?: StyleConfigs;
}

export interface DayOfMonthBtnStyleProps extends ButtonProps {
  selectedBg?: BackgroundProps['bg'];
  disabledBg?: BackgroundProps['bg'];
}

export interface StyleConfigs {
  dateNavBtnProps?: ButtonProps;
  dayOfMonthBtnProps?: DayOfMonthBtnStyleProps;
}

export interface DatepickerConfigs {
  dateFormat: string;
  monthNames: string[];
  dayNames: string[];
}

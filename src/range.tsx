import React, { useState } from 'react';
import { Props as DayzedHookProps } from 'dayzed';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calendarUtils';
import {
  Flex,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { CalendarPanel } from './components/calendarPanel';
import {
  CalendarConfigs,
  CalendarLocaleConfigs,
  DatepickerConfigs,
  DatepickerLocaleConfigs,
  DatepickerProps,
  OnDateSelected,
  PropsConfigs,
} from './utils/commonTypes';
import { format } from 'date-fns';
import FocusLock from 'react-focus-lock';
import { daysForLocale, monthsForLocale } from './utils/calendarUtils';
import * as dateFnsLocales from 'date-fns/locale';

interface RangeCalendarPanelProps {
  dayzedHookProps: DayzedHookProps;
  configs: CalendarConfigs;
  propsConfigs?: PropsConfigs;
  selected?: Date | Date[];
}

export const RangeCalendarPanel: React.FC<RangeCalendarPanelProps> = ({
  dayzedHookProps,
  configs,
  propsConfigs,
  selected,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Calendar level
  const onMouseLeave = () => {
    setHoveredDate(null);
  };

  // Date level
  const onMouseEnterHighlight = (date: Date) => {
    if (!Array.isArray(selected) || !selected?.length) {
      return;
    }
    setHoveredDate(date);
  };

  const isInRange = (date: Date) => {
    if (!Array.isArray(selected) || !selected?.length) {
      return false;
    }
    let firstSelected = selected[0];
    if (selected.length === 2) {
      let secondSelected = selected[1];
      return firstSelected < date && secondSelected > date;
    } else {
      return (
        hoveredDate &&
        ((firstSelected < date && hoveredDate >= date) ||
          (date < firstSelected && date >= hoveredDate))
      );
    }
  };

  return (
    <Flex onMouseLeave={onMouseLeave}>
      <CalendarPanel
        dayzedHookProps={dayzedHookProps}
        configs={configs}
        propsConfigs={propsConfigs}
        isInRange={isInRange}
        onMouseEnterHighlight={onMouseEnterHighlight}
      />
    </Flex>
  );
};

export interface RangeDatepickerProps extends DatepickerProps {
  selectedDates: Date[];
  configs?: DatepickerConfigs | DatepickerLocaleConfigs;
  disabled?: boolean;
  defaultIsOpen?: boolean;
  closeOnSelect?: boolean;
  onDateChange: (date: Date[]) => void;
  id?: string;
  name?: string;
  usePortal?: boolean;
}

const DefaultConfigs: CalendarConfigs = {
  dateFormat: 'MM/dd/yyyy',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
  firstDayOfWeek: 0,
};

const DefaultLocaleConfigs: CalendarLocaleConfigs = {
  locale: 'en-US',
  month: 'short',
  day: 'short',
  firstDayOfWeek: 0,
};

export const RangeDatepicker: React.FC<RangeDatepickerProps> = ({
  configs,
  propsConfigs = {},
  id,
  name,
  usePortal,
  defaultIsOpen = false,
  closeOnSelect = true,
  ...props
}) => {
  const { selectedDates, minDate, maxDate, onDateChange, disabled } = props;

  // chakra popover utils
  const [dateInView, setDateInView] = useState(selectedDates[0] || new Date());
  const [offset, setOffset] = useState(0);
  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  let calendarConfigs: CalendarConfigs;

  if (configs !== undefined && 'locale' in configs) {
    let calendarLocaleConfigs = {
      ...DefaultLocaleConfigs,
      ...configs,
    };

    let currentDateFns =
      Object.values(dateFnsLocales)
        .filter((dateFns) => dateFns.code === calendarLocaleConfigs.locale)
        .pop() || dateFnsLocales.enUS;

    calendarConfigs = {
      dateFormat: currentDateFns.formatLong?.date({ width: 'short' }),
      dayNames: daysForLocale(
        calendarLocaleConfigs.locale,
        calendarLocaleConfigs.day
      ),
      monthNames: monthsForLocale(
        calendarLocaleConfigs.locale,
        calendarLocaleConfigs.month
      ),
      firstDayOfWeek: calendarLocaleConfigs.firstDayOfWeek,
    };
  } else {
    calendarConfigs = {
      ...DefaultConfigs,
      ...configs,
    };
  }

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDates[0] || new Date());
    setOffset(0);
  };

  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    if (!selectable) {
      return;
    }
    let newDates = [...selectedDates];
    if (selectedDates.length) {
      if (selectedDates.length === 1) {
        let firstTime = selectedDates[0];
        if (firstTime < date) {
          newDates.push(date);
        } else {
          newDates.unshift(date);
        }
        onDateChange(newDates);

        if (closeOnSelect) onClose();
        return;
      }

      if (newDates.length === 2) {
        onDateChange([date]);
        return;
      }
    } else {
      newDates.push(date);
      onDateChange(newDates);
    }
  };

  // eventually we want to allow user to freely type their own input and parse the input
  let intVal = selectedDates[0]
    ? `${format(selectedDates[0], calendarConfigs.dateFormat)}`
    : '';
  intVal += selectedDates[1]
    ? ` - ${format(selectedDates[1], calendarConfigs.dateFormat)}`
    : '';

  const PopoverContentWrapper = usePortal ? Portal : React.Fragment;

  return (
    <Popover
      placement="bottom-start"
      variant="responsive"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onPopoverClose}
      isLazy
    >
      <PopoverTrigger>
        <Input
          onKeyPress={(e) => {
            if (e.key === ' ' && !isOpen) {
              e.preventDefault();
              onOpen();
            }
          }}
          id={id}
          autoComplete="off"
          isDisabled={disabled}
          name={name}
          value={intVal}
          onChange={(e) => e.target.value}
          {...propsConfigs.inputProps}
        />
      </PopoverTrigger>
      <PopoverContentWrapper>
        <PopoverContent
          width="100%"
          {...propsConfigs?.popoverCompProps?.popoverContentProps}
        >
          <PopoverBody {...propsConfigs.popoverCompProps?.popoverBodyProps}>
            <FocusLock>
              <RangeCalendarPanel
                dayzedHookProps={{
                  onDateSelected: handleOnDateSelected,
                  selected: selectedDates,
                  monthsToDisplay: 2,
                  date: dateInView,
                  minDate: minDate,
                  maxDate: maxDate,
                  offset: offset,
                  onOffsetChanged: setOffset,
                  firstDayOfWeek: calendarConfigs.firstDayOfWeek,
                }}
                configs={calendarConfigs}
                propsConfigs={propsConfigs}
                selected={selectedDates}
              />
            </FocusLock>
          </PopoverBody>
        </PopoverContent>
      </PopoverContentWrapper>
    </Popover>
  );
};

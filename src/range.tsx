import React, { useState } from 'react';
import { Props as DayzedHookProps } from 'dayzed';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calanderUtils';
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
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
  PropsConfigs,
} from './utils/commonTypes';
import { format } from 'date-fns';
import FocusLock from 'react-focus-lock';

interface RangeCalendarPanelProps {
  dayzedHookProps: DayzedHookProps;
  configs: DatepickerConfigs;
  propsConfigs?: PropsConfigs;
  selected?: Date | Date[];
}

const RangeCalendarPanel: React.FC<RangeCalendarPanelProps> = ({
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
  configs?: DatepickerConfigs;
  disabled?: boolean;
  defaultIsOpen?: boolean;
  onDateChange: (date: Date[]) => void;
  id?: string;
  name?: string;
  usePortal?: boolean;
}

const DefaultConfigs = {
  dateFormat: 'MM/dd/yyyy',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
};

export const RangeDatepicker: React.FC<RangeDatepickerProps> = ({
  configs = DefaultConfigs,
  propsConfigs = {},
  id,
  name,
  usePortal,
  defaultIsOpen = false,
  ...props
}) => {
  const { selectedDates, minDate, maxDate, onDateChange, disabled } = props;

  // chakra popover utils
  const [dateInView, setDateInView] = useState(selectedDates[0] || new Date());
  const [offset, setOffset] = useState(0);
  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  // dayzed utils
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
      } else if (newDates.length === 2) {
        onDateChange([date]);
      }
    } else {
      newDates.push(date);
      onDateChange(newDates);
    }
  };

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDates[0] || new Date());
    setOffset(0);
  };

  // eventually we want to allow user to freely type their own input and parse the input
  let intVal = selectedDates[0]
    ? `${format(selectedDates[0], configs.dateFormat)}`
    : '';
  intVal += selectedDates[1]
    ? ` - ${format(selectedDates[1], configs.dateFormat)}`
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
        <PopoverContent width="100%">
          <PopoverBody>
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
                }}
                configs={configs}
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

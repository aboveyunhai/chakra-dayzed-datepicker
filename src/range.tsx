import React, { useRef, useState } from 'react';
import { RenderProps, useDayzed } from 'dayzed';
import ArrowKeysReact from 'arrow-keys-react';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calanderUtils';
import {
  Flex,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useOutsideClick,
} from '@chakra-ui/react';
import { CalendarPanel, DatepickerConfigs } from './components/calendarPanel';
import { OnDateSelected } from './utils/commonTypes';
import { format } from 'date-fns';

interface RangeCalendarPanelProps {
  configs: DatepickerConfigs;
  selected?: Date | Date[];
  renderProps: RenderProps;
}

const RangeCalendarPanel: React.FC<RangeCalendarPanelProps> = ({
  configs,
  selected,
  renderProps,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const { calendars } = renderProps;

  // looking for a useRef() approach to replace it
  const getKeyOffset = (num: number) => {
    const e = document.activeElement;
    let buttons = document.querySelectorAll('button');
    buttons.forEach((el, i) => {
      const newNodeKey = i + num;
      if (el === e) {
        if (newNodeKey <= buttons.length - 1 && newNodeKey >= 0) {
          buttons[newNodeKey].focus();
        } else {
          buttons[0].focus();
        }
      }
    });
  };

  ArrowKeysReact.config({
    left: () => {
      getKeyOffset(-1);
    },
    right: () => {
      getKeyOffset(1);
    },
    up: () => {
      getKeyOffset(-7);
    },
    down: () => {
      getKeyOffset(7);
    },
  });

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

  if (!(calendars.length > 0)) return null;

  return (
    <Flex {...ArrowKeysReact.events} onMouseLeave={onMouseLeave}>
      <CalendarPanel
        renderProps={renderProps}
        configs={configs}
        isInRange={isInRange}
        onMouseEnterHighlight={onMouseEnterHighlight}
      />
    </Flex>
  );
};

export interface RangeDatepickerProps {
  initDate?: Date;
  selectedDates: Date[];
  minDate?: Date;
  maxDate?: Date;
  configs?: DatepickerConfigs;
  disabled?: boolean;
  onDateChange: (date: Date[]) => void;
  id?: string;
  name?: string;
}

const DefaultConfigs = {
  dateFormat: 'MM/dd/yyyy',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
};

export const RangeDatepicker: React.FC<RangeDatepickerProps> = ({
  configs = DefaultConfigs,
  initDate = new Date(),
  id,
  name,
  ...props
}) => {
  const { selectedDates, minDate, maxDate, onDateChange, disabled } = props;

  // chakra popover utils
  const ref = useRef<HTMLElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const [popoverOpen, setPopoverOpen] = useState(false);

  useOutsideClick({
    ref: ref,
    handler: () => setPopoverOpen(false),
  });

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

  const dayzedData = useDayzed({
    onDateSelected: handleOnDateSelected,
    selected: selectedDates,
    monthsToDisplay: 2,
    date: initDate,
    minDate: minDate,
    maxDate: maxDate,
  });

  // eventually we want to allow user to freely type their own input and parse the input
  let intVal = selectedDates[0]
    ? `${format(selectedDates[0], configs.dateFormat)}`
    : '';
  intVal += selectedDates[1]
    ? ` - ${format(selectedDates[1], configs.dateFormat)}`
    : '';

  return (
    <Popover
      placement="bottom-start"
      variant="responsive"
      isOpen={popoverOpen}
      onClose={() => setPopoverOpen(false)}
      initialFocusRef={initialFocusRef}
      isLazy
    >
      <PopoverTrigger>
        <Input
          id={id}
          autoComplete="off"
          isDisabled={disabled}
          ref={initialFocusRef}
          onClick={() => setPopoverOpen(!popoverOpen)}
          name={name}
          value={intVal}
          onChange={(e) => e.target.value}
        />
      </PopoverTrigger>
      <PopoverContent ref={ref} width="100%">
        <PopoverBody>
          <RangeCalendarPanel
            renderProps={dayzedData}
            configs={configs}
            selected={selectedDates}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

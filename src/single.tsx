import React, { useRef, useState } from 'react';
import {
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useOutsideClick,
} from '@chakra-ui/react';
import { useDayzed } from 'dayzed';
import { format } from 'date-fns';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calanderUtils';
import { CalendarPanel } from './components/calendarPanel';
import {
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
} from './utils/commonTypes';

export interface SingleDatepickerProps extends DatepickerProps {
  date: Date;
  configs?: DatepickerConfigs;
  disabled?: boolean;
  onDateChange: (date: Date) => void;
  id?: string;
  name?: string;
}

const DefaultConfigs = {
  dateFormat: 'yyyy-MM-dd',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
};

export const SingleDatepicker: React.FC<SingleDatepickerProps> = ({
  configs = DefaultConfigs,
  styleConfigs,
  ...props
}) => {
  const { date, name, disabled, onDateChange, id } = props;

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
    if (!selectable) return;
    if (date instanceof Date && !isNaN(date.getTime())) {
      onDateChange(date);
      setPopoverOpen(false);
      return;
    }
  };

  const dayzedData = useDayzed({
    showOutsideDays: true,
    onDateSelected: handleOnDateSelected,
    selected: date,
  });

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
          value={format(date, configs.dateFormat)}
          onChange={(e) => e.target.value}
        />
      </PopoverTrigger>
      <PopoverContent ref={ref} width="100%">
        <PopoverBody>
          <CalendarPanel
            renderProps={dayzedData}
            configs={configs}
            styleConfigs={styleConfigs}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

import React, { useState } from 'react';
import {
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import FocusLock from 'react-focus-lock';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calanderUtils';
import { CalendarPanel } from './components/calendarPanel';
import {
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
} from './utils/commonTypes';

export interface SingleDatepickerProps extends DatepickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  configs?: DatepickerConfigs;
  disabled?: boolean;
  defaultIsOpen?: boolean;
  id?: string;
  name?: string;
  usePortal?: boolean;
}

const DefaultConfigs = {
  dateFormat: 'yyyy-MM-dd',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
};

export const SingleDatepicker: React.FC<SingleDatepickerProps> = ({
  configs = DefaultConfigs,
  propsConfigs,
  usePortal,
  defaultIsOpen = false,
  ...props
}) => {
  const {
    date: selectedDate,
    name,
    disabled,
    onDateChange,
    id,
    minDate,
    maxDate,
  } = props;

  const [dateInView, setDateInView] = useState(selectedDate);
  const [offset, setOffset] = useState(0);

  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  const onPopoverClose = () => {
    onClose();
    if (true) {
      setDateInView(selectedDate);
      setOffset(0);
    }
  };

  // dayzed utils
  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    if (!selectable) return;
    if (date instanceof Date && !isNaN(date.getTime())) {
      onDateChange(date);
      onClose();
      return;
    }
  };

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
          value={selectedDate ? format(selectedDate, configs.dateFormat) : ''}
          onChange={(e) => e.target.value}
          {...propsConfigs?.inputProps}
        />
      </PopoverTrigger>
      <PopoverContentWrapper>
        <PopoverContent width="100%">
          <PopoverBody>
            <FocusLock>
              <CalendarPanel
                dayzedHookProps={{
                  showOutsideDays: true,
                  onDateSelected: handleOnDateSelected,
                  selected: selectedDate,
                  date: dateInView,
                  minDate: minDate,
                  maxDate: maxDate,
                  offset: offset,
                  onOffsetChanged: setOffset,
                }}
                configs={configs}
                propsConfigs={propsConfigs}
              />
            </FocusLock>
          </PopoverBody>
        </PopoverContent>
      </PopoverContentWrapper>
    </Popover>
  );
};

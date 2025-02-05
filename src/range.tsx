import React, { useState } from 'react';
import { Props as DayzedHookProps } from 'dayzed';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calanderUtils';
import {
  Button,
  Flex,
  Input,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { CalendarPanel } from './components/calendarPanel';
import {
  CalendarConfigs,
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
  PropsConfigs,
} from './utils/commonTypes';
import { format } from 'date-fns';
import FocusLock from 'react-focus-lock';
import { VariantProps } from './single';
import { CalendarIcon } from './components/calendarIcon';

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

  const isFirstSelectedDate = (date: Date): boolean => {
    if (!Array.isArray(selected) || selected.length === 0) {
      return false;
    }

    if (selected.length === 1) {
      return hoveredDate ? selected[0].getTime() < hoveredDate.getTime() : false;
    }

    return selected.length > 0 && selected[0].getTime() === date.getTime();
  };

const isLastSelectedDate = (date: Date): boolean => {
  if (!Array.isArray(selected) || selected.length === 0) {
    return false;
  }

  if (selected.length === 1) {
    return hoveredDate ? selected[0].getTime() > hoveredDate.getTime() : false;
  }

  return selected[selected.length - 1].getTime() === date.getTime();
};

  return (
    <Flex onMouseLeave={onMouseLeave}>
      <CalendarPanel
        dayzedHookProps={dayzedHookProps}
        configs={configs}
        propsConfigs={propsConfigs}
        isInRange={isInRange}
        onMouseEnterHighlight={onMouseEnterHighlight}
        isFirstSelectedDate={isFirstSelectedDate}
        isLastSelectedDate={isLastSelectedDate}
      />
    </Flex>
  );
};

interface RangeProps extends DatepickerProps {
  selectedDates: Date[];
  configs?: DatepickerConfigs;
  disabled?: boolean;
  children?: (value: Date[]) => React.ReactNode;
  defaultIsOpen?: boolean;
  closeOnSelect?: boolean;
  onDateChange: (date: Date[]) => void;
  id?: string;
  name?: string;
  usePortal?: boolean;
  portalRef?: React.MutableRefObject<null>;
}

export type RangeDatepickerProps = RangeProps & VariantProps;

const DefaultConfigs: Required<DatepickerConfigs> = {
  dateFormat: 'MM/dd/yyyy',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
  firstDayOfWeek: 0,
  monthsToDisplay: 2,
};

const defaultProps = {
  defaultIsOpen: false,
  closeOnSelect: true,
  triggerVariant: 'default' as const,
};

export const RangeDatepicker: React.FC<RangeDatepickerProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  const {
    configs,
    propsConfigs,
    id,
    name,
    usePortal,
    portalRef,
    defaultIsOpen,
    closeOnSelect,
    selectedDates,
    minDate,
    maxDate,
    onDateChange,
    disabled,
    children,
    triggerVariant,
  } = mergedProps;

  // chakra popover utils
  const [dateInView, setDateInView] = useState(selectedDates[0] || new Date());
  const [offset, setOffset] = useState(0);
  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  const Icon =
    mergedProps.triggerVariant === 'input' && mergedProps.triggerIcon ? (
      mergedProps.triggerIcon
    ) : (
      <CalendarIcon />
    );

  const datepickerConfigs = {
    ...DefaultConfigs,
    ...configs,
  };

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
    ? `${format(selectedDates[0], datepickerConfigs.dateFormat)}`
    : `${datepickerConfigs.dateFormat}`;
  intVal += selectedDates[1]
    ? ` - ${format(selectedDates[1], datepickerConfigs.dateFormat)}`
    : ` - ${datepickerConfigs.dateFormat}`;

  const PopoverContentWrapper = usePortal ? Portal : React.Fragment;

  return (
    <Popover
      id={id}
      placement="bottom-start"
      variant="responsive"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onPopoverClose}
      isLazy
    >
      {!children && triggerVariant === 'default' ? (
        <PopoverTrigger>
          <Button
            type="button"
            variant={'outline'}
            lineHeight={1}
            paddingX="1rem"
            fontSize={'sm'}
            disabled={disabled}
            {...propsConfigs?.triggerBtnProps}
          >
            {intVal}
          </Button>
        </PopoverTrigger>
      ) : null}
      {!children && triggerVariant === 'input' ? (
        <Flex position="relative" alignItems={'center'}>
          <PopoverAnchor>
            <Input
              id={id}
              onKeyPress={(e) => {
                if (e.key === ' ' && !isOpen) {
                  e.preventDefault();
                  onOpen();
                }
              }}
              autoComplete="off"
              width={'16rem'}
              paddingRight={'2.5rem'}
              isDisabled={disabled}
              name={name}
              value={intVal}
              onChange={(e) => e.target.value}
              {...propsConfigs?.inputProps}
            />
          </PopoverAnchor>
          <PopoverTrigger>
            <Button
              position="absolute"
              variant={'ghost'}
              right="0"
              size="sm"
              marginRight="5px"
              zIndex={1}
              type="button"
              disabled={disabled}
              padding={'8px'}
              {...propsConfigs?.triggerIconBtnProps}
            >
              {Icon}
            </Button>
          </PopoverTrigger>
        </Flex>
      ) : null}
      {children ? children(selectedDates) : null}
      <PopoverContentWrapper
        {...(usePortal ? { containerRef: portalRef } : {})}
      >
        <PopoverContent
          width="100%"
          {...propsConfigs?.popoverCompProps?.popoverContentProps}
        >
          <PopoverBody {...propsConfigs?.popoverCompProps?.popoverBodyProps}>
            <FocusLock>
              <RangeCalendarPanel
                dayzedHookProps={{
                  onDateSelected: handleOnDateSelected,
                  selected: selectedDates,
                  monthsToDisplay: datepickerConfigs.monthsToDisplay,
                  date: dateInView,
                  minDate: minDate,
                  maxDate: maxDate,
                  offset: offset,
                  onOffsetChanged: setOffset,
                  firstDayOfWeek: datepickerConfigs.firstDayOfWeek,
                }}
                configs={datepickerConfigs}
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

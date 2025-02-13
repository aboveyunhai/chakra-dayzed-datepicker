import React from 'react';
import { Props as DayzedHookProps } from './utils/dayzed/utils';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calanderUtils';
import { Button, Flex, Input } from '@chakra-ui/react';
import { CalendarPanel } from './components/calendarPanel';
import {
  CalendarConfigs,
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
  PropsConfigs,
} from './utils/commonTypes';
import { format } from 'date-fns';
import { VariantProps } from './single';
import { CalendarIcon } from './components/calendar-icon';
import {
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from './components/snippets/popover';

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
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);

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

  const checkInRange = (date: Date) => {
    if (!Array.isArray(selected) || !selected?.length) {
      return false;
    }
    let firstSelected = selected[0];
    if (selected.length === 2) {
      let secondSelected = selected[1];
      return firstSelected < date && secondSelected > date;
    } else {
      return (
        !!hoveredDate &&
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
        checkInRange={checkInRange}
        onMouseEnterHighlight={onMouseEnterHighlight}
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

export const RangeDatepicker: React.FC<RangeDatepickerProps> = ({
  configs,
  id,
  name,
  selectedDates,
  minDate,
  maxDate,
  onDateChange,
  disabled,
  children,
  usePortal = false,
  portalRef,
  defaultIsOpen = false,
  closeOnSelect = true,
  ...restProps
}) => {
  // chakra popover utils
  const [dateInView, setDateInView] = React.useState(
    selectedDates[0] || new Date()
  );
  const [offset, setOffset] = React.useState(0);
  const [open, setOpen] = React.useState(defaultIsOpen);

  const Icon =
    restProps.triggerVariant === 'input'
      ? restProps.triggerIcon ?? <CalendarIcon />
      : null;

  const datepickerConfigs = {
    ...DefaultConfigs,
    ...configs,
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

        if (closeOnSelect) {
          setOpen(false);
        }
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

  return (
    <PopoverRoot
      id={id}
      positioning={{
        placement: 'bottom-start',
      }}
      open={open}
      onOpenChange={(e) => {
        if (e.open) {
          setOpen(e.open);
        } else {
          setOpen(e.open);
          setDateInView(selectedDates[0] || new Date());
          setOffset(0);
        }
      }}
      lazyMount={true}
      unmountOnExit={true}
    >
      {!children && (restProps.triggerVariant ?? 'default') === 'default' ? (
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={'outline'}
            lineHeight={1}
            paddingX="1rem"
            disabled={disabled}
            fontSize={'sm'}
            rounded={'md'}
            {...restProps.propsConfigs?.triggerBtnProps}
          >
            {intVal}
          </Button>
        </PopoverTrigger>
      ) : null}
      {!children && restProps.triggerVariant === 'input' ? (
        <Flex position="relative" alignItems={'center'}>
          <PopoverAnchor>
            <Input
              id={id}
              onKeyUp={(e) => {
                if (e.key === ' ' && !open) {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
              autoComplete="off"
              width={'16rem'}
              paddingRight={'2.5rem'}
              disabled={disabled}
              name={name}
              value={intVal}
              onChange={(e) => e.target.value}
              {...restProps.propsConfigs?.inputProps}
            />
          </PopoverAnchor>
          <PopoverTrigger asChild>
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
              {...restProps.propsConfigs?.triggerIconBtnProps}
            >
              {Icon}
            </Button>
          </PopoverTrigger>
        </Flex>
      ) : null}
      {children ? children(selectedDates) : null}
      <PopoverContent
        width="100%"
        portalled={usePortal}
        portalRef={portalRef}
        {...restProps.propsConfigs?.popoverCompProps?.popoverContentProps}
      >
        <PopoverBody
          {...restProps.propsConfigs?.popoverCompProps?.popoverBodyProps}
        >
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
            propsConfigs={restProps.propsConfigs}
            selected={selectedDates}
          />
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

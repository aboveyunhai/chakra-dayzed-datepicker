import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Input,
  InputProps,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { format, parse, startOfDay } from 'date-fns';
import FocusLock from 'react-focus-lock';
import { Month_Names_Short, Weekday_Names_Short } from './utils/calanderUtils';
import { CalendarPanel } from './components/calendarPanel';
import {
  CalendarConfigs,
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
  PropsConfigs,
} from './utils/commonTypes';
import { CalendarIcon } from './components/calendarIcon';

interface SingleProps extends DatepickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  configs?: DatepickerConfigs;
  disabled?: boolean;
  /**
   * disabledDates: `Uses startOfDay as comparison`
   */
  disabledDates?: Set<number>;
  children?: (value: Date | undefined) => React.ReactNode;
  defaultIsOpen?: boolean;
  closeOnSelect?: boolean;
  id?: string;
  name?: string;
  usePortal?: boolean;
}

export type VariantProps =
  | {
      propsConfigs?: PropsConfigs;
    }
  | {
      triggerVariant: 'default';
      propsConfigs?: PropsConfigs;
    }
  | {
      triggerVariant: 'input';
      triggerIcon?: React.ReactNode;
      propsConfigs?: Omit<PropsConfigs, 'triggerBtnProps'> & {
        inputProps?: InputProps;
        triggerIconBtnProps?: ButtonProps;
      };
    };

export type SingleDatepickerProps = SingleProps & VariantProps;

const DefaultConfigs: CalendarConfigs = {
  dateFormat: 'yyyy-MM-dd',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
  firstDayOfWeek: 0,
};

const defaultProps = {
  defaultIsOpen: false,
  closeOnSelect: true,
  triggerVariant: 'default' as const,
};

export const SingleDatepicker: React.FC<SingleDatepickerProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  const {
    date: selectedDate,
    name,
    disabled,
    onDateChange,
    id,
    minDate,
    maxDate,
    configs,
    usePortal,
    disabledDates,
    defaultIsOpen,
    triggerVariant,
    propsConfigs,
    closeOnSelect,
    children,
  } = mergedProps;

  const [dateInView, setDateInView] = useState(selectedDate);
  const [offset, setOffset] = useState(0);

  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  const Icon =
    mergedProps.triggerVariant === 'input' && mergedProps.triggerIcon ? (
      mergedProps.triggerIcon
    ) : (
      <CalendarIcon />
    );

  const calendarConfigs: CalendarConfigs = {
    ...DefaultConfigs,
    ...configs,
  };
  const [tempInput, setInputVal] = useState(
    selectedDate ? format(selectedDate, calendarConfigs.dateFormat) : ''
  );

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDate);
    setOffset(0);
  };

  // dayzed utils
  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    if (!selectable) return;
    if (date instanceof Date && !isNaN(date.getTime())) {
      onDateChange(date);
      if (closeOnSelect) onClose();
      return;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
    const newDate = parse(
      event.target.value,
      calendarConfigs.dateFormat,
      new Date()
    );
    if (!(newDate instanceof Date && !isNaN(newDate.getTime()))) {
      return;
    }
    const isDisabled = disabledDates?.has(startOfDay(newDate).getTime());
    if (isDisabled) return;
    onDateChange(newDate);
  };

  const PopoverContentWrapper = usePortal ? Portal : React.Fragment;

  useEffect(() => {
    if (selectedDate) {
      setInputVal(format(selectedDate, calendarConfigs.dateFormat));
    }
  }, [selectedDate, calendarConfigs.dateFormat]);

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
            disabled={disabled}
            {...propsConfigs?.triggerBtnProps}
          >
            {selectedDate
              ? format(selectedDate, calendarConfigs.dateFormat)
              : ''}
          </Button>
        </PopoverTrigger>
      ) : null}
      {!children && triggerVariant === 'input' ? (
        <Flex position="relative" alignItems={'center'}>
          <PopoverAnchor>
            <Input
              onKeyPress={(e) => {
                if (e.key === ' ' && !isOpen) {
                  e.preventDefault();
                  onOpen();
                }
              }}
              id={id}
              autoComplete="off"
              disabled={disabled}
              isDisabled={disabled}
              name={name}
              value={tempInput}
              onChange={handleInputChange}
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
      {children ? children(selectedDate) : null}
      <PopoverContentWrapper>
        <PopoverContent
          width="100%"
          {...propsConfigs?.popoverCompProps?.popoverContentProps}
        >
          <PopoverBody {...propsConfigs?.popoverCompProps?.popoverBodyProps}>
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
                  firstDayOfWeek: calendarConfigs.firstDayOfWeek,
                }}
                configs={calendarConfigs}
                propsConfigs={propsConfigs}
                disabledDates={disabledDates}
              />
            </FocusLock>
          </PopoverBody>
        </PopoverContent>
      </PopoverContentWrapper>
    </Popover>
  );
};

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
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
  portalRef?: React.MutableRefObject<null>;
}

export type VariantProps =
  | {
      triggerVariant?: 'default';
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

const DefaultConfigs: Required<DatepickerConfigs> = {
  dateFormat: 'yyyy-MM-dd',
  monthNames: Month_Names_Short,
  dayNames: Weekday_Names_Short,
  firstDayOfWeek: 0,
  monthsToDisplay: 1,
};

export const SingleDatepicker: React.FC<SingleDatepickerProps> = ({
  date: selectedDate,
  name,
  disabled,
  onDateChange,
  id,
  minDate,
  maxDate,
  configs,
  usePortal,
  portalRef,
  disabledDates,
  defaultIsOpen = false,
  closeOnSelect = true,
  children,
  ...restProps
}) => {
  const [dateInView, setDateInView] = useState(selectedDate);
  const [offset, setOffset] = useState(0);
  const internalUpdate = useRef(false);

  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  const Icon =
    restProps.triggerVariant === 'input'
      ? restProps?.triggerIcon ?? <CalendarIcon />
      : null;

  const datepickerConfigs = useMemo(
    () => ({
      ...DefaultConfigs,
      ...configs,
    }),
    [configs]
  );

  const [tempInput, setInputVal] = useState(
    selectedDate ? format(selectedDate, datepickerConfigs.dateFormat) : ''
  );

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDate);
    setOffset(0);
  };

  // dayzed utils
  const handleOnDateSelected: OnDateSelected = useCallback(
    ({ selectable, date }) => {
      if (!selectable) return;
      if (date instanceof Date && !isNaN(date.getTime())) {
        internalUpdate.current = true;
        onDateChange(date);
        setInputVal(date ? format(date, datepickerConfigs.dateFormat) : '');
        if (closeOnSelect) onClose();
        return;
      }
    },
    [closeOnSelect, datepickerConfigs.dateFormat, onClose, onDateChange]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      internalUpdate.current = true;
      setInputVal(event.target.value);
      const newDate = parse(
        event.target.value,
        datepickerConfigs.dateFormat,
        new Date()
      );
      if (!(newDate instanceof Date && !isNaN(newDate.getTime()))) {
        return;
      }
      const isDisabled = disabledDates?.has(startOfDay(newDate).getTime());
      if (isDisabled) return;
      onDateChange(newDate);
      setDateInView(newDate);
    },
    [datepickerConfigs.dateFormat, disabledDates, onDateChange]
  );

  const PopoverContentWrapper = usePortal ? Portal : React.Fragment;

  useEffect(() => {
    if (internalUpdate.current) {
      internalUpdate.current = false;
      return;
    }
    setInputVal(
      typeof selectedDate !== 'undefined'
        ? format(selectedDate, datepickerConfigs.dateFormat)
        : ''
    );
    setDateInView(selectedDate);
  }, [datepickerConfigs.dateFormat, selectedDate]);

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
      {!children && (restProps.triggerVariant ?? 'default') === 'default' ? (
        <PopoverTrigger>
          <Button
            type="button"
            variant={'outline'}
            lineHeight={1}
            paddingX="1rem"
            disabled={disabled}
            fontSize={'sm'}
            {...restProps.propsConfigs?.triggerBtnProps}
          >
            {selectedDate
              ? format(selectedDate, datepickerConfigs.dateFormat)
              : ''}
          </Button>
        </PopoverTrigger>
      ) : null}
      {!children && restProps.triggerVariant === 'input' ? (
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
              width={'10rem'}
              disabled={disabled}
              isDisabled={disabled}
              name={name}
              value={tempInput}
              onChange={handleInputChange}
              paddingRight={'2.5rem'}
              {...restProps.propsConfigs?.inputProps}
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
              {...restProps.propsConfigs?.triggerIconBtnProps}
            >
              {Icon}
            </Button>
          </PopoverTrigger>
        </Flex>
      ) : null}
      {children ? children(selectedDate) : null}
      <PopoverContentWrapper
        {...(usePortal ? { containerRef: portalRef } : {})}
      >
        <PopoverContent
          width="100%"
          {...restProps.propsConfigs?.popoverCompProps?.popoverContentProps}
        >
          <PopoverBody
            {...restProps.propsConfigs?.popoverCompProps?.popoverBodyProps}
          >
            <FocusLock>
              <CalendarPanel
                dayzedHookProps={{
                  showOutsideDays: true,
                  monthsToDisplay: datepickerConfigs.monthsToDisplay,
                  onDateSelected: handleOnDateSelected,
                  selected: selectedDate,
                  date: dateInView,
                  minDate: minDate,
                  maxDate: maxDate,
                  offset: offset,
                  onOffsetChanged: setOffset,
                  firstDayOfWeek: datepickerConfigs.firstDayOfWeek,
                }}
                configs={datepickerConfigs}
                propsConfigs={restProps.propsConfigs}
                disabledDates={disabledDates}
              />
            </FocusLock>
          </PopoverBody>
        </PopoverContent>
      </PopoverContentWrapper>
    </Popover>
  );
};

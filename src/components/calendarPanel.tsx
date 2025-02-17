import {
  HStack,
  VStack,
  Heading,
  Separator,
  SimpleGrid,
  Box,
  Stack,
  ButtonProps,
} from '@chakra-ui/react';
import { useDayzed } from '../utils/dayzed/dayzed';
import { Props as DayzedHookProps } from '../utils/dayzed/utils';
import { ArrowKeysReact } from '../utils/reactKeysArrow';
import * as React from 'react';
import {
  CalendarConfigs,
  DatepickerProps,
  DayOfMonthBtnStyleProps,
} from '../utils/commonTypes';
import { DatepickerBackBtns, DatepickerForwardBtns } from './dateNavBtns';
import { DayOfMonth } from './dayOfMonth';

export interface CalendarPanelProps extends DatepickerProps {
  dayzedHookProps: Omit<DayzedHookProps, 'children' | 'render'>;
  configs: CalendarConfigs;
  disabledDates?: Set<number>;
  onMouseEnterHighlight?: (date: Date) => void;
  checkInRange?: (date: Date) => boolean;
}

type HoverStyle =
  | (ButtonProps['_hover'] & { _disabled: ButtonProps['_disabled'] })
  | undefined;

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  dayzedHookProps,
  configs,
  propsConfigs,
  disabledDates,
  onMouseEnterHighlight,
  checkInRange,
}) => {
  const { calendars, getBackProps, getForwardProps, getDateProps } =
    useDayzed(dayzedHookProps);

  const weekdayNames = React.useMemo(() => {
    const firstDayOfWeek = configs.firstDayOfWeek;
    const dayNames = configs.dayNames;
    if (firstDayOfWeek && firstDayOfWeek > 0) {
      return configs.dayNames
        .slice(firstDayOfWeek, dayNames.length)
        .concat(dayNames.slice(0, firstDayOfWeek));
    }
    return dayNames;
  }, [configs.firstDayOfWeek, configs.dayNames]);

  // looking for a useRef() approach to replace it
  const getKeyOffset = React.useCallback((num: number) => {
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
  }, []);

  const arrowKeysReact = React.useMemo(
    () =>
      new ArrowKeysReact({
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
      }),
    [getKeyOffset]
  );

  const styleBtnProps: DayOfMonthBtnStyleProps = React.useMemo(() => {
    const {
      defaultBtnProps,
      isInRangeBtnProps,
      selectedBtnProps,
      todayBtnProps,
    } = propsConfigs?.dayOfMonthBtnProps ?? {};
    const halfGap = 0.125; //default Chakra-gap-space-1 is 0.25rem
    return {
      defaultBtnProps: {
        size: 'xs',
        rounded: 'md',
        variant: 'ghost',
        position: 'relative', // for _after position
        // this intends to fill the visual gap from Grid to improve the UX
        // so the button active area is actually larger than what it's seen
        ...defaultBtnProps,
        _after: {
          content: "''",
          position: 'absolute',
          top: `-${halfGap}rem`,
          left: `-${halfGap}rem`,
          bottom: `-${halfGap}rem`,
          right: `-${halfGap}rem`,
          borderWidth: `${halfGap}rem`,
          borderColor: 'transparent',
          ...defaultBtnProps?._after,
        },
        _hover: {
          bg: 'purple.400',
          ...defaultBtnProps?._hover,
          _disabled: {
            bg: 'gray.100',
            // temperory hack to persist the typescript checking
            ...(defaultBtnProps?._hover as HoverStyle)?._disabled,
          },
        },
      },
      isInRangeBtnProps: {
        background: 'purple.200',
        ...isInRangeBtnProps,
      },
      selectedBtnProps: {
        background: 'purple.200',
        ...selectedBtnProps,
      },
      todayBtnProps: {
        borderColor: 'blue.400',
        ...todayBtnProps,
      },
    };
  }, [propsConfigs?.dayOfMonthBtnProps]);

  if (calendars.length <= 0) {
    return null;
  }

  return (
    <Stack
      className="datepicker-calendar"
      direction={['column', 'column', 'row']}
      {...propsConfigs?.calendarPanelProps?.wrapperProps}
      {...arrowKeysReact.getEvents()}
    >
      {calendars.map((calendar, calendarIdx) => {
        return (
          <VStack
            key={calendarIdx}
            height="100%"
            borderWidth="1px"
            padding="0.5rem 0.75rem"
            {...propsConfigs?.calendarPanelProps?.contentProps}
          >
            <HStack {...propsConfigs?.calendarPanelProps?.headerProps}>
              <DatepickerBackBtns
                calendars={calendars}
                getBackProps={getBackProps}
                propsConfigs={propsConfigs}
              />
              <Heading
                size="sm"
                minWidth={'5rem'}
                textAlign="center"
                {...propsConfigs?.dateHeadingProps}
              >
                {configs.monthNames[calendar.month]} {calendar.year}
              </Heading>
              <DatepickerForwardBtns
                calendars={calendars}
                getForwardProps={getForwardProps}
                propsConfigs={propsConfigs}
              />
            </HStack>
            <Separator
              width={'full'}
              {...propsConfigs?.calendarPanelProps?.dividerProps}
            />
            <SimpleGrid
              columns={7}
              gap={1}
              textAlign="center"
              {...propsConfigs?.calendarPanelProps?.bodyProps}
            >
              {weekdayNames.map((day, dayIdx) => (
                <Box
                  fontSize="sm"
                  fontWeight="semibold"
                  key={dayIdx}
                  {...propsConfigs?.weekdayLabelProps}
                >
                  {day}
                </Box>
              ))}
              {calendar.weeks.map((week, weekIdx) => {
                return week.map((dateObj, index) => {
                  const key = `${calendar.month}-${calendar.year}-${weekIdx}-${index}`;
                  if (!dateObj) return <Box key={key} />;
                  const isInRange =
                    !!checkInRange && checkInRange(dateObj.date);
                  return (
                    <DayOfMonth
                      key={key}
                      dateObj={dateObj}
                      propsConfigs={propsConfigs}
                      getDateProps={getDateProps}
                      isInRange={isInRange}
                      disabledDates={disabledDates}
                      onMouseEnterHighlight={onMouseEnterHighlight}
                      styleBtnProps={styleBtnProps}
                    />
                  );
                });
              })}
            </SimpleGrid>
          </VStack>
        );
      })}
    </Stack>
  );
};

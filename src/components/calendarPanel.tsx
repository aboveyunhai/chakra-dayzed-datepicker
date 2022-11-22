import {
  HStack,
  VStack,
  Heading,
  Divider,
  SimpleGrid,
  Box,
  Stack,
} from '@chakra-ui/react';
import { useDayzed, Props as DayzedHookProps } from 'dayzed';
import { ArrowKeysReact } from '../utils/reactKeysArrow';
import React, { useCallback, useMemo } from 'react';
import {
  CalendarConfigs,
  DatepickerProps,
  CustomDateButton,
  OnMonthViewChange,
} from '../utils/commonTypes';
import { DatepickerBackBtns, DatepickerForwardBtns } from './dateNavBtns';
import { DayOfMonth } from './dayOfMonth';

interface CalendarPanelProps extends DatepickerProps {
  dayzedHookProps: Omit<DayzedHookProps, 'children' | 'render'>;
  configs: CalendarConfigs;
  onMouseEnterHighlight?: (date: Date) => void;
  isInRange?: (date: Date) => boolean | null;
  onMonthViewChange?: OnMonthViewChange;
  customDateButton?: CustomDateButton;
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  dayzedHookProps,
  configs,
  propsConfigs,
  onMouseEnterHighlight,
  isInRange,
  onMonthViewChange,
  customDateButton,
}) => {
  const renderProps = useDayzed(dayzedHookProps);
  const { calendars, getBackProps, getForwardProps } = renderProps;

  const weekdayNames = useMemo(() => {
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
  const getKeyOffset = useCallback((num: number) => {
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

  const arrowKeysReact = new ArrowKeysReact({
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

  if (calendars.length <= 0) {
    return null;
  }

  return (
    <Stack
      className="datepicker-calendar"
      direction={['column', 'column', 'row']}
      {...arrowKeysReact.getEvents()}
    >
      {calendars.map((calendar, calendarIdx) => {
        return (
          <VStack
            key={calendarIdx}
            height="100%"
            borderWidth="1px"
            padding="0.5rem 0.75rem"
          >
            <HStack>
              <DatepickerBackBtns
                calendars={calendars}
                getBackProps={getBackProps}
                propsConfigs={propsConfigs}
                onMonthViewChange={onMonthViewChange}
              />
              <Heading size="sm" minWidth={'5rem'} textAlign="center">
                {configs.monthNames[calendar.month]} {calendar.year}
              </Heading>
              <DatepickerForwardBtns
                calendars={calendars}
                getForwardProps={getForwardProps}
                propsConfigs={propsConfigs}
                onMonthViewChange={onMonthViewChange}
              />
            </HStack>
            <Divider />
            <SimpleGrid columns={7} spacing={1} textAlign="center">
              {weekdayNames.map((day, dayIdx) => (
                <Box fontSize="sm" fontWeight="semibold" key={dayIdx}>
                  {day}
                </Box>
              ))}
              {calendar.weeks.map((week, weekIdx) => {
                return week.map((dateObj, index) => {
                  const key = `${calendar.month}-${calendar.year}-${weekIdx}-${index}`;
                  if (!dateObj) return <Box key={key} />;
                  const { date } = dateObj;
                  return (
                    <DayOfMonth
                      key={key}
                      dateObj={dateObj}
                      propsConfigs={propsConfigs}
                      renderProps={renderProps}
                      isInRange={isInRange && isInRange(date)}
                      onMouseEnter={() => {
                        if (onMouseEnterHighlight) onMouseEnterHighlight(date);
                      }}
                      customDateButton={customDateButton}
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

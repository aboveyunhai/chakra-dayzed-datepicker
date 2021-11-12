import {
  HStack,
  VStack,
  Heading,
  Divider,
  SimpleGrid,
  Box,
  Stack,
} from '@chakra-ui/react';
import { RenderProps } from 'dayzed';
import React from 'react';
import { DatepickerBackBtns, DatepickerForwardBtns } from './dateNavBtns';
import { DayOfMonth } from './dayOfMonth';

interface CalendarPaneProps {
  renderProps: RenderProps;
  configs: DatepickerConfigs;
  onMouseEnterHighlight?: (date: Date) => void;
  isInRange?: (date: Date) => boolean | null;
}

export interface DatepickerConfigs {
  dateFormat: string;
  monthNames: string[];
  dayNames: string[];
}

export const CalendarPanel: React.FC<CalendarPaneProps> = ({
  renderProps,
  configs,
  onMouseEnterHighlight,
  isInRange,
}) => {
  const { calendars, getBackProps, getForwardProps } = renderProps;

  if (calendars.length <= 0) {
    return null;
  }

  return (
    <Stack
      className="datepicker-calendar"
      direction={['column', 'column', 'row']}
    >
      {calendars.map((calendar) => {
        return (
          <VStack
            key={`${calendar.month}${calendar.year}`}
            height="100%"
            borderWidth="1px"
            padding="5px 10px"
          >
            <HStack>
              <DatepickerBackBtns
                calendars={calendars}
                getBackProps={getBackProps}
              />
              <Heading size="sm" textAlign="center">
                {configs.monthNames[calendar.month]} {calendar.year}
              </Heading>
              <DatepickerForwardBtns
                calendars={calendars}
                getForwardProps={getForwardProps}
              />
            </HStack>
            <Divider />
            <SimpleGrid columns={7} spacing={1} textAlign="center">
              {configs.dayNames.map((day) => (
                <Box
                  fontSize="sm"
                  fontWeight="semibold"
                  key={`${calendar.month}${calendar.year}${day}`}
                >
                  {day}
                </Box>
              ))}
              {calendar.weeks.map((week, weekIdx) => {
                return week.map((dateObj, index) => {
                  const key = `${calendar.month}${calendar.year}${weekIdx}${index}`;
                  if (!dateObj) return <Box key={key} />;
                  const { date } = dateObj;
                  return (
                    <DayOfMonth
                      key={key}
                      dateObj={dateObj}
                      renderProps={renderProps}
                      isInRange={isInRange && isInRange(date)}
                      onMouseEnter={() => {
                        if (onMouseEnterHighlight) onMouseEnterHighlight(date);
                      }}
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

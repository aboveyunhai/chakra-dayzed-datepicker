import 'react-app-polyfill/ie11';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Box,
  Button,
  ChakraProvider,
  ColorModeScript,
  Divider,
  extendTheme,
  Flex,
  Heading,
  HStack,
  Link,
  StackDivider,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  ThemeConfig,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import {
  SingleDatepicker,
  RangeDatepicker,
  DatepickerConfigs,
  Weekday_Names_Short,
  Month_Names_Short,
  CalendarPanel,
  OnDateSelected,
  RangeCalendarPanel,
} from '../src';
import GitHubButton from 'react-github-btn';
import { subDays, addDays, startOfDay, format } from 'date-fns';

type FirstDayOfWeek = DatepickerConfigs['firstDayOfWeek'];
const offsets: FirstDayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const demoDate = new Date();
  const [date, setDate] = useState(demoDate);
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<FirstDayOfWeek>(1);
  const [isSingleChecked, setSingleCheck] = useState(true);
  const [isRangeChecked, setRangeCheck] = useState(true);

  return (
    <VStack
      paddingX={{ base: '2rem', md: '8rem' }}
      paddingY={{ base: '1rem', md: '4rem' }}
      spacing={4}
      minHeight={'600px'}
      alignItems="flex-start"
      divider={<StackDivider />}
    >
      <Heading>Chakra-Dayzed-Datepicker</Heading>
      <Flex gridGap={5} height="28px">
        <GitHubButton
          href="https://github.com/aboveyunhai/chakra-dayzed-datepicker"
          data-size="large"
          data-show-count="true"
          aria-label="Star aboveyunhai/chakra-dayzed-datepicker on GitHub"
        >
          Star
        </GitHubButton>
        <Link
          href="https://github.com/aboveyunhai/chakra-dayzed-datepicker/blob/main/example/index.tsx"
          textUnderlineOffset="0.2rem"
        >
          🔗 Source code of all examples
        </Link>
      </Flex>
      <p>
        If you used light/dark theme, just be aware of your style under specific
        mode.
      </p>
      <Button size="sm" onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
      <Tabs variant="soft-rounded" colorScheme="gray" display={'flex'}>
        <TabList display={'flex'} flexDir={'column'} gridGap={'1'}>
          <Tab
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            justifyContent={'flex-start'}
          >
            Single & Range
          </Tab>
          <Tab
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            justifyContent={'flex-start'}
          >
            Custom Styles
          </Tab>
          <Tab
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            fontSize={'1rem'}
            justifyContent={'flex-start'}
          >
            Custom&nbsp;<Text fontSize="0.8rem">Month/Weekday/Format</Text>
          </Tab>
          <Tab
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            justifyContent={'flex-start'}
          >
            With Offset
          </Tab>
          <Tab
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            justifyContent={'flex-start'}
          >
            Calendar
          </Tab>
        </TabList>
        <TabPanels height={'20rem'}>
          <TabPanel>
            <Panel>
              <Section title="Single:">
                <Flex alignItems={'center'}>
                  <Box marginRight={'1rem'}>closeOnSelect:</Box>
                  <Switch
                    isChecked={isSingleChecked}
                    onChange={(e) => setSingleCheck(e.currentTarget.checked)}
                  />
                </Flex>
                <SingleDatepicker
                  name="date-input"
                  date={date}
                  disabledDates={
                    new Set([
                      startOfDay(subDays(demoDate, 6)).getTime(),
                      startOfDay(subDays(demoDate, 4)).getTime(),
                      startOfDay(subDays(demoDate, 2)).getTime(),
                    ])
                  }
                  minDate={subDays(demoDate, 8)}
                  maxDate={addDays(demoDate, 8)}
                  onDateChange={setDate}
                  closeOnSelect={isSingleChecked}
                />
              </Section>
              <Section title="Range:">
                <Flex alignItems={'center'}>
                  <Box marginRight={'1rem'}>closeOnSelect:</Box>
                  <Switch
                    isChecked={isRangeChecked}
                    onChange={(e) => setRangeCheck(e.currentTarget.checked)}
                  />
                </Flex>
                <RangeDatepicker
                  selectedDates={selectedDates}
                  onDateChange={setSelectedDates}
                  closeOnSelect={isRangeChecked}
                />
              </Section>
            </Panel>
          </TabPanel>
          <TabPanel>
            <Panel>
              <Section title="Custom Styles:">
                Custom Styles:
                <SingleDatepicker
                  name="date-input"
                  date={date}
                  onDateChange={setDate}
                  propsConfigs={{
                    dayOfMonthBtnProps: {
                      defaultBtnProps: {
                        _hover: {
                          background: 'blue.300',
                        },
                      },
                      selectedBtnProps: {
                        background: '#0085f230',
                      },
                    },
                    dateNavBtnProps: {
                      _hover: {
                        background: '#0085f230',
                      },
                    },
                    popoverCompProps: {
                      popoverContentProps: {
                        background: 'gray.700',
                        color: 'white',
                      },
                    },
                  }}
                />
                <RangeDatepicker
                  selectedDates={selectedDates}
                  onDateChange={setSelectedDates}
                  propsConfigs={{
                    dateNavBtnProps: {
                      colorScheme: 'blue',
                      variant: 'outline',
                    },
                    dayOfMonthBtnProps: {
                      defaultBtnProps: {
                        borderColor: 'red.300',
                        _hover: {
                          background: 'blue.400',
                        },
                      },
                      isInRangeBtnProps: {
                        color: 'purple.800',
                        borderColor: 'blue.300',
                      },
                      selectedBtnProps: {
                        background: 'blue.200',
                        borderColor: 'blue.300',
                        color: 'blue.600',
                      },
                      todayBtnProps: {
                        background: 'teal.200',
                        color: 'teal.700',
                      },
                    },
                    inputProps: {
                      size: 'sm',
                    },
                  }}
                />
              </Section>
            </Panel>
          </TabPanel>
          <TabPanel>
            <Panel>
              <Section title="Custom Month/Weekday/Format:">
                <Box>Check the month name and day labels</Box>
                <RangeDatepicker
                  selectedDates={selectedDates}
                  onDateChange={setSelectedDates}
                  configs={{
                    dateFormat: 'yyyy-MM-dd',
                    dayNames: 'abcdefg'.split(''), // length of 7
                    monthNames: 'ABCDEFGHIJKL'.split(''), // length of 12
                  }}
                />
              </Section>
            </Panel>
          </TabPanel>
          <TabPanel>
            <Panel>
              <Section title="With Offset:">
                <Box>
                  First Day of Week: {Weekday_Names_Short[firstDayOfWeek || 0]}
                </Box>
                <HStack spacing={1}>
                  {offsets.map((e) => (
                    <Button
                      key={e}
                      onClick={() => setFirstDayOfWeek(e)}
                      backgroundColor={
                        firstDayOfWeek === e ? 'green.300' : undefined
                      }
                    >
                      {e}
                    </Button>
                  ))}
                </HStack>
                <SingleDatepicker
                  name="date-input"
                  date={date}
                  onDateChange={setDate}
                  configs={{
                    firstDayOfWeek,
                  }}
                />
                <RangeDatepicker
                  selectedDates={selectedDates}
                  onDateChange={setSelectedDates}
                  configs={{
                    firstDayOfWeek,
                  }}
                />
              </Section>
            </Panel>
          </TabPanel>
          <TabPanel>
            <Panel>
              <Section title="Single Calendar">
                <SingleCalendarDemo />
              </Section>
              <Section title="Range Calendar">
                <RangeCalendarDemo />
              </Section>
            </Panel>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

const SingleCalendarDemo = () => {
  const demoDate = new Date();
  const [date, setDate] = useState(demoDate);

  const handleOnDateSelected = (props: {
    date: Date;
    nextMonth: boolean;
    prevMonth: boolean;
    selectable: boolean;
    selected: boolean;
    today: boolean;
  }) => {
    const { date } = props;
    if (date instanceof Date && !isNaN(date.getTime())) {
      setDate(date);
    }
  };

  return (
    <Box>
      <Box> {format(date, 'yyyy-MM-dd')}</Box>
      <CalendarPanel
        dayzedHookProps={{
          showOutsideDays: true,
          onDateSelected: handleOnDateSelected,
          selected: date,
          minDate: subDays(demoDate, 8),
          maxDate: addDays(demoDate, 8),
        }}
        configs={{
          dateFormat: 'yyyy-MM-dd',
          monthNames: Month_Names_Short,
          dayNames: Weekday_Names_Short,
          firstDayOfWeek: 0,
        }}
      />
    </Box>
  );
};

const RangeCalendarDemo = () => {
  const demoDate = new Date();
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    demoDate,
    demoDate,
  ]);

  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    let newDates = [...selectedDates];
    if (selectedDates.length) {
      if (selectedDates.length === 1) {
        let firstTime = selectedDates[0];
        if (firstTime < date) {
          newDates.push(date);
        } else {
          newDates.unshift(date);
        }
        setSelectedDates(newDates);
        return;
      }

      if (newDates.length === 2) {
        setSelectedDates([date]);
        return;
      }
    } else {
      newDates.push(date);
      setSelectedDates(newDates);
    }
  };

  // eventually we want to allow user to freely type their own input and parse the input
  let intVal = selectedDates[0]
    ? `${format(selectedDates[0], 'yyyy-MM-dd')}`
    : '';
  intVal += selectedDates[1]
    ? ` - ${format(selectedDates[1], 'yyyy-MM-dd')}`
    : '';

  return (
    <Box>
      <Box>{intVal}</Box>
      <RangeCalendarPanel
        selected={selectedDates}
        dayzedHookProps={{
          showOutsideDays: false,
          onDateSelected: handleOnDateSelected,
          selected: selectedDates,
          monthsToDisplay: 2,
        }}
        configs={{
          dateFormat: 'MM/dd/yyyy',
          monthNames: Month_Names_Short,
          dayNames: Weekday_Names_Short,
          firstDayOfWeek: 0,
        }}
      />
    </Box>
  );
};

const Section: React.FC<React.PropsWithChildren<{ title?: string }>> = ({
  title,
  children,
}) => (
  <VStack spacing={3} alignItems="flex-start" padding={'0.25rem'}>
    <Heading size="md">{title}</Heading>
    {children}
  </VStack>
);

const Panel: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <Flex>
    <Box>
      <Divider orientation="vertical" width={'1rem'} />
    </Box>
    <Box>{children}</Box>
  </Flex>
);

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

ReactDOM.render(
  <>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </>,
  document.getElementById('root')
);

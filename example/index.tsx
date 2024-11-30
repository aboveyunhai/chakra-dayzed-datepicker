import 'react-app-polyfill/ie11';
import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Box,
  Button,
  ChakraProvider,
  createSystem,
  defaultConfig,
  DialogTrigger,
  Flex,
  Heading,
  HStack,
  Link,
  Separator,
  StackSeparator,
  Tabs,
  Text,
  useDisclosure,
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
import { Switch } from './snippet/switch';
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from './snippet/dialog';
import { ThemeProvider, useTheme } from './snippet/color-mode';

type FirstDayOfWeek = DatepickerConfigs['firstDayOfWeek'];
const offsets: FirstDayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

const demoDate = new Date();

const App = () => {
  const { theme, setTheme } = useTheme();
  const [date, setDate] = useState<Date | undefined>(demoDate);
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<FirstDayOfWeek>(1);
  const [isSingleChecked, setSingleCheck] = useState(true);
  const [isRangeChecked, setRangeCheck] = useState(true);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const modalRef = useRef(null);

  return (
    <VStack
      paddingX={{ base: '2rem', md: '8rem' }}
      paddingY={{ base: '1rem', md: '4rem' }}
      gap={4}
      minHeight={'600px'}
      alignItems="flex-start"
      separator={<StackSeparator />}
    >
      <Heading>Chakra-Dayzed-Datepicker</Heading>
      <Flex gridGap={5} height="28px">
        <GitHubButton
          href="https://github.com/aboveyunhai/chakra-dayzed-datepicker"
          data-size="large"
          data-show-count="false"
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
      <Button
        size="sm"
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      >
        Toggle {theme === 'light' ? 'Dark' : 'Light'}
      </Button>
      <Tabs.Root
        variant="plain"
        colorScheme="gray"
        display={'flex'}
        flexDirection={['column', 'column', 'row']}
      >
        <Tabs.List display={'flex'} flexDir={'column'} gridGap={'1'}>
          <Tabs.Trigger
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            justifyContent={'flex-start'}
            value="tab-1"
          >
            Single & Range
          </Tabs.Trigger>
          <Tabs.Trigger
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            justifyContent={'flex-start'}
            value="tab-2"
          >
            Custom Styles
          </Tabs.Trigger>
          <Tabs.Trigger
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            fontSize={'1rem'}
            justifyContent={'flex-start'}
            value="tab-3"
          >
            Custom&nbsp;<Text fontSize="0.8rem">Month/Weekday/Format</Text>
          </Tabs.Trigger>
          <Tabs.Trigger
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            justifyContent={'flex-start'}
            value="tab-4"
          >
            With Offset
          </Tabs.Trigger>
          <Tabs.Trigger
            borderRadius="0.5rem"
            height="2rem"
            width="15rem"
            justifyContent={'flex-start'}
            value="tab-5"
          >
            Calendar
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup height={'20rem'}>
          <Tabs.Content value="tab-1">
            <Panel>
              <Flex flexDir={'column'} gap={3} pb="5rem">
                <Section title="Single:">
                  <Flex alignItems={'center'} gap={2}>
                    <Box marginRight={'1rem'}>closeOnSelect:</Box>
                    <Switch
                      name="closeOnSelect-switch"
                      checked={isSingleChecked}
                      onCheckedChange={(e: any) =>
                        setSingleCheck(e.currentTarget.checked)
                      }
                    />
                    <Button
                      size={'sm'}
                      onClick={() => {
                        setDate(undefined);
                      }}
                    >
                      Set Empty (undefined)
                    </Button>
                  </Flex>
                  {/* chakra ui add prefix for the trigger for some reasons? */}
                  <Flex gap="1rem" alignItems="center">
                    <label htmlFor={`popover-trigger-default`}>Default:</label>
                    <SingleDatepicker
                      id="default"
                      date={date}
                      disabledDates={
                        new Set([
                          startOfDay(subDays(demoDate, 6)).getTime(),
                          startOfDay(subDays(demoDate, 4)).getTime(),
                          startOfDay(subDays(demoDate, 2)).getTime(),
                        ])
                      }
                      propsConfigs={{}}
                      minDate={subDays(demoDate, 8)}
                      maxDate={addDays(demoDate, 8)}
                      onDateChange={setDate}
                      closeOnSelect={isSingleChecked}
                    />
                  </Flex>
                  <Flex gap="1rem" alignItems="center">
                    <label htmlFor={`input`}>Input:</label>
                    <SingleDatepicker
                      id="input"
                      triggerVariant="input"
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
                  </Flex>
                </Section>
                <Section title="Range:">
                  <Flex alignItems={'center'} gap={2}>
                    <Box marginRight={'1rem'}>closeOnSelect:</Box>
                    <Switch
                      name="closeOnSelect-switch"
                      checked={isRangeChecked}
                      onCheckedChange={(e: any) =>
                        setRangeCheck(e.currentTarget.checked)
                      }
                    />
                    <Button
                      size={'sm'}
                      onClick={() => {
                        setSelectedDates([]);
                      }}
                    >
                      Set Empty (Empty Array: "[]")
                    </Button>
                  </Flex>
                  <Flex gap="1rem" alignItems="center">
                    <label htmlFor={`popover-trigger-default-range`}>
                      Default:
                    </label>
                    <RangeDatepicker
                      id="default-range"
                      selectedDates={selectedDates}
                      onDateChange={setSelectedDates}
                      closeOnSelect={isRangeChecked}
                    />
                  </Flex>
                  <Flex gap="1rem" alignItems="center">
                    <label htmlFor={`input-range`}>Input:</label>
                    <RangeDatepicker
                      id="input-range"
                      triggerVariant="input"
                      selectedDates={selectedDates}
                      onDateChange={setSelectedDates}
                      closeOnSelect={isRangeChecked}
                    />
                  </Flex>
                </Section>
                <Section title="Inside Modal:">
                  <DialogRoot isOpen={isOpen} onClose={onClose}>
                    <DialogBackdrop />
                    <DialogTrigger asChild>
                      <Button onClick={onOpen}>Open Modal</Button>
                    </DialogTrigger>
                    <DialogContent ref={modalRef}>
                      <DialogHeader>Modal Title</DialogHeader>
                      <DialogCloseTrigger />
                      <DialogBody>
                        <Flex flexDir={'column'} gap={2}>
                          <div>Default:</div>
                          <SingleDatepicker
                            date={date}
                            onDateChange={setDate}
                          />
                          <RangeDatepicker
                            selectedDates={selectedDates}
                            onDateChange={setSelectedDates}
                          />
                          <div>
                            if <code>{`usePortal={true}`} </code> <br />
                            please add <code> {`portalRef={modalRef}`}</code>
                          </div>
                          <SingleDatepicker
                            date={date}
                            onDateChange={setDate}
                            portalRef={modalRef}
                          />
                          <RangeDatepicker
                            selectedDates={selectedDates}
                            onDateChange={setSelectedDates}
                            usePortal={true}
                            portalRef={modalRef}
                          />
                        </Flex>
                      </DialogBody>
                      <DialogFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                          Close
                        </Button>
                        <Button variant="ghost">Secondary Action</Button>
                      </DialogFooter>
                    </DialogContent>
                  </DialogRoot>
                </Section>
              </Flex>
            </Panel>
          </Tabs.Content>
          <Tabs.Content value="tab-2">
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
                          background: 'blue.600',
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
                        background: '#10172b',
                        color: '#94a3bb',
                        boxShadow: 'var(--chakra-shadows-base)',
                      },
                    },
                    calendarPanelProps: {
                      wrapperProps: {
                        borderColor: 'green',
                      },
                      contentProps: {
                        borderWidth: 0,
                      },
                      headerProps: {
                        padding: '5px',
                      },
                      dividerProps: {
                        display: 'none',
                      },
                    },
                    weekdayLabelProps: {
                      fontWeight: 'normal',
                    },
                    dateHeadingProps: {
                      fontWeight: 'semibold',
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
          </Tabs.Content>
          <Tabs.Content value="tab-3">
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
          </Tabs.Content>
          <Tabs.Content value="tab-4">
            <Panel>
              <Section title="With Offset:">
                <Box>
                  First Day of Week: {Weekday_Names_Short[firstDayOfWeek || 0]}
                </Box>
                <HStack gap={1}>
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
          </Tabs.Content>
          <Tabs.Content value="tab-5">
            <Panel>
              <Section title="Single Calendar">
                <SingleCalendarDemo />
              </Section>
              <Section title="Range Calendar">
                <RangeCalendarDemo />
              </Section>
            </Panel>
          </Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs.Root>
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
  <VStack gap={3} alignItems="flex-start" padding={'0.25rem'}>
    <Heading size="md">{title}</Heading>
    {children}
  </VStack>
);

const Panel: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <Flex>
    <Box>
      <Separator orientation="vertical" width={'1rem'} />
    </Box>
    <Box>{children}</Box>
  </Flex>
);

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
  },
});

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <ChakraProvider value={system}>
        <App />
      </ChakraProvider>
    </ThemeProvider>
  </StrictMode>
);

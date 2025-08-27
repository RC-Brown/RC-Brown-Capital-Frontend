"use client";

import React from "react";
import "./date-range-picker.css";
import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker as DateRangePickerComponent,
  DateSegment,
  Group,
  Heading,
  // Label,
  RangeCalendar,
  DateValue,
} from "react-aria-components";

type RangeValue<T> = { start: T; end: T } | null;
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function DateRangePicker() {
  const [value, setValue] = React.useState<RangeValue<DateValue>>(null);

  const startDate = value?.start ? value?.start.year + "-" + value?.start.month + "-" + value?.start.day : null;
  const endDate = value?.end ? value?.end.year + "-" + value?.end.month + "-" + value?.end.day : null;
  const isSameDate = startDate && endDate ? startDate === endDate : undefined;

  console.log({ isSameDate, startDate, endDate, value });

  return (
    <div className='date-range-picker-container'>
      <DateRangePickerComponent value={value} onChange={setValue}>
        <div className='mb-2'>
          {isSameDate === true ? (
            <Group>
              <DateInput slot='start'>{(segment) => <DateSegment segment={segment} />}</DateInput>
            </Group>
          ) : isSameDate === false ? (
            <Group>
              <DateInput slot='start'>{(segment) => <DateSegment segment={segment} />}</DateInput>
              <span aria-hidden='true'>–</span>
              <DateInput slot='end'>{(segment) => <DateSegment segment={segment} />}</DateInput>
            </Group>
          ) : (
            <div className='text-sm font-medium text-text-muted/80'>Date</div>
          )}
        </div>

        <div className='calendar-container'>
          <RangeCalendar>
            <header>
              <Heading />
              <div className='flex items-center gap-4'>
                <Button slot='previous'>
                  <ArrowLeftIcon className='size-3 stroke-[2.6px]' />
                </Button>
                <Button slot='next'>
                  <ArrowRightIcon className='size-3 stroke-[2.6px]' />
                </Button>
              </div>
            </header>
            <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
          </RangeCalendar>
        </div>
      </DateRangePickerComponent>
    </div>
  );
}

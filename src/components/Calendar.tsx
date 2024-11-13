import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function Calendar() {
  const { selectedDate, setSelectedDate, events, setIsModalOpen, setSelectedEvent } = useCalendar();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handlePrevYear = () => {
    setSelectedDate(new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth()));
  };

  const handleNextYear = () => {
    setSelectedDate(new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth()));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    setIsDatePickerOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), monthIndex));
  };

  const handleYearSelect = (year: number) => {
    setSelectedDate(new Date(year, selectedDate.getMonth()));
  };

  const renderDatePicker = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    return (
      <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border p-4 z-10 w-72">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {MONTHS.map((month, index) => (
            <button
              key={month}
              onClick={() => {
                handleMonthSelect(index);
                setIsDatePickerOpen(false);
              }}
              className={`p-2 rounded text-sm ${
                index === selectedDate.getMonth()
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="grid grid-cols-4 gap-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => {
                  handleYearSelect(year);
                  setIsDatePickerOpen(false);
                }}
                className={`p-2 rounded text-sm ${
                  year === selectedDate.getFullYear()
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t mt-4 pt-4">
          <button
            onClick={goToToday}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
          >
            Today
          </button>
        </div>
      </div>
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateStr);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => {
            setSelectedDate(date);
            setSelectedEvent(null);
            setIsModalOpen(true);
          }}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors
            ${isToday ? 'bg-blue-50' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm ${
              isToday
                ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                : ''
            }`}>
              {day}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }}
                className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate hover:bg-blue-200"
                title={event.title}
              >
                {event.time.substring(0, 5)} {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevYear}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Previous Year"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center space-x-2 text-xl font-semibold text-gray-800 hover:bg-gray-100 px-3 py-1 rounded"
            >
              <span>{MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            {isDatePickerOpen && renderDatePicker()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextYear}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Next Year"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          onClick={goToToday}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Today</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px">
        {DAYS.map(day => (
          <div key={day} className="text-center font-semibold text-sm py-2">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
}
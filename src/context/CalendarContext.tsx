import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, CalendarContextType } from '../types';

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => {
    const stored = localStorage.getItem('calendar-events');
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
      notified: false,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => 
      prev.map(event => event.id === updatedEvent.id ? updatedEvent : event)
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkNotifications = () => {
      events.forEach(event => {
        if (!event.notified) {
          const eventTime = new Date(`${event.date}T${event.time}`);
          if (new Date() >= eventTime) {
            new Notification(event.title, {
              body: event.description,
              icon: '/calendar-icon.png'
            });
            updateEvent({ ...event, notified: true });
          }
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <CalendarContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      selectedDate,
      setSelectedDate,
      isModalOpen,
      setIsModalOpen,
      selectedEvent,
      setSelectedEvent
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
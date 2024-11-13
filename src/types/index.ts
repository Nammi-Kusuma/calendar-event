export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  notified?: boolean;
}

export interface CalendarContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
}
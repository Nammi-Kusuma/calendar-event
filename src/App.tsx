import React from 'react';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { EventList } from './components/EventList';
import { CalendarProvider } from './context/CalendarContext';
import { Calendar as CalendarIcon } from 'lucide-react';

function App() {
  return (
    <CalendarProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Calendar App</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Calendar />
            </div>
            <div>
              <EventList />
            </div>
          </div>
        </main>

        <EventModal />
      </div>
    </CalendarProvider>
  );
}

export default App;
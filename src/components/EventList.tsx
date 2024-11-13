import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, Edit2 } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { Event } from '../types';

export function EventList() {
  const { events, deleteEvent, setSelectedEvent, setIsModalOpen } = useCalendar();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Event['type'] | 'all'>('all');

  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event => filter === 'all' || event.type === filter)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

    const handleEdit = (event: Event) => {
      setSelectedEvent(event);
      setIsModalOpen(true);
    };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as Event['type'] | 'all')}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredEvents.map(event => (
            <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>{new Date(`${event.date}T${event.time}`).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    title="Edit event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {event.type !== 'text' && event.mediaUrl && (
                <div className="mt-4">
                  {event.type === 'image' ? (
                    <img
                      src={event.mediaUrl}
                      alt={event.title}
                      className="rounded-lg max-h-48 w-full object-cover"
                    />
                  ) : (
                    <video
                      src={event.mediaUrl}
                      controls
                      className="rounded-lg max-h-48 w-full"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No events found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
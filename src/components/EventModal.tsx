import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { Event } from '../types';

export function EventModal() {
  const { isModalOpen, setIsModalOpen, selectedDate, addEvent, updateEvent, deleteEvent, selectedEvent, setSelectedEvent } = useCalendar();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'text' as const,
    mediaUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date,
        time: selectedEvent.time,
        type: selectedEvent.type,
        mediaUrl: selectedEvent.mediaUrl || ''
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0],
        title: '',
        description: '',
        time: '',
        type: 'text',
        mediaUrl: ''
      }));
    }
  }, [selectedEvent, selectedDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (formData.type !== 'text' && !formData.mediaUrl) {
      newErrors.mediaUrl = 'Media URL is required for image/video events';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      if (selectedEvent) {
        updateEvent({ ...formData, id: selectedEvent.id, notified: selectedEvent.notified });
      } else {
        addEvent(formData);
      }
      handleClose();
    } else {
      setErrors(newErrors);
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'text',
      mediaUrl: ''
    });
    setErrors({});
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedEvent ? 'Edit Event' : 'Add Event'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Event Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          {formData.type !== 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Media URL</label>
              <input
                type="url"
                value={formData.mediaUrl}
                onChange={e => setFormData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter URL for image or video"
              />
              {errors.mediaUrl && <p className="text-red-500 text-xs mt-1">{errors.mediaUrl}</p>}
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            {selectedEvent && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            )}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {selectedEvent ? 'Update' : 'Add'} Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
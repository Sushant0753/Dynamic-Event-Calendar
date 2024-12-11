import React, { useState, useEffect } from 'react';
import { EventUtils } from '../utils/eventUtils';

const EventModal = ({ 
  date, 
  existingEvents, 
  onClose, 
  onAddEvent, 
  onUpdateEvent, 
  onDeleteEvent 
}) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [error, setError] = useState(null);

  // Reset form when modal opens or changes
  useEffect(() => {
    resetForm();
  }, [date]);

  const resetForm = () => {
    setTitle('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setCategory('other');
    setError(null);
    setEditingEvent(null);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDescription(event.description || '');
    setCategory(event.category || 'other');
    setIsAddingEvent(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate event data
      EventUtils.validateEvent({ title, startTime, endTime });

      // Check for time conflicts
      const potentialConflicts = existingEvents.filter(
        event => event.id !== (editingEvent ? editingEvent.id : null)
      );
      
      if (EventUtils.hasTimeConflict(potentialConflicts, { startTime, endTime })) {
        throw new Error('An event already exists during this time');
      }

      const eventData = {
        id: editingEvent ? editingEvent.id : EventUtils.generateId(),
        title,
        startTime,
        endTime,
        description,
        category,
        date: date.toISOString().split('T')[0]
      };

      if (editingEvent) {
        onUpdateEvent(eventData);
      } else {
        onAddEvent(eventData);
      }

      // Reset form and close adding mode
      resetForm();
      setIsAddingEvent(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {date.toLocaleDateString()}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Existing Events List */}
        {!isAddingEvent && (
          <>
            <div className="space-y-2 mb-4">
              {existingEvents.length === 0 ? (
                <div className="text-center text-gray-500">No events</div>
              ) : (
                existingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="bg-gray-100 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onDeleteEvent(event.id)}
                        className="text-red-500 hover:bg-red-100 p-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button 
              onClick={() => setIsAddingEvent(true)}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add New Event
            </button>
          </>
        )}

        {/* Add/Edit Event Form */}
        {isAddingEvent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            />

            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="other">Other</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsAddingEvent(false);
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventModal;
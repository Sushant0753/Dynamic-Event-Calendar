import React, { useState } from 'react';
import { 
  generateCalendarDays, 
  formatDate, 
  getMonthName, 
  navigateMonth 
} from '../utils/dateUtils';
import { useEventManager } from '../hooks/useEvents';
import EventModal from './EventModal';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    getEventsForDate 
  } = useEventManager();

  const calendarDays = generateCalendarDays(currentMonth);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth(navigateMonth(currentMonth, direction));
  };

  const handleAddEvent = (eventData) => {
    addEvent({
      ...eventData,
      date: formatDate(selectedDate)
    });
    setIsModalOpen(false);
  };

  const handleUpdateEvent = (updatedEvent) => {
    updateEvent(updatedEvent);
  };

  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-xl mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this event?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDeleteEvent}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setEventToDelete(null);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => handleMonthChange('prev')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <h2 className="text-2xl font-bold">
          {getMonthName(currentMonth)}
        </h2>
        <button 
          onClick={() => handleMonthChange('next')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold bg-gray-200 p-2">
            {day}
          </div>
        ))}

        {calendarDays.map(({ date, day, isCurrentMonth, isToday }) => {
          const dateString = formatDate(date);
          const dayEvents = getEventsForDate(dateString);

          return (
            <div 
              key={dateString}
              onClick={() => handleDateClick(date)}
              className={`
                p-2 border cursor-pointer 
                ${!isCurrentMonth ? 'bg-gray-100 text-gray-400' : ''}
                ${isToday ? 'bg-blue-100 font-bold' : ''}
                ${dayEvents.length > 0 ? 'bg-green-100' : ''}
              `}
            >
              {day}
              {dayEvents.length > 0 && (
                <div className="text-xs text-green-600">
                  {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <EventModal 
          date={selectedDate}
          existingEvents={getEventsForDate(formatDate(selectedDate))}
          onClose={() => setIsModalOpen(false)}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}
    </div>
  );
};


export default Calendar;
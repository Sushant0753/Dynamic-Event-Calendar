import React from 'react';
import { EventUtils } from '../utils/eventUtils';

const EventList = ({ events, onDeleteEvent, onEditEvent }) => {
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No events for this date
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div 
          key={event.id} 
          className={`
            p-3 rounded-lg border 
            ${EventUtils.getEventColor(event.category || 'other')}
            flex justify-between items-center
          `}
        >
          <div>
            <div className="font-bold">{event.title}</div>
            <div className="text-sm text-gray-600">
              {event.startTime} - {event.endTime}
            </div>
            {event.description && (
              <div className="text-xs text-gray-500 mt-1">
                {event.description}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onEditEvent(event)}
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
      ))}
    </div>
  );
};

export default EventList;
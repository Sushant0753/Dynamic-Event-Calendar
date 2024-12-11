import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useEventManager = () => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const addEvent = useCallback((newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: uuidv4(),
    };

    const updatedEvents = [...events, eventWithId];
    setEvents(updatedEvents);
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    return eventWithId;
  }, [events]);

  const updateEvent = useCallback((updatedEvent) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    setEvents(updatedEvents);
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
  }, [events]);

  const deleteEvent = useCallback((eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    
    setEvents(updatedEvents);
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
  }, [events]);

  const getEventsForDate = useCallback((date) => {
    return events.filter(event => event.date === date);
  }, [events]);

  const exportEvents = useCallback((format = 'json') => {
    const data = format === 'json' 
      ? JSON.stringify(events, null, 2)
      : events.map(e => Object.values(e)).join('\n');
    
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `events_${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
  }, [events]);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    exportEvents
  };
};
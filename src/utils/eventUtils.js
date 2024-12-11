import { v4 as uuidv4 } from 'uuid';

export class EventUtils {
  // Validate event data
  static validateEvent(event) {
    const { title, startTime, endTime } = event;
    
    if (!title || title.trim() === '') {
      throw new Error('Event title is required');
    }

    if (!startTime || !endTime) {
      throw new Error('Start and end times are required');
    }

    if (new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)) {
      throw new Error('End time must be after start time');
    }

    return true;
  }

  // Generate a unique event ID
  static generateId() {
    return uuidv4();
  }

  // Check for event time conflicts
  static hasTimeConflict(existingEvents, newEvent) {
    return existingEvents.some(event => 
      (newEvent.startTime >= event.startTime && newEvent.startTime < event.endTime) ||
      (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime) ||
      (newEvent.startTime <= event.startTime && newEvent.endTime >= event.endTime)
    );
  }

  // Color coding for events
  static getEventColor(category) {
    const colors = {
      work: 'bg-blue-100 border-blue-300',
      personal: 'bg-green-100 border-green-300',
      other: 'bg-gray-100 border-gray-300'
    };
    return colors[category] || colors.other;
  }

  // Export events to different formats
  static exportEvents(events, format = 'json') {
    try {
      let exportData;
      
      if (format === 'json') {
        exportData = JSON.stringify(events, null, 2);
      } else if (format === 'csv') {
        // Convert events to CSV
        const headers = ['ID', 'Title', 'Date', 'Start Time', 'End Time', 'Description'];
        exportData = [
          headers.join(','),
          ...events.map(event => 
            [
              event.id, 
              event.title, 
              event.date, 
              event.startTime, 
              event.endTime, 
              event.description || ''
            ].map(value => `"${value.replace(/"/g, '""')}"`)
            .join(',')
          )
        ].join('\n');
      } else {
        throw new Error('Unsupported export format');
      }

      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `events_${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  }
  static hasTimeConflict(existingEvents, newEvent) {
    return existingEvents.some(event => {
      // Convert times to minutes for easier comparison
      const newStartMinutes = this.timeToMinutes(newEvent.startTime);
      const newEndMinutes = this.timeToMinutes(newEvent.endTime);
      const existingStartMinutes = this.timeToMinutes(event.startTime);
      const existingEndMinutes = this.timeToMinutes(event.endTime);

      return (
        // New event starts during existing event
        (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
        // New event ends during existing event
        (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
        // New event completely encompasses existing event
        (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
      );
    });
  }

  // Helper method to convert time to minutes
  static timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Suggests alternative time slots
  static suggestAlternativeSlots(existingEvents, desiredStartTime, desiredEndTime) {
    // Sort existing events by start time
    const sortedEvents = existingEvents.sort((a, b) => 
      this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime)
    );

    const availableSlots = [];
    let lastEndTime = '00:00';

    // Find gaps between existing events
    sortedEvents.forEach(event => {
      // Check if there's a gap between last event and current event
      if (this.timeToMinutes(event.startTime) > this.timeToMinutes(lastEndTime)) {
        availableSlots.push({
          start: lastEndTime,
          end: event.startTime
        });
      }
      lastEndTime = event.endTime;
    });

    // Add slot after last event if there's room
    if (this.timeToMinutes('23:59') > this.timeToMinutes(lastEndTime)) {
      availableSlots.push({
        start: lastEndTime,
        end: '23:59'
      });
    }

    return availableSlots;
  }
}
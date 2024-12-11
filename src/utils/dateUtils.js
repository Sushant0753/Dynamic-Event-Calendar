import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval, 
    addMonths, 
    subMonths,
    isSameDay,
    isToday
  } from 'date-fns';
  
  export const generateCalendarDays = (currentMonth) => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    
    return eachDayOfInterval({ start, end }).map(date => ({
      date,
      day: date.getDate(),
      isCurrentMonth: format(date, 'M') === format(currentMonth, 'M'),
      isToday: isSameDay(date, new Date())
    }));
  };
  
  export const formatDate = (date) => 
    format(date, 'yyyy-MM-dd');
  
  export const getMonthName = (date) => 
    format(date, 'MMMM yyyy');
  
  export const navigateMonth = (currentMonth, direction) => {
    return direction === 'next' 
      ? addMonths(currentMonth, 1) 
      : subMonths(currentMonth, 1);
  };
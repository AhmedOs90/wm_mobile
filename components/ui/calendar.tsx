import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface AppCalendarProps {
  onDayPress?: (day: DateData) => void;
  markedDates?: { [date: string]: any };
}

export const AppCalendar: React.FC<AppCalendarProps> = ({
  onDayPress,
  markedDates,
}) => {
  return (
    <CalendarList
      // Month scroll behavior
      horizontal
      pagingEnabled
      calendarWidth={350}
      pastScrollRange={12}
      futureScrollRange={12}
      scrollEnabled
      showScrollIndicator={false}
      onDayPress={onDayPress}
      markedDates={markedDates}
      theme={{
        backgroundColor: 'white',
        calendarBackground: 'white',
        textSectionTitleColor: '#a3a3a3',
        selectedDayBackgroundColor: '#1f2937',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#1f2937',
        dayTextColor: '#111827',
        textDisabledColor: '#d1d5db',
        arrowColor: '#1f2937',
        textMonthFontWeight: '500',
        textDayFontSize: 14,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 12,
      }}
      renderArrow={(direction) =>
        direction === 'left' ? (
          <ChevronLeft size={16} color="#6b7280" />
        ) : (
          <ChevronRight size={16} color="#6b7280" />
        )
      }
    />
  );
};

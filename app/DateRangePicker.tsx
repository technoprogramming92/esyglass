import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';

// Define the type for the props
interface DateRangePickerProps {
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onStartDateChange, onEndDateChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);

  return (
    <View style={styles.filterContainer}>
      {/* Start Date Picker */}
      <TouchableOpacity onPress={() => setIsStartPickerOpen(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>
          {startDate ? startDate.toLocaleDateString() : 'Start Date'}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={isStartPickerOpen}
        date={startDate || new Date()}
        onConfirm={(date) => {
          setStartDate(date);
          onStartDateChange(date); // Pass date to parent
          setIsStartPickerOpen(false);
        }}
        onCancel={() => setIsStartPickerOpen(false)}
      />

      {/* End Date Picker */}
      <TouchableOpacity onPress={() => setIsEndPickerOpen(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>
          {endDate ? endDate.toLocaleDateString() : 'End Date'}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={isEndPickerOpen}
        date={endDate || new Date()}
        onConfirm={(date) => {
          setEndDate(date);
          onEndDateChange(date); // Pass date to parent
          setIsEndPickerOpen(false);
        }}
        onCancel={() => setIsEndPickerOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
  },
  datePickerText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default DateRangePicker;

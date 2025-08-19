import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';

interface Option {
  value: string;
  label: string;
}

interface AutocompleteSelectProps {
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  disabled?: boolean;
}

const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  placeholder = 'Search...',
  options,
  value,
  onChange,
  onInputChange,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  useEffect(() => {
    if (value) {
      const selected = options.find(opt => opt.value === value);
      setInputValue(selected?.label || '');
    } else {
      setInputValue('');
    }
  }, [value, options]);

  useEffect(() => {
    if (!inputValue) {
      setFilteredOptions(options);
    } else {
      const lower = inputValue.toLowerCase();
      setFilteredOptions(options.filter(opt => opt.label.toLowerCase().includes(lower)));
    }
  }, [inputValue, options]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    onInputChange?.(text);
    const match = options.find(opt => opt.label.toLowerCase() === text.toLowerCase());
    if (!match && value) onChange('');
    setIsOpen(true);
  };

  const handleOptionSelect = (option: Option) => {
    setInputValue(option.label);
    onChange(option.value);
    setIsOpen(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // allow tap on options
          placeholder={placeholder}
          editable={!disabled}
          style={styles.input}
        />
        {inputValue ? (
          <TouchableOpacity onPress={handleClear} style={styles.icon}>
            <X size={16} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.icon}>
          <ChevronDown size={16} />
        </View>
      </View>

      {isOpen && filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleOptionSelect(item)}
                style={styles.option}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

export default AutocompleteSelect;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  icon: {
    paddingLeft: 6,
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    maxHeight: 150,
    borderRadius: 6,
    overflow: 'hidden',
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

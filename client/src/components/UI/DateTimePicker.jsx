import { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, startOfDay } from 'date-fns';

const DateTimePicker = ({ 
  value, 
  onChange, 
  label = 'Due Date',
  showTime = false,
  minDate = new Date()
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ?  new Date(value) : null);
  const [selectedTime, setSelectedTime] = useState(
    value ? format(new Date(value), 'HH:mm') : '09:00'
  );

  const quickOptions = [
    { label: 'Today', value: startOfDay(new Date()) },
    { label: 'Tomorrow', value: startOfDay(addDays(new Date(), 1)) },
    { label: 'Next Week', value: startOfDay(addWeeks(new Date(), 1)) },
    { label: 'Next Month', value: startOfDay(addMonths(new Date(), 1)) }
  ];

  const handleQuickSelect = (date) => {
    setSelectedDate(date);
    if (showTime) {
      const [hours, minutes] = selectedTime. split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
    }
    onChange(date. toISOString());
    if (! showTime) {
      setShowPicker(false);
    }
  };

  const handleDateChange = (e) => {
    const date = new Date(e. target.value);
    setSelectedDate(date);
    
    if (showTime) {
      const [hours, minutes] = selectedTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
    }
    
    onChange(date.toISOString());
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setSelectedTime(time);
    
    if (selectedDate) {
      const [hours, minutes] = time.split(': ');
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onChange(newDate.toISOString());
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    setSelectedTime('09:00');
    onChange(null);
    setShowPicker(false);
  };

  const containerStyle = {
    position: 'relative',
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingLeft: '45px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '16px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const pickerStyle = {
    position:  'absolute',
    top:  '100%',
    left:  0,
    right: 0,
    marginTop: '8px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 1000
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      
      <div style={{ position: 'relative' }}>
        <Calendar 
          size={20} 
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)',
            pointerEvents: 'none'
          }}
        />
        
        <input
          type="text"
          readOnly
          value={selectedDate ? format(selectedDate, showTime ? 'MMM dd, yyyy HH:mm' :  'MMM dd, yyyy') : ''}
          onClick={() => setShowPicker(!showPicker)}
          placeholder="Select date..."
          style={inputStyle}
        />

        {selectedDate && (
          <button
            onClick={handleClear}
            style={{
              position:  'absolute',
              right:  '12px',
              top:  '50%',
              transform:  'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showPicker && (
        <div style={pickerStyle}>
          {/* Quick Options */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              fontSize: '12px', 
              fontWeight:  '600', 
              color: 'var(--text-muted)',
              marginBottom: '8px',
              display: 'block'
            }}>
              QUICK SELECT
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {quickOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleQuickSelect(option.value)}
                  style={{
                    padding:  '8px 12px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius:  '6px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget. style.background = 'var(--color-primary)';
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e. currentTarget.style.borderColor = 'var(--border-primary)';
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Input */}
          <div style={{ marginBottom: showTime ? '16px' : '0' }}>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: 'var(--text-muted)',
              marginBottom:  '8px',
              display:  'block'
            }}>
              CUSTOM DATE
            </label>
            <input
              type="date"
              value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
              onChange={handleDateChange}
              min={format(minDate, 'yyyy-MM-dd')}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Time Input */}
          {showTime && (
            <div>
              <label style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: 'var(--text-muted)',
                marginBottom: '8px',
                display: 'block',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Clock size={14} />
                TIME
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                style={{
                  width: '100%',
                  padding:  '10px 12px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
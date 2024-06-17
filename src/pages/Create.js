import React, { useEffect, useState, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { motion } from 'framer-motion';
import '../App.css';
import ValuePickerModal from '../components/ValuePickerModal';
import RandomValuePickerModal from '../components/RandomValuePickerModal';

const Create = () => {
    const [selectedDate, setSelectedDate] = useState('');

    const [participantLimit, setParticipantLimit] = useState('');
    const [participantLevel, setParticipantLevel] = useState('');
    const [randomValue, setRandomValue] = useState(null);
    const [userId, setUserId] = useState(null);
    const datePickerRef = useRef(null);
  
    const participantLimitList = ['2', '3', '4 Optimal', '5', '6', '7', '8', '9'];
    const participantLevelList = ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper-Intermediate', 'C1 Advanced', 'C2 Proficiency'];
  
    useEffect(() => {
      // Check if Telegram WebApp object is available
      if (window.Telegram && window.Telegram.WebApp) {
        if(window.Telegram.WebApp) {
          setUserId(window.Telegram.WebApp);
          {userId && <p>User ID: {JSON.stringify(userId, null, 2)}</p>}
  
        }
      } 
    }, []);
  
    const handleDateClick = () => {
      datePickerRef.current.flatpickr.open();
    };
  
  
      // Format selected date as "day/month"
    const formatDate = (date) => {
      if (!date) return '';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    };
  
    const sendDataToBot = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const data = {
          //make a single data/time object
          date: selectedDate,
          topic: randomValue,
          participantLimit: participantLimit,
          participantLevel: participantLevel
        };
        window.Telegram.WebApp.sendData(JSON.stringify(data)); // Send data as a JSON string
      }
    };
  
    const handleParticipantsLimit = (selectedLimit) => {
      setParticipantLimit(selectedLimit);
    };
  
    const handleLevel = (selectedLevel) => {
      setParticipantLevel(selectedLevel);
    };
  
    const handleRandomValueSave = (selectedValue) => {
      setRandomValue(selectedValue);
    };
  
    return (
      <motion.div 
        className="container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Create you own speaking club! 🚀</h1>
        
        <div className="picker-container">
          {/* <button onClick={handleDateClick}>
            {selectedDate ? `Selected Date🕒  ${formatDate(selectedDate)}` : 'Date And Time🕒'}
          </button> */}
          <Flatpickr
            ref={datePickerRef}
            placeholder='Select date and time'
            value={selectedDate}
            onChange={(date) => setSelectedDate(date[0])}
            options={{
              enableTime: true,
              altFormat: "F j, Y H:i",
              dateFormat: 'Y-m-d H:i',
              position: "auto center",
              altInput: true,
              altInputClass: "flatpickr-alt-input-class",
              disableMobile: true,
              minDate: "today",
              maxDate: new Date().fp_incr(30), // 14 days from now
              time_24hr: true
            }}
            style={{ display: 'none' }}
            readOnly
          />
        </div>
  
        <ValuePickerModal valuesList={participantLimitList} buttonText="Patricipants Limit🚫" h2Text="Patricipants Limit" onValueSelect={handleParticipantsLimit} />
  
        <ValuePickerModal valuesList={participantLevelList} buttonText="Patricipants Level⬆️" h2Text="Patricipants Level" onValueSelect={handleLevel} />
  
        <RandomValuePickerModal onSave={handleRandomValueSave} />
  
        <button className="pulsing-button" onClick={sendDataToBot} >Create!🤩</button>
  
      </motion.div>
    );
};

export default Create;

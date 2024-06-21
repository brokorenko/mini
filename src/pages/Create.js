import React, { useEffect, useState, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { motion } from 'framer-motion';
import '../App.css';
import ValuePickerModal from '../components/ValuePickerModal';
import RandomValuePickerModal from '../components/RandomValuePickerModal';
import Congratulations from '../components/Congratulations';
import axios from 'axios';

const Create = () => {
    const [selectedDate, setSelectedDate] = useState('');

    const [participantLimit, setParticipantLimit] = useState('');
    const [participantLevel, setParticipantLevel] = useState('');
    const [randomValue, setRandomValue] = useState(null);
    const [userId, setUserId] = useState(null);
    const datePickerRef = useRef(null);
    const [showCongratulations, setShowCongratulations] = useState(false);
  
    const participantLimits = new Map();
    participantLimits.set('2', 2);
    participantLimits.set('3', 3);
    participantLimits.set('4 Optimal', 4);
    participantLimits.set('5', 5);
    participantLimits.set('6', 6);
    participantLimits.set('7', 7);
    participantLimits.set('8', 8);
    participantLimits.set('9', 9);

    const participantLevels = new Map();
    participantLevels.set('A1 Beginner', 'A1');
    participantLevels.set('A2 Elementary', 'A2');
    participantLevels.set('B1 Intermediate', 'B1');
    participantLevels.set('B2 Upper-Intermediate', 'B2');
    participantLevels.set('C1 Advanced', 'C1');
    participantLevels.set('C2 Proficiency', 'C2');
      
    useEffect(() => {
      // Check if Telegram WebApp object is available
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        setUserId(window.Telegram.WebApp.initDataUnsafe.user.id);
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

    // Function to handle showing congratulations and then closing the app
    const handleCongratulations = () => {
      setShowCongratulations(true);

      // Close the Mini App window after a delay (e.g., 3 seconds)
      setTimeout(() => {
          closeMiniApp();
      }, 3000);
    };

    const closeMiniApp = () => {
      console.log("Closing the Mini App window");
      window.Telegram.WebApp.close();
    };

    const sendDataToBot = () => {
      // if (window.Telegram && window.Telegram.WebApp && userId) {
      if (window.Telegram) {

        const data = {
          date: selectedDate,
          topic: randomValue,
          participantLimit: participantLimit,
          participantLevel: participantLevel,
          userId: 431957763
        };

        // const config = {
        //   headers: {
        //     'Content-Type': 'application/json', // Specify the content type
        //     'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Include authorization token if required
        //   }
        // };
        
        axios.post('http://localhost:3000/club', data)
          .then(response => {
            console.log('Success:', response.data);
            handleCongratulations();
          })
          .catch(error => {
            console.error('Error:', error);
          });

          // closeMiniApp();

        // window.Telegram.WebApp.sendData(JSON.stringify(data)); // Send data as a JSON string
      }
    };
  
    const handleParticipantsLimit = (selectedLimit) => {
      setParticipantLimit(participantLimits.get(selectedLimit));
    };
  
    const handleLevel = (selectedLevel) => {
      setParticipantLevel(participantLevels.get(selectedLevel));
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
              position: "auto top",
              altInput: true,
              altInputClass: "flatpickr-alt-input-class",
              disableMobile: false,
              minDate: "today",
              maxDate: new Date().fp_incr(30), // 14 days from now
              time_24hr: true,
              defaultDate: new Date().fp_incr(1) // 14 days from now
            }}
            style={{ display: 'none' }}
            readOnly={true} 
          />
          {showCongratulations && <Congratulations />}
        </div>
  
        <ValuePickerModal valuesList={Array.from(participantLimits.keys())} buttonText="Patricipants Limit🚫" h2Text="Patricipants Limit" onValueSelect={handleParticipantsLimit} />
  
        <ValuePickerModal valuesList={Array.from(participantLevels.keys())} buttonText="Patricipants Level⬆️" h2Text="Patricipants Level" onValueSelect={handleLevel} />
  
        <RandomValuePickerModal onSave={handleRandomValueSave} />
  
        <button className="pulsing-button" onClick={sendDataToBot} >Create!🤩</button>
  
      </motion.div>
    );
};

export default Create;

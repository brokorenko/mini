import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../App.css';
import "primereact/resources/themes/viva-light/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Congratulations from '../components/Congratulations';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

const Create = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const [participantLimit, setParticipantLimit] = useState(null);
  const [participantLevel, setParticipantLevel] = useState('');
  const [userId, setUserId] = useState(null);
  const datePickerRef = useRef(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [visibleRandomPicker, setVisibleRandomPicker] = useState(null);
  const [visibleCustomPicker, setVisibleCustomPicker] = useState(null);
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [topicOption, setTopicOption] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState(null);
  const toast = useRef(null);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

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

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let nextMonth = month === 11 ? 0 : month + 1;
    let nextYear = nextMonth === 0 ? year + 1 : year;

    setMinDate(new Date());

    let max = new Date();

    max.setMonth(nextMonth);
    max.setFullYear(nextYear);
    setMaxDate(max);
  }, []);

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

    if (topic === null && customTopic === null) {
      show("Error", "Required info is missing", "Fill out the topic");
      return;
    }

    if (selectedDate === null || participantLevel === null || participantLimit === null) {
      show("Error", "Required info is missing", "Fill out all the fields");
      return;
    }

    if (window.Telegram) {
      const data = {
        date: selectedDate,
        topicOption: topicOption,
        topic: topic ? topic : customTopic,
        topicId: topicId,
        selectedQuestions: selectedQuestions,
        participantLimit: participantLimits.get(participantLimit),
        participantLevel: participantLevels.get(participantLevel),
        userId: 431957763
      };

      setShowSpinner(true)
      axios.post('http://localhost:3000/club', data)
        .then(response => {
          handleCongratulations();
          closeMiniApp();
        })
        .catch(error => {
          show("Error", "Can't create speaking club", "We can't create speaking club, please try againg or text to admin");
          setShowSpinner(false);
        })
        .finally(() => {
          setShowSpinner(false);
        }
        );
    }
  };

  const handleRandomClick = async () => {
    try {
      const res = await axios.get('http://localhost:3000/topic/random');
      if (res === null || res.data === null || res.data.name === null || res.data.questions === null || res.data.id === null) {
        throw new Error('Invalid response');
      }
      setTopic(res.data.name);
      setTopicOption(res.data.name);
      setSelectedQuestions(res.data.questions);
      setTopicId(res.data.id);
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setVisibleRandomPicker(false)
      show("Error", "Error generation topic", "We can't generate topic, please try againg or select custom option");
    }
  };

  const handleTopicOption = (selectedOption) => {
    if (selectedOption == 'custom') {
      setTopicOption(null);
      setTopic('');
      setSelectedQuestions(null);
      setVisibleCustomPicker(true);
      return;
    }

    if (selectedOption == 'random') {
      setVisibleRandomPicker(true)
      handleRandomClick();
      return;
    }
  };

  const handleRandomPicker = (selectedOption) => {

    if (selectedOption == 'confirm') {
      setVisibleRandomPicker(false);
      return;
    }

    if (selectedOption == 'regenerate') {
      setVisibleRandomPicker(true);
      setTopic('');
      setSelectedQuestions(null);
      handleRandomClick();
      return;
    }
  };

  const handleCustomTopic = (selectedOption) => {
    setCustomTopic(selectedOption);
    setTopic('');
    setSelectedQuestions(null);
  };

  const handleCustomPicker = (selectedOption) => {
    if (selectedOption == 'confirm') {
      setVisibleCustomPicker(false);
      return;
    }
  };

  const handleTopic = (selectedOption) => {
    if (selectedOption == 'random') {
      handleRandomClick();
      return;
    }
  };

  const topicOptions = [
    { name: 'Random topic', value: 'random' },
    { name: 'Custom topic', value: 'custom' },
  ];

  const randomPickerOptions = [
    { name: 'Regenerate', value: 'regenerate' },
    { name: 'Confirm', value: 'confirm' },
  ];

  const customPickerOptions = [
    { name: 'Confirm', value: 'confirm' },
  ];

  const show = (severity, summary, detail) => {
    toast.current.show({ severity: severity, summary: summary, detail: detail, life: 4000 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className='h1-margin'>Create you own speaking club! 🚀</h1>

      <div className="card flex flex-wrap gap-3 p-fluid">
        <div className="flex-auto">
          <FloatLabel className="float-label-margin">
            <Calendar inputId="club_date" value={selectedDate} onChange={(e) => setSelectedDate(e.value)} showIcon showTime hourFormat="24" minDate={minDate} maxDate={maxDate} readOnlyInput touchUI />
            <label htmlFor="club_date" className="font-bold block mb-2">Date</label>
          </FloatLabel>
        </div>

        <div className="flex-auto">
          <FloatLabel className="float-label-margin">
            <Dropdown id='participants_limit' value={participantLimit} onChange={(e) => setParticipantLimit(e.value)} options={Array.from(participantLimits.keys())} placeholder="Patricipants Limit" className="w-full md:w-14rem" />
            <label htmlFor="participants_limit" className="font-bold block mb-2">Patricipants Limit</label>
          </FloatLabel>
        </div>

        <div className="flex-auto">
          <FloatLabel className="float-label-margin">
            <Dropdown id='participants_level' value={participantLevel} onChange={(e) => setParticipantLevel(e.value)} options={Array.from(participantLevels.keys())} placeholder="Patricipants Level" className="w-full md:w-14rem" />
            <label htmlFor="participants_level" className="font-bold block mb-2">Patricipants Level</label>
          </FloatLabel>
        </div>

        <div className="flex-auto">
          <SelectButton value={topicOption} onChange={(e) => handleTopicOption(e.value)} optionLabel="name" options={topicOptions} />
          <Dialog header="Random topic picker" visible={visibleRandomPicker} style={{ width: '50vw' }} onHide={() => { if (!visibleRandomPicker) return; setVisibleRandomPicker(false); }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            <div className="card flex flex-wrap justify-content-center gap-3">
              <SelectButton value={topicOption} onChange={(e) => handleRandomPicker(e.value)} optionLabel="name" options={randomPickerOptions} />
            </div>
            {topic ? (
              <div>
                <h2>{topic}</h2>
                <div>
                  {selectedQuestions.map((question, index) => (
                    <p key={index}>- {question}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card">
                <ProgressSpinner />
              </div>
            )}

          </Dialog>

          <Dialog header="Create custom topic" visible={visibleCustomPicker} style={{ width: '50vw' }} onHide={() => { if (!visibleCustomPicker) return; setVisibleCustomPicker(false); }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            <div className="card flex flex-wrap justify-content-center gap-3 float-label-margin">
              <SelectButton value={topicOption} onChange={(e) => handleCustomPicker(e.value)} optionLabel="name" options={customPickerOptions} />
            </div>
            <div className="flex-auto">
              <FloatLabel>
                <InputText id="customTopic" value={customTopic} onChange={(e) => handleCustomTopic(e.target.value)} aria-describedby="customTopic-help" />
                <label htmlFor="customTopic">Short Topic Name</label>
              </FloatLabel>
              <small id="customTopic-help">
                Enter the topic you want to discuss.
              </small>
            </div>
          </Dialog>
        </div>
      </div>

      <button className="pulsing-button" onClick={sendDataToBot} >Create!🤩</button>

      {showCongratulations && <Congratulations />}

      <div className="card flex justify-content-center">
        <div className="flex flex-wrap gap-2">
          <Toast ref={toast} position="top-center" />
        </div>
      </div>

      {showSpinner && (
        <div className="spinner-container">
          <ProgressSpinner />
        </div>
      )}

    </motion.div>
  );
};

export default Create;

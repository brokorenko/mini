import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import App from '../App';
import '../App.css';  // Import your custom styles if needed

Modal.setAppElement('#root'); // Set the app element to the root element of your application

const RandomValuePickerModal = ({ onSave }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState(null);


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setResponse(null);  // Reset the response when modal is closed
    // setSelectedValue(null);  // Reset the selected value when modal is closed
    setSelectedTopic(null);  // Save response data to selectedValue
    setSelectedQuestions(null);  // Save response data to selectedValue
  };



  const handleRandomClick = async () => {
    try {
      const res = await axios.get('http://localhost:3000/topic/random'); // Replace with your API endpoint
      setResponse(res.data);
      setSelectedValue(res.data.id);  // Save response data to selectedValue
      setSelectedTopic(res.data.name);  // Save response data to selectedValue
      setSelectedQuestions(res.data.questions);  // Save response data to selectedValue
    } catch (error) {
      console.error('Error fetching random value:', error);
    }
  };

  const handleIDoItClick = () => {
    setSelectedValue(null);
    closeModal();
  };

  const handleSubmit = () => {
    onSave(selectedValue);
    closeModal();
  };

  return (
    <div className="picker-container">
      <button onClick={openModal}>Select Topic</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Select Value"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Select Topic</h2>
        <button className="topic-button"  onClick={handleRandomClick}>Random</button>
        <button className="topic-button" onClick={handleIDoItClick}>I Do It</button>
        <button className="topic-button" onClick={closeModal}>Close</button>
        {response && 
              <div>
              <h1>{selectedTopic}</h1>
              <div>
                {selectedQuestions.map((question, index) => (
                  <p key={index}>- {question}</p>
                ))}
              </div>
            </div>
        }
        {response && (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </Modal>
    </div>
  );
};

export default RandomValuePickerModal;

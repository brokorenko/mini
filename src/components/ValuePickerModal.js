import React, { useState } from 'react';
import Modal from 'react-modal';
import App from '../App';
import '../App.css';  // Import your custom styles if needed


Modal.setAppElement('#root'); // Set the app element to the root element of your application


const ValuePickerModal = ({ valuesList, buttonText, h2Text, onValueSelect }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleValueClick = (value) => {
    setSelectedValue(value);
    onValueSelect(value);
    closeModal();
  };

  return (
    <div className="picker-container">
      <button onClick={openModal}>
        {selectedValue ? `${buttonText} ${selectedValue}` : buttonText}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Select Value"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{h2Text}</h2>
        <ul>
          {valuesList.map((value, index) => (
            <li key={index} onClick={() => handleValueClick(value)} className="value-item">
              {value}
            </li>
          ))}
        </ul>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default ValuePickerModal;

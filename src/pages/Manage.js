import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';


import axios from 'axios';
import { motion } from 'framer-motion';

function formatDate(dateString) {
  // Parse the date string
  let date = new Date(dateString);

  // Extract the components
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are zero-based
  let year = date.getFullYear() % 100; // Get last two digits of the year

  // Add leading zeros if necessary
  if (day < 10) {
      day = '0' + day;
  }
  if (month < 10) {
      month = '0' + month;
  }
  if (year < 10) {
      year = '0' + year;
  }

  // Format the date as dd-mm-yy
  return `${day}/${month}/${year}`;
}

const Manage = () => {

    const [userId, setUserId] = useState(null);
    const [response, setResponse] = useState(null);
    const [products, setProducts] = useState(null);

    const columns = [
      { field: 'date', header: 'Date' },
      { field: 'topic', header: 'Topic' },
      { field: 'participantLimit', header: 'Limit' },
      { field: 'participantLevel', header: 'Level' }
    ];

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
        if (window.Telegram && window.Telegram.WebApp) {
          if(window.Telegram.WebApp) {
            // setUserId(window.Telegram.WebApp);    
            setUserId(12334455);    
          }
        } 

        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/upcoming/clubs', {
                  params: {
                      userId: 431957763
                  }
              });
      
              setResponse(res.data);
              setProducts(res.data)
              
              //   setResponse(res.data);
              //   setSelectedValue(res.data.id);  // Save response data to selectedValue
              //   setSelectedTopic(res.data.name);  // Save response data to selectedValue
              //   setSelectedQuestions(res.data.questions);  // Save response data to selectedValue
              } catch (error) {
                console.error('Error fetching random value:', error);
              } finally {

              }
        }

        fetchData();
      }, []);  

      const isPositiveInteger = (val) => {
        let str = String(val);

        str = str.trim();

        if (!str) {
            return false;
        }

        str = str.replace(/^0+/, '') || '0';
        let n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case 'quantity':
            case 'price':
                if (isPositiveInteger(newValue)) rowData[field] = newValue;
                else event.preventDefault();
                break;

            default:
                if (newValue.trim().length > 0) rowData[field] = newValue;
                else event.preventDefault();
                break;
        }
    };

    const cellEditor = (options) => {
        if (options.field === 'date') 
          return dateEditor(options);
        if(options.field === 'participantLimit')
          return dropdownEditor(options);
        else 
          return textEditor(options);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
    };

    const dateEditor = (options) => {
      return <Calendar value={options.value} onChange={(e) => options.editorCallback(e.value)} showTime hourFormat="24" touchUI />;
    };

    const dropdownEditor = (options) => {
      return <Dropdown value={options.value} onChange={(e) => options.editorCallback(e.value)} options={Array.from(participantLimits.keys())} />
    };

    const dateTemplate = (rowData) => {
      if(rowData === null || rowData.date === null) {
        return '0';
      }
      return formatDate(rowData.date);  
    };

    const participantLimitTemplate = (rowData, field) => {
      if(rowData === null || rowData.participantLimit === null) {
        return '0';
      }
      return String(rowData.participantLimit);
      
  };

    return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Speaking club managment⚙️</h1>
          <div className="card flex flex-wrap gap-3 p-fluid">
            <DataTable value={products} editMode="cell" paginator rows={5} rowsPerPageOptions={[5, 10]} >
              <Column field="date" header="Date" body={dateTemplate} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}></Column>
              <Column field="participantLimit" header="Limit" body={participantLimitTemplate} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} ></Column>
              <Column field="participantLevel" header="Level" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} ></Column>
              <Column field="topic" header="Topic" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} ></Column>
            </DataTable>
          </div>
        </motion.div>
      );
};

export default Manage;

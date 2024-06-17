import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Manage = () => {

    const [userId, setUserId] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);


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
              
              //   setResponse(res.data);
              //   setSelectedValue(res.data.id);  // Save response data to selectedValue
              //   setSelectedTopic(res.data.name);  // Save response data to selectedValue
              //   setSelectedQuestions(res.data.questions);  // Save response data to selectedValue
              } catch (error) {
                console.error('Error fetching random value:', error);
              } finally {
                // Set loading to false after the request is completed
                setLoading(false);
              }
        }

        fetchData();
      }, []);  

      if (loading) return <div>Loading...</div>;

    return (
        <motion.div 
          className="container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Speaking club managment</h1>
          
          {response && 
              <div>
              <h1>{response}</h1>
              <div>
                {response.map((question, index) => (
                  <p key={index}>- {question}</p>
                ))}
              </div>
            </div>
        }
          
    
        </motion.div>
      );
};

export default Manage;

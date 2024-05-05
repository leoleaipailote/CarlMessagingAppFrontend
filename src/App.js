  import './App.css';
  import { socket } from './socket';
  import React, { useState, useEffect} from 'react';
  import { motion, usePresence, AnimatePresence } from 'framer-motion'
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import axios from 'axios'
  import glassesImage from './glasses.jpeg';


  function Home() {
    const [messages, setMessages] = useState([])
    console.log(messages)
    useEffect(() => {
      getPreviousMessages();
      socket.on('getMessage', (data) => {
        console.log("DATA" + data);
        setMessages(prevMessages => {
          const string = `${data.message} - ${new Date(data.createdAt).toLocaleTimeString()}`
          const updatedMessages =  [string, ...prevMessages]
          return updatedMessages.slice(0, 5);
        });
      })
      return () => {
        socket.off('getMessage');
      };
    }, [])

    const getPreviousMessages = async () => {
      try{
        const messageArray = await axios.get(`http://localhost:3000/api/v1/Messages/Messages/getMessages`)
        const stringifyArray = convertMessagesToStrings(messageArray.data);
        setMessages(stringifyArray);
        console.log(stringifyArray);
      }
      catch(err){
        console.log("getPreviousMessages ERROR: " + err);
      }
    }

    // Function to convert array of objects into array of formatted strings
  const convertMessagesToStrings = (messagesArray) => {
    return messagesArray.map(item => {
        // Format the date as a readable string
        // Return the formatted message string
        return `${item.message} - ${new Date(item.createdAt).toLocaleTimeString()}`;
    });
  };

    return (
      <div className="message-container">
          <img src={glassesImage} alt="Glasses" style={{ width: '175px', height: 'auto' }} />

          <h1 className="title">Catching Up with Carl</h1>
          <AnimatePresence>
              {messages.map((msg, index) => (
                  <ListItem key={msg}>
                      <span className="list-item">{msg}</span>
                  </ListItem>
              ))}
          </AnimatePresence>
      </div>
    );
  }
  
  // Dashboard component
  function Form() {
    const [message, setMessage] = useState('');
    const [passcode, setPasscode] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false)

    const checkPasscode = (e) => {
      e.preventDefault();
      if(passcode === process.env.REACT_APP_PASSCODE){
        setIsAuthorized(true);
      }
      else{
        alert("WRONG PASSCODE!")
      }
    }

    const sendMessage = (e) => {
      e.preventDefault();
      socket.emit('receiveMessage', message);
    };
  
    return (
      <div className="App">
        <header className="App-header">
        {!isAuthorized ? (
              <form onSubmit={checkPasscode}>
                  <label>
                      Enter Passcode:
                      <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} />
                  </label>
                  <button type="submit">Unlock</button>
              </form>
          ) : (
              <form onSubmit={sendMessage}>
                  <label>
                      Message:
                      <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
                  </label>
                  <button type="submit">Submit Message</button>
              </form>
          )}
        </header>
      </div>
    );

  }

  const transition = { type: 'spring', stiffness: 500, damping: 50, mass: 1 }

  function ListItem({ children }) {
    const [isPresent, safeToRemove] = usePresence()

    const animations = {
      layout: true,
      initial: 'out',
      style: {
        position: isPresent ? 'static' : 'absolute'
      },
      animate: isPresent ? 'in' : 'out',
      whileTap: 'tapped',
      variants: {
        in: { scaleY: 1, opacity: 1 },
        out: { scaleY: 0, opacity: 0, zIndex: -1},
        tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } }
      },
      onAnimationComplete: () => !isPresent && safeToRemove(),
      transition
    }

    return (
      <motion.h2 {...animations}>
        {children}
      </motion.h2>
    )
  }
  
  // App component with routing
  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;

  import './App.css';
  import { socket } from './socket';
  import React, { useState } from 'react';

  function App() {
    const [message, setMessage] = useState('');

    const sendMessage = (e) => {
      e.preventDefault();
      socket.emit('receiveMessage', message)
    }
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={sendMessage}>
            <label>
              Message:    
              <input type="text" onChange={e => setMessage(e.target.value)}/>
            </label>
            <button type="submit">Submit Message</button>
          </form>
            <p>IP: {process.env.REACT_APP_IP}</p>
        </header>
      </div>
    );
  }

  export default App;

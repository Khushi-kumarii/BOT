import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`App ${darkMode ? 'app-dark' : 'app-light'}`}>
      <ChatBox darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;

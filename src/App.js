// frontend/src/App.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      // Proxy will forward this to backend
      const resp = await axios.post('/chat', { message: input });
      setMessages([...newMessages, { text: resp.data.reply, sender: 'bot' }]);
    } catch (err) {
      console.error('Chat error:', err);
      // Show a helpful message to user
      setMessages([...newMessages, { text: 'Error: could not reach Deep Chat. See console.', sender: 'bot' }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🤖 Deep Chat</h2>
        <p>Your AI companion</p>
      </div>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === 'user' ? 'user-msg' : 'bot-msg'}>
            {m.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;

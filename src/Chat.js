import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Switch } from '@mui/material';

import './Chat.css';
import Message from './Message';

import msoeLogo from './MSOE Logo.png';
import loadingGif from './Loading-Icon.gif';

const scrollBottom = () => {
  var elem = document.getElementById('chat-container');
  elem.scrollTop = elem.scrollHeight;
}

const Chatbot = ({ toggleTheme, themeMode }) => {
  // Messages in chat
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  // User input
  const [input, setInput] = useState('');

  // Feedback buttons
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  const API_URL = "https://kodvij8iki.execute-api.us-east-2.amazonaws.com/prod/message";
  const token = new URLSearchParams(document.location.search).get('token');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !inputDisabled) {
      handleSendMessageStreamed();
    }
  };

  const handleSendMessageStreamed = async () => {
    // handle case if user enters string with no substance: "", "     ", etc.
    if (!input.trim()) return;

    // When the bot starts generating the message
    setInputDisabled(true);

    const userMessage = {
      text: input,
      role: "user",
    };

    let botMessage = {
      text: "",
      role: "bot",
      sources: []
    };

    await setMessages(messages => [...messages, userMessage]);
    setInput("");
    scrollBottom();

    try {
      // Send the user's message to the backend API
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          messages: [...messages, userMessage]
        })
      });

      // Get the response from the backend API
      const responseJson = await response.json();

      botMessage.sources = responseJson.sources;
      botMessage.text = responseJson.text;

      // after start llm response, get actual bot message
      setMessages((messages) => [...messages, botMessage]);
      scrollBottom();

      // Enable the input and send button when the bot has finished responding
      setInputDisabled(false);
    } catch (error) {
      console.log(error);
      
      // Enable the input and send button when recieve error
      setInputDisabled(false);
    }
  }

  const renderMessage = (message, index) => {
    return <Message
      key={message.id || index}
      index={index}
      message={message}
      likes={likes}
      setLikes={setLikes}
      dislikes={dislikes}
      setDislikes={setDislikes}
    />
  };

  const renderLoadingGif = () => {
    if (inputDisabled) {
      return <img id='loadingGif' src={loadingGif} alt="Loading..." />;
    } else {
      return <span></span>
    }
  }

  return (
    <div className={`chat-app ${themeMode}`}>
      <Paper elevation={3} style={{ position: "relative", padding: '20px', maxWidth: '90%', margin: '20px auto', height: 'calc(100% - 80px)' }}>
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          {/* Top bar */}
          <div id="logo-bar" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px', alignItems: 'center', gap: '15px' }}>
            <img src={msoeLogo} alt='logo' width='75' />
            <Typography variant='h5'>General Rosie Chatbot</Typography>
          </div>

          {/* Options bar */}
          <div id="options-bar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' }}>
            <Button disabled={true}>Dark Mode</Button>
            <Switch checked={themeMode === 'dark'} onChange={toggleTheme} name='themeModeToggle' inputProps={{ 'aria-label': 'secondary checkbox' }} />
          </div>
          <div style={{ flexGrow: 5, overflow: 'hidden' }}>
            {/* Message body */}
            <div id="chat-container" style={{ position: 'relative', maxHeight: '100%', overflowY: 'auto' }}>
              {messages.map(renderMessage)}
              {renderLoadingGif()}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {/* User input */}
            <div id='sendTextDiv'>
              <TextField
                id='textField'
                type='text'
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder='Your message'
                style={{ flex: 1, marginRight: "10px", marginTop: "10px" }}
                autoComplete="off"
                disabled={inputDisabled}
              />
              <Button id="sendBtn" variant="contained" color="primary" onClick={handleSendMessageStreamed} disabled={inputDisabled} style={{ marginTop: "10px" }}>
                Send
              </Button>
            </div>
          </div>

          {/* Disclaimer message */}
          <Typography variant="body2" style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem' }}>
            This is a Beta Version. The Bot can make mistakes. Consider checking important information.
          </Typography>

        </div>
      </Paper>
    </div>
  );
};

export default Chatbot;

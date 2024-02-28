import { useState } from 'react';

const App = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseoptions = [
    'Who won the latest Novel Peace Prize?',
    'Where does the pizza come from?',
    'Who do you make a BLT sandwich?',
  ];

  const surprise = () => {
    const randomValue =
      surpriseoptions[Math.floor(Math.random() * surpriseoptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError('Error! Please ask a question!');
      return;
    }

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: 'user',
          parts: value,
        },
        {
          role: 'model',
          parts: data,
        },
      ]);
    } catch (error) {
      console.log(error);
      setError('Something went wrong! Please try again later.');
    }
  };

  const clear = () => {
    setValue('');
    setError('');
    setChatHistory([]);
  };

  return (
    <div className='app'>
      <div className='search-result'>
        {chatHistory.map((chatItem, index) => (
          <div key={index}>
            <p className='answer'>
              {chatItem.role} : {chatItem.parts}
            </p>
          </div>
        ))}
      </div>
      <p>
        What do you want to know?
        <button className='surprise' onClick={surprise} disabled={!chatHistory}>
          Surprise me
        </button>
      </p>
      <div className='input-container'>
        <input
          value={value}
          placeholder='When is Diwali....'
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default App;

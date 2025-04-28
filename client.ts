// client/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setError(null);
    try {
      const resp = await axios.get(`/api/file/${filename}`);
      setContent(resp.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching file');
      setContent('');
    }
  };

  return (
    <div className="App">
      <h1>Fetch File from Server</h1>
      <input
        type="text"
        placeholder="Enter file name (without .txt)"
        value={filename}
        onChange={e => setFilename(e.target.value)}
      />
      <button onClick={handleFetch}>Fetch</button>
      {error && <p className="error">{error}</p>}
      {content && (
        <pre className="file-content">{content}</pre>
      )}
    </div>
  );
}

export default App;

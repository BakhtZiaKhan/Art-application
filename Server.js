// ===== server/index.js =====
// A simple Express server serving React build and exposing a REST endpoint to fetch text files
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve React static files from client/build
app.use(express.static(path.join(__dirname, 'client', 'build')));

// REST endpoint to fetch a .txt file by name (without extension)
app.get('/api/file/:name', (req, res) => {
  const fileName = req.params.name;
  const filePath = path.join(__dirname, 'files', `${fileName}.txt`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.type('text/plain').send(data);
  });
});

// All other requests serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


// ===== client/src/App.js =====
// A React frontend that fetches a file from the server and displays its contents
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

// ===== project structure =====
//
// root/
// ├─ files/                <-- place your .txt files here
// │   └─ example.txt
// ├─ client/               <-- React app created via create-react-app
// │   ├─ build/            <-- production build (after npm run build)
// │   └─ src/
// │       └─ App.js        <-- front-end code above
// ├─ package.json          <-- dependencies for server and proxy to client
// └─ server/index.js       <-- code above

// ===== package.json (root) =====
// {
//   "name": "react-node-file-server",
//   "version": "1.0.0",
//   "main": "server/index.js",
//   "scripts": {
//     "start": "node server/index.js",
//     "postinstall": "npm --prefix client install client && npm --prefix client run build"
//   },
//   "dependencies": {
//     "cors": "^2.8.5",
//     "express": "^4.18.2"
//   }
// }

// ===== Quick Start =====
// 1. Clone this repo.
// 2. Place your .txt files in the files/ directory.
// 3. Run npm install at the root.
// 4. The postinstall script will install client deps and build React.
// 5. Run npm start.
// 6. Open http://localhost:3001 in your browser.

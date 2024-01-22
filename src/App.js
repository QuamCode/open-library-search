// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';

import './App.css';

function App() {
  const [library, setLibrary] = useState([]);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book Finder
          </Typography>
          <Box>
            <Link to="/">Search</Link>
            <Link to="/library">Library</Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Container className="container">
        <Routes>
          <Route path="/" element={<SearchPage library={library} setLibrary={setLibrary} />} />
          <Route path="/library" element={<LibraryPage library={library} setLibrary={setLibrary} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { TextField, Button, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchForm({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'flex', gap: 1 }}>
      <TextField
        label="Enter Title or ISBN"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" type="submit">Search</Button>
    </Box>
  );
}

export default SearchForm;

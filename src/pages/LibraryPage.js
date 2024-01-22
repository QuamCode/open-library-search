import React from 'react';
import { Typography, Grid } from '@mui/material';
import LibraryItem from '../components/LibraryItem';

function LibraryPage({ library, setLibrary }) {
  const removeBook = (isbn) => {
    setLibrary(library.filter(book => book.isbn !== isbn));
  };

  if (!library.length) return <Typography>Your library is empty.</Typography>;

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>Your Library</Typography>
      <div className="bookshelf">
        {library.map((book, index) => (
          <LibraryItem key={index} book={book} onRemove={() => removeBook(book.isbn)} />
        ))}
      </div>
    </div>
  );
}

export default LibraryPage;

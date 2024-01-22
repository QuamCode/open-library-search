import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

function BookDisplay({ book, onAddToLibrary }) {
  if (!book) return null;

  return (
    <Card sx={{ maxWidth: 345, mb: 2 }}>
    <CardMedia
      component="img"
      image={book.cover}
      alt={book.title}
      sx={{ height: 140, objectFit: 'contain' }} // Adjust as needed
    />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Author: {book.authors}<br/>
          ISBN: {book.isbn}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onAddToLibrary}>Add to Library</Button>
      </CardActions>
    </Card>
  );
}

export default BookDisplay;

import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Dialog, DialogTitle, DialogContent, CardMedia, Grid, Box } from '@mui/material';
import axios from 'axios';

function LibraryItem({ book, onRemove }) {
  const [open, setOpen] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setLoading(true);
    axios.get(`https://openlibrary.org/isbn/${book.isbn}.json`)
      .then(response => {
        setAdditionalInfo(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching book details:', error);
        setLoading(false);
      });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderAdditionalInfo = () => {
    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    if (!additionalInfo) {
      return <Typography>No additional information available.</Typography>;
    }

    return (
      <>
        {additionalInfo.subtitle && <Typography paragraph><strong>Subtitle:</strong> {additionalInfo.subtitle}</Typography>}
        {additionalInfo.publishers && <Typography paragraph><strong>Publishers:</strong> {additionalInfo.publishers.join(', ')}</Typography>}
        {additionalInfo.number_of_pages && <Typography paragraph><strong>Number of Pages:</strong> {additionalInfo.number_of_pages}</Typography>}
        {additionalInfo.physical_format && <Typography paragraph><strong>Format:</strong> {additionalInfo.physical_format}</Typography>}
        {additionalInfo.publish_date && <Typography paragraph><strong>Publish Date:</strong> {additionalInfo.publish_date}</Typography>}
        {/* Add more fields as needed */}
      </>
    );
  };

  return (
    <Grid item>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={book.cover}
          alt={book.title}
          sx={{ width: 151, height: 200, borderRadius: 1, boxShadow: 3, cursor: 'pointer' }}
          onClick={handleOpen}
        />
        <Box sx={{ height: '20px', width: '100%', backgroundColor: '#8b4513', position: 'absolute', bottom: '-20px', boxShadow: 3 }} />
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>{additionalInfo.title || book.title}</DialogTitle>
        <DialogContent>
          {renderAdditionalInfo()}
        </DialogContent>
        <CardActions>
          <Button onClick={onRemove} color="error">Remove</Button>
        </CardActions>
      </Dialog>
    </Grid>
  );
}

export default LibraryItem;

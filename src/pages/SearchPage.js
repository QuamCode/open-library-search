




import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import BookDisplay from '../components/BookDisplay';
import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

function SearchPage({ library, setLibrary }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

    const isValidISBN = (isbn) => {
      return /^(97(8|9))?\d{9}(\d|X)$/.test(isbn);
    };

    const fetchBookByISBN = async (isbn) => {
      try {
        const response = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
        const workId = response.data.works[0].key;
        return fetchRelatedBooks(workId);
      } catch (error) {
        console.error("Error fetching book by ISBN:", error);
        setErrorMessage('Error fetching book information.');
        setBooks([]);
      }
    };

    const fetchRelatedBooks = async (workId) => {
      try {
        const response = await axios.get(`https://openlibrary.org${workId}.json`);
        const relatedEditions = response.data.editions;
        const books = await Promise.all(relatedEditions.map(async (editionKey) => {
          const editionResponse = await axios.get(`https://openlibrary.org${editionKey}.json`);
          return {
            title: editionResponse.data.title,
            authors: editionResponse.data.authors ? editionResponse.data.authors.map(a => a.name).join(', ') : 'Unknown Author',
            cover: editionResponse.data.cover ? `http://covers.openlibrary.org/b/id/${editionResponse.data.cover}-M.jpg` : 'https://via.placeholder.com/150',
            isbn: editionResponse.data.isbn_13 || editionResponse.data.isbn_10 || 'ISBN not available'
          };
        }));
        setBooks(books);
      } catch (error) {
        console.error("Error fetching related books:", error);
        setErrorMessage('Error fetching related books.');
        setBooks([]);
      }
    };

    const handleSearch = (searchTerm) => {
      setLoading(true);
      setErrorMessage('');
      if (isValidISBN(searchTerm)) {
        fetchBookByISBN(searchTerm);
      } else {
        axios.get(`https://openlibrary.org/search.json?title=${searchTerm}`)
          .then(response => {
            if (response.data.docs && response.data.docs.length > 0) {
              const books = response.data.docs.map(bookData => ({
                title: bookData.title,
                authors: bookData.author_name ? bookData.author_name.join(', ') : 'Unknown Author',
                cover: bookData.cover_i ? `http://covers.openlibrary.org/b/id/${bookData.cover_i}-M.jpg` : 'https://via.placeholder.com/150',
                isbn: bookData.isbn ? bookData.isbn[0] : 'ISBN not available'
              }));
              setBooks(books);
            } else {
              setErrorMessage('No results found.');
              setBooks([]);
            }
          })
          .catch(error => {
            console.error("Error fetching data:", error);
            setErrorMessage('Error fetching book information.');
            setBooks([]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };

    const addToLibrary = (book) => {
      if (!library.some(libBook => libBook.isbn === book.isbn)) {
        setLibrary([...library, book]);
      } else {
        alert("This book is already in your library.");
      }
    };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {loading && <CircularProgress />}
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <Box sx={{ my: 2 }}>
        {books.slice(0, 10).map((book, index) => (
          <BookDisplay key={index} book={book} onAddToLibrary={() => addToLibrary(book, setLibrary, library)} />
        ))}
      </Box>
    </div>
  );
}

export default SearchPage;

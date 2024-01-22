import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import BookDisplay from '../components/BookDisplay';
import { Box, CircularProgress, Typography, Grid, Pagination } from '@mui/material';
import axios from 'axios';

function SearchPage({ library, setLibrary }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10); // Number of results per page

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

      const indexOfLastBook = currentPage * booksPerPage;
      const indexOfFirstBook = indexOfLastBook - booksPerPage;
      const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

      const paginate = (event, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      return (
        <div>
          <SearchForm onSearch={handleSearch} />
          {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', my: 2 }} />}
          {errorMessage && <Typography color="error" sx={{ my: 2 }}>{errorMessage}</Typography>}
          <Grid container spacing={2} sx={{ my: 2 }}>
            {currentBooks.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <BookDisplay book={book} onAddToLibrary={() => addToLibrary(book, setLibrary, library)} />
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(books.length / booksPerPage)}
            page={currentPage}
            onChange={paginate}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', my: 2 }}
          />
        </div>
      );
    }

    export default SearchPage;
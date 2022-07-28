import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../SearchBar/Searchbar.module.css';
import PropTypes from 'prop-types';

export default function Searchbar(props) {
  const [searchInput, setSearchInput] = useState('');
  const handlerSubmit = event => {
    event.preventDefault();

    if (searchInput.trim() === '') {
      return toast.error('Please enter request');
    }
    props.onSubmit(searchInput);
    setSearchInput('');
  };

  const handlerChange = event => {
    setSearchInput(event.currentTarget.value.toLowerCase());
  };

  return (
    <header className={styles.searchbar}>
      <form onSubmit={handlerSubmit} className={styles.searchForm}>
        <button type="submit" className={styles.searchButton}>
          <span className={styles.searchButtonLabel}>Search</span>
        </button>
        <input
          className={styles.searchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchInput}
          onChange={handlerChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

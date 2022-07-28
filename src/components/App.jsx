import { useState, useEffect } from 'react';
import Searchbar from './SearchBar/Searchbar';
import PixaBay from '../API/PixaBay';
import ModalWindow from './ModalWindow/ModalWindow';
import ImageGallery from './ImageGallery/ImageGallery';
import LoaderSpinner from './Loader/Loader';
import Button from './Button/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    if (searchInput === '') return;
    PixaBay.fetchImages(searchInput, page)
      .then(({ hits }) => {
        console.log(hits.length);
        if (hits.length === 0) {
          return setError(`could not find image by request ${searchInput}`);
        }
        setPage(page);
        setImages(prevState => {
          return [...prevState, ...hits];
        });
      })
      .catch(error => console.log)
      .finally(() => setLoading(false));
  }, [page, searchInput]);

  const onSearch = string => {
    if (string === searchInput) {
      return;
    }
    setImages([]);
    setSearchInput(string);
    setPage(1);

    setError(null);
    setLoading(true);
  };

  const onLoadMore = () => {
    setLoading(true);
    setPage(page => page + 1);
    scroll();
  };

  const scroll = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 1000);
  };

  const modalWindowOpen = image => {
    setModalImage(image);
  };
  const modalWindowClose = () => {
    setModalImage('');
  };

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={onSearch} />
      {isLoading && <LoaderSpinner />}
      {images.length > 0 && (
        <ImageGallery onClickImage={modalWindowOpen} images={images} />
      )}
      {images.length >= 12 * page && <Button loadImages={onLoadMore} />}
      {modalImage && (
        <ModalWindow onClose={modalWindowClose} largeimg={modalImage} />
      )}
      {error && <p className={styles.error}>{error}</p>}
      <ToastContainer autoClose={3000} />
    </div>
  );
}

export default App;

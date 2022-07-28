import { Component } from 'react';
import Searchbar from './SearchBar/Searchbar';
import PixaBay from '../API/PixaBay';
import ModalWindow from './ModalWindow/ModalWindow';
import ImageGallery from './ImageGallery/ImageGallery';
import LoaderSpinner from './Loader/Loader';
import Button from './Button/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';

class App extends Component {
  state = {
    searchInput: '',
    images: [],
    page: 1,
    isLoading: false,
    error: null,
    showModal: false,
    largeimg: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const previousInput = prevState.searchInput;
    const nextInput = this.state.searchInput;
    const nextPage = this.state.page;

    if (previousInput !== nextInput) {
      this.setState({ isLoading: true });
      PixaBay.fetchImages(nextInput, nextPage)
        .then(({ hits }) => {
          if (hits.length === 0) {
            return this.setState({
              status: 'rejected',
              error: `could not find image by request ${nextInput}`,
            });
          }
          this.setState({
            images: hits,
            page: 1,
            status: 'resolved',
          });
        })
        .catch(error => this.setState({ error, status: 'rejected' }))
        .finally(() => this.setState({ isLoading: false }));
    }
  }
  onLoadMore = () => {
    PixaBay.fetchImages(this.state.searchInput, this.state.page + 1).then(
      ({ hits }) => {
        if (hits.length === 0) {
          return this.setState({
            status: 'rejected',
            error: `could not find image by request ${this.state.searchInput}`,
          });
        }
        this.setState(({ images, page }) => ({
          images: [...images, ...hits],
          page: page + 1,
          status: 'resolved',
        }));
      }
    );
  };

  onSearch = searchInput => {
    this.setState({ searchInput, page: 1, error: null });
  };

  scroll = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 1000);
  };

  modalWindowOpen = largeimg => {
    this.setState(() => ({
      largeimg: largeimg,
    }));
  };
  modalWindowClose = () => {
    this.setState({
      largeimg: '',
    });
  };

  render() {
    const { images, error, largeimg, isLoading, page } = this.state;
    return (
      <div className={styles.App}>
        <Searchbar onSubmit={this.onSearch} />
        {isLoading && <LoaderSpinner />}
        {images.length > 0 && !error && (
          <ImageGallery onClickImage={this.modalWindowOpen} images={images} />
        )}
        {images.length >= 12 * page && <Button loadImages={this.onLoadMore} />}
        {largeimg && (
          <ModalWindow onClose={this.modalWindowClose} src={largeimg} />
        )}
        {error && <p className={styles.error}>{error}</p>}
        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}
export default App;

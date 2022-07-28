import React, { Component } from 'react';
import styles from '../ModalWindow/ModalWindow.module.css';
const body = document.querySelector('body');
export default class ModalWindow extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleCloseModal);
    body.classList.add('no-scroll');
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleCloseModal);
    body.classList.remove('no-scroll');
  }

  handleCloseModal = event => {
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  backDropClick = event => {
    if (event.currentTarget === event.target) {
      this.props.onClose();
    }
  };
  render() {
    const { src, alt } = this.props;
    return (
      <div className={styles.backdrop} onClick={this.backDropClick}>
        <div className={styles.modalOpen}>
          <img className={styles.modalImg} src={src} alt={alt} />
        </div>
      </div>
    );
  }
}

import React, { useEffect } from 'react';
import styles from '../ModalWindow/ModalWindow.module.css';
import PropTypes from 'prop-types';

const body = document.querySelector('body');

export default function ModalWindow(props) {
  useEffect(() => {
    const handleCloseModal = event => {
      if (event.code === 'Escape') {
        props.onClose();
      }
    };
    window.addEventListener('keydown', handleCloseModal);
    body.classList.add('no-scroll');
    return () => {
      window.removeEventListener('keydown', handleCloseModal);
      body.classList.remove('no-scroll');
    };
  });

  const backDropClick = event => {
    if (event.currentTarget === event.target) {
      props.onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={backDropClick}>
      <div className={styles.modalOpen}>
        <img className={styles.modalImg} src={props.largeimg} alt={props.alt} />
      </div>
    </div>
  );
}

ModalWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
};

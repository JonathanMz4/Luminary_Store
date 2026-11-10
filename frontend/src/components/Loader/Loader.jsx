import React from 'react';
import styles from './Loader.module.scss';

const Loader = ({ text = 'Carregando recursos corporativos...', full = false }) => {
  return (
    <div className={`${styles.loaderWrapper} ${full ? styles['loaderWrapper--full'] : ''}`}>
      <div className={styles.spinner} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default Loader;

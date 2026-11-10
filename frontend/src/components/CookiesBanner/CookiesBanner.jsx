import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import styles from './CookiesBanner.module.scss';

const CookiesBanner = () => {
  const [accepted, setAccepted] = useState(() => {
    return localStorage.getItem('luminary_cookies_accepted') === 'true';
  });

  const handleAccept = () => {
    localStorage.setItem('luminary_cookies_accepted', 'true');
    setAccepted(true);
  };

  return (
    <AnimatePresence>
      {!accepted && (
        <motion.div
          className={styles.banner}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.text}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={18} color="var(--accent-primary)" />
              <strong>Privacidade & LGPD</strong>
            </div>
            <p>
              Utilizamos cookies essenciais e analíticos para otimizar sua experiência corporativa e segurança em nossa plataforma.
            </p>
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn--outline" onClick={handleAccept}>
              Preferências
            </button>
            <button type="button" className="btn btn--primary" onClick={handleAccept}>
              Aceitar Todos
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookiesBanner;

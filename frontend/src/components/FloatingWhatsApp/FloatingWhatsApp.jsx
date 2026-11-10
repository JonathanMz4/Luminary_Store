import React from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './FloatingWhatsApp.module.scss';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20um%20atendimento%20corporativo%20na%20Luminary%20Store!"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floatBtn}
      aria-label="Atendimento via WhatsApp"
    >
      <MessageCircle size={32} fill="#ffffff" />
      <span className={styles.tooltip}>Atendimento Pro WhatsApp</span>
    </a>
  );
};

export default FloatingWhatsApp;

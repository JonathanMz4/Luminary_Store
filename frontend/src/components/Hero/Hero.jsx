import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Hero.module.scss';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundGlow} />

      <div className={`container ${styles.containerGrid}`}>
        {/* Texto do Hero */}
        <motion.div
          className={styles.textContent}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >

          <h1>
            A Evolução da <span>Alta Performance</span> & Estética Tech.
          </h1>

          <p>
            Equipamentos de grau estúdio, periféricos customizados e displays Ultra-HD projetados para profissionais de elite que exigem perfeição milimétrica.
          </p>

          <div className={styles.ctaGroup}>
            <Link to="/loja" className="btn btn--primary">
              Explorar Catálogo <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <strong>99.8%</strong>
              <span>Aprovação Corporativa</span>
            </div>
            <div className={styles.statItem}>
              <strong>2 Anos</strong>
              <span>Garantia de Substituição</span>
            </div>
          </div>
        </motion.div>

        {/* Imagem AI-Generated com Efeito de Flutuação */}
        <motion.div
          className={styles.imageWrapper}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="/images/hero_banner.png"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop';
            }}
            alt="Setup Tecnológico Corporativo Luminary Store"
          />

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

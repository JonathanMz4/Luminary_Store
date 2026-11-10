import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Monitor, Cpu, Watch, Shield, Box } from 'lucide-react';
import styles from './CategoryCard.module.scss';

const iconMap = {
  headphones: Headphones,
  monitor: Monitor,
  cpu: Cpu,
  watch: Watch,
  shield: Shield,
  box: Box
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icone] || Box;

  return (
    <Link to={`/loja?categoria=${category.slug}`} className={styles.card}>
      <div className={styles.iconWrapper}>
        <IconComponent size={32} />
      </div>
      <h3 className={styles.title}>{category.nome}</h3>
      <span className={styles.count}>
        {category.total_produtos !== undefined ? `${category.total_produtos} produtos` : 'Explorar Linha'}
      </span>
    </Link>
  );
};

export default CategoryCard;

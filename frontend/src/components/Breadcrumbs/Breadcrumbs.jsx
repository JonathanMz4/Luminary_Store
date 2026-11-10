import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumbs.module.scss';

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
      <Link to="/" title="Página Inicial">
        <Home size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} />
          {item.path && index < items.length - 1 ? (
            <Link to={item.path}>{item.label}</Link>
          ) : (
            <span className={styles.active}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

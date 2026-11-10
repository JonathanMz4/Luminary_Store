import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, SlidersHorizontal } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import api from '../../services/api';
import styles from './Store.module.scss';

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros Locais
  const selectedCategory = searchParams.get('categoria') || '';
  const searchQuery = searchParams.get('q') || '';
  const sortOption = searchParams.get('sort') || 'relevancia';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.sucesso) {
          setCategories(res.data.categorias);
        }
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let queryStr = `/products?page=${currentPage}&limit=8`;
        if (selectedCategory) queryStr += `&categoria=${selectedCategory}`;
        if (searchQuery) queryStr += `&q=${encodeURIComponent(searchQuery)}`;
        if (sortOption && sortOption !== 'relevancia') queryStr += `&sort=${sortOption}`;

        const res = await api.get(queryStr);
        if (res.data.sucesso) {
          setProducts(res.data.produtos);
          setTotalProducts(res.data.total);
          setTotalPages(res.data.paginas);
        }
      } catch (err) {
        console.error('Erro ao carregar catálogo:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, searchQuery, sortOption, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.set('page', '1'); // resetar página ao mudar filtro
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('q', localSearch.trim());
  };

  const resetFilters = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  return (
    <div className={`container ${styles.store}`}>
      <Breadcrumbs items={[{ label: 'Catálogo Corporativo' }]} />

      <div className={styles.headerBanner}>
        <h1>Catálogo de Alta Performance</h1>
        <p>Explore equipamentos de ponta projetados para ergonomia, velocidade e estética sublime.</p>
      </div>

      <div className={styles.mainGrid}>
        {/* Sidebar de Filtros */}
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h4>
              <span>Buscar Produto</span>
              <Filter size={16} />
            </h4>
            <form onSubmit={handleSearchSubmit} className={styles.searchBox}>
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              <Search size={16} />
            </form>
          </div>

          <div className={styles.filterGroup}>
            <h4>Categorias</h4>
            <div className={styles.categoryList}>
              <button
                type="button"
                className={!selectedCategory ? styles.active : ''}
                onClick={() => updateParam('categoria', '')}
              >
                <span>Todas as Categorias</span>
                <span>({categories.reduce((acc, c) => acc + (c.total_produtos || 0), 0)})</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={selectedCategory === cat.slug ? styles.active : ''}
                  onClick={() => updateParam('categoria', cat.slug)}
                >
                  <span>{cat.nome}</span>
                  <span>({cat.total_produtos || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {(selectedCategory || searchQuery || sortOption !== 'relevancia') && (
            <button
              type="button"
              className="btn btn--outline"
              onClick={resetFilters}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} /> Limpar Todos os Filtros
            </button>
          )}
        </aside>

        {/* Área de Conteúdo */}
        <main className={styles.contentArea}>
          <div className={styles.topBar}>
            <span>
              Exibindo <strong>{products.length}</strong> de <strong>{totalProducts}</strong> produtos encontrados
            </span>

            <div className={styles.sortBox}>
              <label htmlFor="sortSelect"><SlidersHorizontal size={14} style={{ display: 'inline', marginRight: '4px' }} /> Ordenar por:</label>
              <select
                id="sortSelect"
                value={sortOption}
                onChange={(e) => updateParam('sort', e.target.value)}
              >
                <option value="relevancia">Mais Relevantes</option>
                <option value="menor_preco">Menor Preço</option>
                <option value="maior_preco">Maior Preço</option>
                <option value="recents">Recém Chegados</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loader text="Filtrando catálogo corporativo..." />
          ) : products.length > 0 ? (
            <>
              <div className="grid-catalog" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => updateParam('page', p.toString())}
              />
            </>
          ) : (
            <div className={styles.emptyState}>
              <h3>Nenhum produto encontrado</h3>
              <p>Não encontramos itens correspondentes à sua busca ou filtro. Tente buscar termos mais amplos ou limpar os filtros.</p>
              <button type="button" className="btn btn--primary" onClick={resetFilters}>
                <RefreshCw size={16} /> Ver Todo o Catálogo
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Store;

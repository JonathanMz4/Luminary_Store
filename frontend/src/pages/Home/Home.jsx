import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, ChevronDown, ChevronUp, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../../components/Hero/Hero';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import api from '../../services/api';
import styles from './Home.module.scss';

const faqData = [
  {
    q: 'A Luminary Store fornece nota fiscal corporativa e faturamento para empresas?',
    a: 'Sim! Todos os pedidos efetuados em nossa plataforma acompanham Nota Fiscal Eletrônica corporativa (NF-e) e garantia de fábrica. Empresas têm opção de faturamento personalizado.'
  },
  {
    q: 'Qual o prazo de entrega dos produtos de grau estúdio e periféricos?',
    a: 'Para capitais e regiões metropolitanas, nosso frete expresso entrega entre 24h e 48h úteis. Pedidos acima de R$ 999 contam com frete grátis prioritário via transportadora parceira.'
  },
  {
    q: 'Como funciona a política de garantia e substituição expressa?',
    a: 'Oferecemos garantia direta de 2 anos para qualquer defeito de fabricação. Caso ocorra qualquer anomalia técnica, enviamos um produto substituto antes mesmo da coleta do item anterior.'
  },
  {
    q: 'Posso integrar a API da Luminary com os sistemas de compra da minha empresa?',
    a: 'Certamente. Nossa arquitetura REST Enterprise permite integração direta com sistemas ERP (SAP, Totvs, Oracle) via chaves de acesso no painel administrativo corporativo.'
  }
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  // FAQ State
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?destaque=1&limit=8')
        ]);
        if (catRes.data.sucesso) setCategories(catRes.data.categorias);
        if (prodRes.data.sucesso) setFeaturedProducts(prodRes.data.produtos);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais da Home:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <Hero />

      {/* Categorias em Destaque */}
      <section className={`container ${styles.section}`}>
        <div className="section-header">
          <h2>Explorando o Ecossistema</h2>
          <p>Navegue por nossas linhas especializadas em hardware de alta performance e ergonomia extrema.</p>
        </div>

        {loading ? (
          <Loader text="Carregando categorias..." />
        ) : (
          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Vitrine de Produtos em Destaque */}
      <section className={`container ${styles.section}`}>
        <div className="section-header">
          <h2>Destaques de Vanguarda</h2>
          <p>Equipamentos selecionados por nossa engenharia para elevar sua produtividade ao nível máximo.</p>
        </div>

        {loading ? (
          <Loader text="Carregando vitrine de produtos..." />
        ) : featuredProducts.length > 0 ? (
          <div className="grid-catalog">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum produto em destaque no momento. <Link to="/loja" style={{ color: 'var(--accent-primary)' }}>Ver Catálogo Completo</Link>
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to="/loja" className="btn btn--outline" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
            Ver Todo o Catálogo Corporativo
          </Link>
        </div>
      </section>

      {/* Por Que Escolher a Luminary */}
      <section className={`container ${styles.section}`}>
        <div className="section-header">
          <h2>Padrão de Excelência Enterprise</h2>
          <p>Construído para empresas e líderes que não aceitam compromissos na qualidade de suas ferramentas de trabalho.</p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.iconBox}>
              <Truck size={28} />
            </div>
            <h3>Logística Exclusiva</h3>
            <p>Envio prioritário em embalagens reforçadas contra impacto. Frete grátis segurado para compras acima de R$ 999.</p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.iconBox}>
              <ShieldCheck size={28} />
            </div>
            <h3>Garantia Pro 24 Meses</h3>
            <p>Substituição expressa de equipamentos sem burocracia técnica. Se o seu hardware falhar, enviamos um novo em até 24 horas.</p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.iconBox}>
              <Headphones size={28} />
            </div>
            <h3>Concierge Dedicado</h3>
            <p>Atendimento humanizado por engenheiros de hardware via WhatsApp ou telefone 24 horas por dia, 7 dias por semana.</p>
          </div>
        </div>
      </section>


      {/* Perguntas Frequentes (FAQ Accordion) */}
      <section className={`container ${styles.section}`}>
        <div className="section-header">
          <h2>Perguntas Frequentes</h2>
          <p>Tudo o que você precisa saber sobre compras corporativas, garantias e especificações técnicas.</p>
        </div>

        <div className={styles.faqSection}>
          {faqData.map((item, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                type="button"
                className={styles.faqQuestion}
                onClick={() => toggleFaq(index)}
              >
                <span>{item.q}</span>
                {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openFaq === index && (
                <motion.div
                  className={styles.faqAnswer}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{item.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

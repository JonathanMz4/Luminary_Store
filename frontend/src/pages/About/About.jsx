import React, { useEffect } from 'react';
import { Target, Eye, Award, CheckCircle2, Users, Shield } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import styles from './About.module.scss';

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={`container ${styles.aboutPage}`}>
      <Breadcrumbs items={[{ label: 'Sobre Nós & Institucional' }]} />

      <section className={styles.heroSection}>
        <h1>
          Construindo o Futuro da <span>Performance Tech</span>
        </h1>
        <p>
          Fundada por Jonathan Menezes, a Luminary Store nasceu com uma missão inegociável: fornecer equipamentos de ponta sem concessões na ergonomia e na estética.
        </p>
      </section>

      <section className={styles.grid2}>
        <div className={styles.imgCard}>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
            alt="Equipe de Engenharia e Design da Luminary Store"
          />
        </div>

        <div className={styles.textContent}>
          <h2>Por Trás de Cada Linha de Código & Alumínio</h2>
          <p>
            Nossa equipe é composta por engenheiros de sistemas, designers industriais e arquitetos de software que entendem profundamente o que um ambiente de trabalho de elite exige. Não revendemos apenas hardware; nós curamos um estilo de vida de produtividade irrestrita.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="var(--color-success)" /> Controles de Qualidade ISO-9001 e Certificação FCC
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="var(--color-success)" /> Parcerias Diretas com Fabricantes de Chips e Painéis
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="var(--color-success)" /> Compromisso com Embalagens 100% Recicláveis e Sustentáveis
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2>Nosso Tripé Institucional</h2>
          <p>Os pilares fundamentais que guiam todas as nossas decisões e produtos corporativos.</p>
        </div>

        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={styles.iconBox}>
              <Target size={24} />
            </div>
            <h3>Nossa Missão</h3>
            <p>Empoderar criadores, desenvolvedores e corporações com ferramentas de precisão cirúrgica, reduzindo o atrito entre a mente e a execução do trabalho digital.</p>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.iconBox}>
              <Eye size={24} />
            </div>
            <h3>Nossa Visão</h3>
            <p>Tornar-se a referência mundial absoluta em e-commerce B2B e B2C de hardware de grau estúdio até o final da década, inspirando o padrão de design corporativo.</p>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.iconBox}>
              <Award size={24} />
            </div>
            <h3>Nossos Valores</h3>
            <p>Transparência radical, rigor técnico inabalável, respeito ao tempo do cliente e inovação estética contínua em todos os pontos de contato.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import api from '../../services/api';
import styles from './Contact.module.scss';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await api.post('/newsletter', {
        email: data.email,
        nome: data.nome,
        origem: `contato: ${data.assunto} - ${data.mensagem.slice(0, 50)}...`
      });
      if (res.data.sucesso) {
        setSuccessMsg('Sua mensagem corporativa foi registrada em nosso CRM. Nossa equipe técnica retornará em até 4 horas úteis.');
        reset();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.mensagem || 'Erro ao enviar mensagem. Tente novamente ou chame no WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`container ${styles.contactPage}`}>
      <Breadcrumbs items={[{ label: 'Fale Conosco & Concierge' }]} />

      <div className={styles.grid}>
        {/* Coluna de Informações */}
        <div className={styles.infoCol}>
          <div>
            <h2>Atendimento de Elite para Empresas & Criadores</h2>
            <p>
              Tem perguntas sobre cotações em volume, especificações de hardware, faturamento corporativo ou suporte técnico on-site? Nosso time está pronto para atender.
            </p>
          </div>

          <div className={styles.cardsList}>
            <div className={styles.card}>
              <div className={styles.iconBox}>
                <Mail size={24} />
              </div>
              <div>
                <strong>E-mail de Cotação & Vendas</strong>
                <span>enterprise@luminarystore.com.br</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.iconBox}>
                <Phone size={24} />
              </div>
              <div>
                <strong>Concierge Telefônico & WhatsApp</strong>
                <span>(11) 9999-9999 / (11) 99999-9999 (24/7)</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.iconBox}>
                <MapPin size={24} />
              </div>
              <div>
                <strong>Sede Corporativa & Lab de Testes</strong>
                <span>São Paulo - SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Contato com React Hook Form */}
        <div className={styles.formCol}>
          <h3>Envie uma Mensagem Direta</h3>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="nome">Nome Completo / Empresa *</label>
              <input
                id="nome"
                type="text"
                placeholder="Seu nome ou razão social"
                {...register('nome', { required: 'Nome é obrigatório' })}
              />
              {errors.nome && <span className={styles.error}>{errors.nome.message}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="email">E-mail Corporativo *</label>
              <input
                id="email"
                type="email"
                placeholder="nome@empresa.com.br"
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: { value: /^\S+@\S+$/i, message: 'Digite um e-mail válido' }
                })}
              />
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="assunto">Assunto da Solicitação *</label>
              <input
                id="assunto"
                type="text"
                placeholder="Ex: Cotação para 20 monitores 5K / Suporte"
                {...register('assunto', { required: 'Assunto é obrigatório' })}
              />
              {errors.assunto && <span className={styles.error}>{errors.assunto.message}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="mensagem">Detalhes da Solicitação *</label>
              <textarea
                id="mensagem"
                placeholder="Descreva suas necessidades ou dúvidas técnicas..."
                {...register('mensagem', { required: 'Mensagem é obrigatória', minLength: { value: 10, message: 'Digite pelo menos 10 caracteres' } })}
              />
              {errors.mensagem && <span className={styles.error}>{errors.mensagem.message}</span>}
            </div>

            {successMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={20} /> <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
            >
              <Send size={18} /> {submitting ? 'Enviando ao CRM...' : 'Enviar Solicitação Corporativa'}
            </button>
          </form>
        </div>
      </div>

      {/* Caixa de Localização Simulado */}
      <div className={styles.mapBox}>
        <div className={styles.iconPin}>
          <MessageSquare size={28} />
        </div>
        <h3>Agende uma Visita ao Nosso Studio de Engenharia</h3>
        <p>
          Clientes corporativos podem testar nossos periféricos de grau estúdio presencialmente em nosso Showroom em São Paulo mediante agendamento com o Concierge.
        </p>
      </div>
    </div>
  );
};

export default Contact;

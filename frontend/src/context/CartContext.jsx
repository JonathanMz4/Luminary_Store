import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('luminary_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(null);
  const [freight, setFreight] = useState(0);
  const [freightCep, setFreightCep] = useState('');

  useEffect(() => {
    localStorage.setItem('luminary_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantidade += quantity;
        return updated;
      }
      return [...prev, { ...product, quantidade: quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantidade: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    setFreight(0);
    setFreightCep('');
  };

  const applyCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'LUMINARY10' || upper === 'WELCOME10') {
      setCoupon({ code: upper, discountPercent: 10 });
      return { sucesso: true, mensagem: 'Cupom de 10% de desconto aplicado com sucesso!' };
    } else if (upper === 'VIP20') {
      setCoupon({ code: upper, discountPercent: 20 });
      return { sucesso: true, mensagem: 'Cupom VIP de 20% de desconto aplicado com sucesso!' };
    } else {
      return { sucesso: false, mensagem: 'Cupom inválido ou expirado.' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const simulateFreight = (cep) => {
    const cleanCep = cep.replace(/[^0-9]/g, '');
    if (cleanCep.length < 8) {
      return { sucesso: false, mensagem: 'Digite um CEP válido com 8 dígitos.' };
    }
    setFreightCep(cep);
    // Simulação corporativa limpa
    const lastDigit = parseInt(cleanCep[7], 10) || 0;
    const subtotalCalc = cart.reduce((acc, item) => acc + (parseFloat(item.preco) * item.quantidade), 0);

    if (subtotalCalc >= 999) {
      setFreight(0); // Frete grátis para compras acima de R$ 999
      return { sucesso: true, frete: 0, mensagem: 'Parabéns! Você ganhou Frete Grátis Expresso.' };
    } else {
      const simulatedPrice = 14.90 + (lastDigit * 1.5);
      setFreight(simulatedPrice);
      return { sucesso: true, frete: simulatedPrice, mensagem: `Frete Simulado via Sedex: R$ ${simulatedPrice.toFixed(2)}` };
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.preco) * item.quantidade), 0);
  const discount = coupon ? (subtotal * (coupon.discountPercent / 100)) : 0;
  const total = Math.max(0, subtotal - discount + freight);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        simulateFreight,
        coupon,
        freight,
        freightCep,
        subtotal,
        discount,
        total,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

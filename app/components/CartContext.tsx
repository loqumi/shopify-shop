import React, {createContext, useContext, useState} from 'react';

interface CartContextProps {
  cartLines: any[];
  setCartLines: (lines: any[]) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProviderProduct: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [cartLines, setCartLines] = useState<any[]>([]);

  return (
    <CartContext.Provider value={{cartLines, setCartLines}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartProduct = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartProduct must be used within a CartProviderProduct');
  }
  return context;
};

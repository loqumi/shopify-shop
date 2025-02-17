import type {ReactNode} from 'react';
import {createContext, useEffect, useState} from 'react';
import type {ProductFragment} from 'storefrontapi.generated';
import type {ShopifyProduct} from 'types/ShopifyProduct';

export type WishlistContextType = {
  wishlistItems: ShopifyProduct[];
  saveItem: (product: ShopifyProduct) => void;
  deleteItem: (productId: string) => void;
};

type WishlistContextProviderProps = {
  children: ReactNode;
};

export const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistContextProvider({
  children,
}: WishlistContextProviderProps) {
  const [wishlistItems, setWishlistItems] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    const wishlist = window.localStorage.getItem('wishlist');
    if (wishlist) {
      const parsedWishlist = JSON.parse(wishlist) as ShopifyProduct[];
      setWishlistItems(parsedWishlist);
    }
  }, []);

  function saveItem(product: ShopifyProduct) {
    if (!wishlistItems.some((item) => item.id === product.id)) {
      const newList = [...wishlistItems, product];

      window.localStorage.setItem('wishlist', JSON.stringify(newList));
      setWishlistItems(newList);
    }
  }

  const deleteItem = (productId: string) => {
    const newList = wishlistItems.filter((item) => item.id !== productId);
    window.localStorage.setItem('wishlist', JSON.stringify(newList));
    setWishlistItems(newList);
  };

  const contextValue = {wishlistItems, saveItem, deleteItem};

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

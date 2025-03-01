import {useContext} from 'react';
import type {ProductFragment} from 'storefrontapi.generated';
import type {WishlistContextType} from '~/lib/WishlistContext';
import {WishlistContext} from '~/lib/WishlistContext';

interface WishlistToggleProps {
  product: ProductFragment;
}

export function WishlistToggle({product}: WishlistToggleProps) {
  const {wishlistItems, saveItem, deleteItem} = useContext(
    WishlistContext,
  ) as WishlistContextType;
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      deleteItem(product.id);
    } else {
      saveItem(product);
    }
  };

  return (
    <button onClick={handleWishlistToggle} className="cursor-pointer">
      <svg
        width="26"
        height="22"
        viewBox="0 0 26 22"
        fill={isInWishlist ? '#F73E9F' : 'none'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.5766 2.99419C22.0233 2.44061 21.3663 2.00147 20.6433 1.70187C19.9202 1.40226 19.1452 1.24805 18.3625 1.24805C17.5798 1.24805 16.8047 1.40226 16.0817 1.70187C15.3586 2.00147 14.7016 2.44061 14.1483 2.99419L13 4.14252L11.8516 2.99419C10.734 1.87652 9.21809 1.24863 7.63747 1.24863C6.05685 1.24863 4.54097 1.87652 3.4233 2.99419C2.30563 4.11186 1.67773 5.62774 1.67773 7.20836C1.67773 8.78898 2.30563 10.3049 3.4233 11.4225L13 20.9992L22.5766 11.4225C23.1302 10.8692 23.5693 10.2122 23.869 9.48916C24.1686 8.76608 24.3228 7.99105 24.3228 7.20836C24.3228 6.42566 24.1686 5.65064 23.869 4.92756C23.5693 4.20448 23.1302 3.54751 22.5766 2.99419Z"
          stroke={isInWishlist ? undefined : '#F73E9F'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

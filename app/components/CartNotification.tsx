import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import type {HeaderProps} from '~/components/Header';
import {useCartProduct} from '~/components/CartContext';

export function CartNotification({cart}: Pick<HeaderProps, 'cart'>) {
  const [notification, setNotification] = useState<{
    title: string;
    imageUrl: string;
  } | null>(null);
  const location = useLocation();
  const {cartLines} = useCartProduct();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchCart() {
      const data = await cart;
      const previousTotalQuantity =
        sessionStorage.getItem('totalQuantity') || '0';
      if (!data) return;
      const currentTotalQuantity = data.totalQuantity;

      if (currentTotalQuantity > Number(previousTotalQuantity)) {
        const newProduct = cartLines[0].selectedVariant;

        setNotification({
          title: newProduct.product.title,
          imageUrl: newProduct.image.url,
        });

        sessionStorage.setItem('totalQuantity', String(currentTotalQuantity));

        if (timer) {
          clearTimeout(timer);
        }

        const newTimer = setTimeout(() => {
          setNotification(null);
        }, 2000);
        setTimer(newTimer);
      } else {
        sessionStorage.setItem('totalQuantity', String(currentTotalQuantity));
      }
    }

    if (location.pathname !== '/cart') {
      fetchCart();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [cart, cartLines, location.pathname, timer]);

  useEffect(() => {
    setNotification(null);
  }, [location.pathname]);

  return (
    <>
      {notification && (
        <div className="fixed min-w-[283px] min-h-[73px] top-20 right-10 bg-dark-pink-two text-white p-2 rounded-md shadow-lg flex items-center space-x-4 animate-fade-in">
          <img
            src={notification.imageUrl}
            alt={notification.title}
            className="min-w-[52px] min-h-[49px] max-h-[49px] max-w-[49px] object-cover rounded"
          />
          <div>
            <p className="text-yellow-200 text-xs">added to cart</p>
            <p className="font-bold text-sm font-fraunces">
              {notification.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

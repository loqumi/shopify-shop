import {Await, Link, useAsyncValue} from '@remix-run/react';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Suspense} from 'react';
import type {CartApiQueryFragment} from '../../storefrontapi.generated';
import type {HeaderProps} from '~/components/Header';
import NotificationBadge from '../ui/NotificationBadge';
import {useAside} from './Aside';

export default function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function CartBadge({count}: {count: number | null}) {
  const {close} = useAside();

  return (
    <Link to="/cart" className="flex items-center gap-1" onClick={close}>
      <img src="/cart-icon.svg" alt="cart-icon" />

      {count === null ? (
        <span>&nbsp;</span>
      ) : (
        <NotificationBadge notifications={count} />
      )}
    </Link>
  );
}

import {Await} from '@remix-run/react';
import React, {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {Modal} from '~/components/SearchModal';
import SearchModal from '~/components/Search';
import {WishlistContextProvider} from '~/lib/WishlistContext';
import {CartProviderProduct} from '~/components/CartContext';
import WishlistButton from './WishlistButton';
import CartToggle from './CartToggle';
import ScrollToTopButton from '~/components/ScrollToTopButton';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <WishlistContextProvider>
      <Modal.Provider>
        <Aside.Provider>
          <CartProviderProduct>
            {/* <CartAside cart={cart} /> */}
            <SearchModal />
            <MobileMenuAside
              cart={cart}
              header={header}
              isLoggedIn={isLoggedIn}
              publicStoreDomain={publicStoreDomain}
            />
            {header && (
              <Header
                header={header}
                cart={cart}
                isLoggedIn={isLoggedIn}
                publicStoreDomain={publicStoreDomain}
              />
            )}
            <main>{children}</main>
            <ScrollToTopButton />
            <Footer
              footer={footer}
              header={header}
              publicStoreDomain={publicStoreDomain}
            />
          </CartProviderProduct>
        </Aside.Provider>
      </Modal.Provider>
    </WishlistContextProvider>
  );
}

// function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
//   return (
//     <Aside type="cart" heading="cart">
//       <Suspense fallback={<p>Loading cart ...</p>}>
//         <Await resolve={cart}>
//           {(cart) => {
//             return <CartMain cart={cart} layout="aside" />;
//           }}
//         </Await>
//       </Suspense>
//     </Aside>
//   );
// }

function MobileMenuAside({
  header,
  publicStoreDomain,
  isLoggedIn,
  cart,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
  isLoggedIn: Promise<boolean>;
  cart: Promise<CartApiQueryFragment | null>;
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside
        type="mobile"
        heading={
          <div className="flex gap-10 !font-bold">
            <WishlistButton />
            <CartToggle cart={cart} />
          </div>
        }
      >
        <HeaderMenu
          isLoggedIn={isLoggedIn}
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}

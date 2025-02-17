import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import type {ReactNode} from 'react';
import {Suspense} from 'react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import CartToggle from '~/components/CartToggle';
import WishlistButton from './WishlistButton';
import {useSearchModal} from '~/components/SearchModal';
import AuthButton from '~/ui/AuthButton';
import {CartNotification} from '~/components/CartNotification';

export interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {close: closeModal} = useSearchModal();
  const {menu} = header;

  return (
    <header className="py-3 sticky top-0 bg-white z-10 md:pt-12 border-b-[#D5E882] max-w-screen-xl border-b-[1px] md:pb-6 px-4 lg:px-main">
      <div className="relative flex items-center justify-end gap-10 md:justify-between md:mb-12">
        <SearchToggle />

        <NavLink to="/" onClick={closeModal}>
          <img
            src="/logo.svg"
            alt="logo"
            className="absolute left-0 md:!left-1/2 top-1/2 !transform md:!-translate-x-1/2 !-translate-y-1/2 max-w-[387px] w-[171px] md:w-[30%]"
          />
        </NavLink>

        <HeaderMenuMobileToggle />

        <nav className="header-ctas !gap-10 !hidden md:!flex" role="navigation">
          <WishlistButton />

          <CartToggle cart={cart} />

          <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
            <Suspense fallback="Sign in">
              <Await resolve={isLoggedIn} errorElement="Sign in">
                <img src="/user-icon.svg" alt="user-icon" />
              </Await>
            </Suspense>
          </NavLink>
        </nav>

        <CartNotification cart={cart} />
      </div>

      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  isLoggedIn,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  isLoggedIn?: Promise<boolean>;
}) {
  const className = `header-menu-${viewport} gap-28 justify-center ${
    viewport === 'mobile' ? 'md:!hidden' : 'md:!flex'
  }`;
  const {close} = useAside();
  const {close: closeModal} = useSearchModal();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={() => {
            closeModal();
            close();
          }}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}

      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={() => {
              closeModal();
              close();
            }}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}

      {viewport === 'mobile' && (
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            <AuthButton />
          </Await>
        </Suspense>
      )}
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset md:hidden"
      onClick={() => open('mobile')}
    >
      <img src="/burger-menu.svg" alt="menu-icon" />
    </button>
  );
}

function SearchToggle() {
  const {type: activeType, close, open} = useSearchModal();
  return (
    <button
      className="reset cursor-pointer"
      onClick={activeType === 'search' ? () => close() : () => open('search')}
    >
      {activeType === 'search' ? (
        <img src="/close-button.svg" alt="search-icon" className="z-10" />
      ) : (
        <img src="/search-icon.svg" alt="search-icon" className="z-10" />
      )}
    </button>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

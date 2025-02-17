import {Link, NavLink} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

const shopLinks = [
  {
    title: 'shop',
    link: '',
  },
  {
    title: 'stocks',
    link: '',
  },
  {
    title: 'brands',
    link: '',
  },
  {
    title: 'gift certificates',
    link: '',
  },
  {
    title: 'delivery',
    link: '',
  },
];

const companyLinks = [
  {
    title: 'About the company',
    link: '',
  },
  {
    title: 'Job openings',
    link: '',
  },
  {
    title: 'Contacts',
    link: '',
  },
];

const informationLinks = [
  {
    title: 'Politics',
    link: '',
  },
  {
    title: 'Requisites',
    link: '',
  },
  {
    title: 'Brands',
    link: '',
  },
  {
    title: 'Questions and answers',
    link: '',
  },
];

const helpLinks = [
  {
    title: 'Payment terms',
    link: '',
  },
  {
    title: 'Terms of delivery',
    link: '',
  },
  {
    title: 'Product warranty',
    link: '',
  },
  {
    title: 'Questions and answers',
    link: '',
  },
  {
    title: 'Popular',
    link: '',
  },
];

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <div className="pt-16 bg-dark-pink-two px-4 md:px-main">
      <div className="flex flex-col gap-14 mb-7 md:!flex-row md:justify-between md:flex-wrap md:gap-5">
        <div>
          <Link to="/">
            <img
              src="/white-logo.svg"
              alt="logo"
              className="max-w-[387px] w-[171px] !pb-14"
            />
          </Link>

          <div className="flex flex-col gap-5">
            <h2 className="!font-bold !text-xl text-white">
              +49 (123) 456-78-90
            </h2>
            <div className="flex gap-4">
              <img src="/insta-icon.svg" alt="instagram-icon" />
              <img src="/whats-icon.svg" alt="whatsapp-icon" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {shopLinks.map((link) => (
            <Link
              key={link.title}
              to={link.link}
              className="!font-black !text-white text-lg uppercase font-fraunces"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-6 md:gap">
          <h1 className="!font-black !text-white !text-lg uppercase font-fraunces">
            company
          </h1>
          {companyLinks.map((link) => (
            <Link
              to={link.link}
              key={link.title}
              className="!text-main-pink font-black text-lg font-medium"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="!font-black !text-white !text-lg uppercase font-fraunces">
            information
          </h1>
          {informationLinks.map((link) => (
            <Link
              to={link.link}
              key={link.title}
              className="!text-main-pink font-medium text-lg"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="!font-black !text-white !text-lg uppercase font-fraunces">
            help
          </h1>
          {helpLinks.map((link) => (
            <Link
              to={link.link}
              key={link.title}
              className="!text-main-pink font-medium text-lg"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex justify-end !border-t-dark-pink !border-t py-9 md:justify-start">
        <p className="text-white">{`${new Date().getFullYear()} Pink Avocado`}</p>
      </div>
    </div>
    // <Suspense>
    //   <Await resolve={footerPromise}>
    //     {(footer) => (
    //       <footer className="footer">
    //         {footer?.menu && header.shop.primaryDomain?.url && (
    //           <FooterMenu
    //             menu={footer.menu}
    //             primaryDomainUrl={header.shop.primaryDomain.url}
    //             publicStoreDomain={publicStoreDomain}
    //           />
    //         )}
    //       </footer>
    //     )}
    //   </Await>
    // </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
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
    color: isPending ? 'grey' : 'white',
  };
}

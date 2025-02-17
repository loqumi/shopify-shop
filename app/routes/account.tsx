import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import formatPhoneNumber from '~/lib/formatPhoneNumber';

export async function loader({context}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return json(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

const links = [
  {
    title: 'my shopping',
    link: '/account/shopping',
  },
  {
    title: 'favorites',
    link: '/account/favorites',
  },
  {
    title: 'avocard',
    link: '/account/avocard',
  },
  {
    title: 'faq',
    link: '/account/faq',
  },
];

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    color: isActive ? '#D5E882' : '#F73E9F',
    background: isActive ? '#F73E9F' : '',
  };
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();
  const location = useLocation();
  const customerMetafields = Object.fromEntries(
    customer.metafields.map((item) => {
      const key = item?.key === null ? '' : item?.key;
      return [key, item?.value];
    }),
  );

  return (
    <div className="flex">
      <div
        className={`${
          location.pathname !== '/account'
            ? 'hidden lg:block lg:pl-main lg:pr-[2%] lg:px-0' // sub-path
            : 'flex-1 lg:px-main px-4' // if no sub-path chosen
        } account pt-12 bg-main-green`}
      >
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 gap-8">
              <div>
                <h1 className="font-bold !text-xl">
                  {customerMetafields.phone &&
                    formatPhoneNumber(
                      customerMetafields.phone &&
                        customer.phoneNumber?.phoneNumber,
                    )}
                </h1>
                <h1 className="font-bold !text-xl">
                  {customer.emailAddress?.emailAddress ?? ''}
                </h1>
              </div>
              <Link to="/account/profile">
                <img src="/filter-horizontal.svg" alt="" className="w-6 h-6" />
              </Link>
            </div>

            <div className="flex gap-9">
              <div className="flex flex-col items-center">
                <p className="font-medium text-xs text-main-gray font-noto">
                  Discount
                </p>
                <p className="font-bold !text-xl">{`${
                  customerMetafields?.discount ?? 0
                }%`}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-medium text-xs text-main-gray font-noto">
                  Bonus
                </p>
                <p className="font-bold !text-xl">
                  {customerMetafields?.bonus_points ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-16 gap-7 pb-12">
          {links.map((link) => (
            <div key={link.title} className="flex items-center justify-between">
              <NavLink
                prefetch="intent"
                style={activeLinkStyle}
                to={link.link}
                className="font-bold text-2xl px-1"
              >
                {link.title}
              </NavLink>

              <svg
                className="block lg:hidden"
                width="10"
                height="16"
                viewBox="0 0 10 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 1L9 7.8L1 15" stroke="#F73E9F" strokeWidth="2px" />
              </svg>
            </div>
          ))}
          <Form
            className="account-logout"
            method="POST"
            action="/account/logout"
          >
            &nbsp;
            <button
              type="submit"
              className="text-dark-pink-two font-bold text-xl cursor-pointer"
            >
              logout
            </button>
          </Form>
        </div>
      </div>

      {location.pathname !== '/account' && (
        <div className="bg-main-pink lg:pr-main lg:pl-[2%] pb-16 flex-1 lg:flex-2 px-4 lg:px-0">
          <Outlet context={customerMetafields} />
        </div>
      )}
    </div>
  );
}

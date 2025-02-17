import {Form, Link, useAsyncValue} from '@remix-run/react';

export default function AuthButton() {
  const isLoggedIn = useAsyncValue();

  return (
    <div className="cursor-pointer bg-main-pink p-1 flex items-center justify-between mt-12 text-2xl font-bold">
      {isLoggedIn ? (
        <Logout />
      ) : (
        <Link
          prefetch="intent"
          to="/account"
          className="flex items-center justify-between w-full"
        >
          login
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L9 7.8L1 15" stroke="#F73E9F" strokeWidth={2} />
          </svg>
        </Link>
      )}
    </div>
  );
}

function Logout() {
  return (
    <Form
      className="account-logout w-full cursor-pointer"
      method="POST"
      action="/account/logout"
    >
      <button
        type="submit"
        className="flex justify-between items-center w-full cursor-pointer"
      >
        logout
        <svg
          width="10"
          height="16"
          viewBox="0 0 10 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L9 7.8L1 15" stroke="#F73E9F" strokeWidth={2} />
        </svg>
      </button>
    </Form>
  );
}

import {Link} from '@remix-run/react';

type Props = {
  title: string;
  to: string;
  className?: string;
};

export default function PrevRouteButton({title, to, className}: Props) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-4 !text-main-gray font-bold text-base pt-7 lg:hidden ${className}`}
    >
      <svg
        className="rotate-180"
        width="10"
        height="16"
        viewBox="0 0 10 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 1L9 7.8L1 15" stroke="#F73E9F" strokeWidth="2px" />
      </svg>
      {title}
    </Link>
  );
}

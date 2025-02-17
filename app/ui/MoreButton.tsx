import {Link} from '@remix-run/react';

type Props = {
  linkTo: string;
  sectionName: string;
};

export default function MoreButton({linkTo, sectionName}: Props) {
  return (
    <Link
      className="flex items-center gap-2.5 absolute right-0 top-0 h-full"
      to={linkTo}
    >
      <p className="!font-bold lg:hidden">more</p>
      <p className="!font-bold hidden lg:block uppercase">{`all ${sectionName}`}</p>
      <img src="/arrow-icon.svg" alt="arrow-icon" className="!h-3.5" />
    </Link>
  );
}

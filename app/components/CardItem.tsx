import {Link} from '@remix-run/react';

type Props = {
  amount: number;
  handle: string;
};

export default function CardItem(props: Props) {
  const {amount = 100, handle} = props;

  return (
    <Link
      to={`/products/${handle}`}
      className="w-[356px] h-[219px] bg-dark-pink-two rounded-xl relative p-3 block"
    >
      <h1 className="font-fraunces !font-black !text-[40px] text-main-green uppercase">
        Gift <br /> Card
      </h1>

      <button className="cursor-pointer absolute top-3 right-3">
        <img src="/info-button-black.svg" alt="info-button" />
      </button>

      <img
        src="/card-sticker.svg"
        alt="card-sticker"
        className="absolute top-0 right-0"
      />

      <p className="text-white text-8xl font-extralight font-commissioner -tracking-widest absolute bottom-3">
        {amount.toLocaleString('en-US', {
          style: 'decimal',
          maximumFractionDigits: 0,
        })}
        <span className="text-6xl">€</span>
      </p>
    </Link>
  );
}

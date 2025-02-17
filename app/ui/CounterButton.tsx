import type {Dispatch, SetStateAction} from 'react';

type Props = {
  counter: number;
  setCounter: Dispatch<SetStateAction<number>>;
};

export default function CounterButton({counter, setCounter}: Props) {
  return (
    <div className="rounded-xl border flex gap-6 items-center px-1.5 text-lg font-semibold">
      <button
        className="text-[#3C3C4399] cursor-pointer"
        onClick={() => counter > 1 && setCounter(counter - 1)}
      >
        -
      </button>
      {counter}
      <button
        className="text-[#3C3C4399] cursor-pointer"
        onClick={() => setCounter(counter + 1)}
      >
        +
      </button>
    </div>
  );
}

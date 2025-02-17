type Props = {
  left?: boolean;
};

export default function ArrowButton({left}: Props) {
  return (
    <button className="!bg-main-green w-5 h-5 flex justify-center items-center">
      <svg
        className={`${left ? 'rotate-180' : ''}`}
        width="10"
        height="16"
        viewBox="0 0 10 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path d="M1 1L9 7.8L1 15" className="stroke-dark-pink" />
      </svg>
    </button>
  );
}

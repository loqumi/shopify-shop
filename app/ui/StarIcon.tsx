//#3C3C4399

type Props = {
  color: string;
  stroke?: boolean;
  invisible?: boolean;
};

export default function StarIcon({color, stroke, invisible}: Props) {
  return (
    <svg
      className={invisible ? 'invisible' : ''}
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 0.5L10.4546 5.12154L15.6085 6.02786L11.9716 9.79045L12.7023 14.9721L8 12.676L3.29772 14.9721L4.02839 9.79045L0.391548 6.02786L5.54541 5.12154L8 0.5Z"
        fill={color}
        stroke={stroke ? 'black' : undefined}
      />
    </svg>
  );
}

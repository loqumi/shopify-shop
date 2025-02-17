type Props = {
  discount: number;
};

export default function DiscountIcon({discount}: Props) {
  return (
    <div className="flex justify-center items-center font-black text-main-green bg-[#3064C7] text-xs rounded-lg w-[36px] h-[20px]">
      {discount}%
    </div>
  );
}

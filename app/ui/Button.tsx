type Props = {
  title: string;
  type: 'submit' | 'reset' | 'button' | undefined;
  disabled: boolean;
};

export default function Button(props: Props) {
  const {title, type, disabled} = props;

  return (
    <button
      type={type}
      disabled={disabled}
      className="bg-dark-pink-two font-noto rounded-[10px] py-2.5 text-white text-lg flex-1 hover:bg-black active:bg-black disabled:bg-[#FF87C6] focus:border-black focus:border-[3px] outline-0"
    >
      {title}
    </button>
  );
}

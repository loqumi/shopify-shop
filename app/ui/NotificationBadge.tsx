type Props = {
  notifications: number;
};

export default function NotificationBadge(props: Props) {
  const {notifications} = props;

  return (
    <div className="bg-black rounded-[100%] w-[20px] h-[20px] flex items-center justify-center">
      <p className="text-white !text-xs font-bold font-noto">{notifications}</p>
    </div>
  );
}

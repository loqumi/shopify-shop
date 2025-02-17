export default function CollapsibleTrigger({title}: {title: string}) {
  return (
    <div className="border-b-main-gray border-b text-main-gray flex justify-between cursor-pointer items-center">
      {title}
      <p className="text-lg font-semibold leading-none">+</p>
    </div>
  );
}

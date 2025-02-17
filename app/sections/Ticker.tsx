import {Marquee} from '@devnomic/marquee';
import '@devnomic/marquee/dist/index.css';
import {Link} from '@remix-run/react';

type TickerElementType = {
  icon: string;
  text: string;
};

const elements: TickerElementType[] = [
  {icon: '/heart-icon.svg', text: 'get your luck'},
  {icon: '/star-icon.svg', text: '-15% on first order'},
];

export default function Ticker() {
  return (
    <Marquee
      direction="left"
      reverse={false}
      pauseOnHover={false}
      className="bg-[#F73E9F] h-14 gap-24"
      innerClassName="[--duration:40s] gap-24"
    >
      {elements.map((el) => (
        <TickerElement element={el} key={el.text} />
      ))}
      {elements.map((el) => (
        <TickerElement element={el} key={el.text} />
      ))}
    </Marquee>
  );
}

function TickerElement({element}: {element: TickerElementType}) {
  return (
    <Link className="flex items-center gap-24" to="/wishlist">
      <img src={element.icon} alt="element-icon" />
      <p className="!text-2xl text-[#D5E882] font-bold uppercase">
        {element.text}
      </p>
    </Link>
  );
}

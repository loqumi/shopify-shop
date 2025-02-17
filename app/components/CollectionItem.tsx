import {Link} from '@remix-run/react';

type Props = {
  handle: string;
  imgUrl: string;
  description: string;
};

export default function CollectionItem(props: Props) {
  const {handle, imgUrl, description} = props;

  return (
    <Link to={`${handle}`}>
      <img
        src={imgUrl}
        alt="collection-cover"
        className="aspect-video object-cover rounded-xl"
      />
      <p className="font-semibold text-main-gray text-lg !mt-4 line-clamp-1">
        {description}
      </p>
    </Link>
  );
}

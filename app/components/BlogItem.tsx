import {Link} from '@remix-run/react';
import type {Blog} from '@shopify/hydrogen/storefront-api-types';

type Props = {
  blog: Blog;
};

export default function BlogItem({blog}: Props) {
  return (
    <Link
      to={`/blogs/${blog.handle}`}
      className="relative h-[460px] !rounded-2xl overflow-hidden p-4 flex items-end flex-[1] min-w-[142px]"
    >
      <img
        src={blog?.articles?.nodes[0]?.image?.url}
        alt="article-cover"
        className="absolute top-0 left-0 bottom-0 right-0 !h-full w-full object-cover"
      />

      <div className="relative">
        <div className="bg-dark-pink-two px-2">
          <h1 className="text-main-green !font-semibold !text-xl uppercase">
            {blog.title}
          </h1>
        </div>
      </div>
    </Link>
  );
}

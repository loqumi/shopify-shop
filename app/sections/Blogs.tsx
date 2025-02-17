import {Link} from '@remix-run/react';
import type {Blog} from '@shopify/hydrogen/storefront-api-types';
import BlogItem from '~/components/BlogItem';

type Props = {
  blogs: Blog[];
};

export default function Blogs({blogs}: Props) {
  return (
    <div className="bg-main-pink px-4 lg:px-[10%] pt-12 pb-10 md:pb-20">
      <div className="flex relative md:justify-center pb-9">
        <h1 className="!font-bold !text-2xl pb-6 font-fraunces">blog</h1>

        <Link
          className="flex items-center gap-2.5 absolute right-0 top-0 h-full"
          to="/blogs"
        >
          <p className="!font-bold lg:hidden">more</p>
          <p className="!font-bold hidden lg:block uppercase">all posts</p>
          <img src="/arrow-icon.svg" alt="arrow-icon" className="!h-3.5" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-scroll -m-4 p-4">
        {blogs.map((blog) => (
          <BlogItem key={blog.handle} blog={blog} />
        ))}
      </div>
    </div>
  );
}

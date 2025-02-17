import {Link, useNavigate} from '@remix-run/react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const navigate = useNavigate();

  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  return (
    <div className="flex items-center space-x-2">
      {currentPage > 1 && (
        <button
          className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          to={`?page=${p}`}
          className={`px-3 py-2 rounded-md ${
            p === currentPage
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages && (
        <button
          className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;

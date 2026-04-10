interface PaginationProps {
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export default function Pagination({ hasNextPage, loading, onLoadMore }: PaginationProps) {
  if (!hasNextPage) return null;

  return (
    <div className="mt-10 flex justify-center">
      <button
        className="rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onLoadMore}
        disabled={loading}
        id="load-more-btn"
      >
        {loading ? 'Loading...' : 'Load More Properties'}
      </button>
    </div>
  );
}

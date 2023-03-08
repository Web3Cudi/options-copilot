import { useAtom } from "jotai";
import { tagFilterAtom } from "src/atoms";

export const TagFilterBadge = () => {
  const [tagFilter, setTagFilter] = useAtom(tagFilterAtom);

  return (
    <div>
      {tagFilter.name && (
        <div className="badge">
          Showing Trades Filtered by
          <span className="badge badge-outline badge-success gap-2 ml-2">
            {tagFilter.name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-4 h-4 stroke-current cursor-pointer hover:opacity-80"
              onClick={() => setTagFilter({ name: null, data: [] })}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

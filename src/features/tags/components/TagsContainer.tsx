import { useState } from "react";

import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { tagFilterAtom } from "src/atoms";

import { useGetTagsByType } from "@/features/tradeStats";
import { sortTagsByType } from "@/utils/sort";

export const TagsContainer = () => {
  const router = useRouter();

  const [tagType, setTagType] = useState<"setup" | "mistake" | "custom">(
    "setup"
  );

  const setTagFilter = useSetAtom(tagFilterAtom);

  const { data } = useGetTagsByType(tagType);
  const tags = sortTagsByType(data);

  const stepColor = [
    "step-primary",
    "step-secondary",
    "step-accent",
    "step-info",
    "step-success",
    "step-warning",
    "step-error",
    "step-primary",
    "step-secondary",
    "step-accent",
  ];

  const filterTrades = (tagId: number, tagName: string) => {
    const filteredTags = data
      .filter((d) => d.trade_tags.tag_id === tagId)
      .map((d) => {
        return {
          contract_id: d.contract_id,
          date: d.date,
        };
      });

    setTagFilter({
      name: tagName,
      data: filteredTags.filter(
        (item, index) => filteredTags.indexOf(item) === index
      ),
    });
    router.push("/trades");
  };

  return (
    <div className="flex-1 mt-5 bg-base-100 p-4 rounded-lg mr-12 h-[25rem] overflow-auto">
      <div className="flex flex-col space-y-3 relative">
        <div className="tabs self-center justify-between">
          {["setup", "mistake", "custom"].map(
            (tab: "setup" | "mistake" | "custom") => (
              <p
                key={tab}
                className={`tab tab-bordered uppercase ${
                  tagType === tab ? "tab-active" : ""
                }`}
                onClick={() => setTagType(tab)}
              >
                {tab}
              </p>
            )
          )}
        </div>

        <ul className="steps steps-vertical">
          {tags?.map((tag, index) => (
            <li
              key={tag.tag_id}
              className={`step ${stepColor[index]} text-white cursor-pointer select-none`}
              onClick={() => filterTrades(tag.tag_id, tag.name)}
            >
              <span className="p-2 hover:opacity-80 ring-white">
                {tag.name}
              </span>
              <span className="absolute right-0 ">{tag.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

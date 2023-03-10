export const StatsSkeleton = () => {
  return (
    <div className="stats w-[70rem] h-24">
      <div className="stat animate-pulse w-full space-y-2 ">
        <div className="bg-gray-600 rounded-md h-5 w-1/2 "></div>
        <div className="bg-gray-600 rounded-md h-5 w-full"></div>
      </div>
      <div className="stat animate-pulse w-full space-y-2">
        <div className="bg-gray-600 rounded-md h-5 w-1/2"></div>
        <div className="bg-gray-600 rounded-md h-5 w-full"></div>
      </div>{" "}
      <div className="stat animate-pulse w-full space-y-2">
        <div className="bg-gray-600 rounded-md h-5 w-1/2"></div>
        <div className="bg-gray-600 rounded-md h-5 w-full"></div>
      </div>
    </div>
  );
};

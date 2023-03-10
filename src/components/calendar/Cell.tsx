interface Props {
  isDisabled?: boolean;
  highlightColor?: string;
  handleClick?: (date) => void;
  date?: string;
}

export const Cell: React.FC<Props> = ({
  isDisabled,
  highlightColor,
  children,
  date,
  handleClick,
}) => {
  return (
    <div
      onClick={isDisabled ? undefined : () => handleClick([date, date])}
      className={`text-white h-32 border-b border-r flex items-start justify-start p-3 select-none transition-colors  
      ${isDisabled ? "" : "hover:bg-primary-content cursor-pointer"}
      ${highlightColor}`}
    >
      {children}
    </div>
  );
};

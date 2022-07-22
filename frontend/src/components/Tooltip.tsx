interface Props {
  children: JSX.Element;
  tip: string;
  className?: string;
  position?: string;
}

function Tooltip(props: Props) {
  const { children, tip, className, position = "mb-6" } = props;
  return (
    <div className={`relative flex flex-col items-center group ${className}`}>
      {children}
      {tip && (
        <div
          className={`${position} absolute bottom-0 flex-col items-center hidden group-hover:flex w-full opacity-90`}
        >
          <span className="relative whitespace-nowrap z-10 p-2 text-xs leading-none text-center text-white whitespace-no-wrap bg-slate-500 shadow-lg rounded-md hover:hidden">
            {tip}
            <div className="w-3 h-3 -mt-2 rotate-45 bg-slate-500 absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
          </span>
        </div>
      )}
    </div>
  );
}

export default Tooltip;

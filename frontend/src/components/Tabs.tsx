interface Props {
  tabs: string[];
  currentTab: number;
  onTabChange: (tab: number) => void;
}

function Tabs(props: Props) {
  const { tabs, currentTab, onTabChange } = props;
  return (
    <ul className="flex text-sm font-medium text-center text-gray-400 border-b border-gray-200 space-x-2">
      {tabs.map((tab, i) => (
        <li className="w-full" key={i}>
          <div
            onClick={() => onTabChange(i)}
            className={`inline-block p-4 cursor-pointer w-full text-ellipsis h-full ${
              i === currentTab
                ? "text-indigo-600 bg-gray-50 rounded-t-lg border"
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab}
            {/* {tab.length <= 20 ? tab : tab.substring(0, 17) + "..."} */}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Tabs;

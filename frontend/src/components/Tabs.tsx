interface Props {
  tabs: string[];
  currentTab: number;
  onTabChange: (tab: number) => void;
}

function Tabs(props: Props) {
  const { tabs, currentTab, onTabChange } = props;
  return (
    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-5">
      {tabs.map((tab, i) => (
        <li className="mr-2" key={i}>
          <div
            onClick={() => onTabChange(i)}
            className={`inline-block p-4 cursor-pointer ${
              i === currentTab
                ? "text-blue-600 bg-gray-50 rounded-t-lg active"
                : "rounded-t-lg hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.length <= 20 ? tab : tab.substring(0, 17) + "..."}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Tabs;

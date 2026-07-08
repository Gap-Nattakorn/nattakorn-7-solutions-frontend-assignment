import type { ActiveTab } from "../types";

type TabItem = {
  label: string;
  value: ActiveTab;
};

export function Tabs({
  activeTab,
  onChange,
  tabs,
}: {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
  tabs: TabItem[];
}) {
  return (
    <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          className={`h-10 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
            activeTab === tab.value
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
          key={tab.value}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

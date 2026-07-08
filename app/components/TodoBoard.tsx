import { memo, useEffect, useState } from "react";
import Image from "next/image";

import { ColumnHeader } from "./ColumnHeader";

import type { BoardState, ItemType, TodoItem } from "../types";

const ITEM_TYPES: ItemType[] = ["Fruit", "Vegetable"];
const AUTO_RETURN_SECONDS = 5;
const FULL_WIDTH_STYLE = { width: "100%" };

const typeStyles: Record<
  ItemType,
  {
    column: string;
    iconBackground: string;
    badge: string;
    activeButton: string;
    progress: string;
  }
> = {
  Fruit: {
    column: "border-rose-200 bg-rose-50/80",
    iconBackground: "bg-rose-100",
    badge: "bg-rose-100 text-rose-700",
    activeButton:
      "border-rose-200 bg-white text-rose-950 hover:border-rose-300",
    progress: "bg-rose-500",
  },
  Vegetable: {
    column: "border-emerald-200 bg-emerald-50/80",
    iconBackground: "bg-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
    activeButton:
      "border-emerald-200 bg-white text-emerald-950 hover:border-emerald-300",
    progress: "bg-emerald-500",
  },
};

const typeIcons: Record<ItemType, { alt: string; src: string }> = {
  Fruit: {
    alt: "Fruit icon",
    src: "/icons/fruits.svg",
  },
  Vegetable: {
    alt: "Vegetable icon",
    src: "/icons/vegetables.svg",
  },
};

export function TodoBoard({
  board,
  onMove,
  onReturn,
}: {
  board: BoardState;
  onMove: (item: TodoItem) => void;
  onReturn: (item: TodoItem) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <ColumnHeader count={board.main.length} title="List" />

        <div className="mt-4 grid min-h-[26rem] auto-rows-min gap-2">
          {board.main.map((item) => (
            <QueueButton item={item} key={item.id} onMove={onMove} />
          ))}
        </div>
      </section>

      {ITEM_TYPES.map((type) => (
        <section
          className={`rounded-lg border p-4 shadow-sm ${typeStyles[type].column}`}
          key={type}
        >
          <ColumnHeader count={board.columns[type].length} title={type} />

          <div className="mt-4 grid min-h-[26rem] auto-rows-min gap-2">
            {board.columns[type].map((item) => (
              <ActiveButton item={item} key={item.id} onReturn={onReturn} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const QueueButton = memo(function QueueButton({
  item,
  onMove,
}: {
  item: TodoItem;
  onMove: (item: TodoItem) => void;
}) {
  return (
    <button
      className="group flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 text-left text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20"
      onClick={() => onMove(item)}
      type="button"
    >
      <span className="flex min-w-0 items-center gap-3">
        <TypeIcon type={item.type} />
        <span className="truncate">{item.name}</span>
      </span>
      <span
        className={`rounded-full px-2 py-1 text-xs ${typeStyles[item.type].badge}`}
      >
        {item.type}
      </span>
    </button>
  );
});

const ActiveButton = memo(function ActiveButton({
  item,
  onReturn,
}: {
  item: TodoItem;
  onReturn: (item: TodoItem) => void;
}) {
  const [remainingSeconds, setRemainingSeconds] =
    useState(AUTO_RETURN_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      className={`relative h-14 w-full overflow-hidden rounded-md border px-4 text-left text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${typeStyles[item.type].activeButton}`}
      onClick={() => onReturn(item)}
      type="button"
    >
      <span className="relative z-10 flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3">
          <TypeIcon type={item.type} />
          <span className="truncate">{item.name}</span>
        </span>
        <span className="text-xs font-medium text-slate-500">
          {remainingSeconds}s
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 h-1 origin-left animate-[shrink_5s_linear_forwards] ${typeStyles[item.type].progress}`}
        style={FULL_WIDTH_STYLE}
      />
    </button>
  );
});

function TypeIcon({ type }: { type: ItemType }) {
  const icon = typeIcons[type];

  return (
    <span
      className={`grid size-8 shrink-0 place-items-center rounded-md ${typeStyles[type].iconBackground}`}
    >
      <Image
        alt={icon.alt}
        className="object-contain"
        height={20}
        src={icon.src}
        width={20}
      />
    </span>
  );
}

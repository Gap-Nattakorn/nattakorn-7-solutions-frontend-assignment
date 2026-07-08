"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";

import { DepartmentReport } from "./components/DepartmentReport";
import { Tabs } from "./components/Tabs";
import { TodoBoard } from "./components/TodoBoard";

import type { ActiveTab, ApiState, BoardState, TodoItem } from "./types";

import { FRUITS_AND_VEGETABLES } from "./utils/fruits_and_vegetables_data";
import type { DepartmentSummaryResponse } from "./utils/users_by_department";

type BoardAction =
  | {
      type: "move-to-column";
      item: TodoItem;
    }
  | {
      type: "return-to-main";
      item: TodoItem;
    };

const AUTO_RETURN_DELAY = 5000;
const GITHUB_REPOSITORY_URL =
  "https://github.com/Gap-Nattakorn/nattakorn-7-solutions-frontend-assignment";
const TABS: { label: string; value: ActiveTab }[] = [
  {
    label: "Auto Delete Todo List",
    value: "todo",
  },
  {
    label: "Create data from API",
    value: "api",
  },
];

const INITIAL_ITEMS: TodoItem[] = FRUITS_AND_VEGETABLES.map((item) => ({
  ...item,
  id: item.name,
}));

const INITIAL_BOARD: BoardState = {
  main: INITIAL_ITEMS,
  columns: {
    Fruit: [],
    Vegetable: [],
  },
};

function removeItem(items: TodoItem[], id: string) {
  let removed = false;
  const nextItems: TodoItem[] = [];

  for (const item of items) {
    if (item.id === id) {
      removed = true;
      continue;
    }

    nextItems.push(item);
  }

  return { nextItems, removed };
}

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "move-to-column": {
      const { item } = action;
      const { nextItems: nextMain, removed } = removeItem(state.main, item.id);

      if (!removed) {
        return state;
      }

      return {
        main: nextMain,
        columns: {
          ...state.columns,
          [item.type]: [...state.columns[item.type], item],
        },
      };
    }

    case "return-to-main": {
      const { item } = action;
      const { nextItems: nextColumn, removed } = removeItem(
        state.columns[item.type],
        item.id,
      );

      if (!removed) {
        return state;
      }

      return {
        main: [...state.main, item],
        columns: {
          ...state.columns,
          [item.type]: nextColumn,
        },
      };
    }
  }
}

export default function Home() {
  const [board, dispatch] = useReducer(boardReducer, INITIAL_BOARD);
  const [activeTab, setActiveTab] = useState<ActiveTab>("todo");
  const [apiState, setApiState] = useState<ApiState>({
    status: "idle",
    data: null,
    error: null,
  });
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const returnToMain = useCallback(
    (item: TodoItem) => {
      clearTimer(item.id);
      dispatch({ type: "return-to-main", item });
    },
    [clearTimer],
  );

  const moveToColumn = useCallback(
    (item: TodoItem) => {
      if (timersRef.current.has(item.id)) {
        return;
      }

      dispatch({ type: "move-to-column", item });

      const timer = setTimeout(() => {
        returnToMain(item);
      }, AUTO_RETURN_DELAY);

      timersRef.current.set(item.id, timer);
    },
    [returnToMain],
  );

  const loadDepartmentSummary = useCallback(async () => {
    setApiState({
      status: "loading",
      data: null,
      error: null,
    });

    try {
      const response = await axios.get<DepartmentSummaryResponse>(
        "/api/users-by-department",
      );

      setApiState({
        status: "success",
        data: response.data,
        error: null,
      });
    } catch {
      setApiState({
        status: "error",
        data: null,
        error: "Cannot fetch users from dummyjson.com right now.",
      });
    }
  }, []);

  const changeTab = useCallback(
    (tab: ActiveTab) => {
      setActiveTab(tab);

      if (tab === "api" && apiState.status === "idle") {
        void loadDepartmentSummary();
      }
    },
    [apiState.status, loadDepartmentSummary],
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">
            Frontend Assignment
          </h1>

          <div className="flex flex-col gap-2 sm:items-end">
            <a
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              href={GITHUB_REPOSITORY_URL}
              rel="noreferrer"
              target="_blank"
            >
              GitHub Repository
            </a>
            <Tabs activeTab={activeTab} onChange={changeTab} tabs={TABS} />
          </div>
        </header>

        {activeTab === "todo" ? (
          <TodoBoard
            board={board}
            onMove={moveToColumn}
            onReturn={returnToMain}
          />
        ) : (
          <DepartmentReport
            onRefresh={loadDepartmentSummary}
            state={apiState}
          />
        )}
      </section>
    </main>
  );
}

import type { FruitOrVegetable } from "./utils/fruits_and_vegetables_data";
import type { DepartmentSummaryResponse } from "./utils/users_by_department";

export type ItemType = FruitOrVegetable["type"];
export type ActiveTab = "todo" | "api";

export type TodoItem = FruitOrVegetable & {
  id: string;
};

export type BoardState = {
  main: TodoItem[];
  columns: Record<ItemType, TodoItem[]>;
};

export type ApiState =
  | {
      status: "idle" | "loading";
      data: null;
      error: null;
    }
  | {
      status: "success";
      data: DepartmentSummaryResponse;
      error: null;
    }
  | {
      status: "error";
      data: null;
      error: string;
    };

import Image from "next/image";

import { ColumnHeader } from "./ColumnHeader";

import type { ApiState } from "../types";

const genderIcons = {
  female: {
    alt: "Female icon",
    background: "bg-rose-100",
    src: "/icons/female.svg",
  },
  male: {
    alt: "Male icon",
    background: "bg-blue-100",
    src: "/icons/male.svg",
  },
};

export function DepartmentReport({
  onRefresh,
  state,
}: {
  onRefresh: () => void;
  state: ApiState;
}) {
  const departments =
    state.status === "success"
      ? Object.entries(state.data).sort(([first], [second]) =>
          first.localeCompare(second),
        )
      : [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ColumnHeader count={departments.length} title="Department Summary" />

        <button
          className="h-10 rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={state.status === "loading"}
          onClick={onRefresh}
          type="button"
        >
          {state.status === "loading" ? "Loading" : "Refresh"}
        </button>
      </div>

      {state.status === "error" ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      {state.status === "loading" || state.status === "idle" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="h-48 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
              key={index}
            />
          ))}
        </div>
      ) : null}

      {state.status === "success" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {departments.map(([department, summary]) => (
            <article
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              key={department}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-950">
                  {department}
                </h2>
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                  {summary.ageRange}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Metric
                  icon={genderIcons.male}
                  label="Male"
                  value={summary.male}
                />
                <Metric
                  icon={genderIcons.female}
                  label="Female"
                  value={summary.female}
                />
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-700">Hair</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(summary.hair).map(([color, count]) => (
                    <span
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                      key={color}
                    >
                      {color}: {count}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  Address User
                </h3>
                <div className="mt-2 grid max-h-40 gap-1 overflow-auto pr-1">
                  {Object.entries(summary.addressUser).map(
                    ([fullName, postalCode]) => (
                      <div
                        className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs"
                        key={fullName}
                      >
                        <span className="truncate font-medium text-slate-700">
                          {fullName}
                        </span>
                        <span className="shrink-0 font-semibold text-slate-950">
                          {postalCode}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: {
    alt: string;
    background: string;
    src: string;
  };
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-md ${icon.background}`}
      >
        <Image
          alt={icon.alt}
          className="object-contain"
          height={22}
          src={icon.src}
          width={22}
        />
      </span>
      <div className="min-w-0">
        <div className="text-xl font-semibold leading-none text-slate-950">
          {value}
        </div>
        <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
      </div>
    </div>
  );
}

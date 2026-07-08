export function ColumnHeader({
  count,
  title,
}: {
  count: number;
  title: string;
}) {
  return (
    <div className="flex h-8 items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
        {count}
      </span>
    </div>
  );
}

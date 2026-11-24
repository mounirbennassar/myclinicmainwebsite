import { BRANCH_HOURS, DAY_LABELS, HOURS_BY_CITY, formatSpan, hoursRows, type Span } from "@/app/lib/branch-hours";

/**
 * Every branch's week on one screen, grouped by city, for a dark (bg-primary)
 * panel. From `sm` up it is a table with one column per day group, so a
 * branch's hours and a day across branches both read at a glance; on phones
 * each branch stacks its own rows instead.
 */
export default function BranchHoursTable({ isRtl }: { isRtl: boolean }) {
  const pick = (l: { en: string; ar: string }) => (isRtl ? l.ar : l.en);
  const dentalLabel = isRtl ? "عيادة الأسنان" : "Dental Clinic";

  const cell = (s: Span) => (
    <td className={`py-3 pe-3 last:pe-0 whitespace-nowrap tabular-nums ${s ? "font-bold" : "font-medium text-white/50"}`}>
      {formatSpan(s, isRtl, true)}
    </td>
  );

  const name = (b: (typeof HOURS_BY_CITY)[number]["branches"][number]) => (
    <>
      <span className="block font-bold">{pick(b.name)}</span>
      {b.dental && (
        <span className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-secondary-fixed">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
            dentistry
          </span>
          {dentalLabel}
        </span>
      )}
    </>
  );

  return (
    <>
      <table className="hidden sm:table w-full text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-label text-white/60">
            <th scope="col" className="pb-1 pe-3 text-start font-bold">{isRtl ? "الفرع" : "Branch"}</th>
            <th scope="col" className="pb-1 pe-3 text-start font-bold">{pick(DAY_LABELS.sunThu)}</th>
            <th scope="col" className="pb-1 pe-3 text-start font-bold">{pick(DAY_LABELS.sat)}</th>
            <th scope="col" className="pb-1 text-start font-bold">{pick(DAY_LABELS.fri)}</th>
          </tr>
        </thead>
        {HOURS_BY_CITY.map((group) => (
          <tbody key={group.city.en}>
            <tr>
              <th scope="colgroup" colSpan={4} className="pt-5 pb-2 text-start text-xs font-extrabold uppercase tracking-label text-secondary-fixed">
                {pick(group.city)}
              </th>
            </tr>
            {group.branches.map((b) => {
              const h = BRANCH_HOURS[b.id];
              return (
                <tr key={b.id} className="border-t border-white/15 align-top">
                  <th scope="row" className="py-3 pe-3 text-start font-normal">{name(b)}</th>
                  {cell(h.sunThu)}
                  {cell(h.sat)}
                  {cell(h.fri)}
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>

      <div className="sm:hidden space-y-5">
        {HOURS_BY_CITY.map((group) => (
          <div key={group.city.en}>
            <p className="pb-2 text-xs font-extrabold uppercase tracking-label text-secondary-fixed">{pick(group.city)}</p>
            <ul>
              {group.branches.map((b) => (
                <li key={b.id} className="border-t border-white/15 py-3">
                  {name(b)}
                  <dl className="mt-2 space-y-1 text-sm">
                    {hoursRows(b.id).map((r) => (
                      <div key={r.days.en} className="flex justify-between gap-3">
                        <dt className="text-white/70">{pick(r.days)}</dt>
                        <dd className={`tabular-nums ${r.span ? "font-bold" : "font-medium text-white/50"}`}>{formatSpan(r.span, isRtl)}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

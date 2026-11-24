import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  q: string;
  a: ReactNode;
}

export function Accordion({ items, defaultOpen = -1 }: { items: AccordionItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const base = useId();
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[18px] border border-line bg-surface">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={i}>
            <h3 className="m-0 text-base">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent px-5 py-4 text-start font-heading text-[1.02rem] font-semibold text-heading hover:bg-surface-2"
              >
                <span>{item.q}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-5 shrink-0 text-brand-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen} className="px-5 pb-5 text-muted">
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}

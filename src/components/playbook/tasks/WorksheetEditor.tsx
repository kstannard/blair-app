"use client";

import { cn } from "@/lib/utils";

export interface WorksheetConfig {
  tip?: string;
  sections: WorksheetSection[];
}

export type WorksheetSection =
  | { type: "prompt"; key: string; label: string; description?: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; description?: string; placeholder?: string; rows?: number }
  | { type: "list"; key: string; label: string; description?: string; placeholder?: string; minItems?: number; maxItems?: number }
  | { type: "decision"; key: string; label: string; description?: string; options: { value: string; title: string; description: string }[] }
  | { type: "multiselect"; key: string; label: string; description?: string; options: { value: string; label: string; description?: string }[]; max?: number }
  | { type: "template"; key: string; label: string; description?: string; template: string; fields: { key: string; placeholder: string }[] }
  | { type: "contacts"; key: string; label: string; description?: string; slots: number; statusOptions?: string[] }
  | { type: "checklist"; key: string; label: string; description?: string; items: { value: string; label: string }[] }
  | { type: "heading"; text: string; description?: string };

interface WorksheetEditorProps {
  config: WorksheetConfig;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
}

interface ContactSlotData {
  name: string;
  notes: string;
  status: string;
}

const inputClasses =
  "w-full rounded-xl border border-blair-mist bg-white px-4 py-3 text-sm text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/30";

function SectionLabel({ label, description }: { label: string; description?: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-blair-charcoal/40">
        {label}
      </p>
      {description && (
        <p className="mt-1 text-sm text-blair-charcoal/60">{description}</p>
      )}
    </div>
  );
}

function PromptSection({
  section,
  value,
  onChange,
}: {
  section: Extract<WorksheetSection, { type: "prompt" }>;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <SectionLabel label={section.label} description={section.description} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={section.placeholder}
        className={cn(inputClasses, "mt-3")}
      />
    </div>
  );
}

function TextareaSection({
  section,
  value,
  onChange,
}: {
  section: Extract<WorksheetSection, { type: "textarea" }>;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <SectionLabel label={section.label} description={section.description} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={section.rows ?? 6}
        placeholder={section.placeholder}
        className={cn(inputClasses, "mt-3 leading-relaxed")}
      />
    </div>
  );
}

function ListSection({
  section,
  items,
  onChange,
}: {
  section: Extract<WorksheetSection, { type: "list" }>;
  items: string[];
  onChange: (val: string[]) => void;
}) {
  const minItems = section.minItems ?? 0;
  const maxItems = section.maxItems ?? 20;

  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    if (items.length <= minItems) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (items.length >= maxItems) return;
    onChange([...items, ""]);
  };

  return (
    <div>
      <SectionLabel label={section.label} description={section.description} />
      <div className="mt-3 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(i, e.target.value)}
              placeholder={section.placeholder}
              className={inputClasses}
            />
            {items.length > minItems && (
              <button
                onClick={() => handleRemove(i)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-blair-charcoal/30 transition-colors hover:bg-blair-mist/50 hover:text-blair-charcoal/60"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      {items.length < maxItems && (
        <button
          onClick={handleAdd}
          className="mt-3 rounded-xl border border-dashed border-blair-mist px-4 py-2.5 text-sm font-medium text-blair-charcoal/40 transition-colors hover:border-blair-sage/30 hover:text-blair-sage-dark"
        >
          + Add
        </button>
      )}
    </div>
  );
}

function DecisionSection({
  section,
  value,
  onChange,
}: {
  section: Extract<WorksheetSection, { type: "decision" }>;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <SectionLabel label={section.label} description={section.description} />
      <div className="mt-3 space-y-3">
        {section.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "w-full rounded-xl border p-5 text-left transition-all",
                selected
                  ? "border-blair-sage bg-blair-sage/5 ring-1 ring-blair-sage/20"
                  : "border-blair-mist bg-white hover:border-blair-sage/30"
              )}
            >
              <p className={cn(
                "text-sm font-semibold",
                selected ? "text-blair-sage-dark" : "text-blair-midnight"
              )}>
                {opt.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MultiselectSection({
  section,
  selected,
  onChange,
}: {
  section: Extract<WorksheetSection, { type: "multiselect" }>;
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else if (!section.max || selected.length < section.max) {
      onChange([...selected, val]);
    }
  };

  return (
    <div>
      <SectionLabel label={section.label} description={section.description} />
      {section.max && (
        <p className="mt-1 text-xs text-blair-charcoal/40">
          Select up to {section.max}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {section.options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={cn(
                "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                isSelected
                  ? "border-blair-sage bg-blair-sage/10 text-blair-sage-dark"
                  : "border-blair-mist bg-white text-blair-charcoal/60 hover:border-blair-sage/30"
              )}
            >
              {opt.label}
              {opt.description && (
                <span className="ml-1.5 text-xs font-normal text-blair-charcoal/40">
                  {opt.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TemplateSection({
  section,
  values,
  onChange,
}: {
  section: Extract<WorksheetSection, { type: "template" }>;
  values: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}) {
  const parts = section.template.split(/(\{\{[^}]+\}\})/g);

  return (
    <div>
      <SectionLabel label={section.label} description={section.description} />
      <div className="mt-3 rounded-xl border border-blair-mist bg-white p-5 text-sm leading-loose text-blair-midnight">
        {parts.map((part, i) => {
          const match = part.match(/^\{\{(.+)\}\}$/);
          if (!match) return <span key={i}>{part}</span>;

          const fieldKey = match[1];
          const field = section.fields.find((f) => f.key === fieldKey);
          if (!field) return <span key={i}>{part}</span>;

          return (
            <input
              key={i}
              type="text"
              value={values[fieldKey] ?? ""}
              onChange={(e) => onChange({ ...values, [fieldKey]: e.target.value })}
              placeholder={field.placeholder}
              className="mx-1 inline-block w-48 max-w-full border-b-2 border-blair-sage/30 bg-transparent px-1 py-0.5 text-sm text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none"
            />
          );
        })}
      </div>
    </div>
  );
}

function ContactsSection({
  section,
  contacts,
  onChange,
}: {
  section: Extract<WorksheetSection, { type: "contacts" }>;
  contacts: ContactSlotData[];
  onChange: (val: ContactSlotData[]) => void;
}) {
  const statuses = section.statusOptions ?? ["Not yet", "Reached out", "Done"];

  const handleField = (index: number, field: keyof ContactSlotData, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      <SectionLabel label={section.label} description={section.description} />
      <div className="mt-4 space-y-4">
        {contacts.map((contact, i) => (
          <div key={i} className="rounded-xl border border-blair-mist bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blair-sage/10 text-xs font-semibold text-blair-sage-dark">
                {i + 1}
              </div>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => handleField(i, "name", e.target.value)}
                placeholder="Name"
                className="flex-1 rounded-xl border border-blair-mist bg-white px-3 py-2 text-sm text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/30"
              />
            </div>
            <div className="mt-3 pl-10">
              <textarea
                value={contact.notes}
                onChange={(e) => handleField(i, "notes", e.target.value)}
                rows={2}
                placeholder="Notes"
                className="w-full rounded-xl border border-blair-mist bg-white px-3 py-2 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/30"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 pl-10">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleField(i, "status", status)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    contact.status === status
                      ? "bg-blair-sage/20 text-blair-sage-dark"
                      : "border border-blair-mist bg-white text-blair-charcoal/40 hover:border-blair-sage/30"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistSection({
  section,
  checked,
  onChange,
}: {
  section: Extract<WorksheetSection, { type: "checklist" }>;
  checked: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (checked.includes(val)) {
      onChange(checked.filter((v) => v !== val));
    } else {
      onChange([...checked, val]);
    }
  };

  return (
    <div>
      <SectionLabel label={section.label} description={section.description} />
      <div className="mt-3 space-y-3">
        {section.items.map((item) => {
          const isChecked = checked.includes(item.value);
          return (
            <label key={item.value} className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(item.value)}
                className="h-4.5 w-4.5 rounded border-blair-mist text-blair-sage focus:ring-blair-sage/30 cursor-pointer"
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  isChecked
                    ? "text-blair-charcoal/40 line-through"
                    : "text-blair-charcoal/70 group-hover:text-blair-midnight"
                )}
              >
                {item.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function HeadingSection({ section }: { section: Extract<WorksheetSection, { type: "heading" }> }) {
  return (
    <div>
      <h3 className="font-serif text-xl text-blair-midnight">{section.text}</h3>
      {section.description && (
        <p className="mt-2 text-sm text-blair-charcoal/60">{section.description}</p>
      )}
    </div>
  );
}

function ensureContactSlots(data: unknown, slots: number): ContactSlotData[] {
  const existing = Array.isArray(data) ? (data as ContactSlotData[]) : [];
  const result: ContactSlotData[] = [];
  for (let i = 0; i < slots; i++) {
    result.push(existing[i] ?? { name: "", notes: "", status: "" });
  }
  return result;
}

export function WorksheetEditor({ config, savedData, onSave }: WorksheetEditorProps) {
  const handleChange = (key: string, value: unknown) => {
    onSave({ ...savedData, [key]: value });
  };

  return (
    <div className="space-y-6">
      {config.tip && (
        <div className="rounded-xl border-l-4 border-blair-sage bg-blair-sage/5 p-5">
          <p className="text-sm font-semibold text-blair-sage-dark">Quick tip</p>
          <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/70">
            {config.tip}
          </p>
        </div>
      )}

      {config.sections.map((section, i) => {
        if (section.type === "heading") {
          return (
            <div key={i} className="mt-6">
              <HeadingSection section={section} />
            </div>
          );
        }

        const key = "key" in section ? section.key : `heading-${i}`;

        const inner = (() => {
          switch (section.type) {
            case "prompt":
              return (
                <PromptSection
                  section={section}
                  value={(savedData[section.key] as string) ?? ""}
                  onChange={(val) => handleChange(section.key, val)}
                />
              );
            case "textarea":
              return (
                <TextareaSection
                  section={section}
                  value={(savedData[section.key] as string) ?? ""}
                  onChange={(val) => handleChange(section.key, val)}
                />
              );
            case "list":
              return (
                <ListSection
                  section={section}
                  items={(savedData[section.key] as string[]) ?? [""]}
                  onChange={(val) => handleChange(section.key, val)}
                />
              );
            case "decision":
              return (
                <DecisionSection
                  section={section}
                  value={(savedData[section.key] as string) ?? ""}
                  onChange={(val) => handleChange(section.key, val)}
                />
              );
            case "multiselect":
              return (
                <MultiselectSection
                  section={section}
                  selected={(savedData[section.key] as string[]) ?? []}
                  onChange={(val) => handleChange(section.key, val)}
                />
              );
            case "template":
              return (
                <TemplateSection
                  section={section}
                  values={(savedData[section.key] as Record<string, string>) ?? {}}
                  onChange={(val) => handleChange(section.key, val)}
                />
              );
            case "contacts":
              return (
                <ContactsSection
                  section={section}
                  contacts={ensureContactSlots(savedData[section.key], section.slots)}
                  onChange={(val) => handleChange(section.key, val)}
                />
              );
            case "checklist":
              return (
                <ChecklistSection
                  section={section}
                  checked={(savedData[section.key] as string[]) ?? []}
                  onChange={(val) => handleChange(section.key, val)}
                />
              );
            default:
              return null;
          }
        })();

        return (
          <div key={key} className="rounded-xl border border-blair-mist bg-white p-5 sm:p-6">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

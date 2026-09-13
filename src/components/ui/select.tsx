import { Children, ReactElement, ReactNode, isValidElement } from "react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface CollectedItem {
  value: string;
  label: ReactNode;
}

function collectItems(children: ReactNode): CollectedItem[] {
  const items: CollectedItem[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const el = child as ReactElement<any>;
    if (el.type === SelectItem) {
      items.push({ value: el.props.value, label: el.props.children });
      return;
    }
    if (el.props?.children) {
      items.push(...collectItems(el.props.children));
    }
  });
  return items;
}

function findPlaceholder(children: ReactNode): string | undefined {
  let placeholder: string | undefined;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const el = child as ReactElement<any>;
    if (el.type === SelectValue) {
      placeholder = el.props.placeholder;
      return;
    }
    if (el.props?.children) {
      const found = findPlaceholder(el.props.children);
      if (found) placeholder = found;
    }
  });
  return placeholder;
}

export function Select({ value, onValueChange, children, className }: SelectProps) {
  const items = collectItems(children);
  const placeholder = findPlaceholder(children);

  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600",
        className
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

// The following are no-op structural components kept only so existing
// component code (SelectTrigger > SelectValue, SelectContent > SelectItem)
// keeps compiling unchanged; the real <select>/<option> markup is built by
// the Select component above from these children's props.
export function SelectTrigger({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  void placeholder;
  return null;
}

export function SelectContent({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ children }: { value: string; children: ReactNode }) {
  return <>{children}</>;
}

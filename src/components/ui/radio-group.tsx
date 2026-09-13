import { createContext, useContext, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  name?: string;
}

export function RadioGroup({ value, onValueChange, children, className, name = "radio-group" }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
      <div className={cn("flex flex-col gap-2", className)} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "checked"> {
  value: string;
}

export function RadioGroupItem({ value, className, id, ...props }: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupItem must be used within a RadioGroup");

  return (
    <input
      type="radio"
      id={id}
      name={ctx.name}
      checked={ctx.value === value}
      onChange={() => ctx.onValueChange(value)}
      className={cn(
        "h-4 w-4 border-slate-300 text-emerald-700 focus:ring-2 focus:ring-emerald-600",
        className
      )}
      {...props}
    />
  );
}

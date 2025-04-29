import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

const Switch = ({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) => {
  return (
    <button
      onClick={onChange}
      className={cn(
        `bg-cta mx-2 h-7 w-12 cursor-pointer rounded-full border-3 p-1 ${!checked && "bg-gray-500"} transition-all ${className}`,
      )}
    >
      <div
        className={`bg-grey h-full w-4 rounded-full transition-all ${checked && "translate-x-[125%]"}`}
      ></div>
    </button>
  );
};

export default Switch;

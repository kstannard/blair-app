import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "font-serif text-2xl text-blair-midnight tracking-tight",
        className
      )}
    >
      blair
    </span>
  );
}

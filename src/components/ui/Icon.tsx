import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { Circle } from "lucide-react";

// lucide-react's public API exports one named component per icon (PascalCase); it doesn't
// also expose a name-keyed lookup table, so content data (which references icons as kebab-case
// strings like "door-open") needs a small resolver. Cast is narrow and local to this file.
const iconsByName = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;

function kebabToPascal(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = iconsByName[kebabToPascal(name)] ?? Circle;
  return <Component {...props} />;
}

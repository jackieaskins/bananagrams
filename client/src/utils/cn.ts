export default function cn(classNames: Record<string, boolean>): string {
  return Object.entries(classNames)
    .filter(([, shouldAdd]) => shouldAdd)
    .map(([className]) => className)
    .join(" ");
}

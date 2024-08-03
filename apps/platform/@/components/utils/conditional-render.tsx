export default function ConditionalRender({
  children,
  condition,
}: {
  children: React.ReactNode;
  condition: boolean;
}) {
  return condition ? <>{children}</> : null;
}

export default function ConditionalRender({
  children,
  condition,
}: {
  children: React.ReactNode;
  condition: boolean;
}) {
  if (condition) {
    return <>{children}</>;
  }
  return null;
}

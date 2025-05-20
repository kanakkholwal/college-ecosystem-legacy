// import assert from "node:assert";

export default function ConditionalRender({
  children,
  condition,
}: {
  children: React.ReactNode;
  condition: boolean;
}) {
  // assert the condition for typescript
  // condition && asserts(condition === true, "Condition must be a true");

  return condition ? <>{children}</> : null;
}

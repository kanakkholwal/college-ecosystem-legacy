export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 lg:p-24 @container space-y-4">
      {children}
    </div>
  );
}

import "./loading.css";

export default function RootLoading() {
  return (
    <div className="flex flex-col justify-center items-center gap-4  w-full h-full min-h-screen  p-4 md:p-20 lg:p-36 fixed inset-0 backdrop-blur-xl bg-white/45 z-50">
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="text-2xl md:text-7xl font-bold text-center relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary whitespace-nowrap">
          NITH
        </h1>
        <h2 className="text-md md:text-xl font-semibold capitalize text-slate-700 text-center">
          {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </h2>
      </div>
      <div className="relative w-56 h-1 rounded-full bg-primary/10 overflow-hidden">
        <div className="absolute h-full bg-primary rounded-full animate-loader"></div>
      </div>
    </div>
  );
}

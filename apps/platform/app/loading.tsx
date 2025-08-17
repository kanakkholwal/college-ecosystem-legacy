// import { AppLogo } from "@/components/logo";
import { ApplicationInfo } from "@/components/logo";
import "./loading.css";

export default function RootLoading() {
  return (
    <div className="flex flex-col justify-center items-center gap-4  w-full h-full min-h-screen  p-4 md:p-20 lg:p-36 fixed inset-0 backdrop-blur-xl bg-muted z-50">
      {/* <AppLogo /> */}
      <ApplicationInfo className="flex items-center gap-2 self-center font-medium h-24" imgClassName="size-10 animate-spin animation-duration-9000" />
      <div className="relative w-56 h-1 rounded-full bg-primary/10 overflow-hidden">
        <div className="absolute h-full bg-primary rounded-full animate-loader" />
      </div>
    </div>
  );
}

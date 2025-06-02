import { cn } from "@/lib/utils";
import { BiError } from "react-icons/bi";

type Props = {
  error?: Error;
  title?: string;
  description?: string;
};

export default function ErrorBanner({ error, title, description }: Props) {
  if (error) {
    console.log(error);
  }
  return (
    <div className={cn(
      "flex items-center justify-center flex-col p-6 rounded-lg w-full max-w-2xl mx-auto h-full max-h-96 text-center",
      "bg-destructive/5 border border-destructive"
    )}>
      <div className="size-36 rounded-full bg-destructive/10 flex items-center justify-center aspect-square mb-4">
        <BiError className="m-auto size-24 text-destructive" aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-semibold text-destructive/85 mb-2">
        {title || "Oops! Something went wrong"}
      </h1>
      <p className="text-md text-destructive/60">
        {description ||
          "We are sorry, but something went wrong. Please try again later."}
      </p>
    </div>
  );
}

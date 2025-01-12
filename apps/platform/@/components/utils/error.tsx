import Image from "next/image";
import ErrorImg from "./asset/error.png";

type Props = {
  error?: Error;
  title?: string;
  description?: string;
};

export default function ErrorBanner({ error, title, description }: Props) {
  if (error) {
    console.error(error);
  }
  return (
    <div className="flex items-center justify-center flex-col p-6 rounded-lg w-full max-w-3xl mx-auto h-full max-h-96 bg-red-100 border border-red-500">
      <Image
        src={ErrorImg}
        alt="Error"
        height={512}
        width={512}
        className="mx-auto size-40"
      />
      <h1 className="text-2xl font-semibold text-red-600 text-center">
        {title || "Oops! Something went wrong"}
      </h1>
      <p className="text-md text-red-400 text-center">
        {description ||
          "We are sorry, but something went wrong. Please try again later."}
      </p>
    </div>
  );
}

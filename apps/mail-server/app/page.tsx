import { redirect } from "next/navigation";

export default function Page() {
  redirect("https://app.nith.eu.org");

  return <h1>Hello, Home page!</h1>;
}

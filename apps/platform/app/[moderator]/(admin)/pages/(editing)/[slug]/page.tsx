import { getStaticPageBySlug } from "src/lib/static-page/actions";
import EditStaticPageForm from "./edit-form";

export default async function EditStaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const staticPage = await getStaticPageBySlug((await params).slug);

  return (
    <>
      <EditStaticPageForm staticPage={staticPage} />
    </>
  );
}

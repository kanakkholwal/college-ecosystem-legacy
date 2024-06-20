import CreateCommunityPost from "./form";

export default async function CommunityCreatePost() {
  return (
    <>
      <div className="bg-white/20 backdrop-blur-lg mt-5 rounded-lg p-4 @container/community">
        <div className="w-full flex justify-between items-baseline whitespace-nowrap gap-2">
          <h3 className="text-xl font-semibold">Create Community Post</h3>
        </div>
      </div>
      <CreateCommunityPost />
    </>
  );
}

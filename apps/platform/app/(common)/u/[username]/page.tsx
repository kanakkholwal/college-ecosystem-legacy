import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getHostelById } from "~/actions/hostel";
import { getUserByUsername } from "~/actions/user";
import { changeCase } from "~/utils/string";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}
export default async function PublicUserPage({ params }: UserPageProps) {
  const { username } = await params;
  // const session = await getSession() as sessionType;
  const user = await getUserByUsername(username);
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto h-full space-y-6 space-x-5 p-4">
        <Card>
          <CardContent className="flex flex-col @2xl:flex-row w-full max-w-4xl p-6 gap-4">
            <div className="flex-shrink-0">
              <Avatar className="size-40 bg-secondary/5">
                <AvatarFallback className="text-7xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col justify-center items-start ml-4">
              <CardTitle>
                <div className="text-2xl font-bold">{username}</div>
                <div className="text-sm text-muted-foreground">
                  User not found
                </div>
              </CardTitle>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.hostelId && user.hostelId !== "not_specified") {
    const res = await getHostelById(user.hostelId);
    if (res.success && res.hostel) {
      user.hostelId = res.hostel?.name;
    } else {
      console.error("Error fetching hostel data:", res.error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto h-full space-y-6 space-x-5 p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="flex flex-col @2xl:flex-row w-full p-6 gap-4 @container/0">
          <div className="flex-shrink-0">
            <Avatar className="size-40 bg-secondary/5">
              <AvatarImage
                src={
                  user.image
                    ? user.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`
                }
                alt={user.name}
              />
              <AvatarFallback className="text-3xl">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col justify-start items-start @container/0 flex-auto">
            <CardTitle>
              <div className="text-2xl font-semibold">{user.name}</div>
              <div className="text-sm text-muted-foreground">
                @{user.username}
              </div>
            </CardTitle>
            <div className="grid gap-1 grid-cols-2 @2xl/0:grid-cols-3 text-sm text-muted-foreground my-4">
              <p>Department</p>
              <p className="col-span-2 text-card-foreground font-medium">
                {user.department
                  ? changeCase(user.department.replace("_", " "), "title")
                  : "N/A"}
              </p>
              <p>Roles</p>
              <p className="col-span-2 text-card-foreground font-medium">
                {user.other_roles.length > 0
                  ? user.other_roles
                      .map((role) =>
                        changeCase(role.replace("_", " "), "title")
                      )
                      .join(", ")
                  : "N/A"}
              </p>
              {user.gender !== "not_specified" && (
                <>
                  <p>Gender</p>
                  <p className="col-span-2 text-card-foreground font-medium">
                    {changeCase(user.gender.replace("_", " "), "title")}
                  </p>
                </>
              )}
              {user.hostelId && (
                <>
                  <p>Hostel</p>
                  <p className="col-span-2 text-card-foreground font-medium">
                    {changeCase(user.hostelId.replace("_", " "), "title")}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

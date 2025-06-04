import { Card } from "@/components/ui/card";
import VerifyEmail from "../sign-in/verify-mail";

export default  function VerifyEmailPage() {

  return (
    <div className="flex flex-col gap-6">
      <Card className="m-auto flex flex-col justify-center space-y-6 max-w-[35rem] mx-auto w-full mt-32 @lg:mt-0">
        <div className="px-4 @lg:px-10 border-0 pb-6">
          <VerifyEmail />
        </div>
      </Card>
    </div>
  );
}

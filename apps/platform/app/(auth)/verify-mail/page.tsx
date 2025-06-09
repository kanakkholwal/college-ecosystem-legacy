import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import VerifyEmail from "../sign-in/verify-mail";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address",
  keywords: [
    "Verify Email",
    "Email Verification",
    "Authentication",
    "User Account",
    "NITH Platform",
    "NITH Verify Email",
  ],
  alternates: {
    canonical: "/verify-email",
  },
  robots:{
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};


export default function VerifyEmailPage() {
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

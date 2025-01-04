import {
  Button,
  Column,
  Heading,
  Hr,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { z } from "zod";
const payloadSchema = z.record(
  z.union([z.string(), z.number(), z.array(z.string()), z.array(z.number())])
);

type Payload = z.infer<typeof payloadSchema>;

export function ResetPasswordEmail({ payload }: { payload: Payload }) {
  const email = payload.email as string;
  const userName = payload.name as string;
  const previewText = `Hi ${userName}, Click the button below to reset your password.`;
  const resetLink = payload.reset_link as string;

  return (
    <>
      <Preview>{previewText}</Preview>
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Reset your password
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">
        Hello <strong>{userName}</strong>,
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        You recently requested to reset your password for your account with the
        email address <strong>{email}</strong>. Click the button below to reset
        it.
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
          href={resetLink}
        >
          Reset Password
        </Button>
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        or copy and paste this URL into your browser:{" "}
        <Link href={resetLink} className="text-blue-600 no-underline">
          {resetLink}
        </Link>
      </Text>
      <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
      <Text className="text-[#666666] text-[12px] leading-[24px]">
        If you did not request a password reset, please ignore this email or
        reply to let us know. This password reset is only valid for the next 30
        minutes.
      </Text>
    </>
  );
}

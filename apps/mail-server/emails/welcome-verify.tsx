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

export function WelcomeVerifyEmail({ payload }: { payload: Payload }) {
  const platform_name = payload.platform_name as string;
  const userName = payload.name as string;
  const previewText = `Welcome to ${platform_name}! Verify your email address to get started.`;
  const verifyUrl = payload.verification_url as string;

  return (
    <>
      <Preview>{previewText}</Preview>
      <Text className="text-gray-800 text-lg">
        Hi {userName},{"\n"}
        Welcome to <strong>{platform_name}</strong>! We're thrilled to have you
        join our community.
      </Text>
      <Text className="text-gray-800 mt-4">
        Please verify your email address ({payload.email}) to get started.
      </Text>
      <Button
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4 hover:bg-blue-700"
        href={verifyUrl}
      >
        Verify Email
      </Button>
      <Hr className="border-gray-200 my-6" />
      <Text className="text-gray-600 text-sm">
        If you didn't create an account, you can safely ignore this email.
      </Text>
      <Text className="text-gray-600 text-sm mt-6">
        — The {platform_name} Team
      </Text>
    </>
  );
}

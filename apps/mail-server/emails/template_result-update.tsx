
import { appConfig } from "@/project.config";
import type { EmailPayload } from "@/types/schema";
import {
  Button,
  Heading,
  Hr,
  Link,
  Preview,
  Section,
  Text
} from "@react-email/components";


export function ResultUpdateEmail({ payload }: { payload: EmailPayload }) {
  const batch = payload.batch as string;
  const previewText = "Semester Result Notification";

  return (
    <>
      <Preview>{previewText}</Preview>
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Semester Result Notification
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">
          Hi students of <strong>{batch}</strong> batch,
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        Your semester results have been released. You can view your results with ranking
        by clicking the button below.
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
          href={`${appConfig.url}/results?batch=${batch}`}
        >
          View Results
        </Button>
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        or copy and paste this URL into your browser:{" "}
        <Link href={`${appConfig.url}/results?batch=${batch}`} className="text-blue-600 no-underline">
          {`${appConfig.url}/results?batch=${batch}`}
        </Link>
      </Text>
      <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
      <Text className="text-[#666666] text-[12px] leading-[24px]">
        This is an automated email from the {appConfig.name}. If you have any questions, please contact us at{" "}
        <Link href={`${appConfig.url}/contact`} className="text-blue-600 no-underline">
          Contact
        </Link>
      </Text>
    </>
  );
}
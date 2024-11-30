import {
    Button,
    Container,
    Font,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
  } from "@react-email/components";
  import tailwindConfig from "@root/tailwind.config";
  import { Config } from "tailwindcss";
  
  type Payload = {
    name: string;
    email: string;
    resetUrl: string;
  };
  
  export default function ResetPasswordEmail({ payload }: { payload: Payload }) {
    return (
      <Html>
        <Head>
          <Font
            fontFamily="DM Sans"
            fallbackFontFamily={["Arial", "Helvetica", "sans-serif"]}
            webFont={{
              url: "https://fonts.gstatic.com/s/dmsans/v14/rP2Yp2ywxg089UriI5-g7M8btVsD8Ck0q7u6-K6h9Q.woff2",
              format: "woff2",
            }}
            fontWeight={500}
            fontStyle="normal"
          />
        </Head>
  
        <Preview>
          {`🌟 Reset Your ${process.env.NEXT_PUBLIC_WEBSITE_NAME} Password 🛠️ `}{" "}
        </Preview>
  
        <Tailwind config={tailwindConfig}>
          <Section
            className="max-w-screen-md mx-auto p-8 bg-white dark:bg-slate-900 rounded-md shadow-md"
            style={{
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <Heading as="h3">Dear {payload.name},</Heading>
  
            <Text className="text-gray-600 mb-6">
              We hope this message finds you well. It seems you've requested to
              reset your password on Nexonauts. No worries `–` we're here to help
              you secure your account!
            </Text>
            <Text className="text-lg italic text-gray-700">
              "Your security is our priority. Let's get you back on track."
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              To reset your password, click the link below:
            </Text>
            <Section
              className="w-full flex items-center justify-center p-4"
              key="verify-email"
            >
              <Button
                href={payload.resetUrl}
                className={`inline-flex items-center justify-center px-5 py-3 text-base mx-auto font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-[0.5rem] transition-duration-300   bg-blue-500 dark:bg-blue-500  text-white hover:bg-blue-500/90`}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-gray-600 text-sm mt-6">
              If you did not request this reset, please disregard this email. Your
              account security is essential to us, and no changes will be made
              unless you take action.
            </Text>
            <Heading as="h4" className="mt-8">
              Best Practices for a Secure Password:
            </Heading>
            <Container>
              <Text className="text-gray-600 mb-2" key={"tips-1"}>
                Use a combination of uppercase and lowercase letters.
              </Text>
              <Text className="text-gray-600 mb-2" key={"tips-2"}>
                Include numbers and special characters.
              </Text>
              <Text className="text-gray-600 mb-2" key={"tips-3"}>
                Avoid using easily guessable information, like your name or
                birthday.
              </Text>
            </Container>
            <Heading as="h4" className="mt-8">
              Need Assistance?
            </Heading>
            <Text className="text-gray-600 mt-6">
              If you encounter any issues or have concerns, feel free to reach out
              to our support team at
              <Button
                href="mailto:support@nexonauts.com"
                className="text-blue-500"
              >
                support@nexonauts.com
              </Button>
              . We're here to assist you.
            </Text>
            <Text className="text-gray-600 mt-6">
              Thank you for being part of Nexonauts. Your safety and satisfaction
              are our top priorities.
            </Text>
            <Text className="text-gray-600 mt-2">Best regards,</Text>
            <Text className="text-gray-600">The Nexonauts Team</Text>
          </Section>
        </Tailwind>
      </Html>
    );
  }
  
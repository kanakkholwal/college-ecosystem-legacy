import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export default function EmailWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
              },
            },
          },
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="px-[32px] py-[40px]">
              <Row>
                <Column className="w-[80%]">
                  <Img
                    alt="React Email logo"
                    height="42"
                    src="https://react.email/static/logo-without-background.png"
                  />
                </Column>
                <Column align="right">
                  <Row align="right">
                    <Column>
                      <Link href="https://x.com/kanakkholwal">
                        <Img
                          alt="X"
                          className="mx-[4px]"
                          height="36"
                          src="https://react.email/static/x-logo.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="https://instagram.com/kanakkholwal">
                        <Img
                          alt="Instagram"
                          className="mx-[4px]"
                          height="36"
                          src={`${baseUrl}/static/github-logo.png`}
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="https://github.com/kanakkholwal">
                        <Img
                          alt="Github"
                          className="mx-[4px]"
                          height="36"
                          src="https://react.email/static/github-logo.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>
            <Container className="px-[32px] py-[40px]">{children}</Container>

            <Section className="text-center">
              <table className="w-full">
                <tr className="w-full">
                  <td align="center">
                    <Img
                      alt="React Email logo"
                      height="42"
                      src="https://react.email/static/logo-without-background.png"
                    />
                  </td>
                </tr>
                <tr className="w-full">
                  <td align="center">
                    <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
                      College Platform
                    </Text>
                    <Text className="mb-0 mt-[4px] text-[16px] leading-[24px] text-gray-500">
                      Think different
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

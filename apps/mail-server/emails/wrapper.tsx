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

import { appConfig } from "@/project.config";




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
                <Column className="w-full" align="center">
                  <Img
                    alt={appConfig.name}
                    height="42"
                    src={appConfig.logo}
                  />
                </Column>
                <Column align="right">
                  <Row align="right">
                    <Column>
                      <Link href={appConfig.socials.twitter}>
                        <Img
                          alt="X"
                          className="mx-[4px]"
                          height="36"
                          src="https://cdn-icons-png.flaticon.com/512/5968/5968958.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href={appConfig.socials.linkedin}>
                        <Img
                          alt="X"
                          className="mx-[4px]"
                          height="36"
                          src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href={appConfig.socials.instagram}>
                        <Img
                          alt="Instagram"
                          className="mx-[4px]"
                          height="36"
                          src="https://cdn-icons-png.flaticon.com/512/15713/15713420.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href={appConfig.socials.github}>
                        <Img
                          alt="Github"
                          className="mx-[4px]"
                          height="36"
                          src="https://cdn-icons-png.flaticon.com/512/1051/1051377.png"
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
                      alt={appConfig.name}
                      height="42"
                      src={appConfig.logo}
                    />
                  </td>
                </tr>
                <tr className="w-full">
                  <td align="center">
                    <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
                      {appConfig.name}
                    </Text>
                    <Text className="mb-0 mt-[4px] text-[16px] leading-[24px] text-gray-500">
                      {appConfig.tagline}
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
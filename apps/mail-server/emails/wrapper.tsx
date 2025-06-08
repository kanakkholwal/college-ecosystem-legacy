import { appConfig } from "@/project.config";
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
        <Body className="bg-gray-50 font-sans text-gray-900 px-4 py-6">
          <Container className="bg-white border border-gray-200 rounded-xl max-w-[480px] mx-auto p-6 shadow-sm">
            {/* Header */}
            <Section>
              <Row>
                <Column align="center" className="w-full">
                  <Img
                    alt={appConfig.name}
                    src={appConfig.logo}
                    height="42"
                    className="mx-auto mb-4"
                  />
                </Column>
              </Row>
            </Section>

            {/* Socials */}
            <Section className="text-center mb-6">
              <Row className="justify-center gap-3">
                {[
                  { href: appConfig.socials.twitter, src: "https://cdn-icons-png.flaticon.com/512/5968/5968958.png", alt: "X" },
                  { href: appConfig.socials.linkedin, src: "https://cdn-icons-png.flaticon.com/512/3536/3536505.png", alt: "LinkedIn" },
                  { href: appConfig.socials.instagram, src: "https://cdn-icons-png.flaticon.com/512/15713/15713420.png", alt: "Instagram" },
                  { href: appConfig.socials.github, src: "https://cdn-icons-png.flaticon.com/512/1051/1051377.png", alt: "GitHub" },
                ].map((icon, i) => (
                  <Column key={i} align="center">
                    <Link href={icon.href}>
                      <Img
                        src={icon.src}
                        alt={icon.alt}
                        width="28"
                        height="28"
                        className="mx-1"
                      />
                    </Link>
                  </Column>
                ))}
              </Row>
            </Section>

            {/* Main Content */}
            <Section className="mb-6">{children}</Section>

            {/* Footer */}
            <Section className="text-center border-t border-gray-200 pt-4">
              <Img
                src={appConfig.logo}
                alt={appConfig.name}
                height="32"
                className="mx-auto mb-2"
              />
              <Text className="text-[12px] font-semibold text-gray-700">
                {appConfig.name}
              </Text>
              <Text className="text-[8px] text-gray-500">{appConfig.tagline}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

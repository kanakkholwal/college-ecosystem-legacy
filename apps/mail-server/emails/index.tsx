import { ResetPasswordEmail } from "./reset-password";
import { WelcomeVerifyEmail } from "./welcome-verify";
import EmailWrapper from "./wrapper";

const email_templates = new Map([
  ["reset-password", ResetPasswordEmail],
  ["welcome_verify", WelcomeVerifyEmail],
]);

export function getEmailTemplate({
  template_key,
  payload,
}: {
  template_key: string;
  payload: Record<string, string | number | string[] | number[]>;
}): React.ReactElement | null {
  if (email_templates.has(template_key)) {
    const EmailComponent = email_templates.get(template_key);
    return (
      <EmailWrapper>
        <EmailComponent payload={payload} />
      </EmailWrapper>
    );
  }
  return null;
}

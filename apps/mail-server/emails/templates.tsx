import { ResetPasswordEmail } from "./template_reset-password";
import { WelcomeVerifyEmail } from "./template_welcome-verify";


export const emailTemplates = {
    "welcome_verify": WelcomeVerifyEmail,
    "reset-password": ResetPasswordEmail,
} as const;
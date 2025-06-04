

export const appConfig = {
  name: "College Platform",
  appDomain: "nith.eu.org",
  url: "https://app.nith.eu.org",
  logo: "https://app.nith.eu.org/logo.svg",
  logoSquare: "https://app.nith.eu.org/favicon.ico",
  tagline: "Connecting Students, Faculty, and Staff",
  description:
    "A platform for students, faculty, and staff to interact and collaborate.",
  authors: [
    { name: "Kanak Kholwal", url: "https://kanakkholwal.eu.org" },
    { name: "NITH", url: "https://nith.ac.in" },
  ],
  githubRepo: "https://github.com/kanakkholwal/college-ecosystem",
  socials: {
    twitter: "https://twitter.com/kanakkholwal",
    linkedin: "https://linkedin.com/in/kanakkholwal",
    instagram: "https://instagram.com/kanakkholwal",
    github: "https://github.com/kanakkholwal"
  },
  // sender email
  senderEmail: `platform@nith.eu.org`,
  sender: `College Platform <platform@nith.eu.org>`,

  
} as const;

export const IDENTITY_KEY = process.env.SERVER_IDENTITY;

if (!IDENTITY_KEY) {
  throw new Error("Missing SERVER_IDENTITY in environment variables");
}

const SMTP_HOST = process.env.SMTP_HOST;
const MAIL_EMAIL = process.env.MAIL_EMAIL;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;


if (!MAIL_EMAIL || !MAIL_PASSWORD || !SMTP_HOST) {
  throw new Error("Missing MAIL_EMAIL or MAIL_PASSWORD in environment variables");
}




export const SMTP_SETTINGS = {
  host: SMTP_HOST || "smtp-relay.sendinblue.com", // "smtp.gmail.com", //replace with your email provider
  port: 587,
  // secure: false, // true for 465, false for other ports
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASSWORD,
  },
}
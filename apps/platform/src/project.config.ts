// Project configuration for the College Ecosystem platform


// This file contains the configuration for the app and college
export const appConfig = {
  name: "College Platform",
  appDomain: "nith.eu.org",
  url: "https://app.nith.eu.org",
  logoSquare: "/logo-square.svg",
  logo: "/logo.svg",
  logoDark: "/logo-dark.svg",
  // appDomain: "college-ecosystem.vercel.app",
  // url: "https://college-ecosystem.vercel.app",
  description:
    "A platform for students, faculty, and staff to interact and collaborate.",
  keywords:
    "college, ecosystem, platform, students, faculty, staff, interact, collaborate",
  creator: "Kanak Kholwal",
  authors: [
    { name: "Kanak Kholwal", url: "https://kanakkholwal.eu.org" },
    { name: "NITH", url: "https://nith.ac.in" },
  ],
  githubRepo: "https://github.com/kanakkholwal/college-ecosystem",
  githubUri: "kanakkholwal/college-ecosystem",
    socials: {
    twitter: "https://twitter.com/kanakkholwal",
    linkedin: "https://linkedin.com/in/kanakkholwal",
    instagram: "https://instagram.com/kanakkholwal",
    github: "https://github.com/kanakkholwal"
  }
};

export const orgConfig = {
  name: "National Institute of Technology, Hamirpur",
  shortName: "NITH",
  domain: "nith.ac.in",
  website: "https://nith.ac.in",
  mailSuffix: "@nith.ac.in",
} as const;

export default {
  appConfig,
  orgConfig,
} as const;

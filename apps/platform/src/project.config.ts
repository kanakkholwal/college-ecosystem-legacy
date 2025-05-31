// Project configuration for the College Ecosystem platform

// This file contains the configuration for the app and college
export const appConfig = {
  name: "College Platform",
  // appDomain: "college-ecosystem.vercel.app",
  // url: "https://college-ecosystem.vercel.app",
  appDomain: "nith.eu.org",
  url: "https://app.nith.eu.org",
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

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
    "Un-Official platform of NITH for students, faculty, and staff to collaborate. Manage campus activities, share resources, and connect with the college community.",
  keywords:
    "NITH campus portal, college management system, student portal, faculty collaboration, academic platform, campus resources, " +
    "NITH Hamirpur, college ecosystem, university platform, student management",
  creator: "Kanak Kholwal",
  authors: [
    { name: "Kanak Kholwal", url: "https://kanakkholwal.eu.org" },
    { name: "NITH", url: "https://nith.ac.in" },
  ],
  githubRepo: "https://github.com/kanakkholwal/college-ecosystem?utm_source=app.nith.eu.org&utm_medium=referral&utm_campaign=repo_link",
  githubUri: "kanakkholwal/college-ecosystem",
  socials: {
    twitter: "https://twitter.com/kanakkholwal",
    linkedin: "https://linkedin.com/in/kanakkholwal",
    instagram: "https://instagram.com/kanakkholwal",
    github: "https://github.com/kanakkholwal",
  },
  
  contact: "https://forms.gle/PXbaDm9waeJWYWUP8",
};

export const orgConfig = {
  name: "National Institute of Technology, Hamirpur",
  shortName: "NITH",
  domain: "nith.ac.in",
  website: "https://nith.ac.in",
  logo: "https://nith.ac.in/uploads/settings/15795036012617.png",
  logoSquare:"https://nith.ac.in/uploads/topics/nit-logo15954991401255.jpg",
  mailSuffix: "@nith.ac.in",
  jsonLds:{
    EducationalOrganization: {
      "@type": "EducationalOrganization",
      name: "National Institute of Technology, Hamirpur",
      url: "https://nith.ac.in",
      logo: "https://nith.ac.in/uploads/settings/15795036012617.png",
      sameAs: [
        "https://www.facebook.com/NITHamirpur",
        "https://twitter.com/NITHamirpurHP",
      ],
    },
  }
} as const;



export const supportLinks = [
  {
    href: appConfig.githubRepo,
    title: "Contribute to this project",
  },
  {
    href: appConfig.githubRepo + "/issues",
    title: "Report an issue",
  },

  {
    href: "https://forms.gle/u2ptK12iRVdn5oXF7",
    title: "Give a feedback",
  },
  {
    href: "https://forms.gle/v8Angn9VCbt9oVko7",
    title: "Suggest a feature",
  },

] as const;

export default {
  appConfig,
  orgConfig,
  supportLinks,
} as const;

import Link from "next/link";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuGithub } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";

interface SocialLink {
  href: string;
  icon: React.ElementType;
}
const socials: SocialLink[] = [
  {
    href: "https://x.com/kanakkholwal",
    icon: RiTwitterXFill,
  },
  {
    href: "https://linkedin.com/in/kanak-kholwal",
    icon: FiLinkedin,
  },
  {
    href: "https://github.com/kanakkholwal",
    icon: LuGithub,
  },
  {
    href: "https://instagram.com/kanakkholwal",
    icon: BsInstagram,
  },
];

export default function Footer() {
  return (
    <footer className="flex items-center gap-5">
      <div className="items-center gap-5 md:hidden inline-flex">
        {socials.map((link, index) => {
          return (
            <Link
              href={link.href}
              target="_blank"
              key={`socials_${index}`}
              className="hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-16 icon"
            >
              <link.icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

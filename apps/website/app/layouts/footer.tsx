import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FiLinkedin } from "react-icons/fi";
import { LuGithub } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";

const NEXT_PUBLIC_WEBSITE_NAME = "NITH PORTAL";

export default function Footer() {
  return (
    <footer className="relative z-10 pb-17 lg:pb-22 xl:pb-27 mt-10">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 relative pt-17">
        <div className="w-full h-[1px] footer-divider-gradient absolute top-0 left-0" />
        <div className="flex flex-wrap justify-between mb-10">
          <div>
            <Link
              className="mb-8 inline-block  text-3xl font-extrabold sm:text-3xl xl:text-heading-3"
              href="/"
            >
              {NEXT_PUBLIC_WEBSITE_NAME}
            </Link>
            <p className="mb-12 xl:w-4/5 font-medium text-slate-600">
              Created by{" "}
              <Link
                href="https://kanakkholwal.eu.org?utm_source=nith.eu.org"
                className="text-slate-900 dark:text-slate-200 font-semibold"
              >
                Kanak
              </Link>
            </p>
            <p className="font-medium mt-6 text-slate-600 flex items-center gap-4">
              © {new Date().getFullYear()}{" "}
              <Link
                href="/"
                className="text-slate-900 dark:text-slate-200 font-semibold"
              >
                {NEXT_PUBLIC_WEBSITE_NAME}
              </Link>{" "}
              .
              <Image
                height={20}
                width={80}
                src="https://visitor-badge.laobi.icu/badge?page_id=nith_portal.visitor-badge"
                alt="Vistor counter"
                className="inline-block"
              />
            </p>
          </div>
          <div>
            <div className="flex items-center gap-5">
              <Link
                href="https://x.com/kanakkholwal?utm_source=nith.eu.org"
                className={
                  "text-slate-500 hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-8 icon"
                }
              >
                <RiTwitterXFill className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com/in/kanak-kholwal?utm_source=nith.eu.org"
                className={
                  "text-slate-500 hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-8 icon"
                }
              >
                <FiLinkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/kanakkholwal?utm_source=nith.eu.org"
                className={
                  "text-slate-500 hover:text-primary hover:-translate-y-1  ease-in duration-300 flex justify-center items-center h-16 icon"
                }
              >
                <LuGithub className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com/kanakkholwal?utm_source=nith.eu.org"
                className={
                  "text-slate-500 hover:text-primary hover:-translate-y-1  ease-in duration-300 flex justify-center items-center h-16 icon"
                }
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuGithub } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";

export default function Footer() {

    return (<footer className="z-50 max-w-7xl mx-auto inset-inline-0 flex w-full items-center justify-around font-bold p-4 lg:py-2 backdrop-blur-2xl ">
        <Link href="/" className="relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary lg:text-xl whitespace-nowrap">
            {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </Link>

        <div className="items-center gap-5 flex">
            <span>
                Follow me on
            </span>
            <Link href="https://x.com/kanakkholwal" className={" hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-8 icon"}>
                <RiTwitterXFill className="w-5 h-5" />
            </Link>
            <Link href="https://linkedin.com/in/kanak-kholwal" className={" hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-8 icon"}>
                <FiLinkedin className="w-5 h-5" />
            </Link>
            <Link href="https://github.com/kanakkholwal" className={" hover:text-primary hover:-translate-y-1  ease-in duration-300 flex justify-center items-center h-16 icon"}>
                <LuGithub className="w-5 h-5" />
            </Link>
            <Link href="https://instagram.com/kanakkholwal" className={" hover:text-primary hover:-translate-y-1  ease-in duration-300 flex justify-center items-center h-16 icon"}>
                <BsInstagram className="w-5 h-5" />
            </Link>
        </div>
        <div>
            <img src="https://visitor-badge.laobi.icu/badge?page_id=nith_portal.visitor-badge" alt="Visitor counter" className="inline-block my-2" />
        </div>


    </footer>)

}
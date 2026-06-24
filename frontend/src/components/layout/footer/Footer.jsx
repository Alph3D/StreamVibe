"use client"

import { usePathname } from "next/navigation";
import Copyright from "./Copyright";
import FooterNav from "./FooterNav";
import FooterSocial from "./FooterSocial";

const Footer = () => {
    const pathname = usePathname();
    const currentPath = pathname || "/";

    return (
        <footer className={`bg-c-black-06 ${currentPath == "/register" && "hidden"}`}>
            <div className="container py-8">
                <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 lg:gap-4 md:gap-8 gap-10 mt-6 mb-16">

                    <FooterNav />

                    <FooterSocial />

                </div>

                <Copyright />

            </div>
        </footer>
    );
}

export default Footer;
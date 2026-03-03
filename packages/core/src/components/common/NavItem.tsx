'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItemProps {
    href: string;
    children: ReactNode;
    className?: string;
}

const NavItem = ({ href, children, className }: NavItemProps) => {
    const pathname = usePathname();

    // убираем первый сегмент (locale)
    const segments = pathname.split("/");
    const pathWithoutLocale = "/" + segments.slice(2).join("/");

    const normalizedPath =
        pathWithoutLocale === "/" ? "/" : pathWithoutLocale.replace(/\/$/, "");

    const normalizedHref =
        href === "/" ? "/" : href.replace(/\/$/, "");

    const isActive = normalizedPath === normalizedHref;

    return (
        <Link
            href={href}
            className={`${isActive ? "active" : ""} ${className}`}
        >
            {children}
        </Link>
    );
};

export default NavItem;
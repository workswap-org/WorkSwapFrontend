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
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={isActive ? "active" : "" + className}
        >
            {children}
        </Link>
    );
};

export default NavItem;
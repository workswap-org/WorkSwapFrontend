import { ReactNode } from "react";
import styles from "./AccountHeader.module.scss"
import Link from "next/link";
import LeftArrowIcon from "@core/components/common/icons/LeftArrowIcon";

interface AccountHeaderProps {
    title?: string;
    children?: ReactNode;
    backLink?: string;
}

export default function AccountHeader({title, children, backLink}: AccountHeaderProps) {
    return (
        <div className={`${styles.accountHeader} flex-row`}>
            {backLink && (
                <div className='mobile-actions media-only-flex'>
                    <Link href='/account/my-listings' className={styles.backBtn}>
                        <LeftArrowIcon />
                    </Link>
                </div>
            )}
            {children ?? <h2>{title}</h2>}
        </div>
    )
}
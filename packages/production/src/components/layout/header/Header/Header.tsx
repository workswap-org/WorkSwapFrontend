"use client"

import MobileMenu from "../../MobileMenu/MobileMenu";
import NavButtons from "../NavButtons/NavButtons";
import ThemeChanger from "@core/components/layout/ThemeChanger"
import Link from 'next/link';
import styles from "./Header.module.scss"
import { useI18n } from '@core/lib/contexts/I18nContext';

const Header = () => {

    const { dict } = useI18n();
    
    return (
        <div className={styles.header}>
            <div className={styles.headerContainer}>
                <nav className={styles.navbar}>
                    <Link href="/catalog" className={styles.navbarBrand}>
                        <span>WorkSwap</span>
                        <div className={styles.allListings}>
                            <i className="fa-regular fa-cards-blank"></i>
                            <div>{dict.common['all-listings']}</div>
                        </div>
                        {/* <img src="/images/maskot/base.png"/> */}
                    </Link>
                    <div className={styles.mobileNavButtons}>
                        <div className={styles.navLink}>
                            <ThemeChanger id={"themeChangerHeader"}/>
                        </div>
                        <MobileMenu />
                    </div>
                    <NavButtons />
                </nav>
            </div>
        </div>
    );
};

export default Header;
import { ReactNode } from "react";
import styles from "./Loader.module.scss";
import LoadingSpinner from "../icons/LoadingSpinner";

const Loader = ({
    loadingActive,
    children
}: {
    loadingActive: boolean;
    children: ReactNode;
}) => {

    return loadingActive ? (
        <div className={styles.wrapper}>
            <div className="loader">
                <LoadingSpinner/>
            </div>
        </div>
    ) : children;
};

export default Loader;
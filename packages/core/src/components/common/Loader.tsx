import { ReactNode } from "react";

const Loader = ({
    loadingActive,
    children
}: {
    loadingActive: boolean;
    children: ReactNode;
}) => {

    return loadingActive ? (
        <div className="loader-wrapper">
            <div className="loader">
                <i className="fa-solid fa-spinner-third fa-spin fa-4x"></i>
            </div>
        </div>
    ) : children;
};

export default Loader;
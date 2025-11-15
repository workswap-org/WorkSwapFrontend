import { AccountSidebar } from "@/components";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {

    return (
        <>
            <div className="account-container">
                <div className="account-layout">

                    <AccountSidebar/>

                    <main className="account-main">

                        <Outlet key={location.key} />
                    </main>
                </div>
            </div>
        </>
    );
};

export default AccountLayout;
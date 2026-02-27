import { AccountSidebar } from "@/components";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {

    return (
        <div className="account-layout">

            <AccountSidebar/>

            <main className="account-main">
                <div className="card">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
};

export default AccountLayout;
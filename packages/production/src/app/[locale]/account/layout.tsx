
import { ReactNode } from "react";
import AccountSidebar from "./AccountSidebar";

const AccountLayout = ({children}: {children: ReactNode}) => {

    return (
        <div className="account-layout">

            <AccountSidebar/>

            <main className="account-main">
                <div className="card">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AccountLayout;
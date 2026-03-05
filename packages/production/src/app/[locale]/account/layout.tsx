
import { ReactNode } from "react";
import AccountSidebar from "./AccountSidebar";
import { PrivateRoute } from "@core/routes";

const AccountLayout = ({children}: {children: ReactNode}) => {

    return (
        <PrivateRoute>
            <div className="account-layout">

                <AccountSidebar/>

                <main className="account-main">
                    <div className="card">
                        {children}
                    </div>
                </main>
            </div>
        </PrivateRoute>
    );
};

export default AccountLayout;
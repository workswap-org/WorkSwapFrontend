import AccountSidebar from "@/components/account/AccountSidebar";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {
    return (
        <>
            <div className="account-container">
                <div className="account-layout">

                    <AccountSidebar/>

                    <main className="account-main">

                        <Outlet />
                        {/* <div th:if="${#lists.isEmpty(listings)}" className="no-listings">
                            <p th:text="#{my.listings.no-listings}">У вас пока нет объявлений.</p>
                            <a href="/secure/listing/create" className="btn btn-primary" th:text="#{my.listings.create.new}">Создать первое объявление</a>
                        </div> */}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AccountLayout;
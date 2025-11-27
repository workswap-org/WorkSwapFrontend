import { Outlet } from "react-router-dom";

const ForumLayout = () => {

    return (
        <div className="forum-layout">
            <Outlet />

            <aside className="forum-sidebar">

            </aside>
        </div>
    );
} 

export default ForumLayout;
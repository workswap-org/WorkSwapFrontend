import RecentListings from "./RecentListings";
import RecentUsers from "./RecentUsers";
import StatGrid from "./StatGrid";


const DashboardPage = () => {

    return (
        <>
            <StatGrid />
            <div className="card admin-page">
                <div className="card__body normal-only">
                    
                    <h2>Последние объявления</h2>
                    <RecentListings />
                    <h2>Последние пользователи</h2>
                    <RecentUsers />
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
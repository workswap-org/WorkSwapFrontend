import Card from "@/components/ui/Card/Card";
import RecentListings from "../../../components/pages/dashboard/RecentListings";
import RecentUsers from "../../../components/pages/dashboard/RecentUsers";
import StatGrid from "../../../components/pages/dashboard/StatGrid/StatGrid";

const DashboardPage = () => {

    return (
        <>
            <StatGrid />
            <Card>
                <RecentListings />
                <RecentUsers />
            </Card>
        </>
    );
};

export default DashboardPage;
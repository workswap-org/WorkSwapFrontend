import UsersGrid from "./UsersGrid";

export default function UsersPage() {
    return (
        <div className="card admin-page">
            <div className="card__body">
                <div className="users-page">
                    <UsersGrid />
                </div>
            </div>
        </div>
    );
}
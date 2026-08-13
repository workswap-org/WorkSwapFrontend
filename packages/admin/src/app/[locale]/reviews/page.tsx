import Breadcrumbs from "@core/components/ui/Breadcrumbs/Breadcrumbs";

const ReviewsPage = () => {

    return (
        <>
            <Breadcrumbs
                crumbs={[
                    { href: "/dashboard", title: "Панель управления" },
                    { href: "#", title: "Управление отзывами" },
                ]}
            />
            "Тут пока ничего нет"
        </>
    );
};

export default ReviewsPage;
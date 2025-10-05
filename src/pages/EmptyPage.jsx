import Header from "@/components/layout/header/Header";

const EmptyPage = () => {
    return (
        <div>
            <Header
                user={undefined}
                isEmpty={true}
            />
        </div>
    );
};

export default EmptyPage;
// pages/index.tsx
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: "/catalog",
            permanent: false, // Temporary redirect
        },
    };
};

export default function HomePage() {
    return null; // компонент не рендерится
}
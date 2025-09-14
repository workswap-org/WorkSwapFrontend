import { useEffect } from "react";

const ThemeChanger = ({id}) => {
    useEffect(() => {
        const toggles = document.querySelectorAll(".theme-toggle");
        const savedTheme = localStorage.getItem("theme");

        function applyTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
            toggles.forEach(toggle => {
                toggle.checked = theme === "dark";
            });
        }

        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            applyTheme(prefersDark ? "dark" : "light");
        }

        toggles.forEach(toggle => {
            const handler = () => applyTheme(toggle.checked ? "dark" : "light");
            toggle.addEventListener("change", handler);

            // очищаем при размонтировании
            return () => toggle.removeEventListener("change", handler);
        });
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <label className="switch" htmlFor={id}>
                <input type="checkbox" className="theme-toggle" id={id} />
                <span className="slider">
                    <i className="fa-solid fa-moon"></i>
                    <i className="fa-solid fa-sun" style={{ color: "white" }}></i>
                </span>
            </label>
        </div>
    );
};

export default ThemeChanger;
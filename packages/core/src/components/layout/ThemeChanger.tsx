"use client";

import { useEffect } from "react";

const ThemeChanger = ({ id }: { id: string }) => {
    useEffect(() => {
        const toggles = document.querySelectorAll<HTMLInputElement>(".theme-toggle");

        function setCookie(name: string, value: string, days = 365) {
            const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `${name}=${value}; path=/; expires=${expires}`;
        }

        function applyTheme(theme: "light" | "dark") {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
            setCookie("theme", theme); // добавляем запись в cookie

            toggles.forEach(toggle => {
                toggle.checked = theme === "dark";
            });
        }

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light" || savedTheme === "dark") {
            applyTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            applyTheme(prefersDark ? "dark" : "light");
        }

        toggles.forEach(toggle => {
            const handler = () => applyTheme(toggle.checked ? "dark" : "light");
            toggle.addEventListener("change", handler);

            // очищаем обработчик при размонтировании
            return () => toggle.removeEventListener("change", handler);
        });
    }, []);

    return (
        <label className="switch" htmlFor={id}>
            <input type="checkbox" className="theme-toggle" id={id} />
            <span className="slider">
                <div><i className="fa-solid fa-moon"></i></div>
                <div><i className="fa-solid fa-sun" style={{ color: "white" }}></i></div>
            </span>
        </label>
    );
};

export default ThemeChanger;
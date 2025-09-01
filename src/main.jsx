// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProviders } from "./AppProviders";

import "#/css/public/components/base.css"; // глобальные стили

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppProviders>
                <App />
            </AppProviders>
        </BrowserRouter>
    </React.StrictMode>
);
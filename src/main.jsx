// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth/AuthProvider";
import App from "./App";
import { WebSocketProvider } from "@/contexts/web-socket/WebSocketProvider";

import "#/css/public/components/base.css"; // глобальные стили

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <WebSocketProvider>
                    <App />
                </WebSocketProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
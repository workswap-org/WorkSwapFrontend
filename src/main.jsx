import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProviders } from "@/lib/providers/AppProviders";

import "@/css/components/base.css"; // глобальные стили

ReactDOM.createRoot(document.getElementById("root")).render(

    //<React.StrictMode> для разработки, добавляет двойной вызов функций
    <BrowserRouter> 
        <AppProviders>
            <App />
        </AppProviders>
    </BrowserRouter>
);
// main.jsx
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProviders } from "@core/lib/providers/AppProviders";
import "@/css/main.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(

    //<React.StrictMode> для разработки, добавляет двойной вызов функций
    <BrowserRouter> 
        <AppProviders>
            <App />
        </AppProviders>
    </BrowserRouter>
);
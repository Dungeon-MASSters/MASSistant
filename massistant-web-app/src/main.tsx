import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie"

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </CookiesProvider>
    </React.StrictMode>
);

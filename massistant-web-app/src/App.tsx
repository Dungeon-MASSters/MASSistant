import { BugReport, Egg } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import { useState } from "react";
import { Link, Route, Router, useRouter } from "wouter";
import { MainPage } from "./main_page";
import { KonspektPage } from "./konspekt_page";

const KonspektRouter = () => {
    const router = useRouter();

    return (
        <Router base="/konspekt" parent={router}>
            <Route path="/">
                <KonspektPage />
            </Route>
        </Router>
    );
};

function App() {
    const [count, setCount] = useState(0);

    return (
        <Container>
            <h1>MASSistent</h1>

            <ul>
                <li>
                    <Link href="/">Main</Link>
                </li>
                <li>
                    <Link href="/konspekt">Konspekt</Link>
                </li>
            </ul>

            <Router>
                <Route path="/">
                    <MainPage />
                </Route>
                <KonspektRouter />
            </Router>
        </Container>
    );
}

export default App;

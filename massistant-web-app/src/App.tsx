import { BugReport, Egg } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <h1>Minimal app</h1>

            <Button variant="contained" onClick={() => setCount(count + 1)}>
                <Egg /> Count: {count}
            </Button>
        </>
    );
}

export default App;

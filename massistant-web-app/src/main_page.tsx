import { Box, Button, Stack, Typography, Link, Divider } from "@mui/material";
import "./main-page.css";
import bgPic from './assets/back.jpg';
import { useLocation } from "wouter";

export const MainPage = () => {
    const [_, navigate] = useLocation();

    return <Box sx={{
        position: "absolute",
        width: '100%', height: '100%',
        bottom: 0, right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <div className="cover">
            <img src={bgPic}></img>
            <div className="gradient-1"></div>
            <div className="gradient-2"></div>
        </div>
        <div className="content" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'
        }}>
            <Typography variant="h2" sx={{ fontWeight: 'bolder' }}>Устали писать конспекты?</Typography>
            <Typography variant="h4">📒Поможем выделить <span style={{textDecoration: 'underline'}}>главное</span> в лекциях✍️</Typography>
            <Typography variant="h4" sx={{ mt: 3, fontSize: '18pt' }}>
                <Link
                    onClick={() => navigate("/login_page")}>Войти</Link>
                <span>{" или "}</span>
                <Link
                    onClick={() => navigate("/reg_page")}>зарегистрироваться</Link>
            </Typography>
        </div>
    </Box>;
};

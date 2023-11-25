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
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            <Typography variant="h2" sx={{ fontWeight: 'bolder', mb: 2 }}>Устали писать конспекты?</Typography>
            <Divider />
            <Typography variant="h4" sx={{ mb: 4, fontSize: '18pt' }}>📒Поможем выделить <span style={{textDecoration: 'underline'}}>главное</span> в лекциях✍️</Typography>
            <Typography variant="h4" sx={{ fontSize: '18pt' }}>
                <Link
                    onClick={() => navigate("/login_page")}>Войти</Link>
                <span>{" или "}</span>
                <Link
                    onClick={() => navigate("/reg_page")}>зарегистрироваться</Link>
            </Typography>
        </div>
    </Box>;
};

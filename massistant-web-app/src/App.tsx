import { BugReport, Egg } from "@mui/icons-material";
import {
    Button,
    Container,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    useTheme,
    Theme,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CssBaseline, Stack
} from "@mui/material";
import { useState } from "react";
import { Link, Route, Router, useLocation, useRouter } from "wouter";
import { MainPage } from "./main_page";
import { KonspektPage } from "./konspekt_page";
import { HelpPage } from "./help_page";
import { LoginPage } from "./login_page";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import logo from "./assets/logo.png"

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

    const [_, navigate] = useLocation();

    const drawerWidth = 360;
    const theme = useTheme();

    const menuItems = [
        {
            title: "Главная",
            route: "/"
        },
        {
            title: "Конспект",
            route: "/konspekt"
        },
        {
            title: "Справка",
            route: "/help_page"
        }
    ];

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Stack spacing={2} direction="row" sx={{ flexGrow: 1 }}>
                        <Button variant="outlined" onClick={() => navigate("/")} style={{ backgroundColor: 'transparent' }}><img src={logo}  /></Button>
                    </Stack>
                    <Button color="inherit" onClick={() => navigate("/login_page")}>Войти</Button>
                    <Button color="inherit">Регистрация</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box"
                    }
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: "auto" }}>
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.route)}
                                >
                                    <ListItemIcon>
                                        {index % 3 === 0 ? (
                                            <HomeIcon />
                                        ) : (index % 3 === 1 ? (
                                            <MenuBookIcon />
                                        ) : (
                                            <QuestionMarkIcon />
                                        ))}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <h1>MASSistant</h1>
                <Router>
                    <Route path="/">
                        <MainPage />
                    </Route>
                    <KonspektRouter />
                    <Route path="/help_page">
                        <HelpPage />
                    </Route>
                    <Route path="/login_page">
                        <LoginPage />
                    </Route>
                </Router>
            </Box>
        </Box>
    );
}

export default App;

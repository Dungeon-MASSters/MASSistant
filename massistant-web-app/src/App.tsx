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
    CssBaseline, Stack, createTheme
} from "@mui/material";
import { useState } from "react";
import { Link, Route, Router, Redirect, useLocation, useRouter } from "wouter";
import { MainPage } from "./main_page";
import { KonspektPage } from "./konspekt_page";
import { HelpPage } from "./help_page";
import { LoginPage } from "./login_page";
import { RegPage } from "./reg_page";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu"
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import logo from "./assets/logo.png"
import { create } from "@mui/material/styles/createTransitions";
import { ThemeProvider } from "@emotion/react";
import { useCookies } from "react-cookie";

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

    const [cookies, setCookie, removeCookie] = useCookies(['auth']);

    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawerWidth = 240;
    const theme = useTheme();

    let myTheme = createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '32px',
                    },
                },
            },
        },
        palette: {
            primary: {
                main: '#8d46f4'
            },
            secondary: {
                main: '#f4f5fa'
            }
        }
    })

    const menuItems = [
        // {
        //     title: "Главная",
        //     route: "/"
        // },
        {
            title: "Конспект",
            route: "/konspekt"
        },
        {
            title: "Справка",
            route: "/help_page"
        }
    ];

    // console.log(myTheme);
    return (
        <ThemeProvider theme={myTheme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar
                    // position="fixed"
                    sx={{
                        boxShadow: 'none',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        backgroundColor: 'white',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="secondary"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Stack spacing={2} direction="row" sx={{ flexGrow: 1 }}>
                            <Button variant="outlined" onClick={() => navigate("/")}
                                style={{
                                    height: '3.25em',
                                    borderWidth: 0,
                                    padding: 0,
                                    backgroundColor: 'transparent' 
                                }}><img src={logo} style={{
                                    height: '90%'
                                }}/></Button>
                        </Stack>
                        <Stack spacing={'1em'} direction="row">
                            {!cookies.auth && <Button color='secondary' variant="contained" sx={{backgroundColor: '#e1e1e9' }}
                                onClick={() => navigate("/login_page")}>Войти</Button>}
                            {!cookies.auth && <Button color='secondary' variant="contained" sx={{ backgroundColor: '#e1e1e9' }}
                                onClick={() => navigate("/reg_page")}>Регистрация</Button>}
                            {cookies.auth && <Button color='secondary' variant="contained" sx={{ backgroundColor: '#e1e1e9' }}
                                onClick={() => {
                                    removeCookie("auth");
                                    navigate("/login_page");
                                }}>Выйти</Button>}
                        </Stack>
                    </Toolbar>
                </AppBar>
                <nav style={{ display: !cookies.auth ? 'none' : 'block' }}>
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                width: drawerWidth,
                                boxSizing: "border-box"
                            },
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
                                                { index % 2 == 0 ? <MenuBookIcon /> : <QuestionMarkIcon />}
                                                {/* {index % 3 === 0 ? (
                                                    <HomeIcon />
                                                ) : (index % 3 === 1 ? (
                                                    <MenuBookIcon />
                                                ) : (
                                                    <QuestionMarkIcon />
                                                ))} */}
                                            </ListItemIcon>
                                            <ListItemText primary={item.title} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </nav>
                <div style={{
                    display: 'flex',
                    flexGrow: 1,
                    width: '100%',
                    minHeight: '100vh',
                    height: '100%',
                }}>
                    <Box component="main" bgcolor={myTheme.palette.secondary.main} sx={{
                        flexGrow: 1, p: 3, pt: 0 }}>
                        <Toolbar />
                        {/* Это не нужно, потому что у вас и так в шапке название продукта есть */}
                        {/* <h1>MASSistant</h1> */}
                        <Router>
                            <Route path="/">
                                {cookies.auth ? <Redirect to="/konspekt"></Redirect> : <MainPage />}
                            </Route>
                            <KonspektRouter />
                            <Route path="/help_page">
                                <HelpPage />
                            </Route>
                            <Route path="/login_page">
                                <LoginPage />
                            </Route>
                            <Route path="/reg_page">
                                <RegPage />
                            </Route>
                        </Router>
                    </Box>
                </div>
            </Box>
        </ThemeProvider>
    );
}

export default App;

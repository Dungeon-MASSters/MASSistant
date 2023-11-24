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
declare module "@mui/material/styles" {
    interface Palette {
        white: string;
    }
    interface PaletteOptions {
        white?: string;
    }
}
  
declare module "@mui/material/AppBar" {
    interface AppBarPropsColorOverrides {
        white: true;
    }
}
// import './customPalette.module';
// import './customAppBar.module';
// import './customButton.module';

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

    console.log(myTheme);
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
                            <Button color='secondary' variant="contained" sx={{ backgroundColor: '#e1e1e9' }}
                                onClick={() => navigate("/login_page")}>Войти</Button>
                            <Button color='secondary' variant="contained" sx={{ backgroundColor: '#e1e1e9' }}
                                onClick={() => navigate("/reg_page")}>Регистрация</Button>
                        </Stack>
                    </Toolbar>
                </AppBar>
                <nav>
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
                        flexGrow: 1, p: 3 }}>
                        <Toolbar />
                        {/* Это не нужно, потому что у вас и так в шапке название продукта есть */}
                        {/* <h1>MASSistant</h1> */}
                        <Router>
                            <Route path="/">
                                <Redirect to="/konspekt"></Redirect>
                                {/* <MainPage /> */}
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

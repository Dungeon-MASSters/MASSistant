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
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline
} from "@mui/material";
import { useState } from "react";
import { Link, Route, Router, useRouter } from "wouter";
import { MainPage } from "./main_page";
import { KonspektPage } from "./konspekt_page";
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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

    const drawerWidth = 360;
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MASSistant
                    </Typography>
                    <Button color="inherit">Войти</Button>
                    <Button color="inherit">Регистрация</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
              >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                  <List>
                    {['main', 'konspect'].map((text, index) => (
                      <ListItem key={text} disablePadding>
                        <ListItemButton href={index % 2 === 0 ? "/" : "/konspekt"}>
                          <ListItemIcon>
                            {index % 2 === 0 ? <HomeIcon /> : <MenuBookIcon />}
                          </ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <h1>MASSistent</h1>
                <Router>
                    <Route path="/">
                        <MainPage />
                    </Route>
                    <KonspektRouter />
                </Router>
            </Box>
        </Box>
    );
}

export default App;

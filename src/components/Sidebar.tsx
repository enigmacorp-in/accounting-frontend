import React from 'react';
import { Drawer, Toolbar, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';

const drawerWidth = 240;

const Sidebar = () => {
    const menuItems = [
        { text: 'Dashboard', path: '/dashboard', icon: <></> },
        { text: 'Business Settings', path: '/business-settings', icon: <></> },
        { text: 'Reports', path: '/reports', icon: <></> },
        { text: 'Invoices', path: '/invoices', icon: <></> },
        { text: 'Payments', path: '/payments', icon: <></> },
        { text: 'Customers', path: '/customers', icon: <></> },
        { text: 'Suppliers', path: '/suppliers', icon: <></> },
        { text: 'Inventory', path: '/inventory', icon: <></> },
        { text: 'Expenses', path: '/expenses', icon: <></> },
        { text: 'Assets', path: '/assets', icon: <></> },
        { text: 'Liabilities', path: '/liabilities', icon: <></> },
        { text: 'Equity', path: '/equity', icon: <></> },
        { text: 'Cash Flow', path: '/cash-flow', icon: <></> },
        { text: 'Taxes', path: '/taxes', icon: <></> },
        { text: 'Settings', path: '/settings', icon: <></> },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#3f51b5',
                    color: 'white'
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Indian Accounting Software
                </Typography>
            </Toolbar>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
            <List>
                {menuItems.map((item) => (
                    <Link key={item.text} href={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar; 
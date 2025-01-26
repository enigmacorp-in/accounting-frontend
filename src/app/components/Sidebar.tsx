'use client';

import React from 'react';
import Link from 'next/link';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider,
} from '@mui/material';
import {
    Dashboard,
    People,
    Inventory,
    Receipt,
    Business,
} from '@mui/icons-material';

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Clients', icon: <People />, path: '/clients' },
    { text: 'Inventory', icon: <Inventory />, path: '/inventory' },
    { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
    { text: 'Business Settings', icon: <Business />, path: '/business' }
];

const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    backgroundColor: '#3f51b5',
                    color: 'white',
                },
            }}
        >
            <Box sx={{ overflow: 'auto', mt: 8 }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" component="div">
                        Indian Accounting Software
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                <List>
                    {menuItems.map((item) => (
                        <Link 
                            key={item.text} 
                            href={item.path}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <ListItem
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar; 
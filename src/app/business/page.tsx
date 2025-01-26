'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    Alert
} from '@mui/material';
import api from '@/lib/axios';
import DashboardLayout from '../components/DashboardLayout';

interface BusinessDetails {
    name: string;
    email: string;
    phone: string;
    gstin: string;
    pan: string;
    website: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    bankDetails: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        branchName: string;
        ifscCode: string;
    };
    termsAndConditions: string;
}

export default function BusinessPage() {
    const [formData, setFormData] = useState<BusinessDetails>({
        name: '',
        email: '',
        phone: '',
        gstin: '',
        pan: '',
        website: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        bankDetails: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            branchName: '',
            ifscCode: ''
        },
        termsAndConditions: ''
    });

    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchBusinessDetails();
    }, []);

    const fetchBusinessDetails = async () => {
        try {
            const response = await api.get('/business');
            if (response.data) {
                setFormData(response.data);
            }
        } catch (error) {
            console.error('Error fetching business details:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            if (section === 'address' || section === 'bankDetails') {
                setFormData(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'gstin' || name === 'pan' ? value.toUpperCase() : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/business', formData);
            setMessage({ type: 'success', text: 'Business details updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update business details.' });
            console.error('Error updating business details:', error);
        }
    };

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Business Settings
                </Typography>

                {message && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}

                <Paper sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Company Logo
                                </Typography>
                                <Button variant="contained" component="label">
                                    Upload Logo
                                    <input type="file" hidden accept="image/*" />
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Company Details
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="PAN"
                                    name="pan"
                                    value={formData.pan}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Address
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Street Address"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="PIN Code"
                                    name="address.pincode"
                                    value={formData.address.pincode}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Bank Details
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Account Name"
                                    name="bankDetails.accountName"
                                    value={formData.bankDetails.accountName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    name="bankDetails.accountNumber"
                                    value={formData.bankDetails.accountNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Bank Name"
                                    name="bankDetails.bankName"
                                    value={formData.bankDetails.bankName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Branch Name"
                                    name="bankDetails.branchName"
                                    value={formData.bankDetails.branchName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="IFSC Code"
                                    name="bankDetails.ifscCode"
                                    value={formData.bankDetails.ifscCode}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Terms and Conditions
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="termsAndConditions"
                                    value={formData.termsAndConditions}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </DashboardLayout>
    );
} 
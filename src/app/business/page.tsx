'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import { PhotoCamera, Save } from '@mui/icons-material';
import axios from '@/lib/axios';

interface BusinessDetails {
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    phone: string;
    email: string;
    website: string;
    gstin: string;
    pan: string;
    bankDetails: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        ifscCode: string;
        branch: string;
    };
    logo?: string;
    termsAndConditions: string;
}

export default function BusinessPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
        name: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        phone: '',
        email: '',
        website: '',
        gstin: '',
        pan: '',
        bankDetails: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            ifscCode: '',
            branch: ''
        },
        termsAndConditions: ''
    });

    useEffect(() => {
        fetchBusinessDetails();
    }, []);

    const fetchBusinessDetails = async () => {
        try {
            const response = await axios.get('/business');
            setBusinessDetails(response.data);
            setError(null);
        } catch (err: any) {
            if (err.response?.status !== 404) {
                setError('Failed to load business details');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setBusinessDetails(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof BusinessDetails] as any),
                    [child]: value
                }
            }));
        } else {
            setBusinessDetails(prev => ({
                ...prev,
                [name]: name === 'gstin' || name === 'pan' ? value.toUpperCase() : value
            }));
        }
    };

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onloadend = async () => {
                try {
                    setSaving(true);
                    await axios.patch('/business/logo', { logo: reader.result });
                    setBusinessDetails(prev => ({
                        ...prev,
                        logo: reader.result as string
                    }));
                    setSuccess('Logo updated successfully');
                    setError(null);
                } catch (err) {
                    setError('Failed to update logo');
                } finally {
                    setSaving(false);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await axios.post('/business', businessDetails);
            setSuccess('Business details saved successfully');
            setError(null);
        } catch (err) {
            setError('Failed to save business details');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} p={3}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Business Settings
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Company Logo */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Company Logo
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            {businessDetails.logo && (
                                <img 
                                    src={businessDetails.logo} 
                                    alt="Company Logo" 
                                    style={{ maxWidth: 200, maxHeight: 100 }}
                                />
                            )}
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<PhotoCamera />}
                            >
                                Upload Logo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                />
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Company Details */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Company Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    name="name"
                                    value={businessDetails.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={businessDetails.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={businessDetails.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Website"
                                    name="website"
                                    value={businessDetails.website}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    name="gstin"
                                    value={businessDetails.gstin}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="PAN"
                                    name="pan"
                                    value={businessDetails.pan}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Address
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Street Address"
                                    name="address.street"
                                    value={businessDetails.address.street}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="address.city"
                                    value={businessDetails.address.city}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    name="address.state"
                                    value={businessDetails.address.state}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="PIN Code"
                                    name="address.pincode"
                                    value={businessDetails.address.pincode}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Bank Details */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Bank Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Account Name"
                                    name="bankDetails.accountName"
                                    value={businessDetails.bankDetails.accountName}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    name="bankDetails.accountNumber"
                                    value={businessDetails.bankDetails.accountNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Bank Name"
                                    name="bankDetails.bankName"
                                    value={businessDetails.bankDetails.bankName}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="IFSC Code"
                                    name="bankDetails.ifscCode"
                                    value={businessDetails.bankDetails.ifscCode}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Branch"
                                    name="bankDetails.branch"
                                    value={businessDetails.bankDetails.branch}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Terms and Conditions */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Terms and Conditions
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Terms and Conditions"
                            name="termsAndConditions"
                            value={businessDetails.termsAndConditions}
                            onChange={handleChange}
                        />
                    </Paper>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    >
                        {saving ? 'Saving...' : 'Save Details'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
} 
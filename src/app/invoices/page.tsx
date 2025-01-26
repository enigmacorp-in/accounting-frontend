'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { invoiceAPI, clientAPI, inventoryAPI } from '@/services/api';
import DashboardLayout from '../components/DashboardLayout';
import { format } from 'date-fns';

interface Client {
  _id: string;
  name: string;
  email: string;
  gstin: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  hsnCode: string;
  price: number;
  taxRate: number;
}

const saleTypes = ['Central - 5%', 'Central - 18%', 'Central - 28%'] as const;
type SaleType = typeof saleTypes[number];

interface InvoiceItem {
  product: InventoryItem;
  quantity: number;
  price: number;
  saleType: SaleType;
  taxRate: number;
  taxAmount: number;
  total: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  client: Client;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  totalTax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [selectedSaleType, setSelectedSaleType] = useState<SaleType>('Central - 18%');

  const fetchInvoices = async () => {
    try {
      const response = await invoiceAPI.getAll();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchClients();
    fetchInventory();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setSelectedClient(null);
    setInvoiceItems([]);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingInvoice(null);
    setSelectedClient(null);
    setInvoiceItems([]);
    setSelectedProduct(null);
    setQuantity('1');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceAPI.delete(id);
        fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleGeneratePDF = async (id: string) => {
    try {
      const response = await invoiceAPI.generatePDF(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const addInvoiceItem = () => {
    if (!selectedProduct || !quantity) return;

    const qty = parseFloat(quantity);
    const price = selectedProduct.price;
    const taxRate = parseInt(selectedSaleType.split(' - ')[1]);
    const taxAmount = (price * qty * taxRate) / 100;
    const total = price * qty + taxAmount;

    setInvoiceItems(prev => [...prev, {
      product: selectedProduct,
      quantity: qty,
      price,
      saleType: selectedSaleType,
      taxRate,
      taxAmount,
      total,
    }]);

    setSelectedProduct(null);
    setQuantity('1');
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalTax = invoiceItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const total = subtotal + totalTax;
    return { subtotal, totalTax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || invoiceItems.length === 0) return;

    const { subtotal, totalTax, total } = calculateTotals();
    const invoiceData = {
      client: selectedClient._id,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      items: invoiceItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        saleType: item.saleType,
        taxRate: item.taxRate,
        taxAmount: item.taxAmount,
        total: item.total,
      })),
      subtotal,
      totalTax,
      total,
      status: 'draft',
    };

    try {
      await invoiceAPI.create(invoiceData);
      handleClose();
      fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Invoices</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Create Invoice
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice No</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.client.name}</TableCell>
                  <TableCell>{format(new Date(invoice.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>₹{invoice.total}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleGeneratePDF(invoice._id)} color="primary">
                      <PdfIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(invoice._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
              <Autocomplete
                options={clients}
                getOptionLabel={(client) => `${client.name} (${client.gstin})`}
                value={selectedClient}
                onChange={(_, newValue) => setSelectedClient(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Client"
                    required
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Autocomplete
                  sx={{ flexGrow: 1 }}
                  options={inventory}
                  getOptionLabel={(item) => `${item.name} (₹${item.price})`}
                  value={selectedProduct}
                  onChange={(_, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Product"
                    />
                  )}
                />
                <TextField
                  sx={{ width: 100 }}
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  InputProps={{
                    inputProps: { min: 1 }
                  }}
                />
                <TextField
                  sx={{ width: 200 }}
                  select
                  label="Sale Type"
                  value={selectedSaleType}
                  onChange={(e) => setSelectedSaleType(e.target.value as SaleType)}
                >
                  {saleTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  onClick={addInvoiceItem}
                  disabled={!selectedProduct || !quantity}
                >
                  Add Item
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Sale Type</TableCell>
                      <TableCell align="right">Tax Amount</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">₹{item.price}</TableCell>
                        <TableCell align="right">{item.saleType}</TableCell>
                        <TableCell align="right">₹{item.taxAmount}</TableCell>
                        <TableCell align="right">₹{item.total}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeInvoiceItem(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {invoiceItems.length > 0 && (
                      <>
                        <TableRow>
                          <TableCell colSpan={4} />
                          <TableCell align="right">Subtotal:</TableCell>
                          <TableCell align="right">
                            ₹{calculateTotals().subtotal}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} />
                          <TableCell align="right">Total Tax:</TableCell>
                          <TableCell align="right">
                            ₹{calculateTotals().totalTax}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} />
                          <TableCell align="right">
                            <strong>Total:</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>₹{calculateTotals().total}</strong>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!selectedClient || invoiceItems.length === 0}
            >
              Create Invoice
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </DashboardLayout>
  );
} 
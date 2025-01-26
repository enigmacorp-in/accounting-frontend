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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircle as AddStockIcon,
  RemoveCircle as RemoveStockIcon,
} from '@mui/icons-material';
import { inventoryAPI } from '@/services/api';
import DashboardLayout from '../components/DashboardLayout';

interface InventoryItem {
  _id: string;
  name: string;
  description: string;
  hsnCode: string;
  unit: string;
  price: number;
  stock: number;
}

const units = ['PCS', 'KG', 'MTR', 'BOX', 'LTR'];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [stockDialog, setStockDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hsnCode: '',
    unit: 'PCS',
    price: '',
    stock: 0,
  });
  const [stockError, setStockError] = useState<string>('');

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      hsnCode: '',
      unit: 'PCS',
      price: '',
      stock: 0,
    });
  };

  const handleStockDialogOpen = (item: InventoryItem) => {
    setEditingItem(item);
    setStockQuantity(0);
    setStockDialog(true);
  };

  const handleStockDialogClose = () => {
    setStockDialog(false);
    setEditingItem(null);
    setStockQuantity(0);
    setStockError('');
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      hsnCode: item.hsnCode,
      unit: item.unit,
      price: item.price.toString(),
      stock: item.stock,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.delete(id);
        fetchInventory();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };
      
      if (editingItem) {
        await inventoryAPI.update(editingItem._id, data);
      } else {
        await inventoryAPI.create(data);
      }
      handleClose();
      fetchInventory();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleStockUpdate = async () => {
    if (!editingItem) return;
    try {
      setStockError('');
      await inventoryAPI.updateStock(editingItem._id, stockQuantity);
      handleStockDialogClose();
      fetchInventory();
    } catch (error: any) {
      console.error('Error updating stock:', error);
      if (error.response?.data?.message) {
        setStockError(error.response.data.message);
      } else {
        setStockError('Failed to update stock');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Inventory</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Item
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>HSN Code</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.hsnCode}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(item)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleStockDialogOpen(item)} color="success">
                      <AddStockIcon />
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
          <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
              />
              <TextField
                name="hsnCode"
                label="HSN Code"
                value={formData.hsnCode}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="unit"
                label="Unit"
                value={formData.unit}
                onChange={handleChange}
                select
                required
                fullWidth
              >
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: '₹',
                }}
              />
              {!editingItem && (
                <TextField
                  name="stock"
                  label="Initial Stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={stockDialog} onClose={handleStockDialogClose}>
        <DialogTitle>Update Stock for {editingItem?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2 }}>
            <IconButton
              color="error"
              onClick={() => setStockQuantity(prev => prev - 1)}
            >
              <RemoveStockIcon />
            </IconButton>
            <TextField
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              InputProps={{
                inputProps: { min: -999999 }
              }}
              helperText="Use negative values to reduce stock"
              error={!!stockError}
            />
            <IconButton
              color="success"
              onClick={() => setStockQuantity(prev => prev + 1)}
            >
              <AddStockIcon />
            </IconButton>
          </Box>
          {stockError && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {stockError}
            </Typography>
          )}
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Current Stock: {editingItem?.stock || 0}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
            New Stock will be: {(editingItem?.stock || 0) + stockQuantity}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStockDialogClose}>Cancel</Button>
          <Button onClick={handleStockUpdate} variant="contained" color="primary">
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
} 
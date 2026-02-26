import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  IconButton
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';

function ImageUpload({ currentImage, onImageUploaded, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImage || '');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = `http://localhost:5000${res.data.filePath}`;
      setPreview(imageUrl);
      onImageUploaded(imageUrl);
      setUploading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setPreview('');
    onImageUploaded('');
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {preview && (
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={preview}
              sx={{ width: 100, height: 100 }}
              variant="rounded"
            />
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': { bgcolor: 'error.dark' }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Button
          variant="contained"
          component="label"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : label}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>
      </Box>
    </Box>
  );
}

export default ImageUpload;
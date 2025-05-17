"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import { Avatar, Box, Button, Card, CardContent, CircularProgress, TextField, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export default function SellerInfoPage() {
  const { user } = useAuth();
  const [sellerData, setSellerData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatarFile: null as File | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      // Gerçek veri çekme işlemi burada olacak
      const mockData = {
        createdAt: new Date('2025-05-15T11:28:53Z'),
        email: "abc@tekstil.com",
        name: "ABC Tekstil",
        type: "producer",
        avatarURL: ""
      };
      setSellerData(mockData);
      setFormData({
        name: mockData.name,
        email: mockData.email,
        avatarFile: null
      });
      setLoading(false);
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        avatarFile: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Burada resim yükleme API'sini ve profil güncellemeyi çağırın
      if (formData.avatarFile) {
        setUploading(true);
        // await uploadAvatar(formData.avatarFile);
        // avatarURL = getAvatarUrl();
      }
      
      // await updateProfile(user.uid, { name: formData.name });
      
      setSellerData({
        ...sellerData,
        name: formData.name,
        // avatarURL: avatarURL || sellerData.avatarURL
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const getAvatarPreview = () => {
    if (formData.avatarFile) {
      return URL.createObjectURL(formData.avatarFile);
    }
    return sellerData?.avatarURL || undefined;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" className="mb-6 text-gray-800 font-bold text-center">
        Seller Profile
      </Typography>

      <Card className="max-w-3xl mx-auto shadow-lg rounded-lg">
        <CardContent className="p-6">
          {/* Avatar - Üst Orta Kısım */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar
                src={getAvatarPreview()}
                className="w-32 h-32 border-2 border-gray-200 cursor-pointer"
                sx={{ fontSize: '3rem' }}
                onClick={handleAvatarClick}
              >
                {sellerData?.name?.charAt(0) || 'A'}
              </Avatar>
              
              {isEditing && (
                <>
                  <IconButton 
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={handleAvatarClick}
                  >
                    <AddAPhotoIcon />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
            </div>
            
            {uploading && (
              <div className="mt-2 text-sm text-gray-500">
                <CircularProgress size={20} className="mr-2" />
                Uploading image...
              </div>
            )}
          </div>

          {/* Bilgi Bölümü */}
          <div className="space-y-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  name="name"
                  label="Company Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                
                <TextField
                  name="email"
                  label="Email"
                  value={sellerData?.email}
                  fullWidth
                  disabled
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    disabled={loading || uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={loading || uploading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <Typography variant="h5" className="font-semibold text-center">
                    {sellerData?.name}
                  </Typography>

                  <div className="flex items-center space-x-2">
                    <EmailIcon className="text-gray-500" />
                    <Typography variant="body1" className="text-gray-700">
                      {sellerData?.email}
                    </Typography>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CalendarTodayIcon className="text-gray-500" />
                    <Typography variant="body1" className="text-gray-700">
                      Member since: {sellerData?.createdAt?.toLocaleDateString()}
                    </Typography>
                  </div>

                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                    className="mt-4"
                  >
                    Edit Profile
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { Avatar, Button, Card, CardContent, CircularProgress, TextField, Typography, IconButton, TextareaAutosize } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSellerInfo } from '@/app/lib/api/getSellerInfo';
import { uploadSellerAvatar } from '@/app/lib/api/uploadSellerAvatar';
import { updateSellerInfo } from '@/app/lib/api/updateSellerInfo';


export default function SellerInfoPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = user?.token;

  const { data: sellerData, isLoading, isError } = useQuery({
    queryKey: ['seller-info', user?.id],
    queryFn: () => getSellerInfo(token!),
    enabled: !!token,
  });

  // Avatar yükleme mutation'ı
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => uploadSellerAvatar(file, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seller-info", user?.id]
      });
    },
  });

  // Profil güncelleme mutation'ı
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string, description?: string }) => updateSellerInfo(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seller-info", user?.id]
      });
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    avatarFile: null as File | null,
  });

  // Seller verileri geldiğinde form verilerini güncelle
  useEffect(() => {
    if (sellerData) {
      setFormData({
        name: sellerData.name,
        email: sellerData.email,
        description: sellerData.description || 'Kendinizi kısaca tanıtın',
        avatarFile: null,
      });
    }
  }, [sellerData]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, avatarFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Avatar yükleme işlemi
      if (formData.avatarFile) {
        await uploadAvatarMutation.mutateAsync(formData.avatarFile);
      }
      // Profil bilgilerini güncelleme
      await updateProfileMutation.mutateAsync({ name: formData.name, description: formData.description });
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const getAvatarPreview = () => {
    if (formData.avatarFile) return URL.createObjectURL(formData.avatarFile);
    return sellerData?.avatarURL;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography color="error">Error loading seller data</Typography>
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
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar
                src={getAvatarPreview()}
                className="border-2 border-gray-200 cursor-pointer"

                sx={{ fontSize: '3rem', width: 100, height: 100 }}
                onClick={handleAvatarClick}
              >
                {sellerData?.name?.charAt(0) || 'A'}
              </Avatar>

              {isEditing && (
                <>
                  <IconButton
                    className="absolute bottom-2 left-8 bg-blue-500 hover:bg-blue-600 text-white"
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

            {uploadAvatarMutation.isPending && (
              <div className="mt-2 text-sm text-gray-500">
                <CircularProgress size={20} className="mr-2" />
                Uploading image...
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className='flex flex-col gap-4'>
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
                  <TextareaAutosize
                    name="description"
                    aria-label="About Your Business"
                    minRows={5}
                    maxRows={10}
                    placeholder="Kısaca kendinizden bahsedin ..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 mt-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                    }}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    disabled={uploadAvatarMutation.isPending || updateProfileMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={uploadAvatarMutation.isPending || updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
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
                  <div className=" flex flex-col items-center space-x-2">
                    <Typography variant="h6" className="font-medium mb-2">
                      Açıklama
                    </Typography>
                    <Typography variant="body1" className="text-gray-700 whitespace-pre-line">
                      {sellerData?.description || "No description provided"}
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarTodayIcon className="text-gray-500" />
                    <Typography variant="body1" className="text-gray-700">
                      Member since: {new Date(sellerData?.createdAt).toLocaleDateString()}
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
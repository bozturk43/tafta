"use client";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Button, TextField, Chip, IconButton, Box, Stack, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Attribute } from "@/app/lib/types";
import { useEffect, useState } from "react";


export default function AttributeForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const attributeId = searchParams.get('id');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { control, handleSubmit, setValue, watch } = useForm<Attribute>({
    defaultValues: {
      name: '',
      options: [{ value: '', extraPrice: 0 }]
    }
  });

  const options = watch("options");

  // Attribute yükleme
  useEffect(() => {
    if (!user?.token || !attributeId) {
      setIsLoading(false);
      return;
    }

    const loadAttribute = async () => {
      try {
        const res = await fetch(`/api/seller/get-attribute?id=${attributeId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        
        setValue("name", data.name);
        setValue("options", data.options);
        setIsEditing(true);
      } catch (error) {
        console.error("Attribute load error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAttribute();
  }, [user, attributeId, setValue]);

  const onSubmit = async (data: Attribute) => {
    if (!user?.token) return;

    const apiUrl = isEditing && attributeId 
      ? `/api/seller/update-attribute?id=${attributeId}`
      : '/api/seller/add-attribute';

    try {
      const response = await fetch(apiUrl, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        router.push("/seller-panel/attributes");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const addOption = () => {
    setValue("options", [...options, { value: '', extraPrice: 0 }]);
  };

  const removeOption = (index: number) => {
    setValue("options", options.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Bu alan zorunludur' }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Nitelik Adi"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {options.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name={`options.${index}.value`}
              control={control}
              rules={{ required: 'Bu alan zorunludur' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Opsiyon Adı"
                  fullWidth
                  error={!!fieldState.error}
                />
              )}
            />
            <Controller
              name={`options.${index}.extraPrice`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fiyata Etkisi"
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <IconButton onClick={() => removeOption(index)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        ))}

        <Button 
          startIcon={<AddIcon />} 
          onClick={addOption}
          variant="outlined"
        >
          Opsiyon Ekle
        </Button>

        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Nitelik Güncelle' : 'Nitelik Oluştur'}
        </Button>
      </Stack>
    </Box>
  );
}
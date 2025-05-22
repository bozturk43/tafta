import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";

type CustomRequestForm = {
  description: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  producerId: string;
}

export default function CustomRequestDialog({ open, onClose, producerId }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CustomRequestForm>();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const customerId = user?.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CustomRequestForm) => {
    try {
      setError(null);

      if (!customerId) throw new Error("Kullanıcı kimliği bulunamadı.");
      if (files.length === 0) throw new Error("En az bir görsel yüklenmelidir.");

      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("producerId", producerId);
      formData.append("description", data.description);

      files.forEach(file => {
        formData.append("files", file);
      });

      const res = await fetch("/api/custom-request/create-request", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Bir hata oluştu.");

      reset();
      setFiles([]);
      onClose();
    } catch (err: any) {
      setError(err.message || "Sunucu hatası.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Özel Ürün Talebi Oluştur</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Açıklama"
              {...register("description", { required: true })}
              fullWidth
              multiline
              rows={4}
            />

            <Button variant="outlined" component="label">
              Fotoğraf Yükle
              <input
                hidden
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {files.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={2}>
                {files.map((file, index) => (
                  <Box
                    key={index}
                    position="relative"
                    width={100}
                    height={100}
                    borderRadius={1}
                    overflow="hidden"
                    boxShadow={2}
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <IconButton
                      onClick={() => removeFile(index)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "red",
                      }}
                    >
                      <DeleteIcon fontSize="small" sx={{color:"white"}}/>
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            İptal
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="contained">
            Gönder
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

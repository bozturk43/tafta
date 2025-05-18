"use client";

import { useState } from "react";
import { Tabs, Tab, Box, TextField, Button, Typography, Link, DialogContent, Dialog, Divider } from "@mui/material";
import { useAuth, UserType } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: tab === 0 ? "customer" : "producer",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Giriş başarısız");
      }

      const data = await response.json();
      const userObject: UserType = {
        id: data.user.id,
        type: data.user.type,
        email: data.user.email,
        token: data.token
      }
      login(userObject);
      router.push("/"); // Ana sayfaya yönlendir
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="max-w-md mx-auto mt-20 p-6 border rounded shadow"
      component="main"
    >
      <div className="flex w-full justify-center">
        <Image src="/tafta-logo.png" alt="tafta-logo" width={100} height={50}></Image>
      </div>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="login tabs"
        className="mb-6"
        centered
      >
        <Tab label="Müşteri Girişi" />
        <Tab label="Satıcı Girişi" />
      </Tabs>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="E-Mail"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Şifre"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" fullWidth>
          {loading ? "Giriş yapılıyor..." : tab === 0 ? "Müşteri Girişi" : "Satıcı Girişi"}
        </Button>
      </form>
      <div className="my-2">
        <Typography fontSize={12}>
          Henüz bir hesabınız yok mu?{" "}
          <span onClick={handleOpen} className="text-blue-500 cursor-pointer underline">
            Kayıt ol.
          </span>
        </Typography>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogContent className="p-0">
            <div className="flex flex-row h-full">
              {/* Sol taraf */}
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <Typography variant="h5" className="mt-4 text-center" fontWeight="bold">
                  Sanat Eserlerine Ulaş
                </Typography>
                <Image
                  src="/customer-signup.jpg" // public klasörüne bir resim koy
                  alt="Customer Visual"
                  width={400}
                  height={400}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  className="mt-4"
                  fullWidth
                  component={Link}
                  href="/signup?type=customer"
                >
                  Müşteri Olarak Kayıt Ol
                </Button>
              </div>

              {/* Divider */}
              <Divider orientation="vertical" flexItem />

              {/* Sağ taraf */}
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <Typography variant="h5" className="text-center" fontWeight="bold">
                  Sanatını Sergile
                </Typography>
                <Image
                  src="/seller-signup.jpg" // public klasörüne bir resim koy
                  alt="Seller Visual"
                  width={400}
                  height={400}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="mt-4"
                  fullWidth
                  component={Link}
                  href="/signup?type=producer"
                >
                  Üretici Olarak Kayıt Ol
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}

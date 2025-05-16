"use client";

import { useState } from "react";
import { Tabs, Tab, Box, TextField, Button, Typography } from "@mui/material";
import { useAuth, UserType } from "@/context/authContext";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const userObject:UserType = {
        id:data.user.id,
        type:data.user.type,
        email:data.user.email,
        token:data.token
      }
      login(userObject);
      localStorage.setItem("token", data.token);
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
    </Box>
  );
}

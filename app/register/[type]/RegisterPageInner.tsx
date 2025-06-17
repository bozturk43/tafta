"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
} from "@mui/material";
import { useState } from "react";

type ProducerForm = {
    name: string;
    email: string;
    password: string;
    title: string;
    description: string;
};

type CustomerForm = {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
};

type FormValues = ProducerForm & Partial<CustomerForm>;

export default function RegisterPageInner({ type }: { type: string }) {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);

            const response = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, type }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Bir hata oluştu.");
                return;
            }

            alert("Kayıt başarılı!");
            router.push("/login");
        } catch (err) {
            console.error("Kayıt başarısız:", err);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    {type === "producer" ? "Üretici" : "Müşteri"} Kayıt Ol
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Ad Soyad"
                        margin="normal"
                        {...register("name", { required: true })}
                        error={!!errors.name}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        type="email"
                        {...register("email", { required: true })}
                        error={!!errors.email}
                    />
                    <TextField
                        fullWidth
                        label="Şifre"
                        type="password"
                        margin="normal"
                        {...register("password", { required: true })}
                        error={!!errors.password}
                    />

                    {type === "producer" && (
                        <>
                            <TextField
                                fullWidth
                                label="Ünvan"
                                margin="normal"
                                {...register("title", { required: true })}
                                error={!!errors.title}
                            />
                            <TextField
                                fullWidth
                                label="Açıklama"
                                margin="normal"
                                multiline
                                rows={3}
                                {...register("description")}
                            />
                        </>
                    )}

                    {type === "customer" && (
                        <>
                            <TextField
                                fullWidth
                                label="Telefon"
                                margin="normal"
                                {...register("phone", { required: true })}
                                error={!!errors.phone}
                            />
                            <TextField
                                fullWidth
                                label="Adres"
                                margin="normal"
                                {...register("address", { required: true })}
                                error={!!errors.address}
                            />
                        </>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

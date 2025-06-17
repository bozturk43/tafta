"use client";

import { useEffect } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import { useCart } from "@/context/cartContetx";
import { useAuth } from "@/context/authContext";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function CompleteOrderDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();


    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            customerId: "",
            name: "",
            address: "",
            phone: "",
        },
    });

    useEffect(() => {
        if (user) {
            setValue("customerId", user.id || "guest_user")
            setValue("name", user.name || "");
            setValue("address", user.adress || "");
            setValue("phone", user.phone || "");
        } else {
            reset();
            setValue("customerId", "guest_user")

        }
    }, [user, setValue, reset, isOpen]);

    const onSubmit = async (data: any) => {

        try {
            const body = {
                ...data,
                items: cartItems,
            };

            const response = await fetch('/api/orders/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const orderId = result.orderId;
                sessionStorage.setItem("orderNumber", orderId);
                onClose();
                router.push("/order-complete");
                clearCart();

            } else {
                alert('Sipariş oluşturulurken bir hata oluştu: ' + (result.error || 'Bilinmeyen hata'));

            }
        } catch (error) {
            console.error('Sipariş gönderim hatası:', error);
            alert('Sunucu ile bağlantı kurulamadı.');
        }

    };

    return (
        <Dialog open={isOpen} onClose={() => onClose()} fullWidth maxWidth="sm">
            <DialogTitle>Teslimat ve Adres Bilgileri</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Ad Soyad"
                        {...register("name", { required: !user })}
                        error={!!errors.name}
                        helperText={errors.name && "Ad Soyad gereklidir."}
                    />
                    <TextField
                        label="Adres"
                        {...register("address", { required: !user })}
                        error={!!errors.address}
                        helperText={errors.address && "Adres gereklidir."}
                    />
                    <TextField
                        label="Telefon"
                        {...register("phone", { required: !user })}
                        error={!!errors.phone}
                        helperText={errors.phone && "Telefon gereklidir."}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose()}>İptal</Button>
                    <Button type="submit" variant="contained">
                        Siparişi Tamamla
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

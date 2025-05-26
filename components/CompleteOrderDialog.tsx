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

export default function CompleteOrderDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { cartItems,clearCart} = useCart();
    const { user } = useAuth();

    console.log(user);
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
        console.log("Sipariş verisi:", {
            ...data,
            items: cartItems,
        });

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
                alert(`Siparişiniz başarıyla oluşturuldu! Sipariş No: ${result.orderId}`);
                onClose(); 
                clearCart();
            } else {
                alert('Sipariş oluşturulurken bir hata oluştu: ' + (result.error || 'Bilinmeyen hata'));
            }
        } catch (error) {
            console.error('Sipariş gönderim hatası:', error);
            alert('Sunucu ile bağlantı kurulamadı.');
        }

        // Burada sipariş API'ına gönderim yapılabilir

        // setDialogOpen(false);
        // clearCart();
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
                        disabled={!!user}
                    />
                    <TextField
                        label="Adres"
                        {...register("address", { required: !user })}
                        error={!!errors.address}
                        helperText={errors.address && "Adres gereklidir."}
                        disabled={!!user}
                    />
                    <TextField
                        label="Telefon"
                        {...register("phone", { required: !user })}
                        error={!!errors.phone}
                        helperText={errors.phone && "Telefon gereklidir."}
                        disabled={!!user}
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

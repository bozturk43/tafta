"use client";

import { Box, Button, Typography } from "@mui/material";
import { useCart } from "@/context/cartContetx";
import Image from "next/image";

export default function CartPage() {
    const { cartItems, removeFromCart, clearCart } = useCart();

    console.log("cartItems", cartItems);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    if (cartItems.length === 0) {
        return (
            <Box p={4}>
                <Typography variant="h5">Sepetiniz boş.</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>Sepetim</Typography>

            {cartItems.map((item) => (
                <Box
                    key={item.productId}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    borderBottom="1px solid #ccc"
                    py={2}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            style={{ borderRadius: 8 }}
                        />
                        <Box>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography variant="body2">Ürün Fiyatı:{item.basePrice}₺</Typography>

                            <Box>
                                <Typography variant="body2" fontWeight={600}>
                                    Seçilen Özellikler:
                                </Typography>
                                {item.selectedAttributes.map((attr, index) => (
                                    <Typography key={index} variant="body2" ml={1}>
                                        - {attr.selectedOptionValue}{" "}
                                        {attr.selectedOptionExtraPrice > 0 && (
                                            <>(+₺{attr.selectedOptionExtraPrice})</>
                                        )}
                                    </Typography>
                                ))}
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                                Fiyat: {item.totalPrice.toFixed(2)} ₺
                            </Typography>
                        </Box>
                    </Box>

                    <Button color="error" onClick={() => removeFromCart(item.productId)}>
                        Kaldır
                    </Button>
                </Box>
            ))}

            <Box display="flex" justifyContent="space-between" mt={4}>
                <Typography variant="h6">Toplam: ₺{totalPrice.toFixed(2)}</Typography>
                <Box>
                    <Button color="error" onClick={clearCart} sx={{ mr: 2 }}>
                        Sepeti Temizle
                    </Button>
                    <Button variant="contained" color="primary">
                        Siparişi Onayla
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

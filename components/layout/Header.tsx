"use client";

import { useAuth } from "@/context/authContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Link,
  Badge,
} from "@mui/material"; import { AccountCircle } from "@mui/icons-material";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from "@/context/cartContetx"; // cart context yolunu doğru gir



export default function Header() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { cartItems } = useCart();
  const totalQuantity = cartItems.length;

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {

    try {
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include", // Cookie'lerin iletilmesini sağlar
      });
      // Kullanıcıyı giriş sayfasına yönlendir
      handleMenuClose();
      logout();
      router.push("/");
    } catch (error) {
      console.error("Logout hatası:", error);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1} className="border-b">
      <Toolbar className="flex w-full justify-between items-center px-6 py-2">
        {/* Sol Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image src="/tafta-logo.png" width={80} height={40} alt="tafta-logo" />
          </Link>
        </div>

        {/* Orta Menü */}
        <div className="flex gap-4 hidden md:flex">
          <Link href="/" fontWeight={500} color="secondary" underline="none" className="flex justify-center items-center">
            Ana Sayfa
          </Link>
          <Link href="/workshops" fontWeight={500} color="secondary" underline="none" className="flex justify-center items-center">
            Atölyeler
          </Link>
          <Link href="/about-us" fontWeight={500} color="secondary" underline="none" className="flex justify-center items-center">
            Hikayemiz
          </Link>
          <Link href="/contact" fontWeight={500} color="secondary" underline="none" className="flex justify-center items-center">
            İletisim
          </Link>
        </div>

        {/* Sağ Login / User */}
        <div className="flex flex-row gap-8">
          <IconButton
            color="inherit"
            href="/cart"
            hidden={Boolean(user && user.type === "producer")}>
            <Badge badgeContent={totalQuantity} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {user ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircle />
              </IconButton>


              {user.type === "producer" ? (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/seller-panel" sx={{textDecoration:"none",color:"black"}}>
                      Satıcı Paneli
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/messages" sx={{textDecoration:"none",color:"black"}}>
                     Mesajlarım
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} href="/custom-orders">
                    <Link href="/custom-orders" sx={{textDecoration:"none",color:"black"}}>
                     Özel Siparişler
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
                </Menu>
              ) : (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/account" sx={{textDecoration:"none",color:"black"}}>
                      Hesabım
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/messages"  sx={{textDecoration:"none",color:"black"}}>
                      Mesajlarım
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/customer-custom-order"  sx={{textDecoration:"none",color:"black"}}>
                      Özel Siparişlerim
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
                </Menu>
              )}
            </>
          ) : (
            <Link href="/login">
              {/* <IconButton color="inherit">
                <LoginIcon />
              </IconButton> */}
              <Button color="primary" variant="contained">
                Giriş Yap
              </Button>
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar >
  );
}

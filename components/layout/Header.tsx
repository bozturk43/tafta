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
  } from "@mui/material";import { AccountCircle } from "@mui/icons-material";
import { useState,MouseEvent  } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push("/")
  };

  return (
    <AppBar position="static" color="default" elevation={1} className="border-b">
      <Toolbar className="flex w-full justify-between items-center px-6 py-2">
        {/* Sol Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image src="/tafta-logo.png" width={80} height={40} alt="tafta-logo"/>
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
        <div>
          {user ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircle />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {user.type === "producer" ? (
                  <>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href="/seller-panel">
                        <a className="w-full block no-underline text-inherit">Satıcı Paneli</a>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href="/messages">
                        <a className="w-full block no-underline text-inherit">Mesajlarım</a>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href="/account">
                        <a className="w-full block no-underline text-inherit">Hesabım</a>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href="/messages">
                        <a className="w-full block no-underline text-inherit">Mesajlarım</a>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
                  </>
                )}
              </Menu>
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
    </AppBar>
  );
}

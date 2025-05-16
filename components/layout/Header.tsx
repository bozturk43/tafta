"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Menu,
    MenuItem,
  } from "@mui/material";import { AccountCircle } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import { useState,MouseEvent  } from "react";
import { useRouter } from "next/navigation";

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
            <Typography variant="h6" className="cursor-pointer font-bold">
              MyMarket
            </Typography>
          </Link>
        </div>

        {/* Orta Menü */}
        <div className="space-x-6 hidden md:flex">
          <Link href="/">
            <Button variant="text" color="inherit">Ana Sayfa</Button>
          </Link>
          <Link href="/producers">
            <Button variant="text" color="inherit">Üreticiler</Button>
          </Link>
          <Link href="/store">
            <Button variant="text" color="inherit">Mağaza</Button>
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
                      <Link href="/seller-panel" legacyBehavior>
                        <a className="w-full block no-underline text-inherit">Satıcı Paneli</a>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href="/messages" legacyBehavior>
                        <a className="w-full block no-underline text-inherit">Mesajlarım</a>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href="/account" legacyBehavior>
                        <a className="w-full block no-underline text-inherit">Hesabım</a>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <Link href="/messages" legacyBehavior>
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
              <IconButton color="inherit">
                <LoginIcon />
              </IconButton>
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

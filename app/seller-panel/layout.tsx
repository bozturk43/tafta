"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

type Props = {
  children: ReactNode;
};

export default function SellerPanelLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Sol menü */}
        <nav className="w-64 bg-gray-100 border-r p-4">
          <ul className="space-y-4">
          <li>
              <Link href="/seller-panel">
                  Dashboard
              </Link>
            </li>
            <li>
              <Link href="/seller-panel/products">
                  Ürün Yönetimi
              </Link>
            </li>
            <li>
              <Link href="/seller-panel/attributes">
                  Nitelikler
              </Link>
            </li>
            <li>
              <Link href="/seller-panel/seller-info">
                  Satıcı Bilgileri
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sağ ana içerik */}
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}

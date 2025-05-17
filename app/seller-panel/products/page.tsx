"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";
import { getSellerProducts } from "@/app/lib/api/getSellerProducts";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/app/lib/types";
import { useMemo } from "react";
import { Table } from "@/components/Table";
import { getAttributes } from "@/app/lib/api/getAttributes";
import { Button, IconButton, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from "next/navigation";
import { useQueryClient } from '@tanstack/react-query';



export default function SellerDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = user?.token;

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products", user?.id],
    queryFn: () => getSellerProducts(token!),
    enabled: !!token,
  });
  const { data: attributes } = useQuery({
    queryKey: ["attributes", user?.id],
    queryFn: () => getAttributes(token!),
    enabled: !!token,
  });
  console.log(attributes);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Ürün Adı",
      },
      {
        accessorKey: "basePrice",
        header: "Fiyat",
        cell: info => `${info.getValue()} ₺`,
      },
      {
        accessorKey: "createdAt",
        header: "Oluşturma Tarihi",
      },
      {
        id: "attributes", // accessorkey yerine id kullandık, çünkü product içinde direkt attribute isimleri yok
        header: "Nitelikler",
        cell: ({ row }) => {
          const productAttributes = row.original.attributes;

          if (!productAttributes || productAttributes.length === 0) {
            return "Varyasyon eklenmedi";
          }

          if (!attributes) return "Yükleniyor...";

          const names = productAttributes
            .map((attr: { attributeId: string }) => {
              const attribute = attributes[attr.attributeId];
              return attribute ? attribute.name : null;
            })
            .filter(Boolean);

          return names.length > 0 ? names.join(", ") : "Varyasyon eklenmedi";
        }
      },
      {
        id: "actions",
        header: "İşlemler",
        cell: ({ row }) => {
          const product = row.original;

          const handleUpdate = () => {
            console.log("Güncelle:", row.original);
            router.push(`product-form?id=${row.original.id}`)
            // yönlendirme veya işlem
          };

          const handleDelete = async (productId: string) => {
            if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

            try {
              const response = await fetch(`/api/seller/delete-product?id=${productId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${user?.token}`
                }
              });

              if (!response.ok) {
                throw new Error('Silme işlemi başarısız');
              }
              // Başarılı silme sonrası
              alert('Ürün başarıyla silindi');
              queryClient.invalidateQueries({
                queryKey: ['products', user?.id]
              });
              router.refresh(); // Listeyi güncelle
            } catch (error) {
              console.error('Silme hatası:', error);
              alert('Ürün silinirken bir hata oluştu');
            }
          };

          return (
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" size="small" onClick={handleUpdate} aria-label="güncelle">
                <EditIcon />
              </IconButton>
              <IconButton color="error" size="small" onClick={()=>handleDelete(row.original.id)} aria-label="sil">
                <DeleteIcon />
              </IconButton>
            </Stack>
          );
        },
      },
    ],
    [attributes]
  );
  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {(error as Error).message}</div>;

  if (!products || products.length === 0)
    return <div>Henüz Ürün Eklemediniz.</div>;

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            router.push('product-form');
          }}
        >
          Yeni Ürün Ekle
        </Button>
        <h1>Ürün Yönetimi</h1>
      </Stack>
      <Table data={products} columns={columns} />
    </div>
  );
}

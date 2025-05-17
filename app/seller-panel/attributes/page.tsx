"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";
import { getAttributes } from "@/app/lib/api/getAttributes";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Attribute } from "@/app/lib/types";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from "next/navigation";
import { Table } from "@/components/Table";
import { transformAttributesToArray } from "@/app/lib/helpers/transformAttributesToArray";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import { useQueryClient } from '@tanstack/react-query';



export default function SellerAttributePage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const token = user?.token;

  const { data, isLoading, error } = useQuery({
    queryKey: ["attributes", user?.id],
    queryFn: () => getAttributes(token!),
    enabled: !!token,
    select: (data) => transformAttributesToArray(data) // Veriyi otomatik dönüştür
  });
  console.log(data);

  const columns = useMemo<ColumnDef<Attribute>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nitelik Adı",
        cell: ({ row }) => <p>{row.original.name}</p>
      },
      {
        accessorKey: "options",
        header: "Seçenekler",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.options.map((option, index) => (
              <Chip
                key={index}
                label={`${option.value} (+${option.extraPrice}₺)`}
                size="small"
              />
            ))}
          </div>
        )
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const handleDelete = async (attributeId: string) => {
            if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

            try {
              const response = await fetch(`/api/seller/delete-attribute?id=${attributeId}`, {
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
                queryKey: ["attributes", user?.id]
              });
              router.refresh(); // Listeyi güncelle
            } catch (error) {
              console.error('Silme hatası:', error);
              alert('Nitelik silinirken bir hata oluştu');
            }
          };
          return (
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => router.push(`attribute-form?id=${row.original.id}`)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(row.original.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          )
        }
      }
    ],
    []
  );

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {(error as Error).message}</div>;

  if (!data || data.length === 0)
    return <div>Henüz Ürün Eklemediniz.</div>;
  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            router.push('attribute-form');
          }}
        >
          Yeni Nitelik Ekle
        </Button>
        <h1>Nitelik Yönetimi</h1>
      </Stack>
      <Table data={data} columns={columns} />
    </div>
  );
}

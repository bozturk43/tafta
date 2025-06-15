"use client"
import { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, Typography, Card, CardMedia, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/context/cartContetx';
import { getProductDetailById } from '@/app/lib/api/getProductDetailById';
import { transformAttributesToArray } from '@/app/lib/helpers/transformAttributesToArray';
import { getFinalAttributes } from '@/app/lib/helpers/getFinalAttributes';
import { Attribute } from '@/app/lib/types';
import { calculatePriceRange } from '@/app/lib/helpers/calculatePriceRange';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

export default function ProductDetailInner({ productId }: { productId: string }) {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { addToCart } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();



  const { data: productData, isLoading: productIsLoading } = useQuery({
    queryKey: ["productDetail", productId],
    queryFn: () => getProductDetailById(productId),
  });

  const formSchema = z.object({
    attributes: z.array(
      z.object({
        attributeId: z.string(),
        selectedOptionValue: z.string(),
        selectedOptionExtraPrice: z.number(),
      })
    )
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attributes: [],
    },
  });

  const attributesWatch = watch("attributes");
  console.error(errors);

  useEffect(() => {
    if (productData) {
      const producerAttributes = transformAttributesToArray(productData.attributes);
      const finalProductAttributes = getFinalAttributes(productData.product.attributes, producerAttributes);

      const initialAttributes = finalProductAttributes.map((attr: any) => {
        const firstOption = attr.options[0];
        return {
          attributeId: attr.id,
          selectedOptionValue: firstOption.value,
          selectedOptionExtraPrice: firstOption.extraPrice,
        };
      });

      setValue("attributes", initialAttributes);
      recalculateTotalPrice(initialAttributes);
    }
  }, [productData, setValue]);

  const recalculateTotalPrice = (updatedAttributes: any[]) => {
    const basePrice = productData?.product?.basePrice ?? 0;
    const extras = updatedAttributes.reduce((sum, attr) => sum + attr.selectedOptionExtraPrice, 0);
    setTotalPrice(basePrice + extras);
  };

  const handleOptionChange = (attributeId: string, option: any) => {
    const updatedAttributes = [...attributesWatch];
    const updatedIndex = updatedAttributes.findIndex(attr => attr.attributeId === attributeId);
    if (updatedIndex > -1) {
      updatedAttributes[updatedIndex] = {
        attributeId,
        selectedOptionValue: option.value,
        selectedOptionExtraPrice: option.extraPrice,
      };
      setValue("attributes", updatedAttributes);
      recalculateTotalPrice(updatedAttributes);
    }
  };

  const onSubmit = (data: FormData) => {
    const customizedProduct = {
      productId: productData?.product.id,
      producerId: productData?.producer.id,
      name: productData?.product.name,
      image: productData?.product.images[0],
      basePrice: productData?.product.basePrice,
      selectedAttributes: data.attributes,
      totalPrice,
    };
    addToCart(customizedProduct);
    setIsDialogOpen(true);

  };

  if (productIsLoading || !productData) return <div>Ürün Yükleniyor...</div>;


  const producerAttributes = transformAttributesToArray(productData.attributes);
  const finalProductAttributes = getFinalAttributes(productData.product.attributes, producerAttributes);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        {/* Üst Görsel ve Üretici */}
        <div className="flex flex-row w-full px-12 mb-20 justify-between py-4 rounded" style={{ backgroundColor: "#e4eef7" }}>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 overflow-x-auto">
            {productData.product.images.map((src: string, i: number) => (
              <Card key={i}
                className="w-28 h-28 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out hover:w-100 hover:h-100 hover:fixed hover:z-99"
              >
                <CardMedia component="img" height="100" image={src} alt={`product-${i}`}
                  className="w-full h-full object-cover"
                />
              </Card>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <Avatar src={productData.producer.image} sx={{ width: 60, height: 60 }} />
            <div className='flex flex-col'>
              <Typography fontWeight="bold" color='primary'>{productData.producer.name}</Typography>
              <Typography variant="body2" color='primary'>{productData.producer.title}</Typography>
              <Typography variant="body2" color='primary'>{productData.product.name}</Typography>
              <Typography variant="caption" sx={{ color: "#161E50", marginTop: "10px" }}>
                Fiyat Aralığı: {calculatePriceRange(producerAttributes as Attribute[], productData.product.attributes, productData.product.basePrice)} ₺
              </Typography>
              <Typography variant="caption" sx={{ color: "#161E50" }}>Ort. Yapılış Süresi: {productData.product.averageTime}</Typography>
            </div>
          </div>
        </div>

        {/* Ürün Özelleştirme */}
        <div className="mt-10">
          <Typography sx={{ fontSize: "36px" }} fontWeight="bold" className="text-center" color='primary'>Şimdi Sıra Sende</Typography>
          <Typography className="text-center text-gray-600 mb-6" sx={{ fontSize: "20px" }}>Nasıl İstersen Öyle Üretelim!</Typography>

          <div className="grid grid-cols-1 gap-4 items-center justify-center ">
            <div className="flex flex-col space-y-6 mt-12 ps-24 pb-8 h-[250px] overflow-y-auto justify-between">
              {finalProductAttributes.map((attrItem: any, index: number) => (
                <div className='flex flex-col items-center' key={attrItem.id}>
                  <Typography fontWeight="bold">{index + 1}-{attrItem.name} ?</Typography>
                  <Controller
                    name="attributes"
                    control={control}
                    render={({ field }) => {
                      const selected = field.value.find((item: any) => item.attributeId === attrItem.id)?.selectedOptionValue;
                      return (
                        <RadioGroup
                          row
                          value={selected || ""}
                          onChange={(e) => {
                            const selectedOption = attrItem.options.find((opt: any) => opt.value === e.target.value);
                            handleOptionChange(attrItem.id, selectedOption);
                          }}
                        >
                          <div className='grid grid-cols-2 items-start'>

                            {attrItem.options.map((itemOption: any, i: number) => (
                              <FormControlLabel
                                key={i}
                                value={itemOption.value}
                                control={<Radio />}
                                label={`${itemOption.value} + ${itemOption.extraPrice} ₺`}
                              />
                            ))}
                          </div>

                        </RadioGroup>
                      );
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-row h-full items-center justify-center gap-4 bottom-0 right-1/2 transform">
              <Typography fontWeight="bold" sx={{ fontSize: "20px", lineHeight: "20px" }} className="border p-2 rounded-xl text-[#2a3788] w-60 text-center">
                {totalPrice}<small className='text-[23px]'>₺</small><br /><small className="text-sm font-light">Toplam Fiyat</small>
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: "20px"
                }}
                className="text-white py-3"
              > Bunu Sevdim, Sepete Ekle!
              </Button>
            </div>
          </div>
        </div>
      </form>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" color="primary" fontWeight={600}>
            Ürün Sepete Eklendi!
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            Ürününüz başarıyla sepete eklendi. Ne yapmak istersiniz?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setIsDialogOpen(false);
              router.push("/workshops");
            }}
          >
            Alışverişe Devam Et
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsDialogOpen(false);
              router.push("/cart");
            }}
          >
            Sepete Git
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

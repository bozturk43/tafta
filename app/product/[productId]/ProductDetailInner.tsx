"use client"
import { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, Typography, Card, CardMedia, Avatar } from '@mui/material';
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

export default function ProductDetailInner({ productId }: { productId: string }) {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { addToCart } = useCart();


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
      name: productData?.product.name,
      image: productData?.product.images[0],
      basePrice: productData?.product.basePrice,
      selectedAttributes: data.attributes,
      totalPrice,
    };
    console.log("customizedProduct", customizedProduct);
      addToCart(customizedProduct);

  };

  if (productIsLoading || !productData) return <div>Ürün Yükleniyor...</div>;

  const producerAttributes = transformAttributesToArray(productData.attributes);
  const finalProductAttributes = getFinalAttributes(productData.product.attributes, producerAttributes);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      {/* Üst Görsel ve Üretici */}
      <div className="flex flex-row w-full px-12 mb-20 justify-between py-4 rounded" style={{ backgroundColor: "#e4eef7" }}>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 overflow-x-auto">
          {productData.product.images.map((src: string, i: number) => (
            <Card key={i} className="w-28 h-28 flex-shrink-0">
              <CardMedia component="img" height="100" image={src} alt={`product-${i}`} />
            </Card>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <Avatar src={productData.producer.image} sx={{ width: 60, height: 60 }} />
          <div>
            <Typography fontWeight="bold">{productData.producer.name}</Typography>
            <Typography variant="body2">{productData.producer.title}</Typography>
            <Typography variant="body2">{productData.product.name}</Typography>
            <Typography variant="caption">
              Fiyat Aralığı: {calculatePriceRange(producerAttributes as Attribute[], productData.product.attributes, productData.product.basePrice)} ₺
            </Typography><br />
            <Typography variant="caption">Ort. Yapılış Süresi: {productData.product.averageTime}</Typography>
          </div>
        </div>
      </div>

      {/* Ürün Özelleştirme */}
      <div className="mt-10">
        <Typography variant="h5" fontWeight="bold" className="text-center text-blue-900">Şimdi Sıra Sende</Typography>
        <Typography className="text-center text-gray-600 mb-6">Nasıl istersen öyle Üretelim!</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="flex flex-col items-center gap-4">
            <Image src={productData.product.images[0]} alt="preview" width={400} height={400} className="rounded" />
            <Typography fontWeight="bold" className="border p-2 rounded-xl text-green-900 w-40 text-center">
              {totalPrice}₺<br /><small className="text-sm">Toplam Fiyat</small>
            </Typography>
          </div>

          <div className="flex flex-col space-y-6 mt-12 pb-8 h-full justify-between">
            {finalProductAttributes.map((attrItem: any, index: number) => (
              <div key={attrItem.id}>
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
                        {attrItem.options.map((itemOption: any, i: number) => (
                          <FormControlLabel
                            key={i}
                            value={itemOption.value}
                            control={<Radio />}
                            label={`${itemOption.value} + ${itemOption.extraPrice} ₺`}
                          />
                        ))}
                      </RadioGroup>
                    );
                  }}
                />
              </div>
            ))}

            <Button
              type="submit"
              variant="contained"
              color="success"
              className="rounded-full text-white py-3"
            >
              ❤️ Bunu Sevdim, Sepete Ekle!
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

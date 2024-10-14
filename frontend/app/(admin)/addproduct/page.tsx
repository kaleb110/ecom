"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import useProductStore from "@/store/zustand";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  categories: z.array(z.number()).min(1, "Select at least one category"),
  imageUrl: z.string().url("Image URL is required"),
});

const categories = [
  { id: 1, name: "Apparel" },
  { id: 2, name: "Footwear" },
  { id: 3, name: "Accessories" },
  { id: 4, name: "Special" },
];

const NewProductForm = () => {
  const { addProduct } = useProductStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      stock: undefined,
      categories: [],
      imageUrl: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addProduct(data);
      form.reset();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 pb-12">
      <Card className="bg-white text-black shadow-xl">
        <CardHeader className="pb-8 pt-10">
          <CardTitle className="text-4xl font-bold text-center">
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                          className="border-gray-300 text-black text-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          {...field}
                          className="border-gray-300 text-black text-lg min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Price ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : parseFloat(value)
                            );
                          }}
                          onFocus={(e) =>
                            e.target.value === "0" && (e.target.value = "")
                          }
                          step="0.01"
                          min="0"
                          className="border-gray-300 text-black text-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                {/* Stock */}
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Stock
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : parseInt(value, 10)
                            );
                          }}
                          onFocus={(e) =>
                            e.target.value === "0" && (e.target.value = "")
                          }
                          min="0"
                          step="1"
                          className="border-gray-300 text-black text-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Categories */}
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Categories
                    </FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            onCheckedChange={(checked) => {
                              const currentCategories =
                                form.getValues("categories");
                              if (checked) {
                                form.setValue("categories", [
                                  ...currentCategories,
                                  category.id,
                                ]);
                              } else {
                                form.setValue(
                                  "categories",
                                  currentCategories.filter(
                                    (id) => id !== category.id
                                  )
                                );
                              }
                            }}
                            className="border-gray-300"
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-base font-medium leading-none"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Upload Image */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Upload Image
                    </FormLabel>
                    <FormControl>
                      <div className="mt-2">
                        {!field.value ? (
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              // Log the response to see the URL

                              // Access the URL directly from serverData
                              const imageUrl = res?.[0]?.serverData.url || "";
                              // Set the raw URL (without decoding) to the form field
                              field.onChange(imageUrl);
                            }}
                            onUploadError={(error: Error) => {
                              console.error("Upload error:", error);
                            }}
                          />
                        ) : (
                          <div className="relative mt-4">
                            <Image
                              src={field.value}
                              alt="Uploaded product image"
                              width={200}
                              height={200}
                              className="rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2"
                              onClick={() => {
                                field.onChange(""); // Clear the image
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Add Product
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProductForm;

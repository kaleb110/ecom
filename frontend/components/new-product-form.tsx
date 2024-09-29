"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, X, Upload } from "lucide-react";
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
import useProductStore from "@/utils/zustand";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  categories: z.array(z.number()).min(1, "Select at least one category"),
  imageUrl: z.string().url("A valid image URL is required"),
});

const categories = [
  { id: 1, name: "Tech" },
  { id: 2, name: "Car" },
  { id: 3, name: "Health" },
  { id: 4, name: "Sport" },
];

const NewProductForm = () => {
  const { addProduct } = useProductStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categories: [],
      imageUrl: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
    <div className="container max-w-4xl mx-auto px-4 py-12">
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? "" : parseFloat(value)
                            );
                          }}
                          step="0.01"
                          min="0"
                          className="border-gray-300 text-black text-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? "" : parseInt(value, 10)
                            );
                          }}
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
                          <UploadDropzone
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              field.onChange(res?.[0]?.url || "");
                              setIsUploading(false);
                            }}
                            onUploadError={(error: Error) => {
                              console.error("Upload error:", error);
                              setIsUploading(false);
                            }}
                            onUploadBegin={() => setIsUploading(true)}
                          />
                        ) : (
                          <div className="relative">
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
                              onClick={() => field.onChange("")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {isUploading && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Uploading...</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="pt-4">
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProductForm;
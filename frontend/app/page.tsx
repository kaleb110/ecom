"use client"
import { ProductCardComponent } from "@/components/product-card";
import { EcomNavbarComponent } from "@/components/ecom-navbar";
const page = () => {
  return (
    <div className="flex flex-col gap-5">
      <EcomNavbarComponent />
      <ProductCardComponent />
    </div>
  );
};

export default page;

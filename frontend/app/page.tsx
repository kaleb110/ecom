"use client"
import { ProductCardComponent } from "@/components/product-card";
import { EcomNavbarComponent } from "@/components/ecom-navbar";
import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
const Home = () => {
  return (
    <div className="flex flex-col gap-5">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <EcomNavbarComponent />
        <ProductCardComponent />
      </SignedIn>
    </div>
  );
};

export default Home;

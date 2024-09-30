"use client"
import { ProductCardComponent } from "@/components/product-card";
import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
const Home = () => {
  return (
    <div className="flex flex-col gap-5">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <ProductCardComponent />
      </SignedIn>
    </div>
  );
};

export default Home;

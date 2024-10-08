"use client";

import { ProductCardComponent } from "@/components/product-card";
import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import SearchComponent from "@/components/searchComponent";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div className="w-full max-w-4xl px-4">
          <SearchComponent />
        </div>
        <div className="w-full">
          <ProductCardComponent />
        </div>
      </SignedIn>
    </div>
  );
};

export default Home;

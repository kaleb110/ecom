// products
import { getProducts, addProduct, getSingleProduct } from "../services/product";
import { Request, Response } from "express";
import { Product } from "../types/product";

export const getSingleProductController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const product = await getSingleProduct(Number(id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ message: "No Product Found!" });
  }
};

export const getProductsController = async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ message: "No Product Found!" });
  }
};

// export const searchProductsController = async (req: Request, res: Response) => {
//   const { search, category }: Search = req.query;

//   try {
//     const products = await searchProducts(search, category);
//     if (!products) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to search products" });
//   }
// };

export const addProductController = async (req: Request, res: Response) => {
  try {
    const product: Product = {...req.body};

    await addProduct(product);

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ message: "Cannot add product!" });
  }
};


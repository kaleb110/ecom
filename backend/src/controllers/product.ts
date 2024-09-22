// products
import { getProducts, addProduct, getSingleProduct } from "../services/product";
import { Request, Response } from "express";
import { Search, Product } from "../types/product";

export const getSingleProductController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const product = await getSingleProduct(parseInt(id));
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
    const { name, description, price, stock, imageUrl, categories } = req.body;

    await addProduct({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      imageUrl,
      categories, // Categories are an array of category IDs
    });

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ message: "Cannot add product!" });
  }
};


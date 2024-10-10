// products
import { getProducts, addProduct, getSingleProduct, deleteProduct } from "../services/product";
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

export const addProductController = async (req: Request, res: Response) => {
  try {
    const product: Product = { ...req.body };

    // Decode the image URL if necessary
    const decodedImageUrl = product.imageUrl.replace(/&#x2F;/g, "/");

    // Continue with the rest of your logic
    await addProduct({ ...product, imageUrl: decodedImageUrl });

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error in adding product:", error);
    res.status(500).json({ message: "Cannot add product!" });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params
  
  try {
    await deleteProduct(Number(id))

    res.status(200).json({message: "Product Deleted Successfuly !"})
  } catch (error) {
    console.error("Error Can Not Delete Product !", error)
    res.status(500).json({message: "Can Not Delete Product !"})
  }
}


import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Product } from "../types/product";

export const getProducts = async () => {
  return await prisma.product.findMany({
    include: {
      categories: true,
    },
  });
};

export const getSingleProduct = async (productId: number) => {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
    },
  });
};

// export const searchProducts = async (search, category) => {
//   return await prisma.product.findMany({
//     where: {
//       AND: [
//         {
//           name: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//         {
//           categoryId: category ? parseInt(category) : undefined,
//         },
//       ],
//     },
//   });
// };

export const addProduct = async (product: any) => {
  const { name, description, price, stock, imageUrl, categories } = product;

  return await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
      categories: {
        connect: categories.map((categoryId: number) => ({
          id: Number(categoryId), // Ensure the category ID is an integer
        })),
      },
    },
  });
};

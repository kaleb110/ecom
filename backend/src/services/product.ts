import { prisma } from "../config";
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

export const addProduct = async (product: Product) => {
  const { name, description, price, stock, imageUrl, categories } = product;

  try {
    // Ensure that category IDs exist before connecting
    const validCategories = await prisma.productCategory.findMany({
      where: {
        id: {
          in: categories.map((categoryId: number) => Number(categoryId)),
        },
      },
    });

    // Check if all categories are valid
    if (validCategories.length !== categories.length) {
      throw new Error("One or more categories are invalid");
    }

    // Create the product with valid categories
    return await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        categories: {
          connect: categories.map((categoryId: number) => ({
            id: Number(categoryId),
          })),
        },
      },
    });
  } catch (error) {
    console.error("Error in adding product:", error);
    throw error;
  }
};


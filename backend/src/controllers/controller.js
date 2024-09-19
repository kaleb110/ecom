import {
  getProducts,
  searchProducts,
  addProduct,
  getSingleProduct,
  addProductToCart,
  getCartItems,
  deleteCartItem,
  postUser,
  postOrder,
  postOrderItem,
  removeProductFromCart,
  updateCartItem,
} from "../services/service.js";

export const getProductsController = async (req, res) => {
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

export const getSingleProductController = async (req, res) => {
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

export const searchProductsController = async (req, res) => {
  const { search, category } = req.query;

  try {
    const products = await searchProducts(search, category);
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to search products" });
  }
};

export const addProductController = async (req, res) => {
  const { name, description, price, stock, imageUrl, categoryIds } = req.body;

  try {
    const product = { name, description, price, stock, imageUrl, categoryIds };

    await addProduct(product);
    res.status(201).json({ message: "product added sucessfully!" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ message: "Can not add product!" });
  }
};

export const addProductToCartController = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const product = { userId, productId, quantity };
  try {
    await addProductToCart(product);
    res.status(201).json({ message: "product added To Cart sucessfully!" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

export const getCartItemsController = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await getCartItems(parseInt(userId));
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const deleteCartItemController = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    await deleteCartItem(cartItemId);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "Can Not Delete Cart Item" });
  }
};

export const postUserController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userData = { name, email, password };
    const user = await postUser(userData);
    res.status(201).json({ message: "user added sucessfully!", user });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "cant add user!" });
  }
};

export const postOrderController = async (req, res) => {
  const { userId, status, totalAmount } = req.body;

  try {
    const orderData = { userId, status, totalAmount };
    const order = await postOrder(orderData);
    res.status(201).json({ message: "order created sucessfully!", order });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "cant create order!" });
  }
};

export const postOrderItemController = async (req, res) => {
  const { orderId, productId, price, quantity } = req.body;

  try {
    const orderItemData = { orderId, productId, price, quantity };
    const orderItem = await postOrderItem(orderItemData);
    res
      .status(201)
      .json({ message: "order item created sucessfully!", orderItem });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "cant create order item!" });
  }
};

export const removeProductFromCartController = async (req, res) => {
  const { userId, productId } = req.params;
  const user = { userId, productId };
  try {
    // Find the user's cart
    await removeProductFromCart(user);

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

export const updateCartItemController = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const cartData = { userId, productId, quantity };
  try {
    await updateCartItem(cartData);

    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

import {
  getProductsModel,
  searchProductsModel,
  addProductModel,
  getSingleProductModel,
  addProductToCartModel,
  getCartItemsModel,
  deleteCartItemModel,
  postUserModel,
  postOrderModel,
  postOrderItemModel,
  removeProductFromCartModel,
  updateCartItemModel,
} from "../models/model.js";

export const getProducts = () => {
  return getProductsModel();
};

export const getSingleProduct = (id) => {
  return getSingleProductModel(id);
};

export const searchProducts = (search, category) => {
  return searchProductsModel(search, category);
};

export const addProduct = (product) => {
  return addProductModel(product);
};

export const addProductToCart = (product) => {
  return addProductToCartModel(product);
};

export const getCartItems = (userId) => {
  return getCartItemsModel(userId);
};

export const deleteCartItem = (cartItemId) => {
  return deleteCartItemModel(cartItemId);
};

export const postUser = (userData) => {
  return postUserModel(userData);
};

export const postOrder = (orderData) => {
  return postOrderModel(orderData);
};

export const postOrderItem = (orderItemData) => {
  return postOrderItemModel(orderItemData);
};

export const removeProductFromCart = (user) => {
  return removeProductFromCartModel(user)
}

export const updateCartItem = (cart) => {
  return updateCartItemModel(cart);
};
import { createContext, ReactNode, useState } from 'react';
import { Product } from '../types/product.type';

type CartContextType = {
  isCartOpen: boolean;
  setIsCartOpen: (isCartOpen: boolean) => void;
  cartItems: ProductForOrder[];
  addItemToCart: (
    product: ProductForOrder,
    numberOfRentalDays: string,
    priceByDays: number,
  ) => void;
  updateCartItem: (product: ProductForOrder, newQuantity: number) => void;
  deleteCartItem: (product: ProductForOrder) => void;
};

type CartProviderProps = {
  children: ReactNode;
};

type ProductForOrder = Product & {
  preOrderQuantity: number;
  numberOfRentalDays: string;
  priceByDays: number;
};

const addCartItem = (
  cartItems: ProductForOrder[],
  productToAdd: Product,
  numberOfRentalDays: string,
  priceByDays: number,
): ProductForOrder[] => {
  const existingCartItem = cartItems.find(
    (cartItem: Product) => cartItem._id === productToAdd._id,
  );

  if (existingCartItem) {
    if (existingCartItem.numberOfRentalDays === numberOfRentalDays) {
      return cartItems.map((cartItem: ProductForOrder) =>
        cartItem._id === productToAdd._id
          ? { ...cartItem, preOrderQuantity: cartItem.preOrderQuantity + 1 }
          : cartItem,
      );
    } else {
      return [
        ...cartItems,
        {
          ...productToAdd,
          preOrderQuantity: 1,
          numberOfRentalDays: numberOfRentalDays,
          priceByDays: priceByDays,
        },
      ];
    }
  }

  return [
    ...cartItems,
    {
      ...productToAdd,
      preOrderQuantity: 1,
      numberOfRentalDays: numberOfRentalDays,
      priceByDays: priceByDays,
    },
  ];
};

const updateCartItemQuantity = (
  cartItems: ProductForOrder[],
  productToUpdate: ProductForOrder,
  newQuantity: number,
): ProductForOrder[] => {
  const existingCartItem = cartItems.find(
    (cartItem: Product) => cartItem._id === productToUpdate._id,
  );

  if (existingCartItem) {
    return cartItems.map((cartItem: ProductForOrder) =>
      cartItem._id === productToUpdate._id
        ? { ...cartItem, preOrderQuantity: newQuantity }
        : cartItem,
    );
  } else {
    return cartItems;
  }
};

const deleteCartItemFromCart = (
  cartItems: ProductForOrder[],
  productToDelete: ProductForOrder,
): ProductForOrder[] => {
  const existingCartItem = cartItems.find(
    (cartItem: Product) => cartItem._id === productToDelete._id,
  );

  if (existingCartItem) {
    return cartItems.filter(
      (cartItem: ProductForOrder) => cartItem._id !== productToDelete._id,
    );
  } else {
    return cartItems;
  }
};

export const CartContext = createContext<CartContextType>({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  updateCartItem: () => {},
  deleteCartItem: () => {},
});

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<ProductForOrder[]>(
    [] as ProductForOrder[],
  );
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const addItemToCart = (
    productToAdd: Product,
    numberOfRentalDays: string,
    priceByDays: number,
  ) => {
    setCartItems(
      addCartItem(cartItems, productToAdd, numberOfRentalDays, priceByDays),
    );
  };
  const updateCartItem = (
    productToUpdate: ProductForOrder,
    newQuantity: number,
  ) => {
    setCartItems(
      updateCartItemQuantity(cartItems, productToUpdate, newQuantity),
    );
  };
  const deleteCartItem = (productToDelete: ProductForOrder) => {
    setCartItems(deleteCartItemFromCart(cartItems, productToDelete));
  };

  const values = {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addItemToCart,
    updateCartItem,
    deleteCartItem,
  };

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};
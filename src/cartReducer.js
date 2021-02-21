export default function cartReducer(cart, action) {
  switch (action.type) {
    case 'empty':
      return [];

    case 'add':
      const itemInCart = cart.find((c) => c.sku === action.sku);
      if (itemInCart) {
        return cart.map((c) =>
          itemInCart ? { ...c, quantity: c.quantity++ } : c
        );
      } else {
        return [...cart, { id: action.id, sku: action.sku, quantity: 1 }];
      }

    case 'updateQuantity':
      return action.quantity === 0
        ? cart.filter((c) => c.sku !== action.sku)
        : cart.map((c) =>
            c.sku === action.sku ? { ...c, quantity: action.quantity } : c
          );

    default:
      throw new Error('unhandled action: ', action);
  }
}

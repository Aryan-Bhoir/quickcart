import { useEffect, useState } from "react";
import api from "../services/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    try {
      const response = await api.get("/cart/");
      setCart(response.data);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to load cart");
      }
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      await api.put(`/cart/${cartItemId}`, {
        quantity: quantity,
      });

      setMessage("Cart updated successfully!");

      loadCart();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to update cart");
      }
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);

      setMessage("Product removed from cart!");

      loadCart();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to remove product");
      }
    }
  };

  const placeOrder = async () => {
    try {
      const response = await api.post("/orders/");

      setMessage(
        `Order placed successfully! Order #${response.data.id}`
      );

      loadCart();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to place order");
      }
    }
  };

  return (
    <div className="cart-page">

      <div className="page-header">
        <div>
          <h1>My Cart</h1>
          <p className="page-subtitle">
            Review your products before placing your order.
          </p>
        </div>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {cart.length === 0 && !message && (
        <div className="empty-state">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Add some products to your cart before placing an order.
          </p>
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-container">

          <div className="cart-items">

            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >

                <div className="cart-product-icon">
                  🛍️
                </div>

                <div className="cart-item-details">

                  <h2>
                    Product #{item.product_id}
                  </h2>

                  <p>
                    Product ID: {item.product_id}
                  </p>

                  <div className="quantity-section">

                    <span>Quantity:</span>

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span className="quantity">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <span>
                {cart.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </span>
            </div>

            <hr />

            <button
              className="place-order-button"
              onClick={placeOrder}
            >
              Place Order
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;
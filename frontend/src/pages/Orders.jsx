import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders/");
      setOrders(response.data);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to load orders");
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${orderId}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.put(`/orders/${orderId}/cancel`);

      setMessage("Order cancelled successfully!");

      loadOrders();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to cancel order");
      }
    }
  };

  return (
    <div className="orders-page">

      <div className="page-header">
        <div>
          <h1>My Orders</h1>

          <p className="page-subtitle">
            View your previous orders and their details.
          </p>
        </div>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {orders.length === 0 && !message && (
        <div className="empty-state">

          <div className="empty-cart-icon">
            📦
          </div>

          <h2>No orders found</h2>

          <p>
            You haven't placed any orders yet.
          </p>

        </div>
      )}

      <div className="orders-list">

        {orders.map((order) => (

          <div
            className="order-card"
            key={order.id}
          >

            <div className="order-header">

              <div>

                <h2>
                  Order #{order.id}
                </h2>

                <p>
                  {order.items.length} item
                  {order.items.length !== 1 ? "s" : ""}
                </p>

              </div>

              <span
                className={`order-status ${order.status}`}
              >
                {order.status}
              </span>

            </div>

            <hr />

            <div className="order-items">

              {order.items.map((item) => (

                <div
                  className="order-item"
                  key={item.id}
                >

                  <div className="order-item-icon">
                    🛍️
                  </div>

                  <div className="order-item-details">

                    <h3>
                      {item.product_id !== null
                        ? `Product #${item.product_id}`
                        : "Product no longer available"}
                    </h3>

                    <p>
                      Product ID:{" "}
                      {item.product_id !== null
                        ? item.product_id
                        : "N/A"}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <div className="order-item-price">
                    ₹
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>

              ))}

            </div>

            <div className="order-footer">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {order.total_amount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* CANCEL ORDER */}

            {order.status === "pending" && (

              <div className="order-actions">

                <button
                  className="delete-button"
                  onClick={() =>
                    handleCancelOrder(order.id)
                  }
                >
                  Cancel Order
                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default Orders;
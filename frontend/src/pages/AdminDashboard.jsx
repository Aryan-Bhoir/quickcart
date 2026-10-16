import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Add product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Edit product fields
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingStock, setEditingStock] = useState("");
  const [editingActive, setEditingActive] = useState(true);

  const [message, setMessage] = useState("");

  // =========================
  // LOAD PRODUCTS
  // =========================

  const loadProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to load products");
      }
    }
  };

  // =========================
  // LOAD ALL ORDERS
  // =========================

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders/admin");
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
    loadProducts();
    loadOrders();
  }, []);

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async (event) => {
    event.preventDefault();

    try {
      await api.post("/products/", {
        name: name,
        description: description,
        price: Number(price),
        stock: Number(stock),
      });

      setMessage("Product added successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setStock("");

      loadProducts();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to add product");
      }
    }
  };

  // =========================
  // START EDITING PRODUCT
  // =========================

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setEditingName(product.name);
    setEditingDescription(product.description || "");
    setEditingPrice(product.price);
    setEditingStock(product.stock);
    setEditingActive(product.is_active);

    setMessage("");
  };

  // =========================
  // CANCEL EDITING
  // =========================

  const cancelEditing = () => {
    setEditingProductId(null);
    setEditingName("");
    setEditingDescription("");
    setEditingPrice("");
    setEditingStock("");
    setEditingActive(true);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdateProduct = async (event) => {
    event.preventDefault();

    try {
      await api.put(`/products/${editingProductId}`, {
        name: editingName,
        description: editingDescription,
        price: Number(editingPrice),
        stock: Number(editingStock),
        is_active: editingActive,
      });

      setMessage("Product updated successfully!");

      cancelEditing();

      loadProducts();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to update product");
      }
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);

      setMessage("Product deleted successfully!");

      loadProducts();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to delete product");
      }
    }
  };

  // =========================
  // DELETE ORDER
  // =========================

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Order #${orderId}? This will also delete its order items.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/orders/${orderId}`);

      setMessage("Order deleted successfully!");

      loadOrders();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to delete order");
      }
    }
  };

  return (
    <div className="admin-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p className="page-subtitle">
            Manage products and orders.
          </p>
        </div>
      </div>

      {/* =========================
          MESSAGE
      ========================= */}

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* =========================
          ADD PRODUCT
      ========================= */}

      <div className="admin-section">

        <h2>Add New Product</h2>

        <form
          className="admin-form"
          onSubmit={handleAddProduct}
        >

          <div className="form-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter product name"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Description
            </label>

            <input
              type="text"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter product description"
            />

          </div>

          <div className="admin-form-row">

            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="Enter price"
                min="0"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Stock
              </label>

              <input
                type="number"
                value={stock}
                onChange={(event) =>
                  setStock(event.target.value)
                }
                placeholder="Enter stock"
                min="0"
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="admin-add-button"
          >
            Add Product
          </button>

        </form>

      </div>

      {/* =========================
          PRODUCTS
      ========================= */}

      <div className="admin-section">

        <h2>Products</h2>

        {products.length === 0 && !message && (
          <p>
            No products found.
          </p>
        )}

        <div className="admin-product-list">

          {products.map((product) => (

            <div
              className="admin-product-card"
              key={product.id}
            >

              {/* EDIT MODE */}

              {editingProductId === product.id ? (

                <form
                  className="admin-edit-form"
                  onSubmit={handleUpdateProduct}
                >

                  <h3>
                    Edit Product
                  </h3>

                  <div className="form-group">

                    <label>
                      Product Name
                    </label>

                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) =>
                        setEditingName(event.target.value)
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Description
                    </label>

                    <input
                      type="text"
                      value={editingDescription}
                      onChange={(event) =>
                        setEditingDescription(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="admin-form-row">

                    <div className="form-group">

                      <label>
                        Price
                      </label>

                      <input
                        type="number"
                        value={editingPrice}
                        onChange={(event) =>
                          setEditingPrice(
                            event.target.value
                          )
                        }
                        min="0"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Stock
                      </label>

                      <input
                        type="number"
                        value={editingStock}
                        onChange={(event) =>
                          setEditingStock(
                            event.target.value
                          )
                        }
                        min="0"
                        required
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>

                      <input
                        type="checkbox"
                        checked={editingActive}
                        onChange={(event) =>
                          setEditingActive(
                            event.target.checked
                          )
                        }
                      />

                      {" "}
                      Product Active

                    </label>

                  </div>

                  <button
                    type="submit"
                    className="admin-add-button"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>

                </form>

              ) : (

                /* NORMAL PRODUCT VIEW */

                <>

                  <div>

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      {product.description ||
                        "No description available."}
                    </p>

                  </div>

                  <div className="admin-product-info">

                    <span>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span>
                      Stock: {product.stock}
                    </span>

                    <span>
                      {product.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  <div className="admin-product-actions">

                    <button
                      onClick={() =>
                        startEditing(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteProduct(product.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </>

              )}

            </div>

          ))}

        </div>

      </div>

      {/* =========================
          ORDERS
      ========================= */}

      <div className="admin-section">

        <h2>Orders</h2>

        {orders.length === 0 ? (

          <p>
            No orders found.
          </p>

        ) : (

          <div className="admin-product-list">

            {orders.map((order) => (

              <div
                className="admin-product-card"
                key={order.id}
              >

                <h3>
                  Order #{order.id}
                </h3>

                <div className="admin-product-info">

                  <span>
                    Total: ₹
                    {order.total_amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span>
                    Status: {order.status}
                  </span>

                  <span>
                    Items: {order.items.length}
                  </span>

                </div>

                <div className="admin-product-actions">

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteOrder(order.id)
                    }
                  >
                    Delete Order
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;
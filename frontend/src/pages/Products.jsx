import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Failed to load products");
      });
  }, []);

  const addToCart = async (productId) => {
    try {
      await api.post("/cart/", {
        product_id: productId,
        quantity: 1,
      });

      setMessage("Product added to cart!");
    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to add product to cart");
      }
    }
  };

  return (
    <div className="products-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Our Products</h1>
          <p className="page-subtitle">
            Browse our available products and add your favorites to the cart.
          </p>
        </div>

        <Link to="/cart" className="cart-link">
          🛒 View Cart
        </Link>
      </div>

      {/* Message */}
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* No Products */}
      {products.length === 0 && !message && (
        <div className="empty-state">
          <h2>No products found</h2>
          <p>There are currently no products available.</p>
        </div>
      )}

      {/* Product List */}
      <div className="product-grid">

        {products.map((product) => (
          <div className="product-card" key={product.id}>

            <div className="product-image">
              🛍️
            </div>

            <div className="product-content">

              <h2>{product.name}</h2>

              <p className="description">
                {product.description || "No description available."}
              </p>

              <div className="product-info">

                <p className="price">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <p
                  className={
                    product.stock > 0
                      ? "stock available"
                      : "stock unavailable"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of Stock"}
                </p>

              </div>

              <button
                className="add-cart-button"
                onClick={() => addToCart(product.id)}
                disabled={product.stock === 0}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Products;
import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import React, { useState, useEffect } from "react";

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  handleAdd,
  handleRemove,
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button
          className={styles.actionButton}
          onClick={() => handleAdd(id)}
          disabled={orderedQuantity >= availableCount}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          onClick={() => handleRemove(id)}
          disabled={orderedQuantity <= 0}
        >
          -
        </button>
      </td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const initializedData = data.map((product) => ({
          ...product,
          orderedQuantity: product.orderedQuantity || 0,
        }));
        setProducts(initializedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        setIsLoading(false);
      });
  }, []);

  const [orderSummary, setOrderSummary] = useState({
    total: 0,
    discount: 0,
  });

  useEffect(() => {
    let total = 0;
    products.forEach((product) => {
      total += product.price * product.orderedQuantity;
    });

    let discount = 0;
    if (total > 1000) {
      discount = total * 0.1;
    }

    setOrderSummary({
      total: total - discount,
      discount,
    });
  }, [products]);

  const handleAdd = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, orderedQuantity: product.orderedQuantity + 1 }
        : product
    );
    setProducts(updatedProducts);
  };

  const handleRemove = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, orderedQuantity: product.orderedQuantity - 1 }
        : product
    );
    setProducts(updatedProducts);
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Checkout</h1>
      </header>
      <main>
        {isLoading ? <LoadingIcon /> : null}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Product
                key={product.id}
                id={product.id}
                name={product.name}
                availableCount={product.availableCount}
                price={parseFloat(product.price).toFixed(2)}
                orderedQuantity={product.orderedQuantity || 0}
                total={(product.price * (product.orderedQuantity || 0)).toFixed(
                  2
                )}
                handleAdd={() => handleAdd(product.id)}
                handleRemove={() => handleRemove(product.id)}
              />
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: ${orderSummary.discount.toFixed(2)}</p>
        <p>Total: ${orderSummary.total.toFixed(2)}</p>
      </main>
    </div>
  );
};

export default Checkout;

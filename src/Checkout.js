import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import React, { useState, useEffect } from "react";

// Instructions:

// You are provided with an incomplete <Checkout /> component. ✅
// You are not allowed to add any additional HTML elements. ✅
// You are not allowed to use refs. ✅
// Once the <Checkout /> component is mounted, load the products using the getProducts function. ✅
// Once all the data is successfully loaded, hide the loading icon. ✅
// Render each product object as a <Product/> component, passing in the necessary props. ✅
// Implement the following functionality: all ✅✅
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  removeBtn,
  addBtn,
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
          disabled={orderedQuantity >= availableCount}
          onClick={() => addBtn(id)}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          disabled={orderedQuantity <= 0}
          onClick={() => removeBtn(id)}
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
  const [amount, setAmount] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const initializedData = data.map((product) => ({
          ...product,
          orderedQuantity: product.orderedQuantity || 0,
        }));
        setAmount(initializedData);
        setLoading(true);
      })
      .catch(() => {
        setLoading(true);
      });
  }, []);

  const [orderEnd, setOrderEnd] = useState({
    total: 0,
    discount: 0,
  });

  useEffect(() => {
    let total = 0;
    amount.forEach((product) => {
      total = total + product.price * product.orderedQuantity;
    });

    let discount = 0;
    if (total > 1000) {
      discount = total * 0.1;
    }

    setOrderEnd({
      total: total - discount,
      discount,
    });
  }, [amount]);

  const removeBtn = (productId) => {
    const updatedProducts = amount.map((product) =>
      product.id === productId
        ? { ...product, orderedQuantity: product.orderedQuantity - 1 }
        : product
    );
    setAmount(updatedProducts);
    console.log(updatedProducts);
  };

  const addBtn = (productId) => {
    const updatedProducts = amount.map((product) =>
      product.id === productId
        ? { ...product, orderedQuantity: product.orderedQuantity + 1 }
        : product
    );
    setAmount(updatedProducts);
    console.log(updatedProducts);
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Checkout</h1>
      </header>
      <main>
        {loading ? "" : <LoadingIcon />}
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
            {amount.map((product) => (
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
                addBtn={() => addBtn(product.id)}
                removeBtn={() => removeBtn(product.id)}
              />
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: ${orderEnd.discount.toFixed(2)}</p>
        <p>Total: ${orderEnd.total.toFixed(2)}</p>
      </main>
    </div>
  );
};

export default Checkout;

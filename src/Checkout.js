import { useEffect, useState } from "react";
import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";

// Instructions:

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.
// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
  currency: "USD",
  style: "currency",
});

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity = 0,
  total,
}) => {
  let [availables, setAvailables] = useState(availableCount);
  let [orders, setOrders] = useState(orderedQuantity);

  const add = () => {
    if (availables > 0) {
      setAvailables(--availables);
      setOrders(++orders);
      total(price, 1);
    }
  };

  const cancel = () => {
    if (orders > 0) {
      setAvailables(++availables);
      setOrders(--orders);
      total(price, 0);
    }
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availables}</td>
      <td>{CURRENCY_FORMATTER.format(price)}</td>
      <td>{orders}</td>
      <td>{CURRENCY_FORMATTER.format(orders * price)}</td>
      <td>
        <button
          disabled={availables <= 0}
          onClick={add}
          className={styles.actionButton}
        >
          +
        </button>
        <button
          disabled={orders <= 0}
          onClick={cancel}
          className={styles.actionButton}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState(false);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const calculateTotal = (price, status) => {
    if (status) {
      setTotal(total + price);
    } else {
      setTotal(total - price);
    }
  };

  useEffect(async () => {
    const prods = await getProducts();
    setProducts(prods);
  }, []);

  return (
    <div>
      <header className={styles.header}>
        <h1>Checkout</h1>
      </header>
      <main>
        {!products && <LoadingIcon />}
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
            {
              /* Products should be rendered here */
              products &&
                products.map((product) => {
                  return (
                    <Product
                      key={product.id}
                      {...product}
                      total={calculateTotal}
                    />
                  );
                })
            }
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>
          Discount:{" "}
          {CURRENCY_FORMATTER.format(total > 1000 ? total * 0.1 : 0)}{" "}
        </p>
        <p>
          Total:{" "}
          {CURRENCY_FORMATTER.format(discount > 0 ? total - discount : total)}
        </p>
      </main>
    </div>
  );
};

export default Checkout;

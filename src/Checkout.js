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

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity = 0,
  total = 0,
  // add,
  // subtract
}) => {
  let [o, setO] = useState(orderedQuantity);
  let [t, setT] = useState(total);
  const add = () => setO((q) => q++);
  const subtract = () => setO((q) => q--);

  const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    currency: "USD",
    style: "currency",
  });

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{o}</td>
      <td>${(price*o) > 0 && price*o}</td>
      <td>
        <button onClick={() => CURRENCY_FORMATTER.format(setO(++t))} className={styles.actionButton}>
          +
        </button>
        <button onClick={() => CURRENCY_FORMATTER.format(setO(--t))} className={styles.actionButton}>
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState(false);

  useEffect(async () => {
    const prods = await getProducts();
    console.log(prods);
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
                      {...product}
                      // add={add}
                      // subtract={subtract}
                    />
                  );
                })
            }
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: $ </p>
        <p>Total: $ </p>
      </main>
    </div>
  );
};

export default Checkout;

import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import AppContext from "../context";

function Orders() {
  const { onAddToFavorite, onAddToCart } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // const { data } = await axios.get(
        //   "https://64df954e71c3335b2582d6fd.mockapi.io/orders"
        // );
        // setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      } catch (error) {
        alert("Ошибка при запросе заказов!");
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>

      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card key={index} loading={isLoading} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Orders;

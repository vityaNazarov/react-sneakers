import { useState } from "react";
import Info from "../Info";
// import AppContext from "../context";
import axios from "axios";
import { useCart } from "../hooks/useCart";
import css from "./Drawer.module.scss";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, items = [], onRemove, opened }) {
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://64df954e71c3335b2582d6fd.mockapi.io/orders",
        { items: cartItems }
      );
      // await axios.put("https://64df954e71c3335b2582d6fd.mockapi.io/cart", []);

      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          "https://64df954e71c3335b2582d6fd.mockapi.io/cart" + item.id
        );
        await delay(1000);
      }
    } catch (error) {
      alert("Ошибка при создании заказа!");
    }
    setIsLoading(false);
  };

  return (
    <div className={`${css.overlay} ${opened ? css.overlayVisible : ""}`}>
      <div className={css.drawer}>
        <h2 className="mb-30 d-flex justify-between ">
          Корзина
          <img
            onClick={onClose}
            className=" cu-p"
            src="/img/btn-remove.svg"
            alt="close"
          />
        </h2>

        {items.length > 0 ? (
          <>
            <div className="items">
              {items.map((obj) => (
                <div
                  key={obj.id}
                  className="cartItem d-flex align-center mb-20"
                >
                  <div
                    style={{ backgroundImage: `url(${obj.imageUrl})` }}
                    className="cartItemImg"
                  ></div>

                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} $</b>
                  </div>
                  <img
                    onClick={() => onRemove(obj.id)}
                    className="remove-btn"
                    src="/img/btn-remove.svg"
                    alt="btn-remove"
                  />
                </div>
              ))}
            </div>
            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice} $</b>
                </li>
                <li>
                  <span>Налог 5%:</span>
                  <div></div>
                  <b>{(totalPrice / 100) * 5} $</b>
                </li>
              </ul>
              <button
                disabled={isLoading}
                onClick={onClickOrder}
                className="greenButton"
              >
                Оформить заказ <img src="/img/arrow.svg" alt="arrow" />
              </button>
            </div>
          </>
        ) : (
          <Info
            title={isOrderComplete ? "Заказ оформлен!" : "Корзина пустая"}
            image={
              isOrderComplete
                ? "/img/complete-order.jpg"
                : "/img/empty-cart.jpg"
            }
            description={
              isOrderComplete
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : "Добавьте хотябы одну пару кроссовок, чтобы сделать заказ."
            }
          />
        )}
      </div>
    </div>
  );
}

export default Drawer;

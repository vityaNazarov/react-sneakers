import { useContext } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./hooks/useCart";

function Header(props) {
  const { totalPrice } = useCart();

  return (
    <header className="d-flex justify-between align-center p-40">
      <Link to="/">
        <div className="d-flex align-center">
          <img width={40} height={40} src="/img/logo.png" alt="" />
          <div>
            <h3 className="text-uppercase">React Sneackers</h3>
            <p className="opacity-5">Магазин лучших кросовок</p>
          </div>
        </div>
      </Link>

      <ul className="d-flex">
        <li className="mr-30 cu-p" onClick={props.onClickCart}>
          <img width={18} height={18} src="/img/cart.svg" alt="корзина" />
          <span>{totalPrice} $</span>
        </li>
        <li className="mr-15 cu-p">
          <Link to="/favorites">
            <img width={18} height={18} src="/img/heart.svg" alt="закладки" />
          </Link>
        </li>

        <li>
          <Link to="/orders">
            <img
              width={18}
              height={18}
              src="/img/user.svg"
              alt="пользователь"
            />
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;

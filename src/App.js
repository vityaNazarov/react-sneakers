import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";

import { useEffect, useState } from "react";

import { Route, Routes } from "react-router-dom";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchdata() {
      try {
        const [cartResponse, itemsResponse] = await Promise.all([
          axios.get("https://64df954e71c3335b2582d6fd.mockapi.io/cart"),
          axios.get("https://64df954e71c3335b2582d6fd.mockapi.io/items"),
        ]);

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchdata();
  }, []);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("favorites"));

    if (items) {
      setFavorites(items);
    }
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      );
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://64df954e71c3335b2582d6fd.mockapi.io/cart/${findItem.id}`
        );
      } else {
        setCartItems((prev) => [...prev, data]);

        const { data } = await axios.post(
          "https://64df954e71c3335b2582d6fd.mockapi.io/cart",
          obj
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return { ...item, id: data.id };
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onRemoveCart = async (id) => {
    try {
      await axios.delete(
        `https://64df954e71c3335b2582d6fd.mockapi.io/cart/${id}`
      );
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onAddToFavorite = (obj) => {
    if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
      localStorage.removeItem("favorites");

      setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
    } else {
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setFavorites((prev) => [...prev, obj]);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId === Number(id)));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          opened={cartOpened}
          onRemove={onRemoveCart}
          items={cartItems}
          onClose={() => {
            setCartOpened(false);
          }}
        />

        <Header
          onClickCart={() => {
            setCartOpened(true);
          }}
        />

        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          ></Route>
          <Route path="/favorites" exact element={<Favorites />}></Route>
          <Route path="/orders" exact element={<Orders />}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;

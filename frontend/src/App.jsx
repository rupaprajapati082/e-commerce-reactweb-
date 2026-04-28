import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LogIn";
import JoinUs from "./pages/JoinUs";
import Profile from "./pages/Profile";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./pages/Wishlist";
import AdminPanel from "./pages/AdminPanel";
import Support from "./pages/Support";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/joinus" element={<JoinUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/featured" element={<ProductListing />} />
        <Route path="/categories" element={<ProductListing />} />
        <Route path="/deals" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/about" element={<Support />} />
        <Route path="/contact" element={<Support />} />
      </Routes>
    </>
  );
};

export default App;

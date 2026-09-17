import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import StoreLayout from "./components/share/StoreLayout/StoreLayout";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import AuthProvider from "./features/auth/AuthProvider";
import CartProvider from "./features/cart/CartProvider";
import ProductDetails from "./pages/product/ProductDetails";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import RequireAuth from "./features/auth/RequireAuth";
import NotificationProvider from "./features/notifications/NotificationProvider";
import Notifications from "./pages/notifications/Notifications";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <Routes>
              <Route element={<StoreLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="products/:productId"
                  element={<ProductDetails />}
                />
                <Route path="cart" element={<Cart />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="checkout" element={<Checkout />} />
                <Route element={<RequireAuth />}>
                  <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;

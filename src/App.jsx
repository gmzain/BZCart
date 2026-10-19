import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./compunent/Home";
import Cart from "./compunent/Cart";
import Auth from "./compunent/Auth";
import Loader from "./compunent/Loader";
import Payment from "./compunent/Payment";
import SingleProduct from "./compunent/SingleProduct";
import CategoryProducts from "./compunent/CategoryProducts";
import CategoryRedirect from "./compunent/CategoryRedirect";
import CategoriesPage from "./compunent/CategoriesPage";
import ContactPage from "./compunent/ContactPage";
import TrackOrder from "./compunent/TrackOrder";
import SingleDeal from "./compunent/SingleDeal";
import AllDeals from "./compunent/AllDeals";
import AllProducts from "./compunent/AllProducts";
import SearchPage from "./compunent/SearchPage";
import Cashout from "./compunent/Cashout";
import PaymentMethods from "./compunent/PaymentMethods";
import About from "./compunent/About";
import PrivacyPolicy from "./compunent/PrivacyPolicy";
import ReturnRefund from "./compunent/ReturnRefund";
import TermsAndCondition from "./compunent/TermsAndCondition";
import ForgotPassword from "./compunent/ForgotPassword";
import ResetPassword from "./compunent/ResetPassword";
import Checkout from "./compunent/Checkout";
import FAQS from "./compunent/FAQS";
import BottomNav from "./compunent/BottomNav";
import OrdersList from "./compunent/OrdersList";
import LoginProfile from "./compunent/LoginProfile";
import Profile from "./compunent/Profile";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./compunent/PageTransition";
import Favorites from "./compunent/Favorites";

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  // Handle route change: only manage loading state here. Scroll restoration intentionally disabled.
  useEffect(() => {
    // Only show loader if products are actually loading and no products are in store
    if (productsLoading && !products.length) {
      setLoading(true);
      return;
    }

    setLoading(false);
    // No automatic scroll restore performed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!["/auth", "/checkout", "/Cashout", "/paymentMethods"].some((path) =>
        location.pathname.startsWith(path)
      ) && <BottomNav />}
      <div className="pb-[9vh] md:pb-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/auth"
              element={
                <PageTransition>
                  <Auth />
                </PageTransition>
              }
            />
            <Route
              path="/forgot"
              element={
                <PageTransition>
                  <ForgotPassword />
                </PageTransition>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PageTransition>
                  <ResetPassword />
                </PageTransition>
              }
            />
            <Route
              path="/loginprofile"
              element={
                <PageTransition>
                  <LoginProfile />
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <Profile />
                </PageTransition>
              }
            />
            <Route
              path="/cart"
              element={
                <PageTransition>
                  <Cart />
                </PageTransition>
              }
            />
            <Route
              path="/payment"
              element={
                <PageTransition>
                  <Payment />
                </PageTransition>
              }
            />
            <Route
              path="/Cashout"
              element={
                <PageTransition>
                  <Cashout />
                </PageTransition>
              }
            />
            <Route
              path="/Checkout"
              element={
                <PageTransition>
                  <Checkout />
                </PageTransition>
              }
            />
            <Route
              path="/paymentMethods"
              element={
                <PageTransition>
                  <PaymentMethods />
                </PageTransition>
              }
            />
            <Route
              path="/track-order/:id"
              element={
                <PageTransition>
                  <TrackOrder />
                </PageTransition>
              }
            />
            <Route
              path="/orders"
              element={
                <PageTransition>
                  <OrdersList />
                </PageTransition>
              }
            />
            <Route
              path="/deal/:id"
              element={
                <PageTransition>
                  <SingleDeal />
                </PageTransition>
              }
            />
            <Route
              path="/product/:productName"
              element={
                <PageTransition>
                  <SingleProduct />
                </PageTransition>
              }
            />
            <Route
              path="/categories"
              element={
                <PageTransition>
                  <CategoriesPage />
                </PageTransition>
              }
            />
            <Route
              path="/deals"
              element={
                <PageTransition>
                  <AllDeals />
                </PageTransition>
              }
            />
            <Route
              path="/Contact"
              element={
                <PageTransition>
                  <ContactPage />
                </PageTransition>
              }
            />
            <Route
              path="/products"
              element={
                <PageTransition>
                  <AllProducts />
                </PageTransition>
              }
            />
            <Route
              path="/search"
              element={
                <PageTransition>
                  <SearchPage />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route
              path="/privacypolicy"
              element={
                <PageTransition>
                  <PrivacyPolicy />
                </PageTransition>
              }
            />
            <Route
              path="/returnandrefund"
              element={
                <PageTransition>
                  <ReturnRefund />
                </PageTransition>
              }
            />
            <Route
              path="/termsandconditions"
              element={
                <PageTransition>
                  <TermsAndCondition />
                </PageTransition>
              }
            />
            <Route
              path="/faqs"
              element={
                <PageTransition>
                  <FAQS />
                </PageTransition>
              }
            />

            <Route
              path="/category/:categoryName"
              element={
                <PageTransition>
                  <CategoryRedirect />
                </PageTransition>
              }
            />

            <Route
              path="/:categoryName"
              element={
                <PageTransition>
                  <CategoryProducts />
                </PageTransition>
              }
            />
            <Route
              path="/favorites"
              element={
                <PageTransition>
                  <Favorites />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
};

export default App;

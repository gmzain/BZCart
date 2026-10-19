import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import React, { Suspense, useEffect, useState } from "react";

const Slider = React.lazy(() => import("./Slider"));
const ProductDeals = React.lazy(() => import("./ProductDeals"));
const TopCategories = React.lazy(() => import("./TopCategories"));
const TopBrands = React.lazy(() => import("./TopBrands"));
const PromoBanner = React.lazy(() => import("./PromoBanner"));
const Footer = React.lazy(() => import("./Footer"));
const LazyWrapper = React.lazy(() => import("./LazyWrapper"));
const NewArrival = React.lazy(() => import("./NewArrival"));
const BeatSeller = React.lazy(() => import("./BeatSeller"));

import axios from "axios";
import { toSlug } from "../utils/slugify";
import FridayBannerDisplay from "./FridayBannerDisplay";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <p className="text-center text-red-500">
          Something went wrong. Please try again.
        </p>
      );
    }
    return this.props.children;
  }
}

const Home = () => {
  const dispatch = useDispatch();
  const { products, sortedProducts, loading, error, searchTerm } = useSelector(
    (state) => state.products
  );

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  // Fetch products only if needed
  useEffect(() => {
    if (!products.length && !loading && !error) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length, loading, error]);

  // Scroll to top when Home component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative font-daraz bg-white">
      <ErrorBoundary>
        {/* 🔥 Any kind of Skeleton removed from here */}

        {/* Search results */}
        {searchTerm && (
          <div className="single-product md:w-[95%] mx-auto px-2 md:px-0 py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-500 mb-8">
              Search Results for{" "}
              <span className="text-[#f06621]">"{searchTerm}"</span>
            </h2>

            {/* Categories */}
            <div className="mb-12">
              <h3 className="text-lg md:text-xl font-bold text-gray-500 mb-4">
                Matching Categories
              </h3>

              {/* 🔥 No skeleton — categories component will handle itself */}
              {categoriesError && (
                <p className="text-red-500">{categoriesError}</p>
              )}
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-500 mb-4">
                Matching Products
              </h3>

              {error && <p className="text-red-500">{error}</p>}

              {/* 🔥 No skeleton, the product card components will handle their own skeleton */}
            </div>
          </div>
        )}

        {/* Home Components */}
        <Suspense fallback={<div></div>}>
          <LazyWrapper>
            <Slider />
          </LazyWrapper>
        </Suspense>

        <Suspense fallback={<div></div>}>
          <LazyWrapper>
            <div className="block md:hidden">
              <FridayBannerDisplay />
            </div>
          </LazyWrapper>
        </Suspense>

        {/* <Suspense fallback={<div></div>}>
          <LazyWrapper>
            <TopCategories
              categories={categories}
              loading={categoriesLoading}
            />
          </LazyWrapper>
        </Suspense> */}

        <Suspense fallback={<div></div>}>
          <LazyWrapper>
            <BeatSeller />
          </LazyWrapper>
        </Suspense>

        <Suspense fallback={<div></div>}>
          <LazyWrapper>
            <NewArrival />
          </LazyWrapper>
        </Suspense>

        <Suspense fallback={<div></div>}>
          <LazyWrapper>
            <ProductDeals />
          </LazyWrapper>
        </Suspense>

        <Suspense fallback={<div></div>}>
          <TopBrands sortedProducts={sortedProducts} loading={loading} />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <LazyWrapper>
            <PromoBanner />
          </LazyWrapper>
        </Suspense>

        <Suspense fallback={<div></div>}>
          <LazyWrapper>
            <Footer />
          </LazyWrapper>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Home;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDeals } from "../features/deals/dealSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "./Footer";

const AllDeals = () => {
  const dispatch = useDispatch();
  const { deals, loading, error } = useSelector((state) => state.deals);

  useEffect(() => {
    dispatch(fetchDeals())
      .unwrap()
      .catch(() => {});
  }, [dispatch]);

  const getDiscountPercent = (original, deal) => {
    if (!original || !deal || original <= 0) return null;
    return Math.round(((original - deal) / original) * 100);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border shadow-md p-3"
            >
              <Skeleton height={150} className="rounded-xl" />
              <Skeleton width={`80%`} height={20} className="mt-2" />
              <Skeleton width={`60%`} height={15} />
              <Skeleton width={`40%`} height={15} />
            </div>
          ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-6 text-center">Error: {error}</div>;
  }

  if (deals.length === 0) {
    return <p className="text-center text-dark/70 p-6">No deals available</p>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-3 md:p-6 font-daraz">
        <h1 className="text-2xl md:text-3xl font-bold text-dark mb-6">
          All Deals
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {deals.map((deal, index) => {
            const discountPercent = getDiscountPercent(
              deal.original_price,
              deal.deal_price
            );
            const rating = deal.rating || 4;
            const categoryName = deal.category?.name || "Unknown";

            return (
              <div
                key={`${deal._id}-${index}`}
                className="group bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
              >
                {discountPercent !== null && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">
                    {discountPercent}% OFF
                  </div>
                )}
                <Link
                  to={`/deal/${deal._id}`}
                  aria-label={`View details for ${deal.deal_name}`}
                  data-product-id={deal._id}
                  data-product-name={deal.deal_name}
                >
                  <div
                    className="p-4 h-48 flex items-center justify-center"
                    style={{ backgroundColor: deal.bg_color || "#f3f4f6" }}
                    data-product-id={deal._id}
                    data-product-name={deal.deal_name}
                  >
                    <img
                      src={
                        deal.deal_images?.[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt={deal.deal_name || "Deal"}
                      className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-5 py-2 border-t bg-primary/5">
                    <h3 className="font-semibold text-dark text-sm mb-1 line-clamp-1 hover:text-primary transition-colors duration-200">
                      {deal.deal_name || "Unknown Deal"}
                    </h3>
                    <p className="text-dark/70 text-xs mb-1 capitalize">
                      {categoryName}
                    </p>
                    <div className="flex items-center text-yellow-500 text-sm mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(rating)
                              ? "fill-current"
                              : "fill-none stroke-current"
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="text-dark/70 text-xs ml-2">
                        ({rating})
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-5 pb-3 bg-primary/5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="line-through text-gray-400">
                      Rs. {deal.original_price || "N/A"}
                    </span>
                    <span className="font-semibold text-dark">
                      Rs. {deal.deal_price || "N/A"}
                    </span>
                  </div>
                  {deal.original_price && deal.deal_price && (
                    <p className="text-green-600 text-xs mt-1">
                      Save - Rs.{" "}
                      {(deal.original_price - deal.deal_price).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllDeals;

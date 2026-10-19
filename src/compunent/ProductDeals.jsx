import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { fetchDeals } from "../features/deals/dealSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Next Arrow
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-5 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition"
  >
    <IoIosArrowForward size={20} />
  </button>
);

// Custom Prev Arrow
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-5 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition"
  >
    <IoIosArrowBack size={20} />
  </button>
);

const Deals = () => {
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

  // react-slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: Math.min(deals.length, 5),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(deals.length, 3) },
      },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full max-w-7xl mt-8 mx-auto px-2 md:px-0 py-6 relative">
      {/* Header */}
      <div className="flex justify-between items-start md:items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-dark border-b-2 border-primary inline-block pb-1">
          <span className="text-primary">
            {loading ? <Skeleton width={120} /> : "Hot Deals"}
          </span>
        </h2>
        {loading ? (
          <Skeleton width={70} height={20} />
        ) : (
          <Link
            to="/deals"
            className="text-primary font-medium text-sm hover:underline"
          >
            View All →
          </Link>
        )}
      </div>

      {/* Deal Slider */}
      {loading ? (
        <Slider {...settings}>
          {Array(5)
            .fill()
            .map((_, index) => (
              <div key={index} className="px-2">
                <div className="bg-white rounded-2xl border shadow-md p-3">
                  <Skeleton height={150} className="rounded-xl" />
                  <Skeleton width={`80%`} height={20} className="mt-2" />
                  <Skeleton width={`60%`} height={15} />
                  <Skeleton width={`40%`} height={15} />
                </div>
              </div>
            ))}
        </Slider>
      ) : deals.length === 0 ? (
        <p className="text-center w-full">No deals found</p>
      ) : (
        <Slider {...settings}>
          {deals.map((deal, index) => {
            const discountPercent = getDiscountPercent(
              deal.original_price,
              deal.deal_price
            );
            const rating = deal.rating || 4;
            const categoryName = deal.category?.name || "Unknown";

            return (
              <div key={`${deal._id}-${index}`} className="px-2">
                <div className="group bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
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
                      className="md:p-4 h-[250px] w-[355px] md:h-56 md:w-auto flex items-center justify-center"
                      style={{ backgroundColor: deal.bg_color || "#0851e3" }}
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
                    <div className="px-2 md:px-5 py-2 border-t bg-primary/5">
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
                  <div className="px-2 md:px-5 pb-3 bg-primary/5">
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
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default React.memo(Deals);

import React from "react";
import { Link } from "react-router-dom";

const WatchMenu = () => {
  const products = [
    {
      _id: "1",
      product_name: "Mango E-Liquid",
      product_base_price: 2500,
      product_discounted_price: 1999,
      product_images: [
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      ],
      product_description: "Delicious mango flavored e-liquid.",
      rating: 4.5,
    },
    {
      _id: "2",
      product_name: "Strawberry Ice E-Liquid",
      product_base_price: 2800,
      product_discounted_price: 2200,
      product_images: [
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      ],
      product_description: "Refreshing strawberry ice e-liquid.",
      rating: 4.2,
    },
    {
      _id: "3",
      product_name: "Blueberry Blast",
      product_base_price: 2000,
      product_discounted_price: 1800,
      product_images: [
        "https://static.vecteezy.com/system/resources/previews/053/366/782/non_2x/collection-of-full-body-a-business-suit-mock-up-isolated-on-a-transparency-background-png.png",
      ],
      product_description: "Tangy blueberry blast for vaping lovers.",
      rating: 4,
    },
    {
      _id: "1",
      product_name: "Mango E-Liquid",
      product_base_price: 2500,
      product_discounted_price: 1999,
      product_images: [
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      ],
      product_description: "Delicious mango flavored e-liquid.",
      rating: 4.5,
    },
    {
      _id: "2",
      product_name: "Strawberry Ice E-Liquid",
      product_base_price: 2800,
      product_discounted_price: 2200,
      product_images: [
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      ],
      product_description: "Refreshing strawberry ice e-liquid.",
      rating: 4.2,
    },
    {
      _id: "3",
      product_name: "Blueberry Blast",
      product_base_price: 2000,
      product_discounted_price: 1800,
      product_images: [
        "https://static.vecteezy.com/system/resources/previews/053/366/782/non_2x/collection-of-full-body-a-business-suit-mock-up-isolated-on-a-transparency-background-png.png",
      ],
      product_description: "Tangy blueberry blast for vaping lovers.",
      rating: 4,
    },
  ];

  const calculateDiscountPercentage = (basePrice, discountedPrice) => {
    if (!basePrice || !discountedPrice || basePrice <= 0) return 0;
    return Math.round(((basePrice - discountedPrice) / basePrice) * 100);
  };

  return (
    <div className="md:w-[95%] mx-auto px-3 md:px-0 py-10 font-cabin">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((item) => {
          const discountPercentage = calculateDiscountPercentage(
            item.product_base_price,
            item.product_discounted_price
          );

          return (
            <div
              key={item._id}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image */}
              <Link to={`/product/${item._id}`} className="relative">
                <img
                  src={item.product_images[0]}
                  alt={item.product_name}
                  className="h-48 md:h-64 w-full object-contain bg-light p-6 transition-transform duration-500 group-hover:scale-105"
                />
                {discountPercentage > 0 && (
                  <span className="absolute top-2 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    -{discountPercentage}%
                  </span>
                )}
              </Link>

              {/* Product Info */}
              <div className="flex-1 p-2 md:p-5 flex flex-col justify-between">
                <div>
                  <h6 className="font-semibold text-lg text-dark group-hover:text-primary transition-colors duration-200">
                    {item.product_name}
                  </h6>
                  <p className="text-dark/60 text-sm mt-1 line-clamp-2">
                    {item.product_description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating || 4)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.951-.69l1.286-3.967z" />
                      </svg>
                    ))}
                    <span className="text-xs text-dark/50 ml-1">
                      {item.rating}
                    </span>
                  </div>
                </div>

                {/* Price + Cart */}
                <div className="mt-2 md:mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      Rs. {item.product_base_price}
                    </span>
                    <span className="text-primary font-semibold md:font-bold md:text-xl">
                      Rs. {item.product_discounted_price}
                    </span>
                  </div>

                  {/* <button className="w-full mt-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition duration-300 shadow-md">
                                        🛒 Add to Cart
                                      </button> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WatchMenu;

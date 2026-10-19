import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSlides } from "../features/slides/slideSlice";
import Loader from "./Loader";

const HeroSection = () => {
  const dispatch = useDispatch();
  const { slides, loading, error } = useSelector((state) => state.slides);

  useEffect(() => {
    dispatch(fetchSlides());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center text-red-500 text-xl">{error}</div>;

  // Sort slides: large → medium → small
  const sortedSlides = [...slides].sort((a, b) => {
    const order = { large: 1, medium: 2, small: 3 };
    return order[a.size] - order[b.size];
  });

  const large = sortedSlides.find((s) => s.size === "large");
  const mediumBanners = sortedSlides
    .filter((s) => s.size !== "large")
    .slice(0, 4);

  return (
    <div className="w-full flex justify-center py-4 px-2 font-sans">
      <div className="w-full max-w-7xl">
        {/* =============================== */}
        {/*     DESKTOP VIEW                */}
        {/* =============================== */}
        <div className="hidden md:block">
          {/* Large banner */}
          {large && (
            <a
              href={large.link}
              className=" text-white rounded-xl overflow-hidden shadow-lg block"
              style={{ backgroundColor: large.bgColor || "#28a745" }}
            >
              <div className="px-2 py-7 md:py-7 md:px-12 flex flex-row items-center justify-between gap-4 md:gap-10">
                <div className="flex-1 space-y-2 md:space-y-6">
                  <h1
                    className="text-2xl sm:text-2xl md:text-6xl font-extrabold leading-tight"
                    style={{ color: large.titleColor || "#ffffff" }}
                  >
                    {large.title || "PREMIUM"} <br />
                  </h1>
                  <p className="text-sm sm:text-base md:text-2xl font-medium">
                    {large.subtitle || "MEN'S"} <br />
                  </p>
                  {large.buttonText && (
                    <button className="bg-[#E68A42] hover:bg-[#d6762f] text-white px-5 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all">
                      {large.buttonText}
                    </button>
                  )}
                </div>
                <div className="flex justify-center flex-1">
                  <img
                    loading="lazy"
                    src={large.image}
                    alt="banner"
                    className="w-40 sm:w-40 md:w-72 lg:w-96 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </a>
          )}

          {/* Medium banners */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {mediumBanners.map((item, index) => (
              <a key={index} href={item.link}>
                <div
                  className="rounded-xl px-2 md:px-4 shadow-sm py-3"
                  style={{ backgroundColor: item.bgColor || "#f3cd9f" }}
                >
                  <div className="flex justify-center md:justify-between items-center">
                    <div>
                      <p
                        className="text-xl md:text-3xl font-bold"
                        style={{ color: item.titleColor || "#1A1A1A" }}
                      >
                        {item.title}
                      </p>
                      <button className=" text-sm md:text-lg md:font-medium mt-5 text-gray-600 hidden md:inline-block">
                        {item.subtitle || "View Collection"}
                      </button>
                    </div>
                    <img
                      loading="lazy"
                      src={item.image}
                      alt={item.alt}
                      className="w-20 h-20 md:w-36 md:h-36 -mr-2"
                    />
                  </div>

                  <button className="text-sm text-gray-600 mt-1 md:hidden block">
                    {item.subtitle || "View Collection"}
                  </button>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* =============================== */}
        {/*     MOBILE VIEW                 */}
        {/* =============================== */}
        <div className="block md:hidden">
          {/* Large banner */}
          {large && (
            <a
              href={large.link}
              className="block rounded-xl overflow-hidden shadow-lg mb-4"
            >
              <img
                loading="lazy"
                src={large.image}
                alt="banner"
                className="w-full h-auto object-cover"
              />
            </a>
          )}

          {/* Medium banners */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {mediumBanners.map((item, index) => (
              <a key={index} href={item.link}>
                <div className="h-full rounded-xl shadow-sm flex items-start overflow-hidden">
                  <img
                    loading="lazy"
                    src={item.image}
                    alt={item.title}
                    className="inset-0 w-full h-full object-cover"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

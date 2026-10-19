import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("category"); // category | subcategory

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://bzbackend.online/api/categories/categories"
        );
        setCategories(response.data);
        setFilteredData(response.data); // default view
      } catch (err) {
        console.error(
          "Fetch categories error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleFilter = (type) => {
    setFilterType(type);
    if (type === "category") {
      const mainCats = categories.filter((cat) => !cat.parent_category);
      setFilteredData(mainCats);
    } else {
      const subCats = categories.filter((cat) => cat.parent_category);
      setFilteredData(subCats);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-[95%] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center border-b-2 border-[#f06621] inline-block pb-1">
          Browse <span className="text-[#f06621]">Categories</span>
        </h1>

        {/* 🔘 Filter Buttons */}
        <div className="flex justify-center mb-8 gap-3">
          <button
            onClick={() => handleFilter("category")}
            className={`px-5 py-2 rounded-full border transition-all duration-300 ${
              filterType === "category"
                ? "bg-[#f06621] text-white border-[#f06621]"
                : "bg-white text-[#f06621] border-[#f06621] hover:bg-[#f06621] hover:text-white"
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => handleFilter("subcategory")}
            className={`px-5 py-2 rounded-full border transition-all duration-300 ${
              filterType === "subcategory"
                ? "bg-[#f06621] text-white border-[#f06621]"
                : "bg-white text-[#f06621] border-[#f06621] hover:bg-[#f06621] hover:text-white"
            }`}
          >
            Subcategories
          </button>
        </div>

        {/* 🧩 Categories Grid */}
        {filteredData.length === 0 ? (
          <p className="text-center">No {filterType}s found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredData.map((category, index) => (
              <Link
                key={`${category._id}-${index}`}
                to={`/category/${category._id}`}
                className="flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#f06621] bg-[#fbf6f4] p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
                  <img
                    src={category.image || "https://via.placeholder.com/150"}
                    alt={category.name || "Category"}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm sm:text-base font-medium hover:text-[#f06621] transition">
                  {category.name || "Unknown Category"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesPage;

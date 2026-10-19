import React, { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toSlug } from "../utils/slugify";
import {
  fetchProducts,
  setSearchTerm,
} from "../features/products/productSlice";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const { products, loading, error } = useSelector((state) => state.products);

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTermLocal] = useState(query);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    dispatch(setSearchTerm(query));
    dispatch(fetchProducts());
  }, [dispatch, query]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await axios.get(
          "https://bzbackend.online/api/categories/categories"
        );
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.product_name?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      {/* 🔥 Overlay */}
      <div
        onClick={() => navigate(-1)}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* 👉 Drawer (80% like Favorites) */}
      <div
        className="fixed top-0 right-0 h-full z-50 bg-white
        w-[80%] sm:w-[420px]
        flex flex-col
        animate-slideIn"
      >
        {/* Header */}
        <div className="px-4 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Search 🔍</h2>
          <button onClick={() => navigate(-1)} className="text-2xl">
            ×
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="p-4 border-b flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTermLocal(e.target.value)}
            placeholder="Search products or categories"
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 rounded text-sm"
          >
            Go
          </button>
        </form>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Categories</h3>

            {categoriesLoading ? (
              <Skeleton count={3} height={30} />
            ) : filteredCategories.length === 0 ? (
              <p className="text-xs text-gray-500">No categories found</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/${toSlug(cat.name)}`}
                    className="px-3 py-1 border rounded text-xs"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Products</h3>

            {loading ? (
              <Skeleton count={4} height={90} />
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-xs text-gray-500">No products found</p>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((p) => (
                  <Link
                    key={p._id}
                    to={`/product/${toSlug(p.product_name)}`}
                    className="flex gap-3 border-b pb-3"
                  >
                    <img
                      src={
                        p.product_images?.[0] ||
                        "https://via.placeholder.com/150"
                      }
                      className="w-16 h-20 object-contain"
                      alt=""
                    />
                    <div>
                      <p className="text-sm font-medium line-clamp-2">
                        {p.product_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PKR {p.product_discounted_price || p.product_base_price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(SearchPage);

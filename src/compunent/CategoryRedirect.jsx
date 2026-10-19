import React from "react";
import { useParams, Navigate } from "react-router-dom";

const CategoryRedirect = () => {
  const { categoryName } = useParams();
  if (!categoryName) return null;
  return <Navigate to={`/${categoryName}`} replace />;
};

export default CategoryRedirect;

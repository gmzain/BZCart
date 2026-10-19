import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useHomeScrollRestoration() {
  const location = useLocation();
  // Hook left intentionally empty — scroll restoration disabled globally
}

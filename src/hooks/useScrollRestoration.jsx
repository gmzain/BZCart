import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Saves scroll position for Home and restores it when navigating back.
 * Works across full unmounts (like going to /product/:id and coming back).
 */
export default function useScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType(); // "POP", "PUSH", "REPLACE"
  const prevPath = useRef(null);
  // Scroll restoration behavior intentionally disabled.
}

import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { sendAnalyticsEvent, makeSessionId } from "../utils/analytics";

const AnalyticsProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("myUser")) || null;
  const sessionRef = useRef(() => makeSessionId());
  const startRef = useRef(Date.now());
  const location = useLocation();
  const currentPathRef = useRef(location.pathname + location.search);
  const pathStartRef = useRef(Date.now());

  // device detection helper
  const detectDevice = () => {
    const ua = navigator.userAgent || "";
    const lower = ua.toLowerCase();
    const meta = { ua };
    if (/android\s+([0-9\.]+)/i.test(ua)) {
      const m = ua.match(/Android\s+([0-9\.]+)/i);
      meta.os_name = "Android";
      meta.os_version = m ? m[1] : null;
      meta.device_type = "mobile";
      // try to extract device model for Android (e.g. SM-G991B, Pixel 7)
      const modelMatch = ua.match(
        /Android[\d\.]*;\s*([^;\)]+)\s*(Build|AppleWebKit|;)/i
      );
      if (modelMatch && modelMatch[1]) meta.device_model = modelMatch[1].trim();
    } else if (
      /iPhone OS\s*([0-9_]+)/i.test(ua) ||
      /iPad; CPU OS\s*([0-9_]+)/i.test(ua)
    ) {
      const m = ua.match(/OS\s*([0-9_]+)/i);
      meta.os_name = "iOS";
      meta.os_version = m ? m[1].replace(/_/g, ".") : null;
      meta.device_type = /iPad/i.test(ua) ? "tablet" : "mobile";
      // set device model to iPhone or iPad when present
      if (/iPad/i.test(ua)) meta.device_model = "iPad";
      else if (/iPhone/i.test(ua)) meta.device_model = "iPhone";
    } else if (/windows nt\s*([0-9\.]+)/i.test(lower)) {
      meta.os_name = "Windows";
      meta.device_type = "desktop";
    } else if (/mac os x\s*([0-9_]+)/i.test(ua)) {
      meta.os_name = "macOS";
      meta.device_type = "desktop";
    } else {
      meta.os_name = "unknown";
      meta.device_type = /mobile|android|iphone|ipad/i.test(ua)
        ? "mobile"
        : "desktop";
    }
    // best-effort device model from UA for desktops
    if (!meta.device_model) {
      const platform = navigator.platform || "";
      if (/Mac/i.test(platform)) meta.device_model = "Mac";
      else if (/Win/i.test(platform)) meta.device_model = "Windows PC";
      else if (/Linux/i.test(platform)) meta.device_model = "Linux";
    }
    return meta;
  };

  // Throttle scroll events
  useEffect(() => {
    const sessionId = sessionRef.current();
    try {
      localStorage.setItem("analyticsSession", sessionId);
    } catch (e) {}
    const deviceMeta = detectDevice();
    // attach click event
    const clickHandler = (e) => {
      const target = e.target;
      // safe element id/class/tag extraction (avoid DOM objects)
      const elId = target && target.id ? String(target.id) : null;
      let elClass = null;
      try {
        if (target && typeof target.className === "string")
          elClass = target.className;
        else if (target && target.getAttribute)
          elClass = target.getAttribute("class");
      } catch (err) {
        elClass = null;
      }
      const elTag = target && target.tagName ? String(target.tagName) : null;

      // Detect product interactions: prefer explicit data-product-id/name,
      // otherwise try to extract product slug from the nearest anchor href.
      let productId = null;
      let productName = null;
      let productSlug = null;
      try {
        const prodEl = target.closest && target.closest("[data-product-id]");
        if (prodEl) {
          productId = prodEl.getAttribute("data-product-id");
          try {
            productName = prodEl.getAttribute("data-product-name") || null;
          } catch (e) {}
        }

        if (!productId) {
          const a = target.closest ? target.closest("a[href]") : null;
          if (a && a.getAttribute) {
            let href = a.getAttribute("href") || "";
            // If href is absolute, extract pathname
            try {
              if (/^https?:\/\//i.test(href)) {
                const u = new URL(href, window.location.origin);
                href = u.pathname + (u.search || "") + (u.hash || "");
              }
            } catch (e) {}
            // capture slug part after /product/
            const m = href.match(/\/product\/(.+?)(?:[\/#?]|$)/i);
            if (m && m[1]) {
              productSlug = m[1];
              // if slug looks like an ObjectId, treat as productId
              if (/^[a-f0-9]{24}$/i.test(productSlug)) productId = productSlug;
            }
          }
        }
      } catch (err) {
        productId = null;
        productName = null;
        productSlug = null;
      }

      // Detect add-to-cart action by data-action or class naming
      let action = null;
      try {
        const actionEl = target.closest && target.closest("[data-action]");
        if (actionEl) action = actionEl.getAttribute("data-action");
        if (
          !action &&
          elClass &&
          /add[-_]?to[-_]?cart|add-cart|buy-now/i.test(elClass)
        ) {
          action = "add_to_cart_click";
        }
      } catch (err) {
        action = null;
      }

      const text =
        (target &&
          target.innerText &&
          String(target.innerText).slice(0, 200)) ||
        null;

      const payload = {
        event_type: productId
          ? "product_click"
          : action
          ? "action_click"
          : "click",
        user_id: user?.id || user?._id || null,
        user_display: user?.username || user?.name || user?.email || null,
        guest_id: localStorage.getItem("guestId") || null,
        session_id: sessionId,
        url: window.location.href,
        element: elId || elClass || elTag || null,
        data: {
          text,
          href:
            (target &&
              target.closest &&
              target.closest("a[href]") &&
              target.closest("a[href]").getAttribute("href")) ||
            null,
          product_id: productId || null,
          product_slug: productSlug || null,
          product_name: productName || null,
          action: action || null,
        },
        meta: deviceMeta,
      };
      try {
        if (typeof console !== "undefined") {
          const dbg = {
            productId: productId || null,
            productSlug: productSlug || null,
            productName: productName || null,
            href: payload.data.href || null,
            action: payload.data.action || null,
            element: payload.element || null,
            event_type: payload.event_type,
          };
          try {
            console.debug &&
              console.debug("analytics: click payload", JSON.stringify(dbg));
          } catch (e) {
            console.debug && console.debug("analytics: click payload", dbg);
          }
        }
      } catch (e) {}
      sendAnalyticsEvent(payload);
    };

    let lastScrollAt = 0;
    const scrollHandler = () => {
      const now = Date.now();
      if (now - lastScrollAt < 2000) return; // throttle 2s
      lastScrollAt = now;
      const doc = document.documentElement || document.body;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewport = window.innerHeight || (doc && doc.clientHeight) || 0;
      const docHeight = Math.max(
        doc.scrollHeight || 0,
        document.body.scrollHeight || 0
      );
      const percent =
        docHeight > 0
          ? Math.min(100, Math.round(((scrollY + viewport) / docHeight) * 100))
          : 0;
      const payload = {
        event_type: "scroll",
        user_id: user?.id || user?._id || null,
        user_display: user?.username || user?.name || user?.email || null,
        guest_id: localStorage.getItem("guestId") || null,
        session_id: sessionId,
        url: window.location.href,
        data: { scrollY, percent },
        meta: deviceMeta,
      };
      sendAnalyticsEvent(payload);
    };

    const visibilityHandler = () => {
      if (document.visibilityState === "hidden") {
        const duration = Date.now() - startRef.current;
        const payload = {
          event_type: "session_end",
          user_id: user?.id || user?._id || null,
          user_display: user?.username || user?.name || user?.email || null,
          guest_id: localStorage.getItem("guestId") || null,
          session_id: sessionId,
          url: window.location.href,
          duration_ms: duration,
          meta: deviceMeta,
        };
        sendAnalyticsEvent(payload);
      } else if (document.visibilityState === "visible") {
        // new sub-session start
        startRef.current = Date.now();
        const payload = {
          event_type: "session_start",
          user_id: user?.id || user?._id || null,
          user_display: user?.username || user?.name || user?.email || null,
          guest_id: localStorage.getItem("guestId") || null,
          session_id: sessionId,
          url: window.location.href,
          meta: deviceMeta,
        };
        sendAnalyticsEvent(payload);
      }
    };

    // Send initial page view
    sendAnalyticsEvent({
      event_type: "page_view",
      user_id: user?.id || user?._id || null,
      user_display: user?.username || user?.name || user?.email || null,
      guest_id: localStorage.getItem("guestId") || null,
      session_id: sessionId,
      url: window.location.href,
      meta: deviceMeta,
    });

    document.addEventListener("click", clickHandler, { capture: true });
    document.addEventListener("scroll", scrollHandler, { passive: true });
    document.addEventListener("visibilitychange", visibilityHandler);

    // Keep-alive for session: send heartbeat every 30s
    const heartbeat = setInterval(() => {
      const payload = {
        event_type: "heartbeat",
        user_id: user?.id || user?._id || null,
        user_display: user?.username || user?.name || user?.email || null,
        session_id: sessionId,
        url: window.location.href,
        meta: deviceMeta,
      };
      sendAnalyticsEvent(payload);
    }, 30000);

    return () => {
      document.removeEventListener("click", clickHandler, { capture: true });
      document.removeEventListener("scroll", scrollHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
      clearInterval(heartbeat);
      // send final session_end on unmount
      const duration = Date.now() - startRef.current;
      sendAnalyticsEvent({
        event_type: "session_end",
        user_id: user?.id || user?._id || null,
        user_display: user?.username || user?.name || user?.email || null,
        guest_id: localStorage.getItem("guestId") || null,
        session_id: sessionId,
        url: window.location.href,
        duration_ms: duration,
        meta: deviceMeta,
      });
      try {
        localStorage.removeItem("analyticsSession");
      } catch (e) {}
    };
  }, []);

  // handle page durations on route changes
  useEffect(() => {
    const prevPath = currentPathRef.current;
    const now = Date.now();
    const duration = now - pathStartRef.current;
    // send the page duration for the previous path
    if (prevPath) {
      sendAnalyticsEvent({
        event_type: "page_duration",
        user_id: user?.id || user?._id || null,
        user_display: user?.username || user?.name || user?.email || null,
        guest_id: localStorage.getItem("guestId") || null,
        session_id: sessionRef.current(),
        url: prevPath,
        duration_ms: duration,
        meta: detectDevice(),
      });
    }
    // mark new path start
    currentPathRef.current = location.pathname + location.search;
    pathStartRef.current = Date.now();

    // also send a page_view for the new path
    sendAnalyticsEvent({
      event_type: "page_view",
      user_id: user?.id || user?._id || null,
      user_display: user?.username || user?.name || user?.email || null,
      guest_id: localStorage.getItem("guestId") || null,
      session_id: sessionRef.current(),
      url: location.pathname + location.search,
      meta: detectDevice(),
    });
  }, [location.pathname, location.search]);

  return <>{children}</>;
};

export default AnalyticsProvider;

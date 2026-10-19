import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} // start slightly smaller and invisible
      animate={{ opacity: 1, scale: 1 }} // fade in and scale to normal
      exit={{ opacity: 0, scale: 0.95 }} // fade out and shrink slightly
      transition={{ duration: 0.25, ease: "easeInOut" }} // smooth transition
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const NumberAnimation = ({ value, duration = 2 }) => {
  const count = useMotionValue(0); // Holds the animated value
  const rounded = useTransform(count, (latest) => Math.round(latest)); // Rounds the value

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: "easeOut" }); // Animates smoothly
    return controls.stop; // Clean up animation on unmount
  }, [value, duration, count]);

  return <motion.span>{rounded}</motion.span>;
};

export default NumberAnimation;

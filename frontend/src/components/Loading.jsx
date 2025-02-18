import { motion } from "framer-motion";

export default function AnimatedLoader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <motion.h1
        className="text-white text-4xl font-bold"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.h1>
    </div>
  );
}

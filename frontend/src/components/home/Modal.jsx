import Button from "../common/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Modal({ active, title, content, description }) {
  // open the post modal
  const navigate = useNavigate();

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 w-full bg-black/80 flex flex-col items-center justify-center z-[200] dark:backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.1,
                },
              }}
              exit={{
                opacity: 0,
              }}
              className="bg-white border border-gray-800 max-w-md p-4  rounded-lg z-[200] dark:bg-secondary text-secondary dark:text-white"
            >
              {/* modal header */}
              <div className="text-center">
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              {/* modal form */}
              <div>{content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

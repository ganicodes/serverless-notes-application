import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Card, CardActions, CardDescription, CardTitle } from "./Card";

export type noteType = {
  id: string;
  title: string;
  description: string;
};

export const NotesCard = ({
  items,
  className,
}: {
  items: noteType[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 py-10  md:grid-cols-2  lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.id}
          className="group relative  block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="dark:bg-bg-primary/30 absolute inset-0 block h-full w-full rounded-3xl  bg-primary/30"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription className="flex flex-col justify-between gap-y-2">
              {item.description}
            </CardDescription>
            <CardActions note={item} />
          </Card>
        </div>
      ))}
    </div>
  );
};

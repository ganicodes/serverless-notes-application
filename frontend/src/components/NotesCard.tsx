import { cn } from "@/lib/utils";
import { IconArchive, IconEdit, IconTrash } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type noteType = {
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

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative z-20 h-full w-full overflow-hidden rounded-2xl border border-foreground/50 bg-background p-4 text-foreground group-hover:border-slate-700 dark:border-white/[0.2]",
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "mt-4 font-bold tracking-wide dark:text-zinc-100",
        className,
      )}
    >
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-sm leading-relaxed tracking-wide dark:text-zinc-400",
        className,
      )}
    >
      {children}
    </p>
  );
};

export const CardActions = ({ note }: { note: noteType }) => {
  return (
    <div className="mt-4 flex w-full items-start gap-4">
      <DialogDemo note={note} />
      <Button variant="outline" size="icon" title="Delete">
        <IconTrash className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" title="Archive">
        <IconArchive className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function DialogDemo({ note }: { note: noteType }) {
  const [item, setItem] = useState<noteType>(note);

  const onNoteChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    type: string,
  ) => {
    setItem((prev: noteType) => ({ ...prev, [type]: e.target.value }));
  };

  const updateNote = () => {
    // make api call here
    console.log(item);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Edit">
          <IconEdit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your note here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              value={item.title}
              className="col-span-3"
              onChange={(e) => onNoteChange(e, "title")}
            />
          </div>
          <div className="">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Textarea
              id="username"
              value={item.description}
              className="col-span-3 resize-none"
              onChange={(e) => onNoteChange(e, "description")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={updateNote}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

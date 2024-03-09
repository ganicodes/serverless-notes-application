import { cn } from "@/lib/utils";
import { IconArchive, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { noteType } from "./NotesCard";
import { NotesEditDialog } from "./NotesEdit";

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
  const dialogRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const onEditClick = () => {
    dialogRef?.current?.click();
  };

  return (
    <div className="mt-4 flex w-full items-start gap-4">
      <NotesEditDialog dialogRef={dialogRef} note={note} />
      <Button variant="outline" size="icon" title="Edit" onClick={onEditClick}>
        <IconEdit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" title="Delete">
        <IconTrash className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" title="Archive">
        <IconArchive className="h-4 w-4" />
      </Button>
    </div>
  );
};

import { axiosInstance } from "@/lib/axios";
import { ChangeEvent, LegacyRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { noteType } from "./NotesCard";

export function NotesEditDialog({
  note,
  dialogRef,
}: {
  note: noteType;
  dialogRef: LegacyRef<HTMLButtonElement>;
}) {
  const [item, setItem] = useState<noteType>(note);

  const onNoteChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    type: string,
  ) => {
    setItem((prev: noteType) => ({ ...prev, [type]: e.target.value }));
  };

  const updateNote = async () => {
    // make api call here
    console.log(item);
    try {
      const res = await axiosInstance.put("/notes", item, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log("res: ", res.data);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hidden" title="Edit" ref={dialogRef}>
          Open
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
          <DialogClose
            className="rounded bg-primary px-4 py-2 text-background"
            onClick={updateNote}
            type="submit"
          >
            Save Changes
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

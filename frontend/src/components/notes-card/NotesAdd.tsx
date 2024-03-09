import { axiosInstance } from "@/lib/axios";
import { CreateNoteSchema } from "@ganicodes/sna-common";
import { IconPlus } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";
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

const NotesAdd = () => {
  const [note, setNote] = useState<CreateNoteSchema>({
    title: "",
    description: "",
  });

  const onNoteChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    type: string,
  ) => {
    setNote((prev: CreateNoteSchema) => ({ ...prev, [type]: e.target.value }));
  };

  const addNote = async () => {
    try {
      const res = await axiosInstance.post("/notes", note);
      console.log("res: ", res);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Edit">
          <IconPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add note</DialogTitle>
          <DialogDescription>
            Make changes to your note here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={note?.title}
              className="col-span-3"
              onChange={(e) => onNoteChange(e, "title")}
            />
          </div>
          <div className="">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={note?.description}
              className="col-span-3 resize-none"
              onChange={(e) => onNoteChange(e, "description")}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose
            className="rounded bg-primary px-4 py-2 text-background"
            onClick={addNote}
            type="submit"
          >
            Save
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotesAdd;

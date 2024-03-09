import Sidebar from "@/components/Sidebar";
import NotesAdd from "@/components/notes-card/NotesAdd";
import { NotesCard, noteType } from "@/components/notes-card/NotesCard";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/notes");
        const { notes } = res.data;
        setNotes(
          notes.map((n: noteType) => {
            return {
              id: n.id,
              title: n.title,
              description: n.description,
            };
          }),
        );
        console.log("notes: ", notes);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl px-8">
      <Sidebar />
      <div className="">
        <NotesAdd />
        <NotesCard items={notes} />
      </div>
    </div>
  );
}

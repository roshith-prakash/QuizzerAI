import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css"; // Keep this for toolbar styles
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useDBUser } from "@/context/UserContext";
import NoteEditor from "./NoteEditor";

const Note = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { noteId } = useParams();

  const { dbUser } = useDBUser();

  // Fetch note from DB
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => {
      return axiosInstance.post("/note/get-note-by-id", {
        noteId,
        userId: dbUser?.id,
      });
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 60 * 1000 * 10,
    enabled: !!noteId,
  });

  // Set fetched note values into state
  useEffect(() => {
    if (data?.data) {
      setTitle(data?.data?.note?.title);
      setContent(data?.data?.note?.content);
    }
  }, [data?.data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // NEED to WORK ON THIS
  if (error) {
    return <p>Could not find that note!</p>;
  }

  // NEED TO WORK ON THIS
  if (!data?.data?.note) {
    return <p>Could not find that note!</p>;
  }

  if (data?.data?.note?.user?.id == dbUser?.id) {
    // If the profile is the current user's profile, show the profile component.
    return <NoteEditor />;
  }

  return (
    <div className="relative max-w-[95%] mb-20 md:max-w-5xl mx-auto mt-10 px-4 py-6 bg-white dark:bg-white/5 rounded-xl shadow-sm">
      {/* Display note title */}
      <input
        type="text"
        disabled={true}
        readOnly={true}
        value={title}
        placeholder="Untitled"
        className="w-full text-3xl font-semibold bg-transparent outline-none mb-6 placeholder-gray-400 dark:placeholder-white"
      />
      <hr className="border-t-2" />
      {/* Display note content */}
      <ReactQuill
        theme="bubble"
        value={content}
        readOnly={true}
        onChange={setContent}
        placeholder="Start typing..."
        className="min-h-[300px] custom-quill-editor" // Remove border here
      />
    </div>
  );
};

export default Note;

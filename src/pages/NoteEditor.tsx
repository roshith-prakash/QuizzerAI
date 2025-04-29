import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Keep this for toolbar styles
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import HoverError from "@/components/reuseit/HoverError";
import useDebounce from "@/utils/useDebounce";
import { useDBUser } from "@/context/UserContext";
import QuillToolbar, { formats, modules } from "@/components/QuillToolbar";
import toast from "react-hot-toast";

const NoteEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const debouncedTitle = useDebounce(title, 750);
  const debouncedContent = useDebounce(content, 750);

  const { dbUser } = useDBUser();
  const { noteId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => {
      return axiosInstance.post("/note/get-note-by-id", { noteId });
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 60 * 1000 * 10,
    enabled: !!noteId,
  });

  useEffect(() => {
    if (data?.data) {
      setTitle(data?.data?.note?.title);
      setContent(data?.data?.note?.content);
    }
  }, [data?.data]);

  useEffect(() => {
    if (
      data?.data &&
      debouncedTitle &&
      !isLoading &&
      !error &&
      (debouncedTitle !== data?.data?.note?.title ||
        debouncedContent !== data?.data?.note?.content)
    ) {
      const savePromise = axiosInstance.post("/note/update-note", {
        userId: dbUser?.id,
        noteId,
        title: debouncedTitle,
        content: debouncedContent,
      });

      toast.promise(
        savePromise,
        {
          loading: "Saving...",
          success: "Note saved!",
          error: "Save failed.",
        },
        {
          style: {
            minWidth: "200px",
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
          position: "bottom-right",
        }
      );

      savePromise.catch((error) => {
        console.error("Failed to save note:", error);
      });
    }
  }, [
    data?.data,
    dbUser?.id,
    debouncedContent,
    debouncedTitle,
    noteId,
    isLoading,
    error,
  ]);

  return (
    <div className="relative max-w-[95%] mb-20 md:max-w-5xl mx-auto mt-10 px-4 py-6 bg-white dark:bg-white/5 rounded-xl shadow-sm">
      <HoverError
        position="top"
        text="A Title is required for the note."
        displayed={!isLoading && !error && !title}
        className="!left-0 text-md !translate-x-0 text-red-500"
      >
        <input
          type="text"
          disabled={isLoading || !!error}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full text-3xl font-semibold bg-transparent outline-none mb-6 placeholder-gray-400 dark:placeholder-white"
        />
      </HoverError>

      {/* Sticky Toolbar */}
      <div className="sticky z-2 py-1 pb-3 border-b-2 bg-white dark:bg-secondarydarkbg top-0">
        <QuillToolbar />
      </div>

      <ReactQuill
        theme="snow"
        value={content}
        readOnly={isLoading || !!error}
        onChange={setContent}
        modules={modules}
        formats={formats}
        placeholder="Start typing..."
        className="min-h-[300px] custom-quill-editor" // Remove border here
      />
    </div>
  );
};

export default NoteEditor;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Keep this for toolbar styles

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

import { axiosInstance } from "@/utils/axios";
import useDebounce from "@/utils/useDebounce";

import { useDBUser } from "@/context/UserContext";

import HoverError from "@/components/reuseit/HoverError";
import AlertModal from "@/components/reuseit/AlertModal";
import Modal from "@/components/reuseit/Modal";
import Switch from "@/components/reuseit/Switch";

import { PrimaryButton, SecondaryButton } from "@/components";
import QuillToolbar, { formats, modules } from "@/components/QuillToolbar";

import { Popover, PopoverClose } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// --------------------------------------------------------------------

const NoteEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const debouncedTitle = useDebounce(title, 750);
  const debouncedContent = useDebounce(content, 750);
  const debouncedPublicState = useDebounce(isPublic, 750);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  const { dbUser } = useDBUser();
  const { noteId } = useParams();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // Fetch note from DB
  const { data, isLoading, error } = useQuery({
    queryKey: ["note-editor", noteId],
    queryFn: () => {
      return axiosInstance.post("/note/get-note-by-id", {
        noteId,
        userId: dbUser?.id,
      });
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
    staleTime: 0,
    enabled: !!noteId,
  });

  // Add fetched note value to the state
  useEffect(() => {
    if (data?.data) {
      const { title, content, isPublic } = data.data.note;
      setTitle(title);
      setContent(content);
      setIsPublic(isPublic);
    }
  }, [data?.data]);

  // Auto save the note
  useEffect(() => {
    if (data?.data && debouncedTitle && !isLoading && !error) {
      // Save the note
      const savePromise = axiosInstance.post("/note/update-note", {
        userId: dbUser?.id,
        noteId: noteId,
        title: debouncedTitle,
        content: debouncedContent,
        isPublic: debouncedPublicState,
      });

      // savePromise.then(() => {
      //   queryClient.invalidateQueries({
      //     queryKey: ["notes", dbUser?.id],
      //   });
      // });

      // Display toast
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

      // If note couldn't be saved
      savePromise.catch((error) => {
        console.error("Failed to save note:", error);
      });
    }

    return () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", dbUser?.id],
      });

      // queryClient.invalidateQueries({
      //   queryKey: ["note-editor", noteId],
      // });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dbUser?.id,
    debouncedContent,
    debouncedTitle,
    debouncedPublicState,
    noteId,
    isLoading,
    error,
  ]);

  // Check if user presses ctrl + c
  useEffect(() => {
    const handleCopyShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        toast("Notes are auto-saved ✅", {
          icon: "💾",
          position: "bottom-right",
          duration: 3000,
        });
      }
    };

    window.addEventListener("keydown", handleCopyShortcut);

    return () => {
      window.removeEventListener("keydown", handleCopyShortcut);
    };
  }, []);

  // Delete the note
  const deleteNote = () => {
    setIsDisabled(true);
    axiosInstance
      ?.post("/note/delete-note", { noteId, userId: dbUser?.id })
      .then(() => {
        queryClient.removeQueries({
          queryKey: ["notes", dbUser?.id, ""],
        });

        queryClient.removeQueries({
          queryKey: ["note-editor", noteId],
        });

        setIsDisabled(false);
        toast("Deleted note.");
        navigate("/notes");
      })
      .catch((err) => {
        toast.error("Could not delete note.");
        setIsDisabled(false);
        console.log(err);
      });
  };

  return (
    <>
      {/* Delete Note Modal */}
      <AlertModal
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        isOpen={isDeleteModalOpen}
      >
        <div className="flex flex-col gap-y-2">
          {/* Title */}
          <h1 className="dark:text-darkmodetext font-bold text-2xl">
            Are you sure you want to delete this note?
          </h1>

          {/* Subtitle */}
          <h2 className="dark:text-darkmodetext mt-1 text-base text-darkbg/80">
            This action cannot be reversed.
          </h2>

          {/* Buttons */}
          <div className="mt-5 flex gap-x-5 justify-end">
            <PrimaryButton
              disabled={isDisabled}
              disabledText="Please Wait..."
              className="text-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 dark:bg-red-500 dark:border-red-500 dark:hover:bg-red-600 dark:hover:border-red-600"
              onClick={deleteNote}
              text="Delete"
            />
            <SecondaryButton
              disabled={isDisabled}
              disabledText="Please Wait..."
              className="text-sm text-black border-black hover:bg-black hover:border-black"
              onClick={() => setIsDeleteModalOpen(false)}
              text="Cancel"
            />
          </div>
        </div>
      </AlertModal>

      {/* Note Privacy Modal */}
      <Modal
        onClose={() => {
          setIsPrivacyModalOpen(false);
        }}
        isOpen={isPrivacyModalOpen}
      >
        <button
          onClick={() => {
            setIsPrivacyModalOpen(false);
          }}
          className="cursor-pointer absolute top-4 right-4"
        >
          <RxCross2 className="text-xl" />
        </button>

        <div className="flex flex-col gap-y-2">
          {/* Title */}
          <h1 className="dark:text-darkmodetext pr-8 font-bold text-2xl">
            Do you want to make this note public?
          </h1>
          {/* Subtitle */}
          <h2 className="dark:text-darkmodetext mt-1 text-base text-darkbg/80">
            Public notes will be visible on your profile.
          </h2>
          <div className="flex items-center py-4 justify-center">
            <Switch
              checked={isPublic}
              onChange={() => {
                setIsPublic((prev) => !prev);
              }}
            />
            <label className="font-semibold text-xl">
              {isPublic ? "Public" : "Private"}
            </label>
          </div>
        </div>
      </Modal>

      <div className="relative max-w-[95%] mb-20 md:max-w-5xl mx-auto mt-10 px-4 py-6 bg-white dark:bg-white/5 rounded-xl shadow-sm">
        {/* Title Input */}
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
            className="w-full text-3xl pr-12 font-semibold bg-transparent outline-none mb-6 placeholder-gray-400 dark:placeholder-white"
          />
        </HoverError>

        {/* Delete + Privacy Popover */}
        <div className="absolute top-5 right-5">
          <Popover>
            <PopoverTrigger className="flex items-center cursor-pointer">
              <BsThreeDotsVertical className="text-2xl" />
            </PopoverTrigger>

            <PopoverContent className="dark:bg-darkgrey dark:border-2 w-auto mt-2 mr-4 py-0 px-1">
              <div className="py-1 min-w-32 flex flex-col gap-y-1">
                <PopoverClose>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="cursor-pointer w-full flex items-center gap-x-3 justify-center hover:text-red-500 dark:hover:text-red-400 hover:bg-grey/50 dark:hover:bg-grey/5 py-1.5 transition-all"
                  >
                    <FaTrash />
                    <span className="-translate-x-1">Delete</span>
                  </button>
                </PopoverClose>
                <PopoverClose>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="cursor-pointer hover:text-cta dark:hover:text-darkmodeCTA w-full flex items-center gap-x-2 justify-center hover:bg-grey/50 dark:hover:bg-grey/5 py-1.5 transition-all"
                  >
                    <FaEye />
                    Privacy
                  </button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sticky Toolbar */}
        <div className="sticky z-1 py-1 pb-3 border-b-2 bg-white dark:bg-secondarydarkbg top-0">
          <QuillToolbar />
        </div>

        {/* Quill Editor */}
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
    </>
  );
};

export default NoteEditor;

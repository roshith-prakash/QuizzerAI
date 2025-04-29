import { useEffect, useState } from "react";
import useDebounce from "../utils/useDebounce";
import { Input, SecondaryButton } from "../components";
import { IoIosSearch, IoMdAddCircleOutline } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { useDBUser } from "@/context/UserContext";

const Notes = () => {
  // State for user input - passed to debouncer
  const [search, setSearch] = useState("");
  // Debouncing the input of the user
  const debouncedSearch = useDebounce(search);

  const { dbUser } = useDBUser();
  const navigate = useNavigate();

  // Intersection observer to fetch new leagues
  const { ref, inView } = useInView();

  //  Page Title
  useEffect(() => {
    document.title = "Your Notes | Quizzer AI";
  }, []);

  // Fetching searched notes
  const {
    data: notes,
    isLoading: loadingNotes,
    // error: notesError,
    fetchNextPage: fetchNextNotes,
  } = useInfiniteQuery({
    queryKey: ["notes", dbUser?.id, debouncedSearch],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/note/get-notes-for-user", {
        searchTerm: debouncedSearch,
        page: pageParam,
        userId: dbUser?.id,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Fetching more notes
  useEffect(() => {
    if (inView) {
      fetchNextNotes();
    }
  }, [inView, fetchNextNotes, notes?.pages?.length]);

  // Create a new note
  const createNote = () => {
    axiosInstance
      ?.post("/note/create-note", { userId: dbUser?.id })
      .then((res) => {
        navigate(`/notes/${res?.data?.note?.noteId}`);
      });
  };

  return (
    <>
      <div className="min-h-[70vh] dark:bg-darkbg dark:text-darkmodetext md:min-h-[65vh] lg:min-h-[60vh] px-8 lg:px-10 py-10">
        <div>
          <div className="flex justify-between gap-x-4 items-center">
            {/* Title */}
            <h1 className="text-hovercta font-title dark:text-darkmodeCTA text-4xl md:text-5xl font-semibold">
              Notes
            </h1>

            {/* Create a new note */}
            <SecondaryButton
              className="border-transparent dark:hover:!text-cta dark:disabled:hover:!text-gray-400 shadow-md"
              text={
                <div className="flex gap-x-2 items-center">
                  <IoMdAddCircleOutline className="text-2xl" />
                  <span className="text-nowrap">New Note</span>
                </div>
              }
              onClick={createNote}
            ></SecondaryButton>
          </div>

          {/* Input box */}
          <div className="flex flex-col items-center">
            <div className="relative my-10 mt-14 w-full max-w-3xl flex justify-center">
              <IoIosSearch className="absolute left-2 top-5 mt-0.5 text-greyText text-xl" />
              <Input
                value={search}
                className="pl-10 border-t-0 border-l-0 border-r-0 rounded-none border-b-2"
                placeholder={"Search and find a note!"}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Showing the input entered by the user */}
          {debouncedSearch && (
            <p className="font-medium py-5">
              Showing search results for &quot;{debouncedSearch}&quot;
            </p>
          )}

          {/* Map notes if notes are found */}
          {notes && notes?.pages?.[0]?.data?.notes.length > 0 && (
            <div className="py-10 lg:px-5 flex justify-center flex-wrap gap-8">
              {notes &&
                notes?.pages?.map((page) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  return page?.data.notes?.map((note: any) => {
                    if (note?.title) {
                      console.log(note);
                      return (
                        <Link
                          key={note?.noteId}
                          className=" bg-white shadow-xl max-w-3xs w-full rounded-xl flex flex-col dark:bg-white/5  px-5 py-5 transition-all hover:scale-105"
                          to={`/notes/${note?.noteId}`}
                        >
                          <div className="flex-1">
                            <p className="text-xl mb-4 font-semibold">
                              {note?.title}
                            </p>
                            <p className="text-md line-clamp-6 dark:text-white/80 text-darkbg/70">
                              {note?.content}
                            </p>
                          </div>
                        </Link>
                      );
                    }
                  });
                })}
            </div>
          )}

          {/* Notes Loader */}
          {loadingNotes && (
            <div className="py-10 lg:px-5 flex justify-center flex-wrap gap-8">
              {Array(4)
                ?.fill(null)
                ?.map((_, index) => {
                  return (
                    <div
                      key={index}
                      className=" bg-[#e1e1e1]/25 max-w-3xs w-full rounded-xl flex flex-col dark:bg-white/5  px-5 py-5 transition-all hover:shadow-md hover:bg-white/10"
                    >
                      <div className="flex-1">
                        <p className="px-0.5 h-4 w-48 bg-gray-500 rounded animate-pulse mb-4 "></p>
                        <p className="px-0.5 h-4 w-48 bg-gray-500 rounded animate-pulse mb-4 "></p>
                        <p className="px-0.5 h-4 w-48 bg-gray-500 rounded animate-pulse mb-4 "></p>
                      </div>

                      {/* League creator section - link to user's page. */}
                      <div className="mt-5 flex gap-x-3 items-center w-fit">
                        {/* User's profile picture or avatar on left */}
                        <div className="px-0.5 h-10 w-10 rounded-full bg-gray-500  animate-pulse mb-4 " />
                        {/* User's name & username on the right */}
                        <div>
                          <p className="px-0.5 h-4 w-32 bg-gray-500 rounded animate-pulse mb-4 "></p>
                          <p className="px-0.5 h-4 w-32 bg-gray-500 rounded animate-pulse mb-4 "></p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* If no notes are found */}
          {notes && notes?.pages?.[0]?.data?.notes.length == 0 && (
            <div className="flex flex-col justify-center pt-10">
              <div className="flex justify-center">
                <img
                  src={
                    "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742462679/Starman-bro_rgnlwy.svg"
                  }
                  className="max-w-[30%]"
                />
              </div>
              <p className="text-center mt-5 text-2xl font-medium">
                Uh oh! Couldn&apos;t find any notes.
              </p>
            </div>
          )}

          <div ref={ref}></div>
        </div>
      </div>
    </>
  );
};

export default Notes;

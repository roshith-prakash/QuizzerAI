import { useEffect, useRef, useState } from "react";
import useDebounce from "../utils/useDebounce";
import {
  ErrorStatement,
  Input,
  PrimaryButton,
  SecondaryButton,
} from "../components";
import { IoIosSearch, IoMdAddCircleOutline } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useDBUser } from "@/context/UserContext";
import { BsFileEarmarkPdfFill, BsThreeDotsVertical } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { FaEye, FaTrash } from "react-icons/fa6";
import toast from "react-hot-toast";
import AlertModal from "@/components/reuseit/AlertModal";
import { useQueryClient } from "@tanstack/react-query";
import { IoCloudUploadOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { AxiosError, AxiosResponse } from "axios";

const Files = () => {
  const [noteId, setNoteId] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // State for user input - passed to debouncer
  const [search, setSearch] = useState("");
  // Debouncing the input of the user
  const debouncedSearch = useDebounce(search);

  const [fileNameError, setFileNameError] = useState<number>(0);

  const [files, setFiles] = useState<File[]>([]);

  const { dbUser } = useDBUser();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Intersection observer to fetch new leagues
  const { ref, inView } = useInView();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    setFiles((prevFiles: File[]) => {
      // Filter out duplicates based on name + size + lastModified
      const existing = new Set(
        prevFiles.map(
          (file) => `${file.name}-${file.size}-${file.lastModified}`
        )
      );

      const filteredNewFiles = newFiles.filter(
        (file) =>
          !existing.has(`${file.name}-${file.size}-${file.lastModified}`)
      );

      return [...prevFiles, ...filteredNewFiles];
    });

    if (fileRef?.current) {
      fileRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("userId", dbUser?.id);

    setIsUploading(true);

    await toast.promise(
      axiosInstance.post("/file/upload-files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loading: "Uploading...",
        success: (res: AxiosResponse) => {
          queryClient.invalidateQueries({
            queryKey: ["files", dbUser?.id, debouncedSearch],
          });
          setIsUploading(false);
          console.log("Upload successful", res.data);
          return "Upload successful";
        },
        error: (err: AxiosError) => {
          setIsUploading(false);
          console.error("Upload failed", err);
          return "Upload failed";
        },
      },
      {
        position: "bottom-right",
      }
    );
  };

  //  Page Title
  useEffect(() => {
    document.title = "Your Files | Quizzer AI";
  }, []);

  // Fetching searched notes
  const {
    data: dbFiles,
    isLoading: loadingFiles,
    // error: notesError,
    fetchNextPage: fetchNextNotes,
  } = useInfiniteQuery({
    queryKey: ["files", dbUser?.id, debouncedSearch],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/file/get-files-for-user", {
        searchTerm: debouncedSearch,
        page: pageParam,
        userId: dbUser?.id,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    initialPageParam: 0,
    gcTime: 0,
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
  }, [inView, fetchNextNotes, dbFiles?.pages?.length]);

  // Delete the note
  const deleteFile = () => {
    setIsDisabled(true);
    axiosInstance
      ?.post("/file/delete-file", { fileId: noteId, userId: dbUser?.id })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["files", dbUser?.id, debouncedSearch],
        });
        setIsDisabled(false);
        toast("Deleted file.");
        setIsDeleteModalOpen(false);
      })
      .catch((err) => {
        toast.error("Could not delete file.");
        setIsDisabled(false);
        console.log(err);
      });
  };

  // Rename a file
  const renameFile = () => {
    setFileNameError(0);

    if (fileName == null || fileName == undefined || fileName.length <= 0) {
      setFileNameError(1);
      return;
    } else if (fileName?.length > 50) {
      setFileNameError(2);
      return;
    }

    setFileNameError(0);

    axiosInstance
      ?.post("/file/update-file-name", {
        fileId: noteId,
        userId: dbUser?.id,
        fileName: fileName,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["files", dbUser?.id, debouncedSearch],
        });
        setIsDisabled(false);
        toast("Renamed file.");
        setIsRenameModalOpen(false);
      })
      .catch((err) => {
        toast.error("Could not rename file.");
        setIsDisabled(false);
        console.log(err);
      });
  };

  return (
    <>
      {/* Delete File Modal */}
      <AlertModal
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        isOpen={isDeleteModalOpen}
      >
        <div className="flex flex-col gap-y-2">
          {/* Title */}
          <h1 className="dark:text-darkmodetext font-bold text-2xl">
            Are you sure you want to delete this file?
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
              onClick={deleteFile}
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

      {/* Upload File Modal */}
      <AlertModal
        onClose={() => {
          setIsUploadModalOpen(false);
        }}
        isOpen={isUploadModalOpen}
      >
        <div className="flex flex-col gap-y-2">
          {/* Title */}
          <h1 className="dark:text-darkmodetext font-bold text-2xl">
            Upload Files
          </h1>

          <input
            ref={fileRef}
            onChange={handleFileChange}
            type="file"
            className="hidden"
            multiple
            accept="application/pdf"
          />

          {/* Button to select an image */}
          <button
            disabled={isUploading}
            onClick={() => {
              if (fileRef?.current) fileRef.current.click();
            }}
            className="cursor-pointer hover:bg-hovercta dark:hover:bg-cta hover:border-hovercta hover:text-white dark:hover:border-cta border-darkbg/25 dark:border-white/25 border-1 flex  gap-x-2 py-2 justify-center items-center px-14 shadow rounded-lg font-medium active:shadow transition-all disabled:text-greyText"
          >
            Upload <IoCloudUploadOutline className="translate-y-0.5" />
          </button>

          {files &&
            files?.length > 0 &&
            files?.map((file) => {
              return <p>{file?.name}</p>;
            })}

          {/* Buttons */}
          <div className="mt-5 flex gap-x-5 justify-end">
            <PrimaryButton
              disabled={isDisabled}
              disabledText="Please Wait..."
              className="text-sm"
              onClick={() => {
                handleUpload();
                setIsUploadModalOpen(false);
              }}
              text="Upload"
            />
            <SecondaryButton
              disabled={isDisabled}
              disabledText="Please Wait..."
              className="text-sm text-black border-black hover:bg-black hover:border-black"
              onClick={() => setIsUploadModalOpen(false)}
              text="Cancel"
            />
          </div>
        </div>
      </AlertModal>

      {/* Rename File Modal */}
      <AlertModal
        onClose={() => {
          setIsRenameModalOpen(false);
        }}
        isOpen={isRenameModalOpen}
      >
        <div className="flex flex-col gap-y-2">
          {/* Title */}
          <h1 className="dark:text-darkmodetext font-bold text-2xl">
            Rename this file
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Give your file a new name to help you find it later.
          </p>

          <Input
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);

              if (
                e.target.value != null &&
                e.target.value != undefined &&
                e.target.value.length > 0 &&
                e.target.value?.length < 50
              ) {
                setFileNameError(0);
              }
            }}
            onBlur={(e) => {
              if (
                e.target.value == null ||
                e.target.value == undefined ||
                e.target.value.length <= 0
              ) {
                setFileNameError(1);
                return;
              } else if (e.target.value?.length > 50) {
                setFileNameError(2);
                return;
              }
            }}
            placeholder="Add Filename..."
          />

          {/* Error + Length */}
          <div className="flex w-full justify-between">
            <div>
              <ErrorStatement
                isOpen={fileNameError == 1}
                text={"Please enter filename."}
              />

              <ErrorStatement
                isOpen={fileNameError == 2}
                text={"Filename cannot exceed 50 characters."}
              />
            </div>
            <p
              className={`text-right mt-0.5 mr-0.5 ${
                fileName?.length > 50 && "text-red-500"
              }`}
            >
              {fileName?.length}/50
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex gap-x-5 justify-end">
            <PrimaryButton
              disabled={isDisabled}
              disabledText="Please Wait..."
              className="text-sm"
              onClick={renameFile}
              text="Rename"
            />
            <SecondaryButton
              disabled={isDisabled}
              disabledText="Please Wait..."
              className="text-sm text-black border-black hover:bg-black hover:border-black"
              onClick={() => setIsRenameModalOpen(false)}
              text="Cancel"
            />
          </div>
        </div>
      </AlertModal>

      <div className="min-h-[70vh] dark:bg-darkbg dark:text-darkmodetext md:min-h-[65vh] lg:min-h-[60vh] px-8 lg:px-10 py-10">
        <div>
          <div className="flex justify-between gap-x-4 items-center">
            {/* Title */}
            <h1 className="text-hovercta font-title dark:text-darkmodeCTA text-4xl md:text-5xl font-semibold">
              Files
            </h1>

            {/* Upload a new file */}
            <SecondaryButton
              className="border-transparent dark:hover:!text-cta dark:disabled:hover:!text-gray-400 shadow-md"
              disabled={isUploading}
              text={
                <div className="flex gap-x-2 items-center">
                  <IoMdAddCircleOutline className="text-2xl" />
                  <span className="text-nowrap">Upload File</span>
                </div>
              }
              onClick={() => {
                setIsUploadModalOpen(true);
              }}
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
          {dbFiles && dbFiles?.pages?.[0]?.data?.files.length > 0 && (
            <div className="py-10 lg:px-5 flex justify-center flex-wrap gap-8">
              {dbFiles &&
                dbFiles?.pages?.map((page) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  return page?.data.files?.map((file: any) => {
                    if (file?.fileName) {
                      return (
                        <div
                          key={file?.assetId}
                          className=" bg-white relative overflow-hidden shadow-xl max-w-2xs w-full rounded-xl flex flex-col dark:bg-white/5  px-5 py-5 transition-all cursor-pointer"
                          onClick={() => navigate(`/files/${file?.assetId}`)}
                        >
                          <div className="flex pt-5 pb-10 justify-center items-center">
                            <BsFileEarmarkPdfFill className="text-6xl text-red-700" />
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="absolute top-4 right-4 "
                          >
                            <Popover>
                              <PopoverTrigger className="flex items-center cursor-pointer">
                                <BsThreeDotsVertical className="text-2xl" />
                              </PopoverTrigger>

                              <PopoverContent className="dark:bg-darkgrey dark:border-2 w-auto mt-2 mr-4 py-0 px-1">
                                <div className="py-1 min-w-32 flex flex-col gap-y-1">
                                  <PopoverClose>
                                    <button
                                      onClick={() => {
                                        setNoteId(file?.assetId);
                                        setIsDeleteModalOpen(true);
                                      }}
                                      className="cursor-pointer w-full flex items-center gap-x-3 justify-center hover:text-red-500 dark:hover:text-red-400 hover:bg-grey/50 dark:hover:bg-grey/5 py-1.5 transition-all"
                                    >
                                      <FaTrash />
                                      <span className="-translate-x-1">
                                        Delete
                                      </span>
                                    </button>
                                  </PopoverClose>
                                  <PopoverClose>
                                    <button
                                      onClick={() => {
                                        setNoteId(file?.assetId);
                                        setFileName(file?.fileName);
                                        setIsRenameModalOpen(true);
                                      }}
                                      className="cursor-pointer hover:text-cta dark:hover:text-darkmodeCTA w-full flex items-center gap-x-2 justify-center hover:bg-grey/50 dark:hover:bg-grey/5 py-1.5 transition-all"
                                    >
                                      <FaEye />
                                      Rename
                                    </button>
                                  </PopoverClose>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="flex-1">
                            <p className="text-xl mb-4 mr-6 line-clamp-1 font-semibold">
                              {file?.fileName}
                            </p>
                            <p className="text-md text-justify line-clamp-1 dark:text-white/80 text-darkbg/70">
                              Uploaded on{" "}
                              {dayjs(new Date(file?.createdAt)).format(
                                "MMM DD, YYYY"
                              )}
                              .
                            </p>
                          </div>
                        </div>
                      );
                    }
                  });
                })}
            </div>
          )}

          {/* Files Loader */}
          {loadingFiles && (
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
          {dbFiles && dbFiles?.pages?.[0]?.data?.files.length == 0 && (
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

export default Files;

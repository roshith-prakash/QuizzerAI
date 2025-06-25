import "@/utils/pdfWorker";
import { TiArrowSortedUp } from "react-icons/ti";
import { Document, Page } from "react-pdf";
import { useEffect, useState } from "react";
import {
  ErrorStatement,
  Input,
  PrimaryButton,
  SecondaryButton,
} from "@/components";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axios";
import { useDBUser } from "@/context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import AlertModal from "@/components/reuseit/AlertModal";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PopoverClose } from "@radix-ui/react-popover";
import { FaEye, FaTrash } from "react-icons/fa6";

// LOADING STATE + ERROR STATE REMAINING
// UI NEEDS TO BE REWORKED

function File() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPage, setInputPage] = useState("");

  const [fileName, setFileName] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);

  const { fileId } = useParams();
  const { dbUser } = useDBUser();

  const [fileNameError, setFileNameError] = useState<number>(0);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["file", fileId],
    queryFn: () => {
      return axiosInstance.post("/file/get-file-by-id", {
        fileId,
        userId: dbUser?.id,
      });
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 60 * 1000 * 10,
    enabled: !!fileId,
  });

  // Set Title
  useEffect(() => {
    if (data?.data?.file) {
      setFileName(data?.data?.file?.fileName);
    }
  }, [data?.data]);

  console.log(isLoading, error);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function nextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  }

  function prevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputPage(e.target.value);
  }

  function handlePageJump() {
    const targetPage = parseInt(inputPage);
    if (
      !isNaN(targetPage) &&
      targetPage >= 1 &&
      targetPage <= (numPages || 1)
    ) {
      setPageNumber(targetPage);
    }
    setInputPage("");
  }

  // Delete the note
  const deleteFile = () => {
    setIsDisabled(true);
    axiosInstance
      ?.post("/file/delete-file", {
        fileId: data?.data?.file?.assetId,
        userId: dbUser?.id,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["file", fileId],
        });
        queryClient.invalidateQueries({
          queryKey: ["files", dbUser?.id],
        });

        navigate("/files");
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
        fileId: data?.data?.file?.assetId,
        userId: dbUser?.id,
        fileName: fileName,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["file", fileId],
        });
        queryClient.invalidateQueries({
          queryKey: ["files", dbUser?.id],
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
    <div className="min-h-screen mb-10">
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

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Give your file a new name to help you find it later.
          </p>

          {/* Subtitle */}
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

      {data?.data && (
        <div className="max-w-3xl mx-auto flex flex-col">
          <div className="relative w-full mb-10 md:max-w-5xl mx-auto mt-10 px-4 py-6 bg-white dark:bg-white/5 rounded-xl shadow-sm">
            <p className="text-3xl pr-12 font-semibold">
              {data?.data?.file?.fileName}
            </p>
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
                        onClick={() => setIsRenameModalOpen(true)}
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
          </div>
          <Document
            // file="https://res.cloudinary.com/dvwdsxirc/image/upload/v1745254564/psych_iyhhu1.pdf"
            file={data?.data?.file?.fileURL}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <div className="pointer-events-none">
              <Page pageNumber={pageNumber} width={600} />
            </div>
          </Document>
          <div className="flex justify-between items-center py-4 px-4 text-xl">
            <button
              className="cursor-pointer flex items-center gap-x-1"
              onClick={prevPage}
              disabled={pageNumber <= 1}
            >
              <TiArrowSortedUp className="rotate-[270deg]" />
              Prev
            </button>

            <div className="flex gap-x-2 items-center">
              <input
                type="number"
                min="1"
                max={numPages || 1}
                value={inputPage}
                onChange={handleInputChange}
                placeholder="Go to page"
                className="w-28 px-2 py-1 border border-gray-300 rounded text-base"
              />
              <PrimaryButton
                onClick={handlePageJump}
                text="Go"
                className="text-lg py-0.5"
              ></PrimaryButton>
            </div>

            <button
              className="cursor-pointer flex items-center gap-x-1"
              onClick={nextPage}
              disabled={pageNumber >= (numPages || 1)}
            >
              Next
              <TiArrowSortedUp className="rotate-90" />
            </button>
          </div>
          <p className="text-center text-xl">
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
    </div>
  );
}

export default File;

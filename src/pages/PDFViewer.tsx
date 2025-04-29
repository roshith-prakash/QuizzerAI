import "@/utils/pdfWorker";
import { TiArrowSortedUp } from "react-icons/ti";
import { Document, Page } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { PrimaryButton } from "@/components";

function MyPDFViewer() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPage, setInputPage] = useState("");

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

  return (
    <div className="min-h-screen mb-10">
      <div className="max-w-3xl mx-auto flex flex-col">
        <Document
          file="https://res.cloudinary.com/dvwdsxirc/image/upload/v1745254564/psych_iyhhu1.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={600} />
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
    </div>
  );
}

export default MyPDFViewer;

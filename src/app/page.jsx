"use client";

import { useState, useRef, useEffect } from "react";

import { FiGithub, FiCopy } from "react-icons/fi";
import LoadingOverlay from "./components/LoadingOverlay";
import FeedbackForm from "./components/FeedbackForm";
import { toast } from "react-hot-toast";

export default function Home() {
  const [inputRequest, setInputRequest] = useState("");
  const [responseStream, setResponseStream] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const controllerRef = useRef(null);
  const textAreaRef = useRef(null);

  const resizeTextArea = () => {
    if (!textAreaRef.current) {
      return;
    }

    textAreaRef.current.style.height = "auto"; // will not work without this!
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    resizeTextArea();
    window.addEventListener("resize", resizeTextArea);
  }, []);

  const handleInputRequestChange = (e) => {
    setInputRequest(e.target.value);
    resizeTextArea();
  };

  const handleOpenFeedbackForm = (e) => {
    setIsFeedbackFormOpen(!isFeedbackFormOpen);
  };

  const handleCloseFeedbackForm = () => {
    setIsFeedbackFormOpen(false);
  };

  const handleReset = () => {
    setInputRequest("");
    setResponseStream("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseStream("");

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputRequest,
        }),

        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data", response.statusText);
      }

      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder("utf-8");

      const handleStream = async () => {
        let done = false;
        setIsStreaming(true);

        try {
          while (!done) {
            const { value, done: doneReading } = await reader.read();

            done = doneReading;
            const chunkValue = decoder.decode(value);

            setResponseStream((prev) => prev + chunkValue);
          }
        } catch (e) {
          console.log("Break");
        } finally {
          setIsStreaming(false);
        }
      };

      handleStream();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopStreaming = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    setIsStreaming(false);
  };

  const handleCopy = () => {
    console.log("Writing");
    if (responseStream != "") {
      navigator.clipboard.writeText(responseStream);
      toast.success("Response Copied!");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center w-full">
      <div className="border rounded border-white/0 xl:w-full max-w-full xl:px-96 px-8 xl:py-28 py-10">
        <h1 className="text-center text-2xl md:text-3xl font-bold bg-clip-text">
          Give me a ChatGPT prompt to:
        </h1>

        <form className="mt-6 flex flex-col gap-4 w-[100%] mx-auto">
          {/* INPUT FIELD */}
          <div>
            <textarea
              id="inputRequest"
              value={inputRequest}
              rows="1"
              className="overflow-hidden resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="What do you need ChatGPT to do?"
              onChange={handleInputRequestChange}
              required={true}
              ref={textAreaRef}
            ></textarea>
          </div>

          <div className="mx-auto mt-4">
            {isStreaming ? (
              <button
                type="button"
                className="resetBtn"
                onClick={handleStopStreaming}
              >
                Cancel
              </button>
            ) : (
              <button type="button" className="genBtn" onClick={handleSubmit}>
                Generate
              </button>
            )}
          </div>
        </form>

        <LoadingOverlay isLoading={isLoading} />

        {/* Output FIELD */}
        <div className="mt-8 relative w-[100%] mx-auto">
          <textarea
            id="response"
            value={responseStream}
            rows="15"
            className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            readOnly={true}
          ></textarea>
          <FiCopy
            size={16}
            className="absolute cursor-pointer"
            onClick={handleCopy}
          />
        </div>

        <div className="mx-auto mt-4 text-center">
          <button onClick={handleOpenFeedbackForm} className="feedbackBtn">
            Feedback
          </button>

          <button onClick={handleReset} className="resetBtn">
            Reset
          </button>
        </div>

        {isFeedbackFormOpen && (
          <FeedbackForm
            onClose={handleCloseFeedbackForm}
            inputRequest={inputRequest}
            outputResponse={responseStream}
          />
        )}
      </div>
      <a
        className="bottom-full flex items-center gap-2 pb-2 font-mono text-sm text-neutral-950 transition hover:text-blue-800 sm:m-0"
        href="https://github.com/PhamVuThuNguyet"
        target="_blank"
      >
        <FiGithub size={16} />
        Built with Next.js / Tailwind / OpenAI
      </a>
    </div>
  );
}

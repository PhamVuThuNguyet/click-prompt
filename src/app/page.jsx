"use client";

import { useState } from "react";

import { FiGithub } from "react-icons/fi";

export default function Home() {
  const [inputRequest, setInputRequest] = useState("");
  const [responseStream, setResponseStream] = useState("");

  const handleInputRequestChange = (e) => {
    setInputRequest(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputRequest,
        }),
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

      let done = false;

      const processStream = async () => {
        while (!done) {
          const { value, done: doneReading } = await reader.read();

          done = doneReading;
          const chunkValue = decoder.decode(value);
          console.log(chunkValue);

          setResponseStream((prev) => prev + chunkValue);
        }
      };

      processStream();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center w-full">
      <div className="border rounded border-white/0 w-full px-96">
        <h1 className="text-center text-2xl md:text-3xl font-bold bg-clip-text">
          Give me a ChatGPT prompt to:
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 w-[100%] mx-auto"
        >
          {/* INPUT FIELD */}
          <div>
            <textarea
              id="inputRequest"
              value={inputRequest}
              rows="1"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="What do you need ChatGPT to do?"
              onChange={handleInputRequestChange}
              required={true}
            ></textarea>
          </div>

          <div className="mx-auto mt-4">
            <button type="submit" className="gen-btn">
              Generate
            </button>
          </div>
        </form>

        {/* Output FIELD */}
        <div className="mt-8 flex flex-col gap-4 w-[100%] mx-auto">
          <textarea
            id="response"
            value={responseStream}
            rows="15"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            readOnly={true}
          ></textarea>
        </div>
      </div>

      <a
        className="fixed bottom-0 flex items-center gap-2 pb-2 font-mono text-sm text-neutral-950 transition hover:text-blue-800 sm:m-0"
        href="https://github.com/PhamVuThuNguyet"
        target="_blank"
      >
        <FiGithub size={16} />
        Built with Next.js / Tailwind / OpenAI
      </a>
    </div>
  );
}

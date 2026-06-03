"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function generatePrompt() {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setPrompt(data.prompt || "No prompt generated.");
    } catch (error) {
      console.error(error);
      setPrompt("Error generating prompt.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 mt-8">

        {/* Header */}
        <div className="text-center">

          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Image To Prompt Generator
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Upload any image and generate a universal prompt that can be used in
            Flux, Midjourney, SDXL, GPT Image and other AI image generation models.
          </p>

          <div className="flex justify-end w-full mt-2">
  <p className="text-sm text-gray-500 italic font-medium">
    Designed by Sachin Adi
  </p>
</div>

        </div>

        {/* Upload Section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files?.[0];

              if (selected) {
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }
            }}
            className="
              w-full
              md:w-auto
              border
              border-gray-300
              rounded-xl
              p-3
              text-gray-700
              bg-white
            "
          />

          <button
            onClick={generatePrompt}
            disabled={loading}
            className="
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              text-white
              px-8
              py-3
              rounded-xl
              font-semibold
              shadow-lg
              hover:scale-105
              transition
              duration-300
            "
          >
            {loading ? "Generating..." : "Generate Prompt"}
          </button>

        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mt-10">

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Uploaded Image
            </h2>

            <div className="flex justify-left">
  <div className="bg-slate-100 p-3 rounded-xl ">
    <img
      src={preview}
      alt="Preview"
      className="
        max-w-[300px]
        max-h-[200px]
        w-auto
        h-auto
        rounded-lg
        object-contain
      "
    />
  </div>
</div>

          </div>
        )}

        {/* Prompt Output */}
        {prompt && (
          <div className="mt-10">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

              <h2 className="text-xl font-bold text-gray-800">
                Generated Prompt
              </h2>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(prompt)
                }
                className="
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-5
                  py-2
                  rounded-lg
                  font-medium
                "
              >
                Copy Prompt
              </button>

            </div>

            <textarea
              value={prompt}
              readOnly
              className="
                w-full
                h-[400px]
                p-4
                border
                border-gray-300
                rounded-xl
                bg-slate-50
                text-gray-800
                resize-none
                leading-7
              "
            />

          </div>
        )}

      </div>
    </main>
  );
}
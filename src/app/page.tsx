"use client";
import { useState } from "react";
import { ArrowRight, Code2, Loader2 } from "lucide-react";

const languages = [
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "javascript", name: "JavaScript" },
];

export default function CodeGenerator() {
  const [activeTab, setActiveTab] = useState<"code" | "summary">("code");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [errorSummary, setErrorSummary] = useState("");

  const generateCode = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate code");
      }
      setCode(data.content);
    } catch (error: unknown) {
      console.error("Error generating code:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const summariseText = async () => {
    if (!text.trim()) return;

    try {
      setLoadingSummary(true);
      setErrorSummary("");
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to summarise text");
      }
      setSummary(data.summary);
    } catch (error: unknown) {
      console.error("Error summarising text:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex font-bold justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">LangSynth</h1>
            </div>
            <div className="font-bold flex space-x-4">
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-2 font-bold rounded-md text-lg font-medium ${
                  activeTab === "code"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Akash Code
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-2 font-bold rounded-md text-lg font-medium ${
                  activeTab === "summary"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Summarization
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10 px-6 sm:px-8 lg:px-12">
        {activeTab === "code" ? (
          <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-8 px-6 text-center">
              <h1 className="text-4xl font-extrabold text-white">Akash Code</h1>
              <p className="mt-2 text-lg text-indigo-200">
                Effortlessly generate code snippets in your favorite language.
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label
                  htmlFor="language"
                  className="block font-bold text-sm font-medium text-gray-700"
                >
                  Select Programming Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-black mt-2 block w-full rounded-lg border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="prompt"
                  className="font-bold block text-sm font-medium text-gray-700"
                >
                  Describe Your Code
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Write a function to reverse a string"
                  className="text-black mt-2 block w-full rounded-lg border-gray-300 bg-gray-50 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={generateCode}
                  disabled={loading || !prompt.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white text-sm font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Code
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              {code && (
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Generated Code
                    </h3>
                    <Code2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <pre className="overflow-x-auto bg-gray-800 text-gray-100 p-4 rounded-lg">
                    <code>{code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 py-8 px-6 text-center">
              <h1 className="text-4xl font-extrabold text-white">
                Akash Summariser
              </h1>
              <p className="mt-2 text-lg text-green-200">
                Provide a text to get a concise summary.
              </p>
            </div>
            <div className="p-8 space-y-6">
              <textarea
                id="text"
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to summarise"
                className="text-black mt-2 block w-full rounded-lg border-gray-300"
              />
              <button
                onClick={summariseText}
                disabled={loadingSummary || !text.trim()}
                className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg"
              >
                {loadingSummary ? "Summarising..." : "Summarise Text"}
              </button>
              {summary && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Summary
                  </h3>
                  <pre className="bg-gray-100 text-black p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {summary}
                  </pre>
                </div>
              )}
              {errorSummary && <p className="text-red-600">{errorSummary}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

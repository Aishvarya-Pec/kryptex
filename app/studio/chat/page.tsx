"use client";
import React, { useState } from "react";
import ScenePlayer from "@/src/components/ScenePlayer";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatStudioPage(): JSX.Element {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [scene, setScene] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportHref, setExportHref] = useState<string | null>(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/scene-from-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: `Error: ${data?.error?.message ?? res.statusText}` }]);
      } else {
        setScene(data);
        setMessages((m) => [...m, { role: "assistant", content: "Scene created. Preview updated below." }]);
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Error: ${String(err?.message ?? err)}` }]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const exportScene = async () => {
    if (!scene) return;
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: `Export error: ${data?.error?.message ?? res.statusText}` }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: "Exported preview route. Open the link to view." }]);
        setExportHref("/preview-generated");
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Export error: ${String(err?.message ?? err)}` }]);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Prompt → Landing Page</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            onClick={exportScene}
            disabled={!scene || exporting}
          >
            {exporting ? "Exporting…" : "Export & Create Route"}
          </button>
          {exportHref && (
            <a className="px-3 py-2 rounded bg-slate-700" href={exportHref}>
              Open Exported Preview
            </a>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-3">
          <div className="rounded border border-white/10 p-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your site (e.g., neon portfolio with orbit menu and product gallery)"
              className="w-full h-28 bg-black/30 border border-white/10 rounded p-2"
            />
            <button
              className="mt-2 w-full px-3 py-2 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
              onClick={sendPrompt}
              disabled={loading}
            >
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>

          <div className="rounded border border-white/10 p-3 h-[40vh] overflow-auto space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-white" : "text-slate-300"}>
                <span className="font-semibold mr-2">{m.role === "user" ? "You" : "Assistant"}:</span>
                {m.content}
              </div>
            ))}
            {messages.length === 0 && <div className="text-slate-400">Type a prompt and press Generate.</div>}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="h-[70vh] rounded overflow-hidden border border-white/10">
            {scene ? (
              <ScenePlayer scene={scene} />
            ) : (
              <div className="w-full h-full grid place-items-center text-slate-400">No scene yet — generate to preview.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
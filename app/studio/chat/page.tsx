"use client";
import React, { useState, useEffect } from "react";
import ScenePlayer from "@/src/components/ScenePlayer";

type Message = { role: "user" | "assistant"; content: string };

function PropertiesPanel({ scene, setScene }: { scene: any; setScene: React.Dispatch<React.SetStateAction<any>> }) {
  if (!scene) return null;

  const handlePropertyChange = (index: number, path: string, value: string) => {
    const newScene = JSON.parse(JSON.stringify(scene)); // Deep copy
    let current = newScene.objects[index];
    const keys = path.split(".");
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    const finalKey = keys[keys.length - 1];
    const isNumeric = ["x", "y", "z"].includes(finalKey);
    current[finalKey] = isNumeric ? parseFloat(value) : value;
    setScene(newScene);
  };

  return (
    <div className="rounded border border-white/10 p-3 h-full overflow-auto space-y-4">
      <h2 className="font-semibold">Properties</h2>
      {scene.objects.map((obj: any, index: number) => (
        <div key={obj.id} className="space-y-2 border-t border-white/10 pt-2">
          <p className="font-medium">
            {obj.id} ({obj.type})
          </p>
          <div>
            <label>Color: </label>
            <input
              type="color"
              value={obj.material?.color ?? "#ffffff"}
              onChange={(e) => handlePropertyChange(index, "material.color", e.target.value)}
              className="bg-black/30 border border-white/10 rounded p-1"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="w-4">X:</label>
            <input
              type="number"
              step="0.1"
              value={obj.transform?.position?.x ?? 0}
              onChange={(e) => handlePropertyChange(index, "transform.position.x", e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded p-1"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="w-4">Y:</label>
            <input
              type="number"
              step="0.1"
              value={obj.transform?.position?.y ?? 0}
              onChange={(e) => handlePropertyChange(index, "transform.position.y", e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded p-1"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="w-4">Z:</label>
            <input
              type="number"
              step="0.1"
              value={obj.transform?.position?.z ?? 0}
              onChange={(e) => handlePropertyChange(index, "transform.position.z", e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded p-1"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatStudioPage(): JSX.Element {
  const [prompt, setPrompt] = useState("");
  const [refinePrompt, setRefinePrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [scene, setScene] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  

  useEffect(() => {
    const handleSceneAction = (event: CustomEvent) => {
      const { action, payload } = (event as any).detail || {};
      alert(`Interaction Triggered!\nAction: ${action}\nPayload: ${JSON.stringify(payload)}`);
    };

    window.addEventListener('sceneAction', handleSceneAction as EventListener);
    return () => window.removeEventListener('sceneAction', handleSceneAction as EventListener);
  }, []);

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
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : { raw: await res.text() };
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: `Error: ${data?.error?.message ?? res.statusText}` }]);
      } else {
        if (contentType.includes("application/json")) {
          setScene(data);
        } else {
          setMessages((m) => [...m, { role: "assistant", content: "Error: Unexpected non-JSON response from generator" }]);
        }
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
      const res = await fetch("/api/export/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene }),
      });
      if (!res.ok) {
        throw new Error('Failed to generate ZIP file.');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "kryptex-export.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessages((m) => [...m, { role: "assistant", content: "Project ZIP file downloaded." }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Export error: ${String(err?.message ?? err)}` }]);
    } finally {
      setExporting(false);
    }
  };

  const sendRefinePrompt = async () => {
    if (!refinePrompt.trim() || !scene) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/refine-scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene, prompt: refinePrompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: `Refine Error: ${data?.error?.message ?? res.statusText}` }]);
      } else {
        setScene(data);
        setMessages((m) => [...m, { role: "assistant", content: `Scene refined: ${refinePrompt}` }]);
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Refine Error: ${String(err?.message ?? err)}` }]);
    } finally {
      setLoading(false);
      setRefinePrompt("");
    }
  };

  const refineScene = async () => {
    if (!scene || !refinePrompt.trim()) return;
    try {
      const res = await fetch("/api/ai/refine-scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene, prompt: refinePrompt }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : { raw: await res.text() };
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: `Refine error: ${data?.error ?? res.statusText}` }]);
      } else {
        if (contentType.includes("application/json")) {
          setScene(data);
          setMessages((m) => [...m, { role: "assistant", content: "Scene refined. Preview updated below." }]);
        } else {
          setMessages((m) => [...m, { role: "assistant", content: "Refine error: Unexpected non-JSON response" }]);
        }
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Refine error: ${String(err?.message ?? err)}` }]);
    } finally {
      setRefinePrompt("");
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
            {exporting ? "Zipping…" : "Export as ZIP"}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-3">
          <div className="rounded border border-white/10 p-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A chrome sphere rotating in the center, with a smaller blue cube orbiting it."
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
          <div className="rounded border border-white/10 p-3">
            <textarea
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              placeholder="Refine the scene... (e.g., 'make the first cube red')"
              className="w-full h-20 bg-black/30 border border-white/10 rounded p-2"
              disabled={!scene || loading}
            />
            <button
              className="mt-2 w-full px-3 py-2 rounded bg-teal-600 hover:bg-teal-500 disabled:opacity-50"
              onClick={sendRefinePrompt}
              disabled={!scene || loading}
            >
              {loading ? "Refining…" : "Refine"}
            </button>
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

        <div className="lg:col-span-1 h-[70vh]">
          <PropertiesPanel scene={scene} setScene={setScene} />
        </div>
      </section>
    </main>
  );
}
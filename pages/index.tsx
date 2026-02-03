import Head from "next/head";
import { useState } from "react";

type DownloadState = "idle" | "preparing" | "ready" | "error";

export default function Home() {
  const [state, setState] = useState<DownloadState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setError(null);
      setState("preparing");
      const response = await fetch("/api/pistol-pack");
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AgenticPistolMod.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setState("ready");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <>
      <Head>
        <title>Agentic Bedrock Pistol Mod</title>
        <meta
          name="description"
          content="Download a ready-to-import Minecraft Bedrock 1.19.81 pistol add-on."
        />
      </Head>
      <main className="container">
        <section className="hero">
          <h1>Minecraft Bedrock Pistol Mod</h1>
          <p>
            Drop a modern sidearm into your Bedrock world. This add-on targets
            Minecraft 1.19.81 and delivers a craftable pistol with custom
            behavior, textures, and balanced combat tuning.
          </p>
          <button
            className="download-button"
            type="button"
            onClick={handleDownload}
            disabled={state === "preparing"}
          >
            {state === "preparing" ? "Packaging…" : "Download Mod (.zip)"}
          </button>
          {state === "ready" && (
            <p className="status success">
              ✅ Zip ready! Import the behavior and resource packs into your
              world, enable experimental features, and start blasting.
            </p>
          )}
          {state === "error" && (
            <p className="status error">⚠️ {error ?? "Unable to create pack"}</p>
          )}
        </section>
        <section className="grid">
          <article>
            <h2>Bedrock Ready</h2>
            <p>
              Structured with matching resource and behavior packs, complete
              with manifests, localization strings, and crafting recipes tuned
              for 1.19.81.
            </p>
          </article>
          <article>
            <h2>Balanced Combat</h2>
            <p>
              Fires high-velocity rounds, consumes copper and gunpowder
              ammunition, and features lightweight recoil—all implemented with
              Bedrock components.
            </p>
          </article>
          <article>
            <h2>Instant Download</h2>
            <p>
              Generate a self-contained zip package ready for Minecraft&apos;s
              import workflow. No external tooling required.
            </p>
          </article>
        </section>
        <section className="instructions">
          <h2>Install &amp; Use</h2>
          <ol>
            <li>Download the zip and extract both packs.</li>
            <li>Import the resource and behavior packs into Minecraft.</li>
            <li>
              Create or edit a world, enable required experiments (holiday
              creator features, custom biomes, molang features).
            </li>
            <li>Activate both packs in resource &amp; behavior slots.</li>
            <li>
              Craft a pistol using iron ingots, redstone dust, and gunpowder or
              grant it via `/give @s agentic:pistol`.
            </li>
          </ol>
        </section>
      </main>
      <style jsx>{`
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }
        .hero {
          text-align: center;
        }
        h1 {
          font-size: clamp(2.5rem, 4vw, 3.25rem);
          margin-bottom: 1rem;
        }
        p {
          line-height: 1.6;
          color: #d5d7de;
        }
        .download-button {
          margin-top: 2rem;
          padding: 0.9rem 2.4rem;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #ff6b6b, #f06595);
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .download-button:hover:not([disabled]) {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .download-button[disabled] {
          opacity: 0.6;
          cursor: progress;
        }
        .status {
          margin-top: 1.4rem;
          font-weight: 500;
        }
        .status.success {
          color: #6ee7b7;
        }
        .status.error {
          color: #f87171;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
        }
        article {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 1.5rem;
          backdrop-filter: blur(8px);
        }
        article h2 {
          margin-top: 0;
          margin-bottom: 0.75rem;
        }
        .instructions {
          margin-top: 4rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 18px;
          padding: 2rem;
          border: 1px solid rgba(148, 163, 184, 0.15);
        }
        ol {
          margin: 1.5rem auto 0;
          max-width: 720px;
          text-align: left;
        }
        li + li {
          margin-top: 0.75rem;
        }
        @media (max-width: 600px) {
          .container {
            padding: 3rem 1rem;
          }
          .download-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

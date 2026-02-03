import type { NextApiRequest, NextApiResponse } from "next";
import { createModArchive } from "@/lib/createModArchive";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const archive = await createModArchive();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="AgenticPistolMod.zip"'
    );
    res.send(archive);
  } catch (error) {
    console.error("[pistol-pack] Failed to create archive", error);
    res
      .status(500)
      .json({ error: "Unable to generate pistol mod archive. Try again." });
  }
}

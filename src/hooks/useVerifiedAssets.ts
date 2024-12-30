import { getAllVerifiedFuelAssets, VerifiedAsset } from "@/lib/assets";
import { useState } from "react";
import { useAsync } from "react-use";

export const useVerifiedAssets = () => {
  const [verifiedAssets, setVerifiedAssets] = useState<VerifiedAsset[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useAsync(async () => {
    setStatus("loading");
    try {
      const assets = await getAllVerifiedFuelAssets();
      setVerifiedAssets(assets);
      setStatus("ready");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, []);

  return { verifiedAssets, status };
};

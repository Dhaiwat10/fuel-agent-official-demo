import { BN, WalletUnlocked } from "fuels";
import { useState, useCallback } from "react";
import { useVerifiedAssets } from "./useVerifiedAssets";
import { useAsync } from "react-use";

type AssetBalance = {
  assetId: string;
  symbol: string;
  balance: BN;
  decimals: number;
  icon: string;
};

export const useBalances = (wallet: WalletUnlocked | undefined) => {
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const { verifiedAssets } = useVerifiedAssets();

  const fetchBalances = useCallback(async () => {
    if (!wallet) return;

    setStatus("loading");

    const { balances } = await wallet.getBalances();

    const assetBalances: AssetBalance[] = [];
    for (const balance of balances) {
      const asset = verifiedAssets.find(
        (asset) => asset.assetId === balance.assetId
      );
      if (!asset) continue;
      assetBalances.push({
        assetId: balance.assetId,
        symbol: asset.symbol,
        balance: balance.amount,
        decimals: asset.decimals,
        icon: asset.icon,
      });
    }

    setBalances(assetBalances);
    setStatus("ready");
  }, [wallet, verifiedAssets]);

  useAsync(async () => {
    await fetchBalances();
  }, [fetchBalances]);

  return { balances, status, refetch: fetchBalances };
};

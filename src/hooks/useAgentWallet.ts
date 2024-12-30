import { Provider, Wallet, WalletUnlocked } from "fuels";
import { useState } from "react";
import { useAsync } from "react-use";
import { useBalances } from "./useBalances";

const LOCAL_STORAGE_KEY = "fuel-agent-wallet-pk";

const savePrivateKey = (privateKey: string) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, privateKey);
};

const getPrivateKey = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
};

export const useAgentWallet = () => {
  const [wallet, setWallet] = useState<WalletUnlocked>();
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const { balances, refetch: refetchBalances, status: balanceStatus } = useBalances(wallet);

  useAsync(async () => {
    const privateKey = getPrivateKey();

    let wallet: WalletUnlocked;
    let provider: Provider;

    if (privateKey) {
      provider = await Provider.create(
        "https://mainnet.fuel.network/v1/graphql"
      );
      wallet = Wallet.fromPrivateKey(privateKey, provider);
    } else {
      provider = await Provider.create(
        "https://mainnet.fuel.network/v1/graphql"
      );
      wallet = Wallet.generate({ provider });
      savePrivateKey(wallet.privateKey);
    }

    setWallet(wallet);
    setStatus("ready");
  }, []);

  return {
    wallet,
    status,
    balances,
    refetchBalances,
    balanceStatus
  };
};

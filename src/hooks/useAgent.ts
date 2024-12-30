import { useEffect, useState } from "react";
import { useAgentWallet } from "./useAgentWallet";
import { FuelAgent } from "fuel-agent-kit";

export const useAgent = (openAiApiKey?: string) => {
  const {
    wallet,
    status: walletStatus,
    balances,
    refetchBalances,
    balanceStatus,
  } = useAgentWallet();
  const [agentStatus, setAgentStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [agent, setAgent] = useState<FuelAgent | null>(null);

  useEffect(() => {
    if (!wallet || !openAiApiKey) return;
    setAgentStatus("loading");
    try {
      const agent = new FuelAgent({
        model: "gpt-4o-mini",
        walletPrivateKey: wallet.privateKey,
        openAiApiKey,
      });
      setAgent(agent);
      setAgentStatus("ready");
    } catch (error) {
      console.error(error);
      setAgentStatus("error");
    }
  }, [wallet, openAiApiKey]);

  return {
    wallet,
    walletStatus,
    agentStatus,
    agent,
    balances,
    refetchBalances,
    balanceStatus,
  };
};

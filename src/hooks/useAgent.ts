import { useEffect, useState } from "react";
import { useAgentWallet } from "./useAgentWallet";
import { FuelAgent } from "fuel-agent-kit";

export const useAgent = () => {
  const {
    wallet,
    status: walletStatus,
    balances,
    refetchBalances,
  } = useAgentWallet();
  const [agentStatus, setAgentStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [agent, setAgent] = useState<FuelAgent>();

  useEffect(() => {
    if (!wallet) return;
    setAgentStatus("loading");
    try {
      const agent = new FuelAgent({
        model: "gpt-4o-mini",
        walletPrivateKey: wallet.privateKey,
        openAiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });
      setAgent(agent);
      setAgentStatus("ready");
    } catch (error) {
      console.error(error);
      setAgentStatus("error");
    }
  }, [wallet]);

  return {
    wallet,
    walletStatus,
    agentStatus,
    agent,
    balances,
    refetchBalances,
  };
};

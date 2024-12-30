/* eslint-disable @next/next/no-img-element */
"use client";

import { Copy, Download, ExternalLink, RefreshCcw, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgent } from "@/hooks/useAgent";
import { toast } from "@/hooks/use-toast";

export function AgentWallet({ onChangeApiKey }: { onChangeApiKey: () => void }) {
  const {
    wallet,
    walletStatus,
    balances: assets,
    refetchBalances,
    balanceStatus
  } = useAgent();
  const address = wallet?.address.toB256();

  const exportPrivateKey = () => {
    if (!wallet) return;
    const privateKey = wallet.privateKey;
    navigator.clipboard.writeText(privateKey);
    toast({
      title: "Private key copied to clipboard",
    });
  };

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied to clipboard",
    });
  };

  return (
    <Card className="bg-[#111] border-[#222] text-white">
      <CardHeader className="border-b border-[#222]">
        <CardTitle className="text-lg font-medium text-[#00FF94]">
          Agent Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {walletStatus === "loading" ? (
          <>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Address</div>
              <Skeleton className="h-9 w-full bg-[#222]" />
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-400">Balances</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24 bg-[#222]" />
                  <Skeleton className="h-6 w-16 bg-[#222]" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24 bg-[#222]" />
                  <Skeleton className="h-6 w-16 bg-[#222]" />
                </div>
              </div>
            </div>

            <Skeleton className="h-10 w-full bg-[#222]" />
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Address</div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://app.fuel.network/account/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#222] px-3 py-1 rounded text-sm flex-1 overflow-x-auto hover:bg-[#00FF94]/20 transition-colors flex items-center gap-2 group"
                >
                  <code className="flex-1">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </code>
                  <ExternalLink className="h-4 w-4 text-[#00FF94] opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyAddress}
                  className="hover:bg-[#222]"
                >
                  <Copy className="h-4 w-4 text-[#00FF94]" />
                  <span className="sr-only">Copy address</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-400">Balances</div>
              <div className="space-y-2">
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <div
                      key={asset.symbol}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={asset.icon}
                          alt={asset.symbol}
                          className="h-4 w-4"
                        />
                        <span>{asset.symbol}</span>
                      </div>
                      <div className="text-[#00FF94] font-medium">
                        {balanceStatus === "loading" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          asset.balance.format({
                            units: asset.decimals,
                            precision: 5,
                          })
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-white py-1">
                    No balance. Start by adding some funds to this wallet.
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => {
                refetchBalances();
                toast({
                  title: "Balances refreshed",
                });
              }}
              variant="outline"
              className="w-full border-[#333] bg-[#222] hover:bg-[#333] text-[#00FF94] hover:text-[#00FF94]/80"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Balances
            </Button>

            <Button
              onClick={onChangeApiKey}
              variant="outline"
              className="w-full border-[#333] bg-[#222] hover:bg-[#333] text-[#00FF94] hover:text-[#00FF94]/80"
            >
              <Key className="h-4 w-4 mr-2" />
              Change API Key
            </Button>

            <Button
              onClick={exportPrivateKey}
              variant="outline"
              className="w-full border-[#333] bg-[#222] hover:bg-[#333] text-[#00FF94] hover:text-[#00FF94]/80"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Private Key
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAgent } from "@/hooks/useAgent";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { toast } from "@/hooks/use-toast";
import Markdown from "react-markdown";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string | React.ReactNode;
}

interface ChatInterfaceProps {
  showApiKeyDialog: boolean;
  onApiKeyDialogClose: () => void;
}

export default function ChatInterface({
  showApiKeyDialog,
  onApiKeyDialogClose,
}: ChatInterfaceProps) {
  const [openAiApiKey, setOpenAiApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("openai-api-key") || "";
    }
    return "";
  });
  const { agent, agentStatus, refetchBalances } = useAgent(openAiApiKey);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (agentStatus === "ready" && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hi, I'm an AI agent on Fuel. I can help you interact with Fuel Ignition.
          \nHere are some things I can do:
          \n- Transfer assets
          \n- Check Balances
          \n- Swap assets on Mira
          \n- Add liquidity on Mira
          \n- Supply collateral and Lend assets on Swaylend`,
        },
      ]);
    }
  }, [agentStatus, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    if (!agent) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const { output } = await agent.execute(input);

      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: output }]);
    } catch (err) {
      console.error(err);
      toast({
        title: "Request failed",
        description:
          "Please make sure your API key is correct, and that you have not run out of tokens.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      await refetchBalances();
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }

    // Auto-focus input after response, if not focused elsewhere
    if (
      !isLoading &&
      inputRef.current &&
      document.activeElement !== inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  const handleApiKeySubmit = (apiKey: string) => {
    setOpenAiApiKey(apiKey);
    localStorage.setItem("openai-api-key", apiKey);
    onApiKeyDialogClose();
  };

  return (
    <div className="h-[calc(100vh-35rem)] bg-black text-white flex flex-col">
      <ApiKeyDialog
        open={showApiKeyDialog}
        onSubmit={handleApiKeySubmit}
        onDelete={() => setOpenAiApiKey("")}
        defaultValue={openAiApiKey}
      />
      <Card className="flex-grow max-w-2xl mx-auto w-full bg-[#111] border-[#222] text-white flex flex-col">
        <CardHeader className="border-b border-[#222]">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#00FF94] to-[#00FF94]/70 inline-block text-transparent bg-clip-text">
            Fuel AI Agent
          </CardTitle>
          <CardDescription>
            Powered by the{" "}
            <Link
              href="https://github.com/fuellabs/fuel-agent-kit"
              className="transition-colors duration-300 underline decoration-dashed underline-offset-4"
              target="_blank"
            >
              Fuel Agent Kit
            </Link>
            . This project is completely{" "}
            <Link
              href="https://github.com/dhaiwat10/fuel-agent-official-demo"
              className="transition-colors duration-300 underline decoration-dashed underline-offset-4"
              target="_blank"
            >
              open source
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex-grow overflow-hidden">
          <ScrollArea className="max-h-[calc(100vh-25rem)]" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                      message.role === "user"
                        ? "bg-[#00FF94] text-black"
                        : "bg-[#222] text-white"
                    }`}
                  >
                    {typeof message.content === "string" ? (
                      <Markdown
                        className={`${
                          message.role === "assistant" && "prose prose-invert"
                        }`}
                      >
                        {message.content}
                      </Markdown>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {(isLoading || agentStatus === "loading") && (
                <div className="flex justify-start">
                  <div className="bg-[#222] text-white rounded-lg px-4 py-2 max-w-[80%] flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-[#00FF94] animate-spin" />
                    <span className="text-sm text-gray-400">
                      {agentStatus === "loading"
                        ? "Initializing agent..."
                        : "Processing..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t border-[#222] p-4">
          <form
            onSubmit={handleSubmit}
            className="flex w-full gap-2 items-center"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a command..."
              className="flex-1 bg-[#222] border-[#333] text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#00FF94]/20 focus-visible:ring-offset-0 py-6"
              disabled={
                isLoading ||
                agentStatus === "loading" ||
                !openAiApiKey ||
                !agent
              }
            />
            <Button
              type="submit"
              className="bg-[#00FF94] text-black hover:bg-[#00FF94]/90 disabled:opacity-50 py-6"
              disabled={isLoading || agentStatus === "loading" || !openAiApiKey}
              onClick={() => !openAiApiKey && onApiKeyDialogClose()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

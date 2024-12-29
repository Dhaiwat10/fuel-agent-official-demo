"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string | React.ReactNode;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        'Hello! I can help you send transactions on Fuel. Try commands like "send 5 USDC to 0x123..." or "show balance"',
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    const response = await fetch("/api/execute", {
      method: "POST",
      body: JSON.stringify({ command: input }),
    });
    const data = await response.json();

    // Simulate AI processing
    setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    setIsLoading(false);
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

  return (
    <div className="h-[calc(100vh-8rem)] md:h-auto bg-black text-white flex flex-col">
      <Card className="flex-grow max-w-2xl mx-auto w-full bg-[#111] border-[#222] text-white flex flex-col">
        <CardHeader className="border-b border-[#222]">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#00FF94] to-[#00FF94]/70 inline-block text-transparent bg-clip-text">
            Fuel AI Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-[#00FF94] text-black"
                        : "bg-[#222] text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#222] text-white rounded-lg px-4 py-2 max-w-[80%] flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-[#00FF94] animate-spin" />
                    <span className="text-sm text-gray-400">
                      Processing transaction...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t border-[#222] p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a command..."
              className="flex-1 bg-[#222] border-[#333] text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#00FF94]/20 focus-visible:ring-offset-0"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="bg-[#00FF94] text-black hover:bg-[#00FF94]/90 disabled:opacity-50"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

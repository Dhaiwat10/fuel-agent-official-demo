"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Key, Eye, EyeOff, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApiKeyDialogProps {
  open: boolean;
  onSubmit: (apiKey: string) => void;
  onDelete: () => void;
  defaultValue?: string;
}

export function ApiKeyDialog({
  open,
  onSubmit,
  onDelete,
  defaultValue = "",
}: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState(defaultValue);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({
      title: "API key copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "You must enter an OpenAI API key to use the AI agent.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = () => {
    localStorage.removeItem("openai-api-key");
    setApiKey("");
    onDelete();
    toast({
      title: "API key deleted",
      description: "Your OpenAI API key has been removed from storage.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal>
      <DialogContent className="bg-[#111] border-[#222] text-white">
        <DialogHeader>
          <DialogTitle>Enter OpenAI API Key</DialogTitle>
          <DialogDescription>
            Your API key is required to use the AI agent. The key is stored
            locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="apiKey"
                placeholder="sk-..."
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-[#222] border-[#333] text-white pr-20"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-[#333]"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4 text-[#00FF94]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#00FF94]" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-[#333]"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#00FF94]" />
                  ) : (
                    <Copy className="h-4 w-4 text-[#00FF94]" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2">
          <Button
            onClick={() => onSubmit(apiKey)}
            disabled={!apiKey}
            className="w-full bg-[#00FF94] text-black hover:bg-[#00FF94]/90"
          >
            <Key className="w-4 h-4 mr-2" />
            Save API Key
          </Button>
          {defaultValue && (
            <Button
              onClick={handleDeleteKey}
              variant="outline"
              className="w-full border-[#333] bg-[#222] hover:bg-[#333] text-red-500 hover:text-red-400"
            >
              Delete API Key
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

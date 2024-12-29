'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal')
    if (!hasSeenModal) {
      setIsOpen(true)
      localStorage.setItem('hasSeenWelcomeModal', 'true')
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-[#111] text-white border-[#222]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00FF94]">Welcome to Fuel AI Agent</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="text-gray-300 space-y-4">
            <p>
              This demo uses an agent wallet to allow the AI agent to autonomously execute transactions on your behalf.
            </p>
            <div>
              <p className="mb-2">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your agent wallet is created and stored in your browser</li>
                <li>Fund your wallet by sending crypto to the displayed address</li>
                <li>You can export your private key at any time to recover funds</li>
              </ul>
            </div>
            <p>
              The AI agent will use this wallet to interact with the Fuel network based on your commands.
            </p>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button 
            onClick={() => setIsOpen(false)}
            className="bg-[#00FF94] text-black hover:bg-[#00FF94]/90"
          >
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


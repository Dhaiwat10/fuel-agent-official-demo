'use client'

import { MessageSquare, Wallet } from 'lucide-react'

type Tab = 'chat' | 'wallet'

interface MobileTabsProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#222] md:hidden">
      <div className="flex justify-around">
        <button
          onClick={() => onTabChange('chat')}
          className={`flex-1 py-4 flex flex-col items-center ${
            activeTab === 'chat' ? 'text-[#00FF94]' : 'text-gray-400'
          }`}
        >
          <MessageSquare className="h-6 w-6 mb-1" />
          <span className="text-xs">Chat</span>
        </button>
        <button
          onClick={() => onTabChange('wallet')}
          className={`flex-1 py-4 flex flex-col items-center ${
            activeTab === 'wallet' ? 'text-[#00FF94]' : 'text-gray-400'
          }`}
        >
          <Wallet className="h-6 w-6 mb-1" />
          <span className="text-xs">Wallet</span>
        </button>
      </div>
    </div>
  )
}


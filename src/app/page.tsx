'use client'

import { useState } from 'react'
import ChatInterface from '@/app/chat-interface'
import { AgentWallet } from '@/components/agent-wallet'
import { WelcomeModal } from '@/components/welcome-modal'
import { CautionNotice } from '@/components/caution-notice'
import { MobileTabs } from '@/components/mobile-tabs'

export default function Page() {
  const [activeTab, setActiveTab] = useState<'chat' | 'wallet'>('chat')

  return (
    <div className="min-h-screen bg-black p-4 pb-20 md:pb-4">
      <WelcomeModal />
      <div className="max-w-6xl mx-auto space-y-4">
        <CautionNotice />
        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <div className={`${activeTab === 'chat' ? 'block' : 'hidden md:block'}`}>
            <ChatInterface />
          </div>
          <div className={`${activeTab === 'wallet' ? 'block' : 'hidden md:block'}`}>
            <div className="md:sticky md:top-4">
              <AgentWallet />
            </div>
          </div>
        </div>
      </div>
      <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}


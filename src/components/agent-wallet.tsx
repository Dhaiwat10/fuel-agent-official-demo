'use client'

import { useState } from 'react'
import { Copy, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Asset {
  symbol: string
  balance: string
  icon: string
}

export function AgentWallet() {
  const [address, setAddress] = useState('0x1234...5678') // TODO: Generate actual wallet
  const [assets, setAssets] = useState<Asset[]>([
    { symbol: 'ETH', balance: '0.05', icon: '⧫' },
    { symbol: 'USDC', balance: '100.00', icon: '$' },
    { symbol: 'USDT', balance: '50.00', icon: '$' },
    { symbol: 'FUEL', balance: '1000.00', icon: '⚡' },
  ])
  
  const exportPrivateKey = () => {
    // TODO: Implement private key export
    console.log('Exporting private key...')
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
  }

  return (
    <Card className="bg-[#111] border-[#222] text-white">
      <CardHeader className="border-b border-[#222]">
        <CardTitle className="text-lg font-medium text-[#00FF94]">
          Agent Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Address</div>
          <div className="flex items-center gap-2">
  <a
    href={`https://app.fuel.network/account/${address}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-[#222] px-3 py-1 rounded text-sm flex-1 overflow-x-auto hover:bg-[#00FF94]/20 transition-colors flex items-center gap-2 group"
  >
    <code className="flex-1">{address}</code>
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
            {assets.map((asset) => (
              <div key={asset.symbol} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{asset.icon}</span>
                  <span>{asset.symbol}</span>
                </div>
                <div className="text-[#00FF94] font-medium">{asset.balance}</div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={exportPrivateKey}
          variant="outline"
          className="w-full border-[#333] bg-[#222] hover:bg-[#333] text-[#00FF94]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Private Key
        </Button>
      </CardContent>
    </Card>
  )
}


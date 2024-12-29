import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CautionNotice() {
  return (
    <Alert variant="destructive" className="bg-yellow-900/20 border-yellow-600 text-yellow-100 mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Caution: Alpha Software</AlertTitle>
      <AlertDescription>
        The Fuel Agent Kit is currently in alpha. Only transfer funds to the agent wallet that you are comfortable potentially losing. Use at your own risk.
      </AlertDescription>
    </Alert>
  )
}


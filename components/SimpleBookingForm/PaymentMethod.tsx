"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building2, CreditCard } from "lucide-react"

interface PaymentMethodProps {
  paymentMethod: "cash" | "stripe"
  setPaymentMethod: (method: "cash" | "stripe") => void
}

export function PaymentMethod({ paymentMethod, setPaymentMethod }: PaymentMethodProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-bold text-card-foreground mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        Payment Method
      </h2>
      <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "cash" | "stripe")}>
        <div className="space-y-3">
          <label
            htmlFor="cash"
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              paymentMethod === "cash"
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value="cash" id="cash" />
            <Building2 className="w-5 h-5 text-primary" />
            <span className="font-medium text-card-foreground flex-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Pay at Spa
            </span>
          </label>
          <label
            htmlFor="stripe"
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              paymentMethod === "stripe"
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value="stripe" id="stripe" />
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="font-medium text-card-foreground flex-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Stripe Payment
            </span>
          </label>
        </div>
      </RadioGroup>
    </div>
  )
}

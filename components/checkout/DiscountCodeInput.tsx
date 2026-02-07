"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, X, Sparkles } from "lucide-react";
import { useRef } from "react";

interface DiscountCodeInputProps {
  couponCode: string;
  appliedDiscount: { code: string; amount: number; finalTotal: number } | null;
  isApplying: boolean;
  onCodeChange: (code: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

export function DiscountCodeInput({
  couponCode,
  appliedDiscount,
  isApplying,
  onCodeChange,
  onApply,
  onRemove,
}: DiscountCodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3
            className="text-lg font-semibold text-card-foreground"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Discount Code
          </h3>
        </div>
        {appliedDiscount ? (
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100 text-base">{appliedDiscount.code}</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You saved <span className="font-semibold">${appliedDiscount.amount.toLocaleString()}</span>
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove discount"
              onClick={onRemove}
              className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
              tabIndex={0}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <form
            className="flex gap-2"
            onSubmit={e => {
              e.preventDefault();
              if (!isApplying && couponCode.trim()) {
                onApply();
              }
            }}
            autoComplete="off"
          >
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Enter your discount/promo code"
                value={couponCode}
                maxLength={32}
                autoFocus={false}
                spellCheck={false}
                autoCorrect="off"
                inputMode="text"
                className="pr-10 text-sm ring-1 ring-transparent focus:ring-primary/70 focus:border-primary transition bg-background placeholder:text-muted-foreground rounded-lg"
                onChange={e => onCodeChange(e.target.value.trimStart())}
                onKeyDown={e => {
                  if (e.key === "Enter" && !isApplying && couponCode.trim()) {
                    e.preventDefault();
                    onApply();
                  }
                  if (e.key === "Escape") {
                    onCodeChange("");
                    // Optionally refocus input
                    inputRef.current?.focus();
                  }
                }}
                aria-label="Discount code"
                disabled={isApplying}
              />
            </div>
            <Button
              type="submit"
              variant="default"
              disabled={isApplying || !couponCode.trim()}
              className="shrink-0 h-10 px-6 font-semibold text-sm"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              aria-label="Apply discount code"
            >
              {isApplying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </form>
        )}
        {!appliedDiscount && (
          <p className="mt-3 text-xs text-muted-foreground">
            Only one code per order. Double-check your code before applying.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

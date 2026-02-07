"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, X, Sparkles } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from 'next-intl';
import { useSystemSettings } from "@/lib/swr/system-settings";
import { getCurrencySymbol, formatCurrency } from "@/lib/utils";

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
  const t = useTranslations('Checkout');
  const { currency } = useSystemSettings();
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
            {t('discountCode')}
          </h3>
        </div>
        {appliedDiscount ? (
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100 text-base">{appliedDiscount.code}</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('youSaved')} <span className="font-semibold">{formatCurrency(appliedDiscount.amount, currency)}</span>
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('removeDiscount')}
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
                placeholder={t('enterDiscountCode')}
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
                aria-label={t('discountCode')}
                disabled={isApplying}
              />
            </div>
            <Button
              type="submit"
              variant="default"
              disabled={isApplying || !couponCode.trim()}
              className="shrink-0 h-10 px-6 font-semibold text-sm"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              aria-label={t('applyDiscountCode')}
            >
              {isApplying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('apply')
              )}
            </Button>
          </form>
        )}
        {!appliedDiscount && (
          <p className="mt-3 text-xs text-muted-foreground">
            {t('discountCodeNote')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
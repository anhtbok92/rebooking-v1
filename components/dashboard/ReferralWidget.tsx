"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Gift, Users } from "lucide-react"
import { toast } from "sonner"

interface ReferralStats {
  referralCode: string
  totalPoints: number
  referralCount: number
  referrals: Array<{
    id: string
    email: string
    name: string
    createdAt: string
  }>
}

export function ReferralWidget() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchReferralStats()
  }, [])

  const fetchReferralStats = async () => {
    try {
      const response = await fetch("/api/referral/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // Silently fail - referral stats are not critical
      }
    } catch (error) {
      // Silently fail - referral stats are not critical
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = async () => {
    if (stats?.referralCode) {
      try {
        await navigator.clipboard.writeText(stats.referralCode)
        setCopied(true)
        toast.success("Referral code copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast.error("Failed to copy referral code")
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading referral data...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Referral Program
          </CardTitle>
          <CardDescription>Earn points by referring friends and family</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Referral Code Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-4 py-2 rounded font-mono text-lg font-bold text-purple-600">
                {stats?.referralCode}
              </code>
              <Button size="sm" variant="outline" onClick={copyReferralCode} className="gap-2 bg-transparent">
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this code with friends to earn 100 points per referral</p>
          </div>

          {/* Points Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Points</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalPoints || 0}</p>
              <p className="text-xs text-gray-500 mt-1">100 points = $1 discount</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Referrals</p>
              <p className="text-3xl font-bold text-green-600">{stats?.referralCount || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Active referrals</p>
            </div>
          </div>

          {/* Referrals List */}
          {stats && stats.referrals.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Your Referrals
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stats.referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{referral.name || "User"}</p>
                      <p className="text-sm text-gray-500">{referral.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-green-600 font-semibold">+100 pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!stats || stats.referrals.length === 0) && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No referrals yet</p>
              <p className="text-sm text-gray-500">Share your code to start earning points</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Points Redemption Section */}
      <Card>
        <CardHeader>
          <CardTitle>Redeem Points</CardTitle>
          <CardDescription>Convert your points into discounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-gray-700 mb-3">How it works:</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">1.</span>
                  <span>Earn 100 points per referral</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">2.</span>
                  <span>Redeem 100 points for $1 discount</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">3.</span>
                  <span>Apply discount to any booking</span>
                </li>
              </ul>
            </div>
            {stats && stats.totalPoints >= 100 && (
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Redeem {Math.floor(stats.totalPoints / 100)} × $1 Discount
              </Button>
            )}
            {stats && stats.totalPoints < 100 && (
              <Button disabled className="w-full">
                Need {100 - stats.totalPoints} more points
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { getEmailTemplate } from "../email-service"

export function getReferralWelcomeEmail(name: string, referralCode: string, referralLink: string) {
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Welcome to our Referral Program! Start earning rewards by sharing Luxury Nail Spa with your friends.</p>
		
		<div class="success-box">
			<p><strong>🎁 Your Referral Code</strong></p>
			<p style="font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 12px 0;">${referralCode}</p>
		</div>

		<div class="info-box">
			<strong>How it works:</strong>
			<p>• Share your referral code or link with friends</p>
			<p>• When they sign up and complete their first booking, you both earn rewards!</p>
			<p>• Earn points for every successful referral</p>
			<p>• Redeem points for discounts and exclusive services</p>
		</div>

		<div style="text-align: center; margin: 24px 0;">
			<p style="margin-bottom: 12px; color: #6b7280;">Your referral link:</p>
			<div style="background: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 12px;">
				${referralLink}
			</div>
		</div>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/profile" class="email-button">Manage Referrals</a>
		</div>

		<div class="info-box">
			<strong>💡 Pro Tips:</strong>
			<p>• Share on social media for maximum reach</p>
			<p>• Tell friends about your great experience</p>
			<p>• Track your referrals in your dashboard</p>
		</div>
	`
	return getEmailTemplate(content, "Welcome to Our Referral Program")
}

export function getReferralRewardEmail(name: string, referredByName: string, pointsEarned: number, totalPoints: number) {
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Congratulations! You've earned referral rewards!</p>
		
		<div class="success-box">
			<p><strong>🎉 Referral Successful!</strong></p>
			<p>${referredByName} signed up using your referral code and completed their first booking.</p>
		</div>

		<table class="details-table">
			<tr>
				<td>Points Earned</td>
				<td><strong>+${pointsEarned} points</strong></td>
			</tr>
			<tr>
				<td>Total Points</td>
				<td><strong>${totalPoints} points</strong></td>
			</tr>
		</table>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="email-button">View Your Rewards</a>
		</div>

		<div class="info-box">
			<strong>💝 What's Next?</strong>
			<p>• Continue sharing your referral code to earn more points</p>
			<p>• Redeem points for discounts on future bookings</p>
			<p>• Climb the loyalty tiers for even better rewards</p>
		</div>

		<p>Keep sharing and earning! Thank you for being a valued member of our community.</p>
	`
	return getEmailTemplate(content, "Referral Reward Earned")
}

export function getReferralSignupEmail(name: string, referrerName: string, referralCode: string) {
	const content = `
		<p>Hello <strong>${name}</strong>,</p>
		<p>Welcome to Luxury Nail Spa! You were referred by <strong>${referrerName}</strong>.</p>
		
		<div class="success-box">
			<p><strong>🎁 Special Welcome Bonus</strong></p>
			<p>Because you were referred, you'll receive special rewards when you complete your first booking!</p>
		</div>

		<div class="info-box">
			<strong>Referral Details:</strong>
			<p>Referred by: ${referrerName}</p>
			<p>Referral Code: ${referralCode}</p>
		</div>

		<div style="text-align: center;">
			<a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}" class="email-button">Book Your First Appointment</a>
		</div>

		<p>Complete your first booking to unlock your referral rewards and start earning loyalty points!</p>
	`
	return getEmailTemplate(content, "Welcome - You Were Referred")
}


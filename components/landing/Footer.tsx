"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { BookOpen, Mail, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
	return (
		<footer className="bg-muted/50 border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand Column */}
					<div className="space-y-4">
						<Logo />
						<p className="text-sm text-muted-foreground">
							The modern booking system for nail salons. Manage appointments, services, and customers with ease.
						</p>
						<div className="flex gap-3">
							<a
								href="#"
								className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
								aria-label="Facebook"
							>
								<Facebook className="w-4 h-4" />
							</a>
							<a
								href="#"
								className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
								aria-label="Instagram"
							>
								<Instagram className="w-4 h-4" />
							</a>
							<a
								href="#"
								className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
								aria-label="Twitter"
							>
								<Twitter className="w-4 h-4" />
							</a>
							<a
								href="#"
								className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin className="w-4 h-4" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="font-semibold text-card-foreground mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Home
								</Link>
							</li>
							<li>
								<Link href="/#booking" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Book Appointment
								</Link>
							</li>
							<li>
								<Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Features
								</Link>
							</li>
							<li>
								<Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Documentation
								</Link>
							</li>
							<li>
								<Link href="/signin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Sign In
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="font-semibold text-card-foreground mb-4">Support</h3>
						<ul className="space-y-2">
							<li>
								<a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Help Center
								</a>
							</li>
							<li>
								<a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Contact Us
								</a>
							</li>
							<li>
								<a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Privacy Policy
								</a>
							</li>
							<li>
								<a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									Terms of Service
								</a>
							</li>
							<li>
								<a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									FAQ
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="font-semibold text-card-foreground mb-4">Contact</h3>
						<ul className="space-y-3">
							<li className="flex items-start gap-3">
								<Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
								<a href="mailto:support@reebooking.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									support@reebooking.com
								</a>
							</li>
							<li className="flex items-start gap-3">
								<Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
								<a href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-primary transition-colors">
									+1 (234) 567-890
								</a>
							</li>
						</ul>
						<div className="mt-6">
							<Link href="/signup">
								<Button className="w-full">Get Started</Button>
							</Link>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-border mt-12 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-sm text-muted-foreground text-center md:text-left">
							© {new Date().getFullYear()} Reebooking. All rights reserved.
						</p>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<BookOpen className="w-4 h-4" />
							<span>Made with ❤️ for nail salons</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}


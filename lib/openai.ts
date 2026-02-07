import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateServiceRecommendations(bookingHistory: any[]) {
  try {
    const serviceNames = bookingHistory.map((b) => b.service.name).join(", ")
    const bookingFrequency = bookingHistory.length

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Based on a spa customer's booking history with these services: ${serviceNames} (${bookingFrequency} total bookings), provide 3 personalized service recommendations. For each recommendation, provide:
1. Service name (must be realistic spa service)
2. Reason why they'd like it (based on their history)
3. Suggested frequency (e.g., "Monthly", "Quarterly")

Format as JSON array with objects containing: service, reason, frequency`,
        },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (content) {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }
    return []
  } catch (error) {
    console.error("Failed to generate recommendations:", error)
    return []
  }
}

export async function generateBookingSummary(booking: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Create a brief, friendly summary for a booking confirmation:
Service: ${booking.service.name}
Date: ${new Date(booking.date).toLocaleDateString()}
Time: ${booking.time}
Price: $${booking.service.price}

Keep it under 50 words and make it warm and professional.`,
        },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (content) {
      return content
    }
    return ""
  } catch (error) {
    console.error("Failed to generate summary:", error)
    return ""
  }
}

export async function generateSmartAvailability(existingBookings: any[]) {
  try {
    const bookedTimes = existingBookings.map((b) => b.time).join(", ")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Given these already booked times: ${bookedTimes || "none"}, suggest the best available time slots for a spa appointment today. Consider:
1. Typical spa operating hours (9 AM - 6 PM)
2. Standard appointment duration (1-2 hours)
3. Lunch break (12-1 PM)

Return 3 recommended time slots as JSON array with format: ["HH:MM AM/PM", ...]`,
        },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (content) {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }
    return ["10:00 AM", "2:00 PM", "4:00 PM"]
  } catch (error) {
    console.error("Failed to generate availability:", error)
    return ["10:00 AM", "2:00 PM", "4:00 PM"]
  }
}

interface ReceiptData {
	bookingId: string
	date: string
	time: string
	customerName: string
	phone: string
	serviceName: string
	servicePrice: number
	paymentMethod: string
	status: string
}

export function generateReceiptHTML(data: ReceiptData): string {
	const receiptDate = new Date().toLocaleDateString()
	const bookingDate = new Date(data.date).toLocaleDateString()

	return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt - ${data.bookingId}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 40px;
            background: #f5f5f5;
          }
          .receipt {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e5e5;
          }
          .header h1 {
            font-size: 28px;
            color: #333;
            margin-bottom: 8px;
          }
          .header p {
            color: #666;
            font-size: 14px;
          }
          .receipt-info {
            margin-bottom: 30px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .info-label {
            color: #666;
            font-size: 14px;
          }
          .info-value {
            color: #333;
            font-weight: 600;
            font-size: 14px;
          }
          .service-section {
            margin: 30px 0;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 6px;
          }
          .service-title {
            font-size: 18px;
            color: #333;
            margin-bottom: 16px;
            font-weight: 600;
          }
          .service-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .service-name {
            font-size: 16px;
            color: #333;
          }
          .service-price {
            font-size: 24px;
            font-weight: 700;
            color: #333;
          }
          .total-section {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e5e5;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
          }
          .total-label {
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }
          .total-amount {
            font-size: 28px;
            font-weight: 700;
            color: #333;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-confirmed {
            background: #dcfce7;
            color: #166534;
          }
          .status-completed {
            background: #dbeafe;
            color: #1e40af;
          }
          .status-pending {
            background: #fef3c7;
            color: #92400e;
          }
          .status-cancelled {
            background: #fee2e2;
            color: #991b1b;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .receipt {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>Reebooking Receipt</h1>
            <p>Thank you for your booking</p>
          </div>

          <div class="receipt-info">
            <div class="info-row">
              <span class="info-label">Receipt Number</span>
              <span class="info-value">#${data.bookingId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Receipt Date</span>
              <span class="info-value">${receiptDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Customer Name</span>
              <span class="info-value">${data.customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone Number</span>
              <span class="info-value">${data.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Appointment Date</span>
              <span class="info-value">${bookingDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Appointment Time</span>
              <span class="info-value">${data.time}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method</span>
              <span class="info-value">${data.paymentMethod}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status</span>
              <span class="info-value">
                <span class="status-badge status-${data.status.toLowerCase()}">${data.status}</span>
              </span>
            </div>
          </div>

          <div class="service-section">
            <div class="service-title">Service Details</div>
            <div class="service-details">
              <span class="service-name">${data.serviceName}</span>
              <span class="service-price">$${data.servicePrice.toLocaleString()}</span>
            </div>
          </div>

          <div class="total-section">
            <div class="total-row">
              <span class="total-label">Total Amount</span>
              <span class="total-amount">$${data.servicePrice.toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <p>This is an official receipt for your booking.</p>
            <p>For any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Pharmacy Payment Receipt PDF Generator
// Generates professional PDF receipts for pharmacy/prescription payments

export interface DrugItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PharmacyReceiptData {
  receiptId: string;
  prescriptionNo: string;
  patientName: string;
  patientId: string;
  fileNo: string;
  drugs: DrugItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentDate: string;
  paymentTime: string;
  pharmacistName: string;
  pharmacistId: string;
  cashierName: string;
  cashierId: string;
}

export function generatePharmacyReceiptPDF(data: PharmacyReceiptData): void {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to print receipts');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Pharmacy Receipt - ${data.receiptId}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: white;
          color: #1a1a1a;
        }
        
        .receipt {
          max-width: 800px;
          margin: 0 auto;
          border: 3px solid #1e40af;
          padding: 40px;
          background: white;
          position: relative;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #059669;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .hospital-name {
          font-size: 32px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        
        .hospital-tagline {
          font-size: 14px;
          color: #059669;
          font-style: italic;
          margin-bottom: 15px;
        }
        
        .hospital-details {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
        }
        
        .receipt-title {
          font-size: 26px;
          font-weight: bold;
          color: #059669;
          margin-top: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .receipt-id {
          font-size: 14px;
          color: #666;
          margin-top: 8px;
          font-family: 'Courier New', monospace;
        }
        
        .badge {
          display: inline-block;
          padding: 6px 16px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
          margin-top: 10px;
        }
        
        .details-section {
          margin: 35px 0;
        }
        
        .section-header {
          font-size: 16px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .detail-item {
          padding: 15px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #1e40af;
        }
        
        .detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        
        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        
        .drugs-table {
          width: 100%;
          border-collapse: collapse;
          margin: 25px 0;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .drugs-table thead {
          background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
        }
        
        .drugs-table thead th {
          color: white;
          padding: 15px;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .drugs-table tbody tr {
          border-bottom: 1px solid #e5e7eb;
        }
        
        .drugs-table tbody tr:last-child {
          border-bottom: none;
        }
        
        .drugs-table tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .drugs-table tbody td {
          padding: 15px;
          font-size: 14px;
          color: #374151;
        }
        
        .drug-name {
          font-weight: 700;
          color: #111827;
          font-size: 15px;
        }
        
        .amount-section {
          background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
          padding: 30px;
          border-radius: 12px;
          margin: 35px 0;
          box-shadow: 0 10px 25px rgba(30, 64, 175, 0.2);
        }
        
        .amount-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .amount-label {
          font-size: 18px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .amount-value {
          font-size: 42px;
          font-weight: bold;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .payment-info {
          margin: 30px 0;
          padding: 25px;
          background: #ecfdf5;
          border-left: 5px solid #059669;
          border-radius: 8px;
        }
        
        .payment-info-title {
          font-weight: 700;
          color: #065f46;
          margin-bottom: 15px;
          font-size: 15px;
        }
        
        .payment-detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #d1fae5;
        }
        
        .payment-detail-row:last-child {
          border-bottom: none;
        }
        
        .footer {
          margin-top: 50px;
          padding-top: 25px;
          border-top: 3px double #e5e7eb;
          text-align: center;
        }
        
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 60px;
          margin-bottom: 40px;
        }
        
        .signature-box {
          text-align: center;
          flex: 1;
        }
        
        .signature-line {
          border-top: 2px solid #374151;
          width: 200px;
          margin: 60px auto 12px;
        }
        
        .signature-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 140px;
          color: rgba(30, 64, 175, 0.04);
          font-weight: bold;
          z-index: -1;
          user-select: none;
          pointer-events: none;
        }
        
        .footer-note {
          background: #e0f2fe;
          padding: 15px;
          border-radius: 8px;
          margin-top: 25px;
          border: 1px solid #38bdf8;
        }
        
        .footer-note-text {
          font-size: 12px;
          color: #075985;
          line-height: 1.6;
        }
        
        .staff-info {
          margin: 25px 0;
          padding: 20px;
          background: #fef3c7;
          border-left: 5px solid #f59e0b;
          border-radius: 8px;
        }
        
        .staff-info-title {
          font-weight: 700;
          color: #92400e;
          margin-bottom: 12px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .staff-detail {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #fde68a;
        }
        
        .staff-detail:last-child {
          border-bottom: none;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .receipt {
            border: none;
          }
          
          @page {
            margin: 20mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="watermark">GODIYA HOSPITAL</div>
      
      <div class="receipt">
        <div class="header">
          <div class="hospital-name">GODIYA HOSPITAL</div>
          <div class="hospital-tagline">Caring for Life, Serving with Love</div>
          <div class="hospital-details">
            Birnin Kebbi, Kebbi State, Nigeria<br>
            Phone: +234 XXX XXX XXXX | Email: info@godiyahospital.ng<br>
            Website: www.godiyahospital.ng
          </div>
          <div class="receipt-title">Pharmacy Payment Receipt</div>
          <div class="receipt-id">Receipt No: ${data.receiptId}</div>
          <div class="badge">Pharmacy Services</div>
        </div>
        
        <div class="details-section">
          <div class="section-header">
            <span>👤</span>
            Patient Information
          </div>
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Patient Name</div>
              <div class="detail-value">${data.patientName}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Patient ID</div>
              <div class="detail-value">${data.patientId}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">File Number</div>
              <div class="detail-value">${data.fileNo}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Prescription Number</div>
              <div class="detail-value">${data.prescriptionNo}</div>
            </div>
          </div>
        </div>
        
        <div class="details-section">
          <div class="section-header">
            <span>💊</span>
            Medication Details
          </div>
          <table class="drugs-table">
            <thead>
              <tr>
                <th style="width: 10%;">#</th>
                <th style="width: 45%;">Medication Name</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Unit Price</th>
                <th style="width: 15%; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${data.drugs.map((drug, index) => `
                <tr>
                  <td style="text-align: center; font-weight: 600; color: #6b7280;">${index + 1}</td>
                  <td><span class="drug-name">${drug.name}</span></td>
                  <td style="text-align: center; font-weight: 600;">${drug.quantity}</td>
                  <td style="text-align: right; font-weight: 600;">₦${drug.unitPrice.toLocaleString()}</td>
                  <td style="text-align: right; font-weight: 700; color: #059669;">₦${drug.subtotal.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="amount-section">
          <div class="amount-row">
            <div class="amount-label">Total Amount Paid</div>
            <div class="amount-value">₦${data.totalAmount.toLocaleString()}</div>
          </div>
        </div>
        
        <div class="staff-info">
          <div class="staff-info-title">👨‍⚕️ Staff Information</div>
          <div class="staff-detail">
            <span style="color: #92400e; font-weight: 600;">Dispensed By (Pharmacist):</span>
            <span style="color: #78350f; font-weight: 700;">${data.pharmacistName} (${data.pharmacistId})</span>
          </div>
          <div class="staff-detail">
            <span style="color: #92400e; font-weight: 600;">Processed By (Cashier):</span>
            <span style="color: #78350f; font-weight: 700;">${data.cashierName} (${data.cashierId})</span>
          </div>
        </div>
        
        <div class="payment-info">
          <div class="payment-info-title">💳 Payment Transaction Details</div>
          <div class="payment-detail-row">
            <span style="color: #065f46; font-weight: 600;">Payment Method:</span>
            <span style="color: #047857; font-weight: 700;">${data.paymentMethod}</span>
          </div>
          <div class="payment-detail-row">
            <span style="color: #065f46; font-weight: 600;">Payment Date:</span>
            <span style="color: #047857; font-weight: 700;">${data.paymentDate}</span>
          </div>
          <div class="payment-detail-row">
            <span style="color: #065f46; font-weight: 600;">Payment Time:</span>
            <span style="color: #047857; font-weight: 700;">${data.paymentTime}</span>
          </div>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Pharmacist Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Cashier Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Patient Signature</div>
          </div>
        </div>
        
        <div class="footer">
          <p style="font-weight: 700; font-size: 16px; color: #1e40af; margin-bottom: 10px;">
            Thank you for choosing Godiya Hospital
          </p>
          <p style="font-size: 12px; color: #6b7280; margin-top: 12px; line-height: 1.6;">
            This is a computer-generated receipt and is valid without signature.<br>
            Please keep this receipt for your records.
          </p>
          
          <div class="footer-note">
            <p class="footer-note-text">
              <strong>Important:</strong> Please store all medications as directed. Keep out of reach of children. 
              Follow the dosage instructions provided by your doctor. If you experience any adverse reactions, 
              contact our pharmacy immediately at pharmacy@godiyahospital.ng or visit the Emergency Department.
              For medication refills, present this prescription at the pharmacy counter.
            </p>
          </div>
          
          <p style="font-size: 11px; color: #9ca3af; margin-top: 20px;">
            Printed on ${new Date().toLocaleString()} | For inquiries: pharmacy@godiyahospital.ng
          </p>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
}

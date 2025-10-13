"use client";
import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import EmailAPI from '@/app/utils/api/email';
export default function CertificateGenerator() {
  const [pdfTemplate, setPdfTemplate] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Hardcoded QR codes - replace these URLs with your actual QR code image URLs
  const QR_CODE_1_URL = '/qr1.png'; // First signature (Sr. Jacqueline, CB)
  const QR_CODE_2_URL = '/qr2.png'; // Second signature (dr. Robertus Bebet Prasetyo)

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      setPdfTemplate(arrayBuffer);
      alert('✅ PDF template loaded!');
    }
  };

  const handleDataPaste = (e) => {
    const pastedData = e.target.value;
    const lines = pastedData.trim().split('\n');
    
    const parsedData = lines.slice(1).map((line, index) => {
      const cols = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
      
      return {
        no: cols[8]?.trim() || '',
        timestamp: cols[0]?.trim() || '',
        name: cols[1]?.trim() || '',
        domisili: cols[2]?.trim() || '',
        phone: cols[3]?.trim() || '',
        email: cols[4]?.trim() || '',
      };
    });
    
    setExcelData(parsedData);
    alert(`✅ ${parsedData.length} records loaded!`);
  };

  const generateCertificate = async (person, certNumber) => {
    if (!pdfTemplate) {
      alert('Please upload PDF template first!');
      return null;
    }

    try {
      const pdfDoc = await PDFDocument.load(pdfTemplate);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      // Certificate Number
      firstPage.drawText(certNumber, {
        x: 320,
        y: height - 155,
        size: 25,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      // Participant Name (properly centered)
      const fontSize = 30;
      const nameWidth = boldFont.widthOfTextAtSize(person.name, fontSize);
      const centerX = (width - nameWidth) / 2;
      
      firstPage.drawText(person.name, {
        x: centerX,
        y: height - 250,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      
      // ✅ Load and embed QR Code 1 (Left signature - Sr. Jacqueline, CB)
    try {
  const QR_CODE_1_URL = '/qr1.png'; // Ensure this is the correct root path!
  const qr1Response = await fetch(QR_CODE_1_URL);

  // --- 🛑 CRITICAL CHECK 1: Ensure the HTTP request succeeded ---
  if (!qr1Response.ok) {
    throw new Error(`HTTP Error: ${qr1Response.status} - Could not find the image at ${QR_CODE_1_URL}`);
  }
  
  // --- CRITICAL CHECK 2: Get the raw image data ---
  const qr1ArrayBuffer = await qr1Response.arrayBuffer();
  
  // --- CRITICAL FIX 3: Embed using the correct format based on file content ---
  let qr1Image;
  const contentType = qr1Response.headers.get('content-type');

  if (contentType && contentType.includes('image/png')) {
    qr1Image = await pdfDoc.embedPng(qr1ArrayBuffer);
  } else if (contentType && (contentType.includes('image/jpeg') || contentType.includes('image/jpg'))) {
    // If the file is actually a JPG disguised as a PNG:
    qr1Image = await pdfDoc.embedJpg(qr1ArrayBuffer);
  } else {
    throw new Error(`Mismatched format. Server returned Content-Type: ${contentType}. Expected image/png.`);
  }

  const qrSize = 80;

  firstPage.drawImage(qr1Image, {
    x: 210,
    y: 80,
    width: qrSize,
    height: qrSize,
  });

} catch (err) {
  // Line 97 now logs the detailed error
  console.error('Error loading QR Code 1:', err); 
  alert('QR Code Load Failure: ' + err.message); // Alert user to the root cause
}
      
      // ✅ Load and embed QR Code 2 (Right signature - dr. Robertus Bebet Prasetyo)
      try {
        const qr2Response = await fetch(QR_CODE_2_URL);
        const qr2ArrayBuffer = await qr2Response.arrayBuffer();
        const qr2Image = await pdfDoc.embedPng(qr2ArrayBuffer);
        
        const qrSize = 80; // Adjust size as needed
        
        firstPage.drawImage(qr2Image, {
          x: width - 300, // Right side position
          y: 70,          // Bottom area
          width: qrSize,
          height: qrSize,
        });
      } catch (err) {
        console.error('Error loading QR Code 2:', err);
      }
      
      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error: ' + error.message);
      return null;
    }
  };

  const generateAll = async () => {
    if (!pdfTemplate || excelData.length === 0) {
      alert('Please upload template and paste data first!');
      return;
    }

    setLoading(true);
    
    try {
         for (let i = 0; i < excelData.length; i++) {
        setCurrentIndex(i + 1);

        const person = excelData[i];
        // Ensure 'person.email' is available from your excelData structure
        // const recipientEmail = person.email; 
                const recipientEmail = "pradahsuherli@gmail.com"; 

        // Use person.no for certNumber (already fixed in your provided code)
        const certNumber = person.no; 
        
        // 1. GENERATE PDF BYTES
        const pdfBytes = await generateCertificate(person, certNumber);

        if (pdfBytes && recipientEmail) {
          // 2. CONVERT PDF BYTES to Base64 String for JSON transmission
         const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
             await EmailAPI.sendEmail({ 
                email: recipientEmail, 
                name: person.name, 
                pdfBase64 
            });
          
         
        }
      }
      
      alert('✅ All certificates generated!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
      setCurrentIndex(0);
    }
  };

  const generateTest = async () => {
    const testPerson = { name: 'John Doe Test', no: 1 };
    const certNumber = '001/001/1010/2025';
    const pdfBytes = await generateCertificate(testPerson, certNumber);
    
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Test_Certificate.pdf';
      link.click();
      
      alert('✅ Test certificate generated!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
          🎓 Certificate Generator
        </h1>
        
        <div className="space-y-6">
          {/* Upload PDF */}
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <h2 className="text-xl font-bold mb-4">Step 1: Upload PDF Template</h2>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="w-full border-2 border-green-300 rounded px-4 py-3"
            />
            {pdfTemplate && <p className="text-green-600 font-bold mt-2">✓ Template Loaded!</p>}
          </div>
          
          {/* QR Info */}
          <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
            <h2 className="text-xl font-bold mb-4">QR Codes (Hardcoded)</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p>📍 <strong>Left QR:</strong> Sr. Jacqueline, CB</p>
              <p>📍 <strong>Right QR:</strong> dr. Robertus Bebet Prasetyo, SpU (K)</p>
              <p className="text-xs text-gray-500 mt-2">
                QR codes will be automatically added from: {QR_CODE_1_URL} and {QR_CODE_2_URL}
              </p>
            </div>
          </div>
          
          {/* Paste Data */}
          <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h2 className="text-xl font-bold mb-4">Step 2: Paste Spreadsheet Data</h2>
            <textarea
              onChange={handleDataPaste}
              placeholder="Paste data here..."
              rows={8}
              className="w-full border-2 border-blue-300 rounded px-4 py-3 font-mono"
            />
            {excelData.length > 0 && (
              <div className="mt-4">
                <p className="text-blue-600 font-bold">
                  ✓ {excelData.length} participants loaded
                </p>
                <div className="mt-2 p-3 bg-white rounded border text-sm">
                  <p className="font-bold">Preview:</p>
                  <ul className="mt-2 space-y-1">
                    {excelData.slice(0, 3).map((person, i) => (
                      <li key={i}>
                        {person.no}. {person.name}
                      </li>
                    ))}
                    {excelData.length > 3 && (
                      <li className="text-gray-500">
                        ... and {excelData.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* Generate */}
          <div className="space-y-3">
            <button
              onClick={generateTest}
              disabled={loading || !pdfTemplate}
              className="w-full bg-yellow-500 text-white font-bold py-3 rounded hover:bg-yellow-600 disabled:bg-gray-400"
            >
              🧪 Test Certificate (Check QR Positions)
            </button>
            
            <button
              onClick={generateAll}
              disabled={loading || !pdfTemplate || excelData.length === 0}
              className="w-full bg-green-600 text-white font-bold py-4 rounded hover:bg-green-700 disabled:bg-gray-400 text-lg"
            >
              {loading 
                ? `⏳ Generating... (${currentIndex}/${excelData.length})`
                : `🎓 Generate All ${excelData.length} Certificates`
              }
            </button>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              <strong>📋 Setup Instructions:</strong>
            </p>
            <ol className="text-sm text-yellow-800 mt-2 space-y-1 list-decimal list-inside">
              <li>Place your QR code PNG files in the <code>public</code> folder</li>
              <li>Name them <code>qr-code-1.png</code> and <code>qr-code-2.png</code></li>
              <li>Or update the URLs at the top of the component</li>
              <li>QR codes will be automatically embedded in all certificates</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
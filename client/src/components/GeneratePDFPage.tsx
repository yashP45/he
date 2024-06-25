import React, { useState } from 'react';
import { generatePDF } from '../api/api';

const GeneratePDFPage: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const token = localStorage.getItem('token') || '';

  const handleGeneratePDF = async () => {
    try {
      const { data } = await generatePDF(token);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      alert( err);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'invoice.pdf');
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generate PDF</h2>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300" 
        onClick={handleGeneratePDF}
      >
        Generate PDF
      </button>
      {pdfUrl && (
        <div className="mt-6">
          <iframe 
            src={pdfUrl} 
            width="100%" 
            height="500px" 
            title="Invoice PDF" 
            className="border border-gray-300 rounded shadow-sm"
          ></iframe>
          <button 
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300" 
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneratePDFPage;

import React, { useState } from "react";
import { generatePDF } from "../api/api";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const GeneratePDFPage: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const { data } = await generatePDF(token);
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();
    }
  };

  if (loading) {
    return <Loader message="Please wait, we're generating your PDF" />;
  }

  return (
    <div className="container mx-auto p-4">
      {!pdfUrl ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Generate PDF</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            onClick={handleGeneratePDF}
          >
            Generate PDF
          </button>
        </div>
      ) : (
        <div className="h-full">
          {pdfUrl && (
            <>
              <iframe
                src={pdfUrl}
                width="100%"
                height="700px"
                title="Invoice PDF"
                className="border border-gray-300 rounded shadow-sm"
              ></iframe>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
            </>
          )}
        </div>
      )}
      <p className="mt-4 text-center">
        Go back to home page
        <Link to="/add-product" className="text-blue-500 hover:underline">
          Click
        </Link>
      </p>
    </div>
  );
};

export default GeneratePDFPage;

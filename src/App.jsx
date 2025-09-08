// src/URLShortenerApp.jsx
import React, { useState } from "react";
import {
  Link2,
  Clock,
  BarChart3,
  Globe,
  MousePointer,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { LoggingMiddleware } from "./LoggingMiddleware";

const URLShortenerApp = () => {
  const [currentPage, setCurrentPage] = useState("shortener");
  const [urlEntries, setUrlEntries] = useState([{ id: Date.now(), url: "", validity: 30, customCode: "" }]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // --- Handlers and utilities ---
  const generateShortCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  const handleInputChange = (index, field, value) => {
    const newEntries = [...urlEntries];
    newEntries[index][field] = value;
    setUrlEntries(newEntries);
    if (errors[`${field}_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${field}_${index}`];
      setErrors(newErrors);
    }
  };

  const addUrlEntry = () => {
    if (urlEntries.length < 5) setUrlEntries([...urlEntries, { id: Date.now(), url: "", validity: 30, customCode: "" }]);
  };

  const removeUrlEntry = (index) => {
    if (urlEntries.length > 1) setUrlEntries(urlEntries.filter((_, i) => i !== index));
  };

  const handleShortenUrls = () => {
    // Dummy shortening
    const newShortened = urlEntries.map((entry) => ({
      id: Date.now() + Math.random(),
      originalUrl: entry.url,
      shortUrl: "https://short.ly/" + (entry.customCode || Math.random().toString(36).slice(2, 8)),
      shortCode: entry.customCode || "",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (entry.validity || 1) * 60000),
      clickCount: 0,
      clicks: [],
    }));
    setShortenedUrls([...shortenedUrls, ...newShortened]);
    setUrlEntries([{ id: Date.now(), url: "", validity: 30, customCode: "" }]);
    setSuccessMessage("URLs shortened successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const handleShortUrlClick = (code) => window.open(`https://short.ly/${code}`, "_blank");

  // --- Pages ---
  const URLShortenerPage = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Link2 className="w-5 h-5" /> Shorten URLs</h2>

      {urlEntries.map((entry, index) => (
        <div key={entry.id} className="mb-4 p-4 border rounded-lg">
          <input
            type="text"
            placeholder="Enter your URL"
            value={entry.url}
            onChange={(e) => handleInputChange(index, "url", e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          {errors[`url_${index}`] && <p className="text-red-500 text-sm">{errors[`url_${index}`]}</p>}

          <input
            type="number"
            placeholder="Validity (minutes)"
            value={entry.validity}
            onChange={(e) => handleInputChange(index, "validity", e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          {errors[`validity_${index}`] && <p className="text-red-500 text-sm">{errors[`validity_${index}`]}</p>}

          <input
            type="text"
            placeholder="Custom Code (optional)"
            value={entry.customCode}
            onChange={(e) => handleInputChange(index, "customCode", e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          {errors[`customCode_${index}`] && <p className="text-red-500 text-sm">{errors[`customCode_${index}`]}</p>}

          {urlEntries.length > 1 && <button onClick={() => removeUrlEntry(index)} className="text-red-500 text-sm">Remove</button>}
        </div>
      ))}

      <div className="flex gap-2">
        <button onClick={addUrlEntry} className="px-4 py-2 bg-gray-200 rounded">Add Another</button>
        <button onClick={handleShortenUrls} className="px-4 py-2 bg-blue-600 text-white rounded">Shorten URLs</button>
      </div>

      {successMessage && <p className="mt-3 text-green-600">{successMessage}</p>}

      <div className="mt-6">
        {shortenedUrls.map((url) => (
          <div key={url.id} className="p-3 border rounded flex items-center justify-between mb-2">
            <a
              href={url.shortUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => { e.preventDefault(); handleShortUrlClick(url.shortCode); }}
              className="text-blue-600 underline"
            >
              {url.shortUrl}
            </a>
            <button onClick={() => copyToClipboard(url.shortUrl)} className="text-sm flex items-center gap-1">
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const StatisticsPage = () => (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Statistics</h2>
      {shortenedUrls.length === 0 ? (
        <p>No URLs shortened yet.</p>
      ) : (
        shortenedUrls.map((url) => (
          <div key={url.id} className="p-3 border rounded mb-3">
            <p><strong>Original:</strong> {url.originalUrl}</p>
            <p><strong>Short:</strong> {url.shortUrl}</p>
            <p><strong>Clicks:</strong> {url.clickCount}</p>
            <ul className="text-sm mt-2">
              {url.clicks.map((click, i) => (
                <li key={i}>{click.timestamp.toString()} — {click.location}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link2 className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-800">URL Shortener</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage("shortener")}
                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === "shortener" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-800"}`}
              >
                Shortener
              </button>
              <button
                onClick={() => setCurrentPage("statistics")}
                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === "statistics" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-800"}`}
              >
                Statistics
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {currentPage === "shortener" ? <URLShortenerPage /> : <StatisticsPage />}
         <center> Please click Add Another to add more URL input fields (up to 5).</center>
      </main>

     
    </div>
  );
};

export default URLShortenerApp;

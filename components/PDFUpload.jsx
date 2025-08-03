'use client';

import { useState } from 'react';

export default function PDFUpload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    if (data.url) setUrl(data.url);
    else alert('Upload failed');
  };

  return (
    <div className="p-4 border rounded-md">
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded ml-4">
        {loading ? 'Uploading...' : 'Upload PDF'}
      </button>
      {url && (
        <div className="mt-4">
          <p>Uploaded PDF:</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}

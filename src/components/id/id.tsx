import React, { useEffect, useState } from 'react';

interface SheetRow {
  Name: string;
  Address: string;
  Email: string;
  Position: string;
  'Company Name': string;
  'ID Number': string;
  'SSS No.': string;
  TIN: string;
  PhilHealth: string;
  'Pag-IBIG': string;
  'Contact Person': string;
  'Emergency Number': string;
  'ID Photo': string;  // Google Drive share link
  'E-Signature': string;
  Timestamp: string;
  Status: string;
}

const SheetData: React.FC = () => {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: convert Google Drive share URL to direct image URL
  const getDriveImageUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (!match) return url; // fallback to original if no match
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  };

  useEffect(() => {
    fetch('https://api.sheetbest.com/sheets/6877ea05-2698-489f-b0c0-b86385b6c308')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading sheet data...</div>;
  if (error) return <div>Error loading data: {error}</div>;
  if (data.length === 0) return <div>No data available</div>;

  return (
    <section className="position-relative padding-large">
      <div className="container">
        <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
          <h3 className="d-flex align-items-center">Sheet Data</h3>
        </div>
        <div className="swiper product-swiper">
          <div className="swiper-wrapper" style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
            {data.map((row, i) => (
              <div
                key={i}
                className="swiper-slide card position-relative p-4 border rounded-3"
                style={{ minWidth: '250px', flexShrink: 0, cursor: 'pointer' }}
                onClick={() => alert(JSON.stringify(row, null, 2))}
              >
                <img
                  src={getDriveImageUrl(row['ID Photo'])}
                  alt={`${row.Name} ID Photo`}
                  className="img-fluid shadow-sm"
                  style={{ maxHeight: '180px', width: '100%', objectFit: 'contain', borderRadius: '8px' }}
                />
                <h6 className="mt-4 mb-0 fw-bold">{row.Name}</h6>
                <p className="fs-6 text-muted">{row.Position} - {row['Company Name']}</p>
                <p className="fs-7 text-muted mb-2">Email: {row.Email}</p>
                <p className="fs-7 text-muted">Status: {row.Status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SheetData;

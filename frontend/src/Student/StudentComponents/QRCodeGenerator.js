import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ studentId }) => {
  const [qrCodeData, setQRCodeData] = useState('');

  const generateQRCodeData = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const status = 'present';
    const qrData = `studentId=${studentId}&date=${currentDate}&status=${status}`;
    setQRCodeData(qrData);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Attendance Management</h1>
      <button onClick={generateQRCodeData}>Generate QR Code</button>
      {qrCodeData && (
        <div style={{ marginTop: '20px' }}>
          <QRCode value={qrCodeData} />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;

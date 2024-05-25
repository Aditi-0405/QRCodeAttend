import React, { useState } from 'react';
import QRCode from 'qrcode.react'; 

const QRCodeGenerator = () => {
  const [studentId, setStudentId] = useState('');
  const [qrCodeData, setQRCodeData] = useState('');
  const generateQRCodeData = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const qrData = `studentId=${studentId}&date=${currentDate}`;
    setQRCodeData(qrData);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Attendance Management</h1>
      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={{ padding: '10px', marginBottom: '20px' }}
      />
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

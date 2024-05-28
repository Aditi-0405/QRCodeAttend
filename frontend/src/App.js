import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';

const App = () => {
  const authenticatedStudentId = '6655bad9335469dec10b3810';

  return (
    <div>
      <QRCodeGenerator studentId={authenticatedStudentId} />
    </div>
  );
};

export default App;


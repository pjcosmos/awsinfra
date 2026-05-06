import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('대기 중...');
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const albAddress = process.env.REACT_APP_API_BASE_URL ?? "";

  const callBackend = async () => {
    setMessage('호출 중...');
    setError(null);
    try {
      const response = await fetch(`${albAddress}/api/hello`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.text();
      setMessage(data);
    } catch (err) {
      setError(err.message);
      setMessage('호출 실패');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setMessage('업로드 중...');
    setError(null);

    try {
      const response = await fetch(`${albAddress}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed! status: ${response.status}`);

      const result = await response.text();
      setMessage(result);
      setUploadedFileName(file.name);
    } catch (err) {
      setError(err.message);
      setMessage('업로드 실패');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial', padding: '0 20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#232f3e' }}>☁️ AWS S3 File Integration CI/CD Test</h1>
        <p style={{ color: '#666' }}>백엔드를 통해 S3에 안전하게 파일을 업로드하고 미리보기합니다.</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* Hello API Section */}
        <section style={sectionStyle}>
          <h3>🔗 Backend Connection</h3>
          <button onClick={callBackend} style={buttonStyle}>백엔드 API 호출</button>
          <div style={resultBoxStyle}>
            <p style={{ color: error ? '#d9534f' : '#5cb85c', fontWeight: 'bold' }}>
              {error ? '❌ 에러: ' + error : '✅ ' + message}
            </p>
          </div>
        </section>

        {/* Upload Section */}
        <section style={sectionStyle}>
          <h3>📤 S3 File Upload</h3>
          <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
          <br />
          <button onClick={handleUpload} style={{ ...buttonStyle, backgroundColor: '#007bff' }}>S3에 업로드</button>
        </section>
      </div>

      {/* Preview Section */}
      {uploadedFileName && (
        <section style={{ ...sectionStyle, width: '80%', maxWidth: '800px', margin: '40px auto' }}>
          <h3>🖼️ S3 File Preview (Proxy)</h3>
          <p>백엔드 주소를 통해 가져온 이미지입니다: <code>{uploadedFileName}</code></p>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', backgroundColor: '#f9f9f9' }}>
            <img
              src={`${albAddress}/api/preview/${uploadedFileName}`}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px' }}
              onError={(e) => {
                e.target.style.display = 'none';
                setMessage("미리보기를 불러올 수 없습니다. (이미지 파일이 아닐 수 있습니다)");
              }}
            />
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
            URL: {`${albAddress}/api/preview/${uploadedFileName}`}
          </p>
        </section>
      )}
    </div>
  );
}

const sectionStyle = {
  padding: '20px',
  border: '1px solid #eee',
  borderRadius: '12px',
  minWidth: '320px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  backgroundColor: 'white'
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '15px',
  backgroundColor: '#ff9900',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'opacity 0.2s'
};

const resultBoxStyle = {
  marginTop: '15px',
  padding: '10px',
  border: '1px solid #f0f0f0',
  borderRadius: '6px',
  backgroundColor: '#fafafa',
  minHeight: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default App;

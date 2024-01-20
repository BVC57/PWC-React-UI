import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './Main.css';

const Upload = () => {
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const fileInputRef = useRef(null);
  // const [fileList, setFileList] = useState([]);
  // the data is use when the old data is added and page is refresh to store in localstorage
  const [fileList, setFileList] = useState(
    JSON.parse(localStorage.getItem('fileList')) || []
  );
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  const handleFileCheckboxChange = (event) => {
    const fileId = event.target.closest('tr').querySelector('.checkbox-input').value;
    const isSelected = event.target.checked;
    const checkbox = event.target;
    checkbox.indeterminate = false;
    checkbox.style.backgroundColor = checkbox.checked ? 'lightblue' : 'white';
    checkbox.nextElementSibling.style.display = checkbox.checked ? 'inline-block' : 'block';
    setSelectedFileIds((prevIds) => (isSelected ? [...prevIds, fileId] : prevIds.filter((id) => id !== fileId)));

    if (isSelected) {
      // alert(`File with Load ID ${fileId} selected`);
      handleDeleteSelectedFiles(fileId);
    } else {
      // alert(`File with Load ID ${fileId} unselected`);
    }
  };

  const handleDeleteSelectedFiles = () => {
    const fileListKey = 'fileList'; // Use a variable for the key
  
    if (selectedFileIds.length > 0) {
      if (window.confirm('Are you sure you want to delete the selected files?')) {
        localStorage.removeItem(fileListKey); // Use the key to remove the item
        window.location.reload();
      }
    }
  };
  

  useEffect(() => {
    // Update localStorage whenever fileList changes
    localStorage.setItem('fileList', JSON.stringify(fileList));
  }, [fileList]);

  const onDrop = useCallback((acceptedFiles) => {
    const firstFile = acceptedFiles[0];
    setSelectedFileName(firstFile.name);
  }, []);

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
  };


  const handleUploadClick = () => {
    if (selectedFileName) {
      // Simulate file upload (replace with your actual upload logic)
      const newLoadID = fileList.length + 1;
      const newFile = {
        id: newLoadID,
        method:selectedMethod.toUpperCase(),
        name: selectedFileName,
        loadedBy: 'ram', // Replace with actual user information
        status: 'Uploaded',
        loadedAt: new Date().toLocaleTimeString(),
      };
      setFileList([...fileList, newFile]);
    } else {
      alert('Please select a file.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div>
    <div className='fhead'><h2>Upload File</h2></div>
    <section className="upload-section">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <p>Drag & Drop Files In This or Browse File</p>
      </div>
      <div className="upload-options">
        <label htmlFor="method">Method</label>
        <select id="method" className="fdd" value={selectedMethod} onChange={handleMethodChange}>
          <option className='od' value="aws-textract">AWS Textract</option>
          <option className='od' value="openai">Open AI</option>
          <option className='od' value="custom">Custom</option>
          <option className='od' value="systemdefaul">System Default</option>
        </select>
        <button type="button" className='ubtn' onClick={handleUploadClick}>Upload</button>
      </div>
    </section>
    <div className='hr1'><hr></hr></div>

    <section className="file-list">
      <table>
        <thead>
          <tr>
            <th className="checkbox-container"><input type="checkbox" className="checkbox-input" /> Load ID</th>
            <th>File Name</th>
            <th>Method Use</th>
            <th>Loaded By</th>
            <th>Status</th>
            <th>Loaded At</th>
            <th>Action</th>
          </tr>
        </thead>
        {/* <tbody>
          <tr>
            <td className="checkbox-container"><input type="checkbox" className="checkbox-input" /> 11</td>
            <td>my new file</td>
            <td>ram</td>
            <td>Uploded</td>
            <td>10:00 AM</td>
            <td className="action-container">
              <FontAwesomeIcon icon={faDownload} className="download-icon" />
            </td>
          </tr>
          <tr>
            <td className="checkbox-container"><input type="checkbox" className="checkbox-input" /> 12</td>
            <td>my new file</td>
            <td>ram</td>
            <td>Uploded</td>
            <td>10:00 AM</td>
            <td className="action-container">
              <FontAwesomeIcon icon={faDownload} className="download-icon" />
            </td>
          </tr>
        </tbody> */}
        <tbody>
      {fileList.map((file) => (
        <tr key={file.id}>
          <td className="checkbox-container">
            <input type="checkbox" className="checkbox-input" value={file.id} onChange={handleFileCheckboxChange} />
            <i className="tickmark-icon" style={{ display: 'none' }}>✔</i>
            {file.id}
          </td>
          <td>{file.name}</td>
          <td>{file.method}</td>
          <td>{file.loadedBy}</td>
          <td>{file.status}</td>
          <td>{file.loadedAt}</td>
          <td className="action-container">
            <FontAwesomeIcon icon={faDownload} className="download-icon" />
          </td>
        </tr>
      ))}
    </tbody>
      </table>
    </section>
    </div>
  )
}

export default Upload
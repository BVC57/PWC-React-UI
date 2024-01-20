import React, { useState, useRef, useCallback, useEffect } from 'react';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Main.css';

const Upload = () => {
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);
  const [fileList, setFileList] = useState(
    JSON.parse(localStorage.getItem('fileList')) || []
  );
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const options = [
    { value: 'AWS Textract', label: 'AWS Textract' },
    { value: 'Open AI', label: 'Open AI' },
    { value: 'Custom', label: 'Custom' },
    { value: 'System Default', label: 'System Default' },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log('Selected Method:', selectedOption.value);
  };
  

  const handleFileCheckboxChange = (event) => {
    const fileId = event.target.closest('tr').querySelector('.checkbox-input').value;
    const isSelected = event.target.checked;
    const checkbox = event.target;
    checkbox.indeterminate = false;
    checkbox.style.backgroundColor = checkbox.checked ? 'lightblue' : 'white';
    checkbox.nextElementSibling.style.display = checkbox.checked ? 'inline-block' : 'block';
    setSelectedFileIds((prevIds) =>
      isSelected ? [...prevIds, fileId] : prevIds.filter((id) => id !== fileId)
    );

    if (isSelected) {
      handleDeleteSelectedFiles(fileId);
    }
  };

  const handleDeleteSelectedFiles = () => {
    const fileListKey = 'fileList';
    if (selectedFileIds.length > 0) {
      if (window.confirm('Are you sure you want to delete the selected files?')) {
        localStorage.removeItem(fileListKey);
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('fileList', JSON.stringify(fileList));
  }, [fileList]);

  const onDrop = useCallback((acceptedFiles) => {
    const firstFile = acceptedFiles[0];
    setSelectedFileName(firstFile.name);
  }, []);

  
  const handleUploadClick = async () => {
    try {
      if (selectedFileName) {
        const FileName = selectedFileName;
        console.log(FileName)
  
        // Using regex
        const matchResult = FileName.match(/@(.*?)@/);
  
        // The matched value is in the first capturing group
        const FileType = matchResult ? matchResult[1] : null;
  
        console.log(FileType); // Output: BRC
  
        // const formData = new FormData();
        // formData.append('file', selectedFileName); // Assuming acceptedFiles is the array of dropped files
  
        const response = await axios.post(
          'https://pyrtqap426.execute-api.ap-south-1.amazonaws.com/navigate-pdf-parser/upload_pdf',
          {},
          {
            headers: {
              'Content-Type': 'application/pdf',
              'Customer-ID':1,
              'File-Type': `${FileType}`,
              'File-Name': `${selectedFileName}`,
            },
          }
        );
  
        // Assuming the API response contains the information you want to add to fileList
        const apiResponse = response.data;
        console.log("upload api response"+apiResponse.body);
        if(apiResponse.statuscode === 200){

          const newLoadID = fileList.length + 1;
          const newFile = {
            id: newLoadID,
            method: selectedOption.value,
            name: selectedFileName,
            loadedBy: 'ram',
            status: 'Uploded', // Adjust according to your API response
            loadedAt: new Date().toLocaleTimeString(),
          };
          setFileList([...fileList, newFile]);
          setSelectedFileName('');
        } else{
          const newLoadID = fileList.length + 1;
          const newFile = {
            id: newLoadID,
            method: selectedOption.value,
            name: selectedFileName,
            loadedBy: 'ram',
            status: "Not Uploaded", // Adjust according to your API response
            loadedAt: new Date().toLocaleTimeString(),
          };
          setFileList([...fileList, newFile]);
          setSelectedFileName('');
        }
      } 
      else {
        alert('Please select a file and method.');
      }
    } catch (error) {
      console.error('Error in API request:', error.message);
      // Handle the error, show a user-friendly message, or perform other actions as needed
      // Example: alert('An error occurred while uploading the file.');
    }
  };
  


  const customStyles = {
    // Example styles, you can customize them according to your needs
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #d93954',
      width:'350px',
      marginleft:'20px',
      boxShadow: state.isFocused ? 'none' : 'none',
      '&:hover': {
        border: '1px solid #d93954',
      },
    }),
    menu: (provided) => ({
      ...provided,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }),
    option: (provided, state) => ({
      ...provided,
      border: '1px solid #ccc', // Add a border to each option
      color: state.isSelected ? '#2684FF' : 'black', // Change text color when selected
      background: state.isFocused ? '#f0f0f0' : 'white', // Change background color when focused
    }),
    indicatorSeparator: () => ({}), // Remove the default indicator separator
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transition: 'transform 0.3s', // Add a transition for a smooth rotation effect
      transform: state.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)', // Rotate the arrow based on menu state
    }),
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
          <div className="menu">
          <Select
            options={options}
            value={selectedOption}
            onChange={handleChange}
            placeholder="Select Method"
            styles={customStyles}
          />
          </div>

          <button type="button" className="ubtn" onClick={handleUploadClick}>
            Upload
          </button>
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
          <tbody>
            {fileList.map((file) => (
              <tr key={file.id}>
                <td className="checkbox-container">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    value={file.id}
                    onChange={handleFileCheckboxChange}
                  />
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
  );
};
export default Upload;

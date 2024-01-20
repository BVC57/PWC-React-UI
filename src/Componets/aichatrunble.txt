import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./Main.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AIChat = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    if (pdfFile) {
      setIsLoading(true);
      setError(null);
      setNumPages(null); // Reset numPages when a new file is selected
      setIsLoading(false);
    }
  }, [pdfFile]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      setChatMessages([
        ...chatMessages,
        { sender: "User", message: currentMessage },
      ]);
      setCurrentMessage("");
    }
  };

  const handleAddFileClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setPdfFile(selectedFile);
      setPageNumber(1);
      setError(null);

      // Update the selected file name
      setSelectedFileName(selectedFile.name);
    } else {
      setPdfFile(null);
      setNumPages(null);
      setError("Invalid file format. Please select a PDF file.");

      // Clear the selected file name in case of an error
      setSelectedFileName("");
    }
  };

  return (
    <div>
      <div className="addfile">
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <button className="add-file-button" onClick={handleAddFileClick}>
          Add New File
        </button>
      </div>
      <section className="main-content">
        <div className="pdf-viewer">
          <div className="filename">{selectedFileName || "No file selected"}</div>
          {pdfFile && !error && (
            <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from({ length: numPages }, (_, index) => (
              <Page key={index + 1} pageNumber={index + 1} width={400} />
            ))}
          </Document>
          )}
          {error && <div className="error-message">{error}</div>}
          {!pdfFile && isLoading && <div className="loading-indicator">Loading...</div>}
        </div>
        <div className="cline"></div>
        <div className="chat-box">
          <div className="filename">Chat</div>
          <div className="newchat">
            <ul>
              {chatMessages.map((message, index) => (
                <li key={index}>
                  <span className="sender">{message.sender}:</span>{" "}
                  {message.message}
                </li>
              ))}
            </ul>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Ask Any Question"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button onClick={handleSendMessage} className="send-button">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIChat;

import React, { useState, useEffect, useRef } from "react";

const SubmitVerification = () => {
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({
    loan_id: "",
    store_name: "",
    bill_number: "",
    purchase_date: "",
    amount_utilized: "",
    description: "",
  });
  
  const [billFile, setBillFile] = useState(null);
  const [assetFile, setAssetFile] = useState(null);

  // Webcam states
  const [activeCamera, setActiveCamera] = useState(null); // 'bill' ya 'asset'
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/api/loans/my-loans", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setLoans(data.loans || []);
        }
      } catch (err) {
        console.error("Failed to load loans", err);
      }
    };
    fetchLoans();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Start Laptop Webcam
  const startCamera = async (type) => {
    setActiveCamera(type);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("Camera access denied or not available!");
      setActiveCamera(null);
    }
  };

  // Stop Webcam
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setActiveCamera(null);
  };

  // Capture Photo from Video Feed
  const capturePhoto = (type) => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], `${type}_capture.jpg`, { type: "image/jpeg" });
      if (type === "bill") {
        setBillFile(file);
      } else {
        setAssetFile(file);
      }
      stopCamera();
    }, "image/jpeg");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      
      const formPayload = new FormData();
      formPayload.append("loan_id", formData.loan_id);
      formPayload.append("store_name", formData.store_name);
      formPayload.append("bill_number", formData.bill_number);
      formPayload.append("purchase_date", formData.purchase_date);
      formPayload.append("amount_utilized", formData.amount_utilized);
      formPayload.append("description", formData.description);
      
      if (billFile) formPayload.append("bill_file", billFile);
      if (assetFile) formPayload.append("asset_file", assetFile);

      const response = await fetch("http://localhost:8000/api/verification/submit", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit verification");
      }

      setMessage("Verification submitted successfully with proofs!");
      setFormData({
        loan_id: "",
        store_name: "",
        bill_number: "",
        purchase_date: "",
        amount_utilized: "",
        description: "",
      });
      setBillFile(null);
      setAssetFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200 mt-6 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Asset Verification</h2>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Loan Select Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Loan</label>
          <select
            name="loan_id"
            value={formData.loan_id}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Choose your loan --</option>
            {loans.map((loan) => (
              <option key={loan._id} value={loan.loan_id}>
                {loan.loan_id} - {loan.scheme_name} (₹{loan.sanctioned_amount})
              </option>
            ))}
          </select>
        </div>

        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store / Vendor Name</label>
          <input
            type="text"
            name="store_name"
            value={formData.store_name}
            onChange={handleChange}
            required
            placeholder="e.g. Agarwal Machinery Store"
            className="w-full p-2.5 border border-gray-300 rounded-md"
          />
        </div>

        {/* Bill Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bill / Invoice Number</label>
          <input
            type="text"
            name="bill_number"
            value={formData.bill_number}
            onChange={handleChange}
            required
            placeholder="e.g. INV-98234"
            className="w-full p-2.5 border border-gray-300 rounded-md"
          />
        </div>

        {/* Purchase Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded-md"
          />
        </div>

        {/* Amount Utilized */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount Utilized (₹)</label>
          <input
            type="number"
            name="amount_utilized"
            value={formData.amount_utilized}
            onChange={handleChange}
            required
            placeholder="e.g. 45000"
            className="w-full p-2.5 border border-gray-300 rounded-md"
          />
        </div>

        {/* Webcam Modal / Box */}
        {activeCamera && (
          <div className="p-4 border rounded-md bg-gray-900 text-center space-y-3">
            <h3 className="text-white font-semibold">Capturing {activeCamera === 'bill' ? 'Bill / Invoice' : 'Asset Photo'}</h3>
            <video ref={videoRef} autoPlay playsInline className="w-full max-h-64 mx-auto rounded"></video>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => capturePhoto(activeCamera)}
                className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
              >
                Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Upload / Webcam triggers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Bill Capture Section */}
          <div className="border p-4 rounded-md bg-gray-50">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bill / Invoice Proof</label>
            {billFile ? (
              <p className="text-sm text-green-600 font-medium">✓ Bill Attached ({billFile.name})</p>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startCamera('bill')}
                  className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
                >
                  Upload-Bill
                </button>
                
              </div>
            )}
          </div>

          {/* Asset Capture Section */}
          <div className="border p-4 rounded-md bg-gray-50">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Asset / Machine Photo</label>
            {assetFile ? (
              <p className="text-sm text-green-600 font-medium">✓ Asset Photo Attached ({assetFile.name})</p>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startCamera('asset')}
                  className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
                >
                  Upload-Asset
                </button>
                
              </div>
            )}
          </div>

        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write short details about the purchase..."
            className="w-full p-2.5 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors font-semibold text-base shadow-sm"
        >
          {loading ? "Submitting Proofs & Running AI Check..." : "Submit Verification with Proofs"}
        </button>
      </form>
    </div>
  );
};

export default SubmitVerification;
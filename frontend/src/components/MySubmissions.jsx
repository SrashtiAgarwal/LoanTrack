import React, { useState, useEffect } from "react";

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Image popup state
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/api/verification/my-submissions", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || "Failed to fetch submissions");
        }
        
        setSubmissions(data.submissions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600 font-medium">Loading your submissions...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 font-medium">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200 mt-6 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Submissions</h2>

      {submissions.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No Submission Verification found!!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 border-b">Loan ID</th>
                <th className="p-3 border-b">Store Name</th>
                <th className="p-3 border-b">Bill No.</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Proofs</th>
                <th className="p-3 border-b text-center">Status</th>
                <th className="p-3 border-b">Officer Name</th>
                <th className="p-3 border-b">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-800">{sub.loan_id}</td>
                  <td className="p-3 text-gray-700">{sub.store_name}</td>
                  <td className="p-3 text-gray-600">{sub.bill_number}</td>
                  <td className="p-3 text-gray-600">{sub.purchase_date}</td>
                  <td className="p-3 font-semibold text-blue-600">₹{sub.amount_utilized?.toLocaleString()}</td>
                  
                  {/* Proofs / Images Buttons */}
                  <td className="p-3 flex gap-2">
                    {sub.bill_image_path && (
                      <button
                        onClick={() => setModalImage(sub.bill_image_path)}
                        className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded text-xs font-semibold hover:bg-indigo-100 transition"
                      >
                        View Bill
                      </button>
                    )}
                    {sub.asset_image_path && (
                      <button
                        onClick={() => setModalImage(sub.asset_image_path)}
                        className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-xs font-semibold hover:bg-emerald-100 transition"
                      >
                        View Asset
                      </button>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      sub.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      sub.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {sub.status || 'Pending'}
                    </span>
                  </td>

                  {/* Officer Name Column */}
                  <td className="p-3 text-gray-700 font-medium text-xs">
                    {sub.reviewed_by ? sub.reviewed_by : <span className="text-gray-400 italic">Pending Review</span>}
                  </td>

                  {/* Audit Remark Column */}
                  <td className="p-3 text-gray-600 text-xs">
                    {sub.officer_remark ? (
                      <span className="italic text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100 block">
                        "{sub.officer_remark}"
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No remarks yet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Popup Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full relative shadow-2xl">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Uploaded Proof Preview</h3>
              <button
                onClick={() => setModalImage(null)}
                className="text-gray-500 hover:text-gray-800 font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center bg-slate-900 p-2 rounded-lg max-h-[75vh] overflow-hidden">
              <img 
                src={modalImage} 
                alt="Verification Proof" 
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
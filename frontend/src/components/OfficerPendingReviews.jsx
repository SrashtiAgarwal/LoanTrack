import React, { useState, useEffect } from 'react';

const OfficerPendingReviews = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null); // Modal detail view ke liye
  const [previewImage, setPreviewImage] = useState(null); // Image lightbox preview ke liye
  const [remark, setRemark] = useState(''); // Officer remark state

  const fetchPendingReviews = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/officer/pending-reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch pending reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const handleAction = async (subId, status) => {
    if (!window.confirm(`Are you sure you want to mark this application as ${status}?`)) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/officer/verification-action/${subId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status, 
          remark: remark.trim() // 👈 Backend par remark bhej rahe hain
        }),
      });

      if (response.ok) {
        alert(`Application ${status} successfully!`);
        setSelectedSub(null);
        setRemark(''); // Reset remark input
        fetchPendingReviews();
      } else {
        const errData = await response.json();
        alert(errData.detail || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-800">Pending Reviews</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review utilization proofs, bills, and asset photographs submitted by beneficiaries.
        </p>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading audit queue...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No pending reviews found in the queue. All caught up!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Loan ID</th>
                  <th className="p-4">Beneficiary</th>
                  <th className="p-4">Store / Bill No.</th>
                  <th className="p-4">Utilized Amount</th>
                  <th className="p-4">Purchase Date</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">{sub.loan_id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{sub.user_name}</div>
                      <div className="text-xs text-slate-400">{sub.user_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-700">{sub.store_name}</div>
                      <div className="text-xs text-slate-400">Bill: {sub.bill_number}</div>
                    </td>
                    <td className="p-4 font-bold text-indigo-600">₹{sub.amount_utilized?.toLocaleString()}</td>
                    <td className="p-4">{sub.purchase_date}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setRemark(''); // Modal khulte hi remark field clear rahegi
                        }}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-3 py-1.5 rounded-xl text-xs transition"
                      >
                        Review Proofs 🔍
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Review Details & Proofs */}
      {selectedSub && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">Audit Verification Review</h2>
              <button
                onClick={() => setSelectedSub(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-400 block">Beneficiary Name</span>
                <span className="font-semibold text-slate-800">{selectedSub.user_name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Loan ID</span>
                <span className="font-semibold text-slate-800">{selectedSub.loan_id}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Store Name</span>
                <span className="font-semibold text-slate-800">{selectedSub.store_name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Bill Number</span>
                <span className="font-semibold text-slate-800">{selectedSub.bill_number}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Utilized Amount</span>
                <span className="font-bold text-indigo-600">₹{selectedSub.amount_utilized?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Purchase Date</span>
                <span className="font-semibold text-slate-800">{selectedSub.purchase_date}</span>
              </div>
              {selectedSub.description && (
                <div className="col-span-2">
                  <span className="text-xs text-slate-400 block">Description / Notes</span>
                  <span className="text-slate-700">{selectedSub.description}</span>
                </div>
              )}
            </div>

            {/* Proof Images Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-600">Uploaded Proof Documents</span>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-2 text-center">
                  <span className="text-xs text-slate-500 block mb-1">Bill Document</span>
                  {selectedSub.bill_image_path ? (
                    <button 
                      type="button"
                      onClick={() => setPreviewImage({ url: selectedSub.bill_image_path, title: "Bill Document" })}
                      className="w-full text-xs text-indigo-600 font-semibold hover:bg-indigo-100 block bg-indigo-50 py-2 rounded-lg transition"
                    >
                      View Bill File 📄
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Not Provided</span>
                  )}
                </div>

                <div className="border border-slate-200 rounded-xl p-2 text-center">
                  <span className="text-xs text-slate-500 block mb-1">Asset Photo</span>
                  {selectedSub.asset_image_path ? (
                    <button 
                      type="button"
                      onClick={() => setPreviewImage({ url: selectedSub.asset_image_path, title: "Asset Photo" })}
                      className="w-full text-xs text-indigo-600 font-semibold hover:bg-indigo-100 block bg-indigo-50 py-2 rounded-lg transition"
                    >
                      View Asset Photo 📷
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Not Provided</span>
                  )}
                </div>
              </div>
            </div>

            {/* Officer Remark Input Box */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600">
                Audit Remark / Feedback <span className="text-slate-400 font-normal">(Optional for approval, recommended for rejection)</span>
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter reason for approval or rejection..."
                rows="2"
                className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleAction(selectedSub._id, 'Rejected')}
                className="flex-1 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-semibold transition"
              >
                Reject Application ✕
              </button>
              <button
                type="button"
                onClick={() => handleAction(selectedSub._id, 'Approved')}
                className="flex-1 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-semibold transition shadow-sm"
              >
                Approve Application ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Lightbox Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl p-4 max-w-2xl w-full shadow-2xl space-y-3 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800">{previewImage.title} Preview</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-slate-600 font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            
            <div className="flex justify-center bg-slate-900 rounded-xl p-2 overflow-hidden max-h-[75vh]">
              <img 
                src={previewImage.url} 
                alt="Document Preview" 
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <a 
                href={previewImage.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl transition"
              >
                Open in New Tab ↗
              </a>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerPendingReviews;
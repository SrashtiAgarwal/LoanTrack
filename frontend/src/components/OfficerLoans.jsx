import React, { useState, useEffect } from 'react';

const OfficerLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State matching LoanModel fields exactly
  const [formData, setFormData] = useState({
    user_id: '',
    loan_id: `LN-${Math.floor(100000 + Math.random() * 900000)}`, // Auto-generated unique ID
    purpose: '',
    amount: '',
    tenure_months: '',
    interest_rate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch all loans
  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/officer/loans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setLoans(data.loans || []);
      }
    } catch (err) {
      console.error('Failed to fetch loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      
      // Payload matching LoanModel structure
      const payload = {
        user_id: formData.user_id,
        loan_id: formData.loan_id,
        purpose: formData.purpose,
        amount: parseFloat(formData.amount),
        tenure_months: parseInt(formData.tenure_months),
        interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : null,
      };

      const response = await fetch('http://localhost:8000/api/loans/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Loan Issued Successfully!');
        setIsModalOpen(false);
        setFormData({
          user_id: '',
          loan_id: `LN-${Math.floor(100000 + Math.random() * 900000)}`,
          purpose: '',
          amount: '',
          tenure_months: '',
          interest_rate: '',
        });
        fetchLoans(); // Refresh list
      } else {
        const errData = await response.json();
        alert(errData.detail || 'Failed to Issue loan');
      }
    } catch (err) {
      console.error('Error creating loan:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Issued Loans Portfolio</h1>
          <p className="text-xs text-slate-500 mt-1">
            View master records of all active loans and create new loan schemes to beneficiaries.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm text-sm transition flex items-center justify-center gap-2"
        >
          <span>+ Create New Loan</span>
        </button>
      </div>

      {/* Loans Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading loans portfolio...</div>
        ) : loans.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No loan records found. Sanction one above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Loan ID</th>
                  <th className="p-4">Beneficiary Email/ID</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Amount (₹)</th>
                  <th className="p-4">Tenure</th>
                  <th className="p-4">Interest Rate</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loans.map((loan) => (
                  <tr key={loan._id || loan.loan_id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">{loan.loan_id}</td>
                    <td className="p-4 font-medium text-slate-800">{loan.user_id}</td>
                    <td className="p-4">{loan.purpose}</td>
                    <td className="p-4 font-bold text-indigo-600">₹{loan.amount?.toLocaleString()}</td>
                    <td className="p-4">{loan.tenure_months} Months</td>
                    <td className="p-4">{loan.interest_rate ? `${loan.interest_rate}%` : 'N/A'}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {loan.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Sanction New Loan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">Create New Loan</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Beneficiary Email (user_id)
                </label>
                <input
                  type="email"
                  required
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Loan ID</label>
                <input
                  type="text"
                  required
                  value={formData.loan_id}
                  onChange={(e) => setFormData({ ...formData, loan_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Loan Purpose</label>
                <input
                  type="text"
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Agricultural Equipment Purchase"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 150000"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tenure (Months)</label>
                <input
                  type="number"
                  required
                  value={formData.tenure_months}
                  onChange={(e) => setFormData({ ...formData, tenure_months: e.target.value })}
                  placeholder="e.g. 12"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Interest Rate (%) (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.interest_rate}
                  onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                  placeholder="e.g. 8.5"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-semibold transition shadow-sm"
                >
                  {submitting ? 'Sanctioning...' : 'Create Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerLoans;
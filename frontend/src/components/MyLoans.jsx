import React, { useEffect, useState } from "react";

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("User not authenticated. Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8000/api/loans/my-loans", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch loans. Please login again.");
        }

        const data = await response.json();
        setLoans(data.loans);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLoans();
  }, []);

  if (loading) return <div className="text-center p-6 text-gray-600">Loading your loans...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Loan Details</h2>
      
      {loans.length === 0 ? (
        <p className="text-gray-600 bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          No loans found for your account.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Loan ID</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Purpose</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{loan.loan_id}</td>
                  <td className="px-6 py-4 text-blue-600 font-semibold">{loan.purpose}</td>
                  <td className="px-6 py-4 text-gray-700">₹{loan.amount}</td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      loan.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {loan.created_at ? new Date(loan.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyLoans;
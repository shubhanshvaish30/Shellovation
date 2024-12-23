import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8080/complaints/get-complaints');
        if (response.data.success) {
          setComplaints(response.data.complaints);
        } else {
          alert('Error fetching complaints');
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
        alert('An error occurred while fetching complaints');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (complaintNumber, newStatus) => {
    try {
      const response = await axios.put('http://localhost:8080/complaints/update-complaint-status', {
        complaintId: complaintNumber,
        status: newStatus,
      });

      if (response.data.success) {
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint.complaintNumber === complaintNumber
              ? { ...complaint, status: newStatus }
              : complaint
          )
        );
        alert('Complaint status updated successfully');
      } else {
        alert('Failed to update complaint status');
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('An error occurred while updating the status');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">All Complaints</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2 text-left">Complaint ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.complaintNumber} className="border-t">
                <td className="px-4 py-2">{complaint.complaintNumber}</td>
                <td className="px-4 py-2">{complaint.name}</td>
                <td className="px-4 py-2">{complaint.email}</td>
                <td className="px-4 py-2">{complaint.message}</td>
                <td className="px-4 py-2">{complaint.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleStatusChange(complaint.complaintNumber, 'Resolved')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
                  >
                    Mark as Resolved
                  </button>
                  <button
                    onClick={() => handleStatusChange(complaint.complaintNumber, 'Pending')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                  >
                    Mark as Pending
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminComplaint;

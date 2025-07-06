import React, { useState } from "react";
import axios from "axios";

interface Parcel {
  parcel_id: string;
  user_id: string;
  pickup_location: string;
  drop_location: string;
  deliverytype: string;
  status: string;
  created_at: string;
  sender_name: string;
  sender_phone: string;
  receiver_name: string;
  receiver_phone: string;
  delivery_time: string;
  amount: string;
  weight: string;
  package_type: string;
}

const TrackShipment: React.FC = () => {
  const [parcelId, setParcelId] = useState<string>("");
  const [parcelData, setParcelData] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const fetchParcel = async () => {
    if (!parcelId.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");
    setParcelData(null);

    try {
      const res = await axios.get<Parcel>(`http://localhost:4000/api/parcel/${parcelId.trim()}`);
      setParcelData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Parcel not found");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!parcelData) return;

    const status = prompt("Enter new status (e.g., In Transit, Delivered):");
    if (!status?.trim()) return alert("Status is required");

    const location = prompt("Enter current location:");
    if (!location?.trim()) return alert("Location is required");

    try {
      const res = await axios.post("http://localhost:4000/api/parcel_timeline", {
        parcel_id: parcelData.parcel_id,
        status,
        location,
      });

      setMessage(res.data.message || "Tracking updated successfully");
      fetchParcel(); // refresh parcel details after update
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update tracking");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h2>Track Your Shipment</h2>

      <input
        type="text"
        placeholder="Enter Parcel ID"
        value={parcelId}
        onChange={(e) => setParcelId(e.target.value)}
        style={{ padding: "8px", width: "80%", marginRight: 10 }}
      />
      <button onClick={fetchParcel} disabled={loading} style={{ padding: "8px 16px" }}>
        {loading ? "Loading..." : "Track"}
      </button>

      {error && <p style={{ color: "red", marginTop: 15 }}><strong>Error:</strong> {error}</p>}
      {message && <p style={{ color: "green", marginTop: 15 }}><strong>Success:</strong> {message}</p>}

      {parcelData && (
        <div style={{ marginTop: 30, background: "#f9f9f9", padding: 20, borderRadius: 10 }}>
          <h3>Parcel Details</h3>
          <p><strong>Parcel ID:</strong> {parcelData.parcel_id}</p>
          <p><strong>User ID:</strong> {parcelData.user_id}</p>
          <p><strong>Pickup Location:</strong> {parcelData.pickup_location}</p>
          <p><strong>Drop Location:</strong> {parcelData.drop_location}</p>
          <p><strong>Sender:</strong> {parcelData.sender_name} ({parcelData.sender_phone})</p>
          <p><strong>Receiver:</strong> {parcelData.receiver_name} ({parcelData.receiver_phone})</p>
          <p><strong>Delivery Type:</strong> {parcelData.deliverytype}</p>
          <p><strong>Package Type:</strong> {parcelData.package_type}</p>
          <p><strong>Weight:</strong> {parcelData.weight} kg</p>
          <p><strong>Status:</strong> {parcelData.status}</p>
          <p><strong>Amount:</strong> ₹{parcelData.amount}</p>
          <p><strong>Created At:</strong> {new Date(parcelData.created_at).toLocaleString()}</p>
          <p><strong>Expected Delivery:</strong> {new Date(parcelData.delivery_time).toLocaleString()}</p>

          <button
            onClick={handleUpdateTracking}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Update Tracking
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;

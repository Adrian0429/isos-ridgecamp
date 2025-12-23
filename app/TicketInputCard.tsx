"use client";

import { useState } from "react";

type Props = {
  onSubmitSuccess: (ticket: string) => void;
  loading: boolean;
};

export default function TicketInputCard({ onSubmitSuccess, loading }: Props) {
  const [ticketNumber, setTicketNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!ticketNumber.trim()) {
      setError("Please enter a ticket number");
      return;
    }

    setError("");

    const res = await fetch("/api/submit-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketNumber }),
    });

    if (!res.ok) {
      setError("Failed to submit ticket");
      return;
    }

    // save cookie for 1 hour
    document.cookie = `patient_ticket=${ticketNumber}; max-age=3600; path=/`;

    onSubmitSuccess(ticketNumber);
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-lg p-8 max-w-lg w-full h-[50%]">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Submit Ticket</h1>
        <p className="text-xl text-gray-600 mt-2">
          Enter your ticket number
          <br />
          <span className="italic text-gray-400 mt-2">Masukkan nomor tiket Anda</span>
        </p>
      </div>

      <div>
        <input
          type="text"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          placeholder="Ticket Number / Nomor Tiket"
          disabled={loading}
          className="w-full px-4 py-3 mt-6 border border-gray-400 rounded-lg placeholder-gray-500 text-gray-600"
        />

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Submit / Kirim
        </button>
      </div>
    </div>
  );
}

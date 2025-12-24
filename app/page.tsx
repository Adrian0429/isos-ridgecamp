"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TicketInputCard from "./TicketInputCard";
import TicketDisplayCard from "./TicketDisplayCard";

export default function TicketSubmission() {
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("patient_ticket="));

    if (cookie) {
      const value = cookie.split("=")[1];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmittedTicket(value);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-50 to-blue-100">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Image
            src="/isos.png"
            alt="International SOS"
            width={120}
            height={25}
          />
          <Image
            src="/freeport.png"
            alt="Freeport Indonesia"
            width={250}
            height={70}
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-6">
        {submittedTicket ? (
          <TicketDisplayCard
            ticket={submittedTicket}
            onReset={() => setSubmittedTicket(null)}
          />
        ) : (
          <TicketInputCard
            onSubmitSuccess={(ticket) => setSubmittedTicket(ticket)}
          />
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TicketInputCard from "./TicketInputCard";
import TicketDisplayCard from "./TicketDisplayCard";

export default function TicketSubmission() {
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [loading] = useState(false);

  /* ===============================
     CHECK COOKIE ON LOAD
  =============================== */
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-row sm:flex-row items-center justify-between gap-3">
            {/* Left logo */}
            <div className="flex items-center justify-center sm:justify-start">
              <Image
                src="/isos.png"
                alt="International SOS"
                width={120}
                height={25}
                className="h-auto w-25 sm:w-30"
                priority
              />
            </div>

            {/* Right logo */}
            <div className="flex items-center justify-center sm:justify-end">
              <Image
                src="/freeport.jpg"
                alt="Freeport Indonesia"
                width={250}
                height={70}
                className="h-auto w-45 sm:w-55 md:w-62.5"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex items-center justify-center h-[calc(100vh-120px)] px-6">
        {submittedTicket ? (
          <TicketDisplayCard
            ticket={submittedTicket}
            onReset={() => setSubmittedTicket(null)}
          />
        ) : (
          <TicketInputCard
            loading={loading}
            onSubmitSuccess={(ticket) => setSubmittedTicket(ticket)}
          />
        )}
      </main>
    </div>
  );
}

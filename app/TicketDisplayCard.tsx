"use client";

type Props = {
  ticket: string;
  onReset: () => void;
};

export default function TicketDisplayCard({ ticket, onReset }: Props) {
  const handleReset = () => {
    // Remove cookie by setting max-age to 0
    document.cookie = "patient_ticket=; max-age=0; path=/";
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full flex flex-col">
      <h2 className="text-4xl font-bold text-gray-800">Your Ticket Number</h2>
      <p className="text-xl text-gray-600 mb-8">Nomor tiket Anda</p>

      <div className="border rounded-lg px-8 py-24 bg-blue-50 text-center">
        <p className="text-8xl font-bold text-blue-700">{ticket}</p>
      </div>

      <p className="mt-6 text-gray-500 text-center">
        Please head to administration and state the number
        <br />
        <span className="italic">
          Silakan menuju administrasi dan menunjukkan nomor antrian
        </span>
      </p>

      {/* RESET ACTION */}
      <button
        onClick={handleReset}
        className="mt-8 text-blue-600 hover:text-blue-800 underline text-sm self-center"
      >
        Submit another queue number
        <br />
        <span className="italic text-xs">Ambil nomor antrian lain</span>
      </button>
    </div>
  );
}

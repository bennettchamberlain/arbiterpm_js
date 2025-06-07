'use client';

export default function Contact() {
  const phoneNumber = '+1 (914) 319-3250';
  const email = 'bennett@arbiterpm.com';

  const handleSMS = () => {
    window.open(`sms:${phoneNumber.replace(/[^0-9+]/g, '')}`);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${email}`);
  };

  return (
    <section id="contact" className="py-20 relative z-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Contact Us</h2>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <p className="text-3xl font-semibold text-white mb-4">{phoneNumber}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSMS}
                className="group relative px-6 py-2 rounded-md text-black border border-white transition-all duration-200 overflow-hidden bg-gradient-to-r from-white via-purple-400 to-white bg-[length:200%_100%] hover:animate-gradient-shift"
              >
                <span className="relative z-10">Send SMS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
              <button
                onClick={handleWhatsApp}
                className="group relative px-6 py-2 rounded-md text-black border border-white transition-all duration-200 overflow-hidden bg-gradient-to-r from-white via-purple-400 to-white bg-[length:200%_100%] hover:animate-gradient-shift"
              >
                <span className="relative z-10">WhatsApp</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-2xl text-white mb-4">{email}</p>
            <button
              onClick={handleEmail}
              className="group relative px-6 py-2 rounded-md text-black border border-white transition-all duration-200 overflow-hidden bg-gradient-to-r from-white via-purple-400 to-white bg-[length:200%_100%] hover:animate-gradient-shift"
            >
              <span className="relative z-10">Email Us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        .animate-gradient-shift {
          animation: gradient-shift 1s linear infinite;
        }
      `}</style>
    </section>
  );
} 
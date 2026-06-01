import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/20 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs gap-4 mt-auto">
      <div className="flex flex-col gap-1 items-center md:items-start">
        <span className="font-semibold text-slate-400">Future Path Education Portal</span>
        <span>Empowering Sri Lankan students post G.C.E. Advanced Level exams.</span>
      </div>
      <div className="flex gap-6 items-center">
        <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a>
      </div>
    </footer>
  );
};

export default Footer;

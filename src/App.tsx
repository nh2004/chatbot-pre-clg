import React from 'react';
import { Navbar } from './components/Navbar';
import { PreBot } from './components/PreBot';
import { FooterDesktop } from './screens/FooterDesktop';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFFCF7] via-[#FFF4DE] to-[#E8FAF8]">
      <Navbar />
      <main className="flex-1">
        <PreBot />
      </main>
      <FooterDesktop />
    </div>
  );
}

export default App;
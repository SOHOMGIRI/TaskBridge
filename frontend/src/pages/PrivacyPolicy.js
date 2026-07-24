import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{background:'#0A0A0A',minHeight:'100vh',padding:'60px 20px',color:'white',maxWidth:'800px',margin:'0 auto'}}>
      <h1 style={{color:'#FF6B00',fontSize:'2.5rem',marginBottom:'30px'}}>Privacy Policy 🔒</h1>
      {[
        ['Data We Collect','We collect your name, email, college/business details, and usage data to provide our services.'],
        ['How We Use Data','Your data is used to match businesses with students, process payments, and improve our platform.'],
        ['Data Security','All data is encrypted and stored securely. We never sell your personal information to third parties.'],
        ['Payments','Payment information is processed securely. We use escrow to protect both parties.'],
        ['Contact','For privacy concerns contact us at taskbridge@gmail.com or call +91 9123338497'],
      ].map(([title,text])=>(
        <div key={title} style={{background:'#111',borderRadius:'12px',padding:'25px',marginBottom:'20px',border:'1px solid #222'}}>
          <h2 style={{color:'#FF6B00',marginBottom:'12px'}}>{title}</h2>
          <p style={{color:'#ccc',lineHeight:'1.8'}}>{text}</p>
        </div>
      ))}
    </div>
  );
}
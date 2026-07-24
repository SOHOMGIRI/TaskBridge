import React from 'react';

export default function TermsOfService() {
  return (
    <div style={{background:'#0A0A0A',minHeight:'100vh',padding:'60px 20px',color:'white',maxWidth:'800px',margin:'0 auto'}}>
      <h1 style={{color:'#FF6B00',fontSize:'2.5rem',marginBottom:'30px'}}>Terms of Service 📋</h1>
      {[
        ['Acceptance','By using TaskBridge you agree to these terms. If you disagree, please do not use our platform.'],
        ['For Businesses','You agree to post genuine tasks, pay students on approval, and not misuse student work without payment.'],
        ['For Students','You agree to deliver quality work on time, maintain honesty in pitches, and not plagiarize work.'],
        ['Payments','All payments go through our escrow system. Funds are released only after business approval.'],
        ['Termination','We reserve the right to terminate accounts that violate our community guidelines.'],
        ['Contact','Questions? Contact us at taskbridge@gmail.com or +91 9123338497'],
      ].map(([title,text])=>(
        <div key={title} style={{background:'#111',borderRadius:'12px',padding:'25px',marginBottom:'20px',border:'1px solid #222'}}>
          <h2 style={{color:'#FF6B00',marginBottom:'12px'}}>{title}</h2>
          <p style={{color:'#ccc',lineHeight:'1.8'}}>{text}</p>
        </div>
      ))}
    </div>
  );
}

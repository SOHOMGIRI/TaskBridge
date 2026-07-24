import React, { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div style={{background:'#0A0A0A',minHeight:'100vh',padding:'60px 20px',color:'white',maxWidth:'800px',margin:'0 auto'}}>
      <h1 style={{color:'#FF6B00',fontSize:'2.5rem',marginBottom:'10px'}}>Contact Us 📞</h1>
      <p style={{color:'#888',marginBottom:'40px'}}>We'd love to hear from you!</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'40px'}}>
        {[
          ['📞','Phone','+91 9123338497'],
          ['📧','Email','taskbridge@gmail.com'],
          ['📍','Location','Mumbai, Maharashtra'],
          ['⏰','Support Hours','Mon-Sat 9AM-6PM']
        ].map(([icon,label,value])=>(
          <div key={label} style={{background:'#111',borderRadius:'12px',padding:'20px',border:'1px solid #222'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'8px'}}>{icon}</div>
            <div style={{color:'#888',fontSize:'0.85rem'}}>{label}</div>
            <div style={{color:'white',fontWeight:'bold'}}>{value}</div>
          </div>
        ))}
      </div>

      {sent ? (
        <div style={{background:'#1a2a1a',border:'1px solid green',borderRadius:'12px',padding:'30px',textAlign:'center'}}>
          <div style={{fontSize:'3rem'}}>✅</div>
          <h3 style={{color:'green'}}>Message Sent!</h3>
          <p style={{color:'#ccc'}}>We'll get back to you within 24 hours.</p>
        </div>
      ) : (
        <div style={{background:'#111',borderRadius:'12px',padding:'30px',border:'1px solid #222'}}>
          <h2 style={{color:'#FF6B00',marginBottom:'20px'}}>Send us a Message</h2>
          <input placeholder="Your Name" style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'8px',padding:'12px',color:'white',marginBottom:'15px',boxSizing:'border-box'}} />
          <input placeholder="Your Email" style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'8px',padding:'12px',color:'white',marginBottom:'15px',boxSizing:'border-box'}} />
          <input placeholder="Subject" style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'8px',padding:'12px',color:'white',marginBottom:'15px',boxSizing:'border-box'}} />
          <textarea placeholder="Your message..." rows={5} style={{width:'100%',background:'#1a1a1a',border:'1px solid #333',borderRadius:'8px',padding:'12px',color:'white',marginBottom:'15px',boxSizing:'border-box',resize:'vertical'}} />
          <button onClick={()=>setSent(true)} style={{width:'100%',background:'#FF6B00',color:'white',border:'none',padding:'14px',borderRadius:'8px',fontSize:'1rem',fontWeight:'bold',cursor:'pointer'}}>Send Message 🚀</button>
        </div>
      )}
    </div>
  );
}
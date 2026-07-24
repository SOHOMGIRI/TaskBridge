import React from 'react';

export default function AboutUs() {
  return (
    <div style={{background:'#0A0A0A',minHeight:'100vh',padding:'60px 20px',color:'white',maxWidth:'900px',margin:'0 auto'}}>
      <h1 style={{color:'#FF6B00',fontSize:'2.5rem',marginBottom:'10px'}}>About TaskBridge 🌉</h1>
      <p style={{color:'#FF6B00',marginBottom:'30px',fontSize:'1.1rem'}}>Instantly. Affordably. Locally.</p>
      <div style={{background:'#111',borderRadius:'12px',padding:'30px',marginBottom:'20px',border:'1px solid #222'}}>
        <h2 style={{color:'#FF6B00',marginBottom:'15px'}}>Our Mission</h2>
        <p style={{color:'#ccc',lineHeight:'1.8'}}>TaskBridge is India's hyperlocal digital talent marketplace. We connect SME businesses and MSMEs with verified college student talent for digital tasks — instantly, affordably, and locally.</p>
      </div>
      <div style={{background:'#111',borderRadius:'12px',padding:'30px',marginBottom:'20px',border:'1px solid #222'}}>
        <h2 style={{color:'#FF6B00',marginBottom:'15px'}}>The Problem We Solve</h2>
        <p style={{color:'#ccc',lineHeight:'1.8'}}>Small businesses pay ₹15,000–1,00,000/month to agencies for digital work. Students have skills but no structured way to earn. We bridge this gap by creating a trusted execution network.</p>
      </div>
      <div style={{background:'#111',borderRadius:'12px',padding:'30px',marginBottom:'20px',border:'1px solid #222'}}>
        <h2 style={{color:'#FF6B00',marginBottom:'15px'}}>Why TaskBridge?</h2>
        <p style={{color:'#ccc',lineHeight:'1.8'}}>TaskBridge builds a bridge between India's small businesses and student talent. Like a bridge, we connect two worlds that need each other — instantly, affordably, and locally. We believe every Indian SME deserves access to skilled talent, and every college student deserves a chance to earn and build their portfolio.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',marginTop:'30px'}}>
        {[['500+','Businesses'],['1200+','Students'],['₹25L+','Paid Out']].map(([num,label])=>(
          <div key={label} style={{background:'#111',borderRadius:'12px',padding:'20px',textAlign:'center',border:'1px solid #FF6B00'}}>
            <div style={{fontSize:'2rem',fontWeight:'bold',color:'#FF6B00'}}>{num}</div>
            <div style={{color:'#888'}}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

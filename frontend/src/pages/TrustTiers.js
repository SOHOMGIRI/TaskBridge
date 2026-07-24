import React from 'react';

export default function TrustTiers() {
  return (
    <div style={{background:'#0A0A0A',minHeight:'100vh',padding:'60px 20px',color:'white',maxWidth:'900px',margin:'0 auto'}}>
      <h1 style={{color:'#FF6B00',fontSize:'2.5rem',marginBottom:'10px'}}>Trust Ladder 🏆</h1>
      <p style={{color:'#888',marginBottom:'40px'}}>How students earn their reputation on TaskBridge</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'20px'}}>
        {[
          {tier:'🥉 Bronze',points:'0-25',jobs:'0-10 jobs',color:'#cd7f32',perks:['Access to all jobs','Basic profile','Submit pitches']},
          {tier:'🥈 Silver',points:'26-50',jobs:'10-25 jobs',color:'#C0C0C0',perks:['Priority in search','Silver badge','Higher visibility']},
          {tier:'🥇 Gold',points:'51-75',jobs:'25-50 jobs',color:'#FFD700',perks:['Top search results','Gold badge','Premium jobs access']},
          {tier:'💎 Verified Pro',points:'76-100',jobs:'50+ jobs',color:'#FF6B00',perks:['#1 in search','Pro badge','Exclusive high-pay jobs','Direct business contact']},
        ].map(t=>(
          <div key={t.tier} style={{background:'#111',borderRadius:'16px',padding:'25px',border:`2px solid ${t.color}`}}>
            <h2 style={{color:t.color,marginBottom:'8px'}}>{t.tier}</h2>
            <p style={{color:'#888',marginBottom:'5px'}}>{t.points} trust points</p>
            <p style={{color:'#888',marginBottom:'15px'}}>{t.jobs}</p>
            <h4 style={{color:'white',marginBottom:'10px'}}>Perks:</h4>
            {t.perks.map(p=>(
              <div key={p} style={{color:'#ccc',marginBottom:'6px',display:'flex',gap:'8px'}}>
                <span style={{color:t.color}}>✓</span>{p}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
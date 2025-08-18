'use client';
export default function Card({ title, children, right }) {
  return (
    <section className="card" style={{marginTop:16}}>
      <div className="row" style={{justifyContent:'space-between', marginBottom:10}}>
        {title ? <h3 style={{margin:0}}>{title}</h3> : <span />}
        {right || null}
      </div>
      {children}
    </section>
  );
}

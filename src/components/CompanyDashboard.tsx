import React from 'react';
import { companyInfo } from '../data/dummyData';

const CompanyDashboard: React.FC = () => {
  return (
    <div className="dashboard card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0}}>Company Dashboard</h3>
        <div style={{fontSize:14,color:'#6b7280'}}>Employees: <strong>{companyInfo.totalEmployees}</strong></div>
      </div>

      <div>
        <h4 style={{marginBottom:6}}>Latest Announcements</h4>
        <ul className="ann-list">
          {companyInfo.announcements.map(a => (
            <li key={a.id}>
              <strong>{a.title}</strong>
              <div style={{color:'#6b7280',fontSize:12}}>{a.date}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 style={{marginBottom:6}}>Useful Links</h4>
        <div className="link-list">
          {companyInfo.links.map(l => (
            <div key={l.title}><a href={l.url} target="_blank" rel="noreferrer">{l.title}</a></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
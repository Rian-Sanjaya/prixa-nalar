import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './diagnosisHistoryPage.scss';
import { HeaderContext } from '../../../components/header/HeaderContext';
import { ComplaintTab } from './ComplaintTab';
import { ActivityTab } from './ActivityTab';

export const DiagnosisHistoryPage = () => {
  const { setHeader } = useContext(HeaderContext);
  const [activeTab, setActiveTab] = useState(1);

  const history = useHistory();

  useEffect(() => {
    setHeader('Riwayat Keluhan');
    return () => setHeader('');
  }, [setHeader]);

  const tab: any = useParams();
  useEffect(() => {
    setActiveTab(tab.tab === 'result' ? 1 : 2);
  }, [setActiveTab, tab, activeTab]);

  const selectedTab = (tab: number) => {
    if (activeTab === tab) return 'tab active';
    return 'tab';
  };

  return (
    <>
      <div style={{ position: 'fixed', width: 'inherit', zIndex: 1 }}>
        <div className="diagnosis-tab">
          <div className={selectedTab(1)} onClick={() => history.push('/diagnosis-history/result')}>
            <span>Keluhan</span>
          </div>
          <div className={selectedTab(2)} onClick={() => history.push('/diagnosis-history/activity')}>
            <span>Aktivitas</span>
          </div>
        </div>
      </div>
      {activeTab === 1 ? <ComplaintTab /> : <ActivityTab />}
    </>
  );
};

export default DiagnosisHistoryPage;

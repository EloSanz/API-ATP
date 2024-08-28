import React, { useState } from 'react';
import { usePlayers } from '../../hooks/usePlayers';
import styles from './HomePage.module.css';
import CardGrid from '../Players/CardGrid';

const HomePage: React.FC = () => {
  const [eventType, setEventType] = useState<'ATP' | 'WTA'>('ATP');
  const { players, loading, error } = usePlayers(eventType);

  if (loading) {  return <p>Loading players...</p>; }
  if (error) {  return <p>{error}</p>;  }

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tennis API</h1>
      </header>
      <div className={styles.sidebar}>
        <button onClick={() => setEventType('ATP')}>ATP</button>
        <button onClick={() => setEventType('WTA')}>WTA</button>
      </div>
      <div className={styles.mainContent}>
        <CardGrid players={players} />
      </div>
    </div>
  );
};

export default HomePage;

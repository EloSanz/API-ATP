import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles/PlayerDetails.module.css';
import { PlayerDto } from './playerDTO';
import { getPlayer } from '../../services/apiService';

const PlayerDetails: React.FC = () => {
  const { playerKey } = useParams<{ playerKey: string }>();
  const [player, setPlayer] = useState<PlayerDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const data = await getPlayer(playerKey);
        setPlayer(data.result);
        setLoading(false);
      } catch(error) {
        setError('Error fetching player details');
        console.log(error);
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [playerKey]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!player) return <p>No player found</p>;

  return (
    <div className={styles.playerDetails}>
      <h1>{player.player_full_name}</h1>
      <img src={player.player_logo} alt={player.player_name} />
      <p>Country: {player.player_country}</p>
      <p>Date of Birth: {player.player_bday}</p>
    </div>
  );
};

export default PlayerDetails;

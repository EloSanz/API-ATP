import { Link } from "react-router-dom";
import { PlayerDto } from "./playerDTO";
import styles from './styles/Card.module.css';
interface CardProps {
  player: PlayerDto;
}

export default function Card ({ player } : CardProps) {
  return (
    <Link to={`/player/${player.player_key}`} className={styles.card}>
      <img src={player.player_logo || 'https://via.placeholder.com/200'} alt={player.player_name} />
      <div className={styles.cardBody}>
        <h2>{player.player_full_name}</h2>
        <p>Country: {player.player_country}</p>
        <p>Date of Birth: {player.player_bday}</p>
      </div>
    </Link>
  );
};


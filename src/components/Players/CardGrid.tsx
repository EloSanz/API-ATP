import styles from './styles/CardGrid.module.css';
import { PlayerDto } from './playerDTO';
import Card from './Card';

interface CardGridProps {
  players: PlayerDto[];
}

export default function CardGrid ({ players } : CardGridProps){
  return (
    <div className={styles.cardGrid}>
      {players.map((player) => (
        <Card player={player} key={player.player_key} />
      ))}
    </div>
  );
};


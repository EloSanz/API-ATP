import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlayerDto } from "../components/Players/playerDTO";
import { getPlayer } from "../services/apiService";

export const usePlayerDetails = () => {
  const { playerKey = "" } = useParams<{ playerKey: string }>();
  const [player, setPlayer] = useState<PlayerDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const playerData = await getPlayer(playerKey);
        setPlayer(playerData.result);
      } catch (error) {
        setError("Error fetching player details");
        console.log(error);
        setLoading(false);
      }finally { setLoading(false); }
    };

    fetchPlayerDetails();
  }, [playerKey]);

  return { player, loading, error };
};

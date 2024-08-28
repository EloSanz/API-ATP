import { useState, useEffect } from "react";
import { getStandings } from "../services/apiService";
import { PlayerDto } from "../components/Players/playerDTO";

export const usePlayers = (eventType: "ATP" | "WTA" = "WTA") => {
  const [players, setPlayers] = useState<PlayerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getStandings(eventType);
        setPlayers(data.result);
      } catch (err) {
        setError("Error fetching standings");
        console.error(err);
      } finally { setLoading(false); }
    };

    fetchPlayers();
  }, [eventType]);

  return { players, loading, error };
};

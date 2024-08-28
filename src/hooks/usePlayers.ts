import { useState, useEffect } from "react";
import { getStandings } from "../services/apiService";
import { usePlayerPhotos } from "../hooks/usePlayerPhotos";
import { PlayerDto } from "../components/Players/playerDTO";

export const usePlayers = (eventType: "ATP" | "WTA" = "WTA") => {
  const [players, setPlayers] = useState<PlayerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerKeys, setPlayerKeys] = useState<string[]>([]);

  // Hook para cargar fotos de jugadores
  const { photos, loading: photosLoading, error: photosError } = usePlayerPhotos(playerKeys);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getStandings(eventType);
        const keys = data.result.map(player => player.player_key);
        setPlayerKeys(keys); // Establece las claves de los jugadores
        setPlayers(data.result); // Establece los jugadores
      } catch (err) {
        setError("Error fetching standings");
        console.error(err);
      } finally { setLoading(false); }
    };

    fetchPlayers();
  }, [eventType]);

  useEffect(() => {
    if (playerKeys.length === 0) return; //

    const updatePlayersWithPhotos = async () => {
      try {
        if (!photosLoading && !photosError) {
          const updatedPlayers = players.map(player => ({
            ...player,
            player_logo: photos[player.player_key] || ""
          }));
          setPlayers(updatedPlayers);
        }
      } catch (err) {
        setError("Error updating player photos");
        console.error(err);
      }
    };

    updatePlayersWithPhotos();
  }, [playerKeys, photos, photosLoading, photosError]); // no meters players porque genera bucle infinito

  if (loading || photosLoading) { return { players: [], loading: true, error: null }; }

  if (error || photosError) { return { players: [], loading: false, error: error || photosError }; }

  return { players, loading, error };
};

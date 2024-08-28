import { useState, useEffect } from "react";
import axios from "axios";
import { cachePlayerPhotos, getCachedPlayerPhotos } from "../services/utils";

const API_BASE_URL = "https://api.api-tennis.com/tennis/";
const API_KEY = "cd83e71e2a6f9248c49f882901f12896ace67084ccd9ea71c60e1e96d3b64ce0";

const fetchPlayerPhotos = async (playerKeys: string[]): Promise<Record<string, string>> => {
  try {
    const photos: Record<string, string> = {};
    
    for (const playerKey of playerKeys) {
      const response = await axios.get(API_BASE_URL, {
        params: {
          method: "get_players",
          APIkey: API_KEY,
          player_key: playerKey,
        },
      });

      const player = response.data.result[0];
      if (player && player.player_key) {
        photos[player.player_key] = player.player_logo || "";
      }
    }

    return photos;
  } catch (error) {
    console.error("Error fetching player photos:", error);
    throw error;
  }
};

export const usePlayerPhotos = (playerKeys: string[]) => {
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const cachedPhotos = getCachedPlayerPhotos();
        const missingKeys = playerKeys.filter(key => !cachedPhotos || !cachedPhotos[key]);

        if (missingKeys.length > 0) {
          const newPhotos = await fetchPlayerPhotos(missingKeys);
          const allPhotos = { ...cachedPhotos, ...newPhotos };
          cachePlayerPhotos(allPhotos);
          setPhotos(allPhotos);
        } else {
          setPhotos(cachedPhotos || {});
        }
      } catch (err) {
        setError("Error fetching player photos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [playerKeys]);

  return { photos, loading, error };
};

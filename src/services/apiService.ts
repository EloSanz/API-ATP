/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { PlayerDto } from "../components/Players/playerDTO";

const API_BASE_URL = "https://api.api-tennis.com/tennis/";
const API_KEY =
  "cd83e71e2a6f9248c49f882901f12896ace67084ccd9ea71c60e1e96d3b64ce0";

export const getPlayer = async (
  playerKey: string = "1000"
): Promise<{ result: PlayerDto }> => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        method: "get_players",
        APIkey: API_KEY,
        player_key: playerKey,
      },
    });

    const playerData = response.data.result[0]; // Ajusta según la estructura real de la respuesta

    const player: PlayerDto = {
      player_key: parseInt(playerData.player_key, 10),
      player_name: playerData.player_name,
      player_full_name: playerData.player_full_name,
      player_country: playerData.player_country,
      player_bday: playerData.player_bday,
      player_logo: playerData.player_logo,
      stats: playerData.stats.map((stat: any) => ({
        season: stat.season,
        type: stat.type,
        rank: stat.rank,
        titles: stat.titles,
        matches_won: stat.matches_won,
        matches_lost: stat.matches_lost,
        hard_won: stat.hard_won,
        hard_lost: stat.hard_lost,
        clay_won: stat.clay_won,
        clay_lost: stat.clay_lost,
        grass_won: stat.grass_won,
        grass_lost: stat.grass_lost,
      })),
    };

    return { result: player };
  } catch (error) {
    console.error("Error fetching player:", error);
    throw error;
  }
};

export const getStandings = async (
  eventType: "ATP" | "WTA" = "ATP"
): Promise<{ result: PlayerDto[] }> => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        method: "get_standings",
        APIkey: API_KEY,
        event_type: eventType,
      },
    });

    const standings = response.data.result.slice(0, 20);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const players: PlayerDto[] = standings.map((player: any) => ({
      player_key: parseInt(player.player_key, 10),
      player_name: player.player,
      player_full_name: player.player,
      player_country: player.country,
      player_bday: "", // Ajusta estos campos si la API proporciona más datos
      player_logo: "",
      stats: [], // Ajusta estos campos si la API proporciona más datos
    }));

    return { result: players };
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

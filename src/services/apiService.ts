/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { PlayerDto } from "../components/Players/playerDTO";
import {transformPlayerData, cachePlayerPhotos, getCachedPlayerPhotos } from "./utils";

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

    const playerData = response.data.result[0];
    const player: PlayerDto  = transformPlayerData(playerData);
    
    return { result: player };
  } catch (error) {
    console.error("Error fetching player:", error);
    throw error;
  }
};

export const getStandings = async (eventType: "ATP" | "WTA" = "ATP"): Promise<{ result: PlayerDto[] }> => {
  try {
    const cachedPhotos = getCachedPlayerPhotos();
    if(!cachedPhotos)
      cachePlayerPhotos({});
    else
      console.log("Photos cached", cachedPhotos);

    const standings = await fetchStandings(eventType);

    const validStandings = standings.filter((player: any) => player.player_key);
    const playerKeys = validStandings.map((player: any) => player.player_key);
    const missingKeys = playerKeys.filter((key: string) => cachedPhotos && !cachedPhotos[key]);

    if (missingKeys.length > 0) {
      const photos = await fetchPlayerPhotos(missingKeys);
      cachePlayerPhotos({ ...cachedPhotos, ...photos });
    }

    const players: PlayerDto[] = validStandings.map((player: any) => ({
      player_key: player.player_key,
      player_name: player.player_name,
      player_full_name: player.player_full_name,
      player_country: player.country,
      player_bday: "",
      player_logo: cachedPhotos ? cachedPhotos[player.player_key] || "" : "",
      stats: [],
    }));

    return { result: players };
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

const fetchStandings = async (
  eventType: "ATP" | "WTA" = "ATP"
): Promise<any[]> => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        method: "get_standings",
        APIkey: API_KEY,
        event_type: eventType,
      },
    });

    return response.data.result.slice(0, 20);
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

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
        photos[player.player_key] = player.player_logo || player.player_full_name + ' without logo';
      }
    }

    return photos;
  } catch (error) {
    console.error("Error fetching player photos:", error);
    throw error;
  }
};

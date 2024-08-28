/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlayerDto } from "../components/Players/playerDTO";

const transformPlayerData = (playerData: any): PlayerDto => {
  return {
    player_key: playerData.player_key,
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
};


const cachePlayerPhotos = (photos: Record<string, string>): void => {
  localStorage.setItem("playerPhotos", JSON.stringify(photos));
};

const getCachedPlayerPhotos = (): Record<string, string> | null => {
  const cached = localStorage.getItem("playerPhotos");
  return cached ? JSON.parse(cached) : null;
};

export { transformPlayerData, cachePlayerPhotos, getCachedPlayerPhotos };
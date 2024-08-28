export interface PlayerDto {
  player_key: number;
  player_name: string;
  player_full_name: string;
  player_country: string;
  player_bday: string;
  player_logo: string;
  stats: Array<{
    season: string;
    type: string;
    rank: string;
    titles: string;
    matches_won: string;
    matches_lost: string;
    hard_won: string;
    hard_lost: string;
    clay_won: string;
    clay_lost: string;
    grass_won: string;
    grass_lost: string;
  }>;
}

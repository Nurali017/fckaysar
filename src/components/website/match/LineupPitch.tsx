import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineupPlayer, LineupTeam, transformImagePath } from '@/api/types/match-details-types';
import { PlayerCard } from './PlayerCard';
import { Shield } from 'lucide-react';

interface LineupPitchProps {
  homeTeam: LineupTeam;
  awayTeam: LineupTeam;
}

export const LineupPitch: React.FC<LineupPitchProps> = ({ homeTeam, awayTeam }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<LineupPlayer | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away' | null>(null);

  const handlePlayerClick = (player: LineupPlayer, team: 'home' | 'away') => {
    setSelectedPlayer(player);
    setSelectedTeam(team);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Home Team */}
        <TeamList
          team={homeTeam}
          teamType="home"
          onPlayerClick={(player) => handlePlayerClick(player, 'home')}
        />

        {/* Away Team */}
        <TeamList
          team={awayTeam}
          teamType="away"
          onPlayerClick={(player) => handlePlayerClick(player, 'away')}
        />
      </div>

      {/* Player Card Modal */}
      <AnimatePresence>
        {selectedPlayer && selectedTeam && (
          <PlayerCard
            player={selectedPlayer}
            team={selectedTeam === 'home' ? homeTeam : awayTeam}
            isOpen={true}
            onClose={() => {
              setSelectedPlayer(null);
              setSelectedTeam(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Team List Component
const TeamList: React.FC<{
  team: LineupTeam;
  teamType: 'home' | 'away';
  onPlayerClick: (player: LineupPlayer) => void;
}> = ({ team, teamType, onPlayerClick }) => {
  const brandColor = team.brand_color || (teamType === 'home' ? '#eab308' : '#dc2626');

  // Разделяем на основу и запас
  const allGks = team.lineup.filter(p => p.is_gk);
  const allOutfield = team.lineup.filter(p => !p.is_gk);

  // Основной состав: 1 GK + 10 outfield = 11
  // NOTA: SOTA API не присылает разделение на основу/запас, показываем только первых 11
  const startingGk = allGks[0];
  const startingOutfield = allOutfield.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: teamType === 'home' ? 0 : 0.1 }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
    >
      {/* Team Header */}
      <div
        className="px-5 py-4 flex items-center gap-4"
        style={{ background: `linear-gradient(135deg, ${brandColor}30 0%, transparent 100%)` }}
      >
        {team.bas_logo_path && (
          <img
            src={team.bas_logo_path}
            alt={team.name}
            className="w-10 h-10 object-contain"
          />
        )}
        <div>
          <h3 className="text-white font-bold text-lg">{team.name}</h3>
          <p className="text-gray-400 text-sm">{teamType === 'home' ? 'Хозяева' : 'Гости'}</p>
        </div>
      </div>

      {/* ОСНОВНОЙ СОСТАВ */}
      <div className="divide-y divide-white/5">
        <div className="px-3 py-2 bg-emerald-500/10 border-b border-emerald-500/20">
          <p className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
            Основной состав
          </p>
        </div>

        {/* Вратарь */}
        {startingGk && (
          <div className="px-2 py-2 bg-white/5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-3 py-1">
              Вратарь
            </p>
            <PlayerRow
              player={startingGk}
              color={brandColor}
              onClick={() => onPlayerClick(startingGk)}
              index={0}
            />
          </div>
        )}

        {/* Полевые игроки основы */}
        {startingOutfield.length > 0 && (
          <div className="px-2 py-2">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-3 py-1">
              Полевые игроки
            </p>
            {startingOutfield.map((player, index) => (
              <PlayerRow
                key={player.id}
                player={player}
                color={brandColor}
                onClick={() => onPlayerClick(player)}
                index={index + 1}
              />
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
};

// Player Row Component
const PlayerRow: React.FC<{
  player: LineupPlayer;
  color: string;
  onClick: () => void;
  index: number;
}> = ({ player, color, onClick, index }) => {
  const playerImage = transformImagePath(player.bas_image_path);
  const hasCustomImage = player.bas_image_path && !playerImage.includes('default-player');

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
    >
      {/* Jersey Number */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
        style={{ backgroundColor: color }}
      >
        {player.number}
      </div>

      {/* Player Photo */}
      <div
        className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white/20 group-hover:border-white/40 transition-colors"
        style={{ backgroundColor: hasCustomImage ? '#1f2937' : color }}
      >
        {hasCustomImage ? (
          <img
            src={playerImage}
            alt={player.full_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
          style={{ display: hasCustomImage ? 'none' : 'flex' }}
        >
          {(player.last_name || player.full_name || 'NN').slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Player Name */}
      <div className="flex-1 text-left min-w-0">
        <p className="text-white font-medium text-sm truncate group-hover:text-white/90">
          {player.full_name || ''} {player.last_name || ''}
        </p>
      </div>

      {/* Captain Badge */}
      {player.is_captain && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 shrink-0">
          <Shield className="w-3 h-3 text-yellow-500" />
          <span className="text-[10px] text-yellow-500 font-semibold">C</span>
        </div>
      )}
    </motion.button>
  );
};

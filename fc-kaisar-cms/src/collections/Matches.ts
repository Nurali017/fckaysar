import type { CollectionConfig } from 'payload'

/**
 * Matches Collection
 * Stores match data synced from SOTA API
 */
export const Matches: CollectionConfig = {
  slug: 'matches',
  admin: {
    useAsTitle: 'sotaId',
    defaultColumns: ['homeTeam.name', 'awayTeam.name', 'matchDate', 'status', 'tour'],
    description: 'Match data synced from SOTA API',
  },
  access: {
    read: () => true,
  },
  fields: [
    // === IDENTIFICATION ===
    {
      name: 'sotaId',
      type: 'text',
      label: 'SOTA ID',
      required: true,
      unique: true,
      admin: { description: 'UUID матча из SOTA API' },
    },
    {
      name: 'seasonId',
      type: 'number',
      label: 'Season ID',
      defaultValue: 61,
    },
    {
      name: 'tour',
      type: 'number',
      label: 'Тур',
    },

    // === HOME TEAM ===
    {
      name: 'homeTeam',
      type: 'group',
      label: 'Домашняя команда',
      fields: [
        { name: 'id', type: 'number', label: 'ID команды' },
        { name: 'name', type: 'text', label: 'Название' },
        { name: 'shortName', type: 'text', label: 'Короткое название' },
        { name: 'logo', type: 'text', label: 'URL логотипа' },
        { name: 'score', type: 'number', label: 'Счёт' },
        { name: 'brandColor', type: 'text', label: 'Цвет бренда' },
      ],
    },

    // === AWAY TEAM ===
    {
      name: 'awayTeam',
      type: 'group',
      label: 'Гостевая команда',
      fields: [
        { name: 'id', type: 'number', label: 'ID команды' },
        { name: 'name', type: 'text', label: 'Название' },
        { name: 'shortName', type: 'text', label: 'Короткое название' },
        { name: 'logo', type: 'text', label: 'URL логотипа' },
        { name: 'score', type: 'number', label: 'Счёт' },
        { name: 'brandColor', type: 'text', label: 'Цвет бренда' },
      ],
    },

    // === TIME & PLACE ===
    {
      name: 'matchDate',
      type: 'date',
      label: 'Дата матча',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'venue',
      type: 'text',
      label: 'Стадион',
    },
    {
      name: 'competition',
      type: 'text',
      label: 'Турнир',
    },
    {
      name: 'visitors',
      type: 'number',
      label: 'Посещаемость',
    },

    // === STATUS ===
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      options: [
        { label: 'Запланирован', value: 'scheduled' },
        { label: 'Live', value: 'live' },
        { label: 'Завершен', value: 'finished' },
      ],
      defaultValue: 'scheduled',
    },
    {
      name: 'hasStats',
      type: 'checkbox',
      label: 'Есть статистика',
      defaultValue: false,
    },

    // === TEAM STATS ===
    {
      name: 'teamStats',
      type: 'group',
      label: 'Статистика команд',
      fields: [
        {
          name: 'home',
          type: 'group',
          label: 'Хозяева',
          fields: [
            { name: 'possession', type: 'number', label: '% владения' },
            { name: 'shots', type: 'number', label: 'Удары' },
            { name: 'shotsOnGoal', type: 'number', label: 'В створ' },
            { name: 'shotsOffGoal', type: 'number', label: 'Мимо' },
            { name: 'passes', type: 'number', label: 'Пасы' },
            { name: 'fouls', type: 'number', label: 'Фолы' },
            { name: 'corners', type: 'number', label: 'Угловые' },
            { name: 'offsides', type: 'number', label: 'Офсайды' },
            { name: 'yellowCards', type: 'number', label: 'ЖК' },
            { name: 'redCards', type: 'number', label: 'КК' },
          ],
        },
        {
          name: 'away',
          type: 'group',
          label: 'Гости',
          fields: [
            { name: 'possession', type: 'number', label: '% владения' },
            { name: 'shots', type: 'number', label: 'Удары' },
            { name: 'shotsOnGoal', type: 'number', label: 'В створ' },
            { name: 'shotsOffGoal', type: 'number', label: 'Мимо' },
            { name: 'passes', type: 'number', label: 'Пасы' },
            { name: 'fouls', type: 'number', label: 'Фолы' },
            { name: 'corners', type: 'number', label: 'Угловые' },
            { name: 'offsides', type: 'number', label: 'Офсайды' },
            { name: 'yellowCards', type: 'number', label: 'ЖК' },
            { name: 'redCards', type: 'number', label: 'КК' },
          ],
        },
      ],
    },

    // === REFEREES ===
    {
      name: 'referees',
      type: 'group',
      label: 'Судьи',
      fields: [
        { name: 'main', type: 'text', label: 'Главный судья' },
        { name: 'firstAssistant', type: 'text', label: '1-й ассистент' },
        { name: 'secondAssistant', type: 'text', label: '2-й ассистент' },
        { name: 'fourthReferee', type: 'text', label: '4-й судья' },
        { name: 'var', type: 'text', label: 'VAR' },
        { name: 'varAssistant', type: 'text', label: 'Ассистент VAR' },
      ],
    },

    // === LINEUPS ===
    {
      name: 'homeLineup',
      type: 'array',
      label: 'Состав хозяев',
      fields: [
        { name: 'playerId', type: 'text', label: 'ID игрока' },
        { name: 'number', type: 'number', label: 'Номер' },
        { name: 'fullName', type: 'text', label: 'Полное имя' },
        { name: 'lastName', type: 'text', label: 'Фамилия' },
        { name: 'isGk', type: 'checkbox', label: 'Вратарь' },
        { name: 'isCaptain', type: 'checkbox', label: 'Капитан' },
        { name: 'photo', type: 'text', label: 'URL фото' },
      ],
    },
    {
      name: 'awayLineup',
      type: 'array',
      label: 'Состав гостей',
      fields: [
        { name: 'playerId', type: 'text', label: 'ID игрока' },
        { name: 'number', type: 'number', label: 'Номер' },
        { name: 'fullName', type: 'text', label: 'Полное имя' },
        { name: 'lastName', type: 'text', label: 'Фамилия' },
        { name: 'isGk', type: 'checkbox', label: 'Вратарь' },
        { name: 'isCaptain', type: 'checkbox', label: 'Капитан' },
        { name: 'photo', type: 'text', label: 'URL фото' },
      ],
    },

    // === COACHES ===
    {
      name: 'homeCoach',
      type: 'group',
      label: 'Тренер хозяев',
      fields: [
        { name: 'name', type: 'text', label: 'Имя' },
        { name: 'photo', type: 'text', label: 'URL фото' },
      ],
    },
    {
      name: 'awayCoach',
      type: 'group',
      label: 'Тренер гостей',
      fields: [
        { name: 'name', type: 'text', label: 'Имя' },
        { name: 'photo', type: 'text', label: 'URL фото' },
      ],
    },

    // === PLAYER STATS ===
    {
      name: 'homePlayers',
      type: 'array',
      label: 'Статистика игроков (хозяева)',
      fields: [
        { name: 'playerId', type: 'text', label: 'ID игрока' },
        { name: 'name', type: 'text', label: 'Имя' },
        { name: 'number', type: 'number', label: 'Номер' },
        { name: 'shots', type: 'number', label: 'Удары' },
        { name: 'shotsOnGoal', type: 'number', label: 'В створ' },
        { name: 'passes', type: 'number', label: 'Пасы' },
        { name: 'fouls', type: 'number', label: 'Фолы' },
        { name: 'yellowCards', type: 'number', label: 'ЖК' },
        { name: 'redCards', type: 'number', label: 'КК' },
        { name: 'duels', type: 'number', label: 'Единоборства' },
        { name: 'tackles', type: 'number', label: 'Отборы' },
        { name: 'offsides', type: 'number', label: 'Офсайды' },
        { name: 'corners', type: 'number', label: 'Угловые' },
      ],
    },
    {
      name: 'awayPlayers',
      type: 'array',
      label: 'Статистика игроков (гости)',
      fields: [
        { name: 'playerId', type: 'text', label: 'ID игрока' },
        { name: 'name', type: 'text', label: 'Имя' },
        { name: 'number', type: 'number', label: 'Номер' },
        { name: 'shots', type: 'number', label: 'Удары' },
        { name: 'shotsOnGoal', type: 'number', label: 'В створ' },
        { name: 'passes', type: 'number', label: 'Пасы' },
        { name: 'fouls', type: 'number', label: 'Фолы' },
        { name: 'yellowCards', type: 'number', label: 'ЖК' },
        { name: 'redCards', type: 'number', label: 'КК' },
        { name: 'duels', type: 'number', label: 'Единоборства' },
        { name: 'tackles', type: 'number', label: 'Отборы' },
        { name: 'offsides', type: 'number', label: 'Офсайды' },
        { name: 'corners', type: 'number', label: 'Угловые' },
      ],
    },

    // === META ===
    {
      name: 'lastSyncAt',
      type: 'date',
      label: 'Последняя синхронизация',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
    },

    // === CMS ONLY FIELDS (not from SOTA) ===
    {
      name: 'highlights',
      type: 'upload',
      relationTo: 'media',
      label: 'Видео обзор',
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Фото с матча',
    },
    {
      name: 'ticketLink',
      type: 'text',
      label: 'Ссылка на билеты',
    },
    {
      name: 'matchReport',
      type: 'richText',
      label: 'Отчет о матче',
      localized: true,
    },
  ],
}

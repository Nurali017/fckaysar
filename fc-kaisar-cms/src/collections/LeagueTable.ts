import type { CollectionConfig } from 'payload'

export const LeagueTable: CollectionConfig = {
  slug: 'league-table',
  admin: {
    useAsTitle: 'teamName',
    defaultColumns: ['position', 'teamName', 'played', 'points', 'updatedAt'],
    description: 'Турнирная таблица - синхронизируется из SOTA API',
    group: 'SOTA Данные',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // === Идентификация ===
    {
      name: 'teamId',
      type: 'number',
      required: true,
      label: 'ID команды (SOTA)',
      admin: {
        description: 'Уникальный ID команды из SOTA API',
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'teamName',
      type: 'text',
      required: true,
      label: 'Название команды',
      localized: true,
    },
    {
      name: 'teamLogo',
      type: 'text',
      label: 'URL логотипа',
      admin: {
        description: 'URL логотипа команды из SOTA API',
      },
    },

    // === Позиция ===
    {
      name: 'position',
      type: 'number',
      required: true,
      label: 'Позиция',
      min: 1,
      admin: {
        readOnly: true,
      },
    },

    // === Статистика матчей ===
    {
      name: 'played',
      type: 'number',
      required: true,
      label: 'Игры',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'won',
      type: 'number',
      required: true,
      label: 'Победы',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'drawn',
      type: 'number',
      required: true,
      label: 'Ничьи',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'lost',
      type: 'number',
      required: true,
      label: 'Поражения',
      defaultValue: 0,
      admin: { readOnly: true },
    },

    // === Голы ===
    {
      name: 'goalsFor',
      type: 'number',
      required: true,
      label: 'Забитые голы',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'goalsAgainst',
      type: 'number',
      required: true,
      label: 'Пропущенные голы',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'goalDifference',
      type: 'number',
      required: true,
      label: 'Разница голов',
      defaultValue: 0,
      admin: { readOnly: true },
    },

    // === Очки ===
    {
      name: 'points',
      type: 'number',
      required: true,
      label: 'Очки',
      defaultValue: 0,
      admin: { readOnly: true },
    },

    // === Метаданные ===
    {
      name: 'seasonId',
      type: 'number',
      required: true,
      label: 'ID сезона',
      defaultValue: 61,
      admin: {
        description: 'ID сезона из SOTA API (61 = 2025)',
      },
      index: true,
    },
    {
      name: 'tournamentId',
      type: 'number',
      label: 'ID турнира',
      defaultValue: 7,
      admin: {
        description: 'ID турнира из SOTA API (7 = Premier League)',
      },
    },
    {
      name: 'lastSyncAt',
      type: 'date',
      label: 'Последняя синхронизация',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
    {
      name: 'isKaisar',
      type: 'checkbox',
      label: 'FC Kaisar',
      defaultValue: false,
      admin: {
        description: 'Отметка для команды FC Kaisar (teamId = 94)',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Автоматически помечаем FC Kaisar
        if (data?.teamId === 94) {
          data.isKaisar = true
        }
        return data
      },
    ],
  },
}

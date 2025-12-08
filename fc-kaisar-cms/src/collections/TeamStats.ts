import type { CollectionConfig } from 'payload'

export const TeamStats: CollectionConfig = {
  slug: 'team-stats',
  admin: {
    useAsTitle: 'teamId',
    defaultColumns: ['teamId', 'seasonId', 'gamesPlayed', 'points', 'goals', 'updatedAt'],
    description: 'Статистика команды - синхронизируется из SOTA API',
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
      label: 'ID команды',
      defaultValue: 94,
      admin: { readOnly: true },
      index: true,
    },
    {
      name: 'seasonId',
      type: 'number',
      required: true,
      label: 'ID сезона',
      defaultValue: 61,
      admin: { readOnly: true },
      index: true,
    },

    // === Основные показатели ===
    {
      type: 'row',
      fields: [
        {
          name: 'gamesPlayed',
          type: 'number',
          label: 'Матчей сыграно',
          defaultValue: 0,
          admin: { readOnly: true, width: '25%' },
        },
        {
          name: 'gamesTotal',
          type: 'number',
          label: 'Матчей всего',
          defaultValue: 0,
          admin: { readOnly: true, width: '25%' },
        },
        {
          name: 'points',
          type: 'number',
          label: 'Очки',
          defaultValue: 0,
          admin: { readOnly: true, width: '25%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'wins',
          type: 'number',
          label: 'Победы',
          defaultValue: 0,
          admin: { readOnly: true, width: '33%' },
        },
        {
          name: 'draws',
          type: 'number',
          label: 'Ничьи',
          defaultValue: 0,
          admin: { readOnly: true, width: '33%' },
        },
        {
          name: 'losses',
          type: 'number',
          label: 'Поражения',
          defaultValue: 0,
          admin: { readOnly: true, width: '33%' },
        },
      ],
    },

    // === Голы ===
    {
      type: 'row',
      fields: [
        {
          name: 'goals',
          type: 'number',
          label: 'Голы забитые',
          defaultValue: 0,
          admin: { readOnly: true, width: '33%' },
        },
        {
          name: 'goalsConceded',
          type: 'number',
          label: 'Голы пропущенные',
          defaultValue: 0,
          admin: { readOnly: true, width: '33%' },
        },
        {
          name: 'goalsDifference',
          type: 'number',
          label: 'Разница голов',
          defaultValue: 0,
          admin: { readOnly: true, width: '33%' },
        },
      ],
    },

    // === Атака ===
    {
      name: 'attackStats',
      type: 'group',
      label: 'Атака',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'shots', type: 'number', label: 'Удары', defaultValue: 0, admin: { readOnly: true } },
            { name: 'shotsOnGoal', type: 'number', label: 'Удары в створ', defaultValue: 0, admin: { readOnly: true } },
            { name: 'xg', type: 'number', label: 'xG', defaultValue: 0, admin: { readOnly: true } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'assists', type: 'number', label: 'Голевые передачи', defaultValue: 0, admin: { readOnly: true } },
            { name: 'corners', type: 'number', label: 'Угловые', defaultValue: 0, admin: { readOnly: true } },
            { name: 'crosses', type: 'number', label: 'Кроссы', defaultValue: 0, admin: { readOnly: true } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'penalties', type: 'number', label: 'Пенальти', defaultValue: 0, admin: { readOnly: true } },
            { name: 'keyPasses', type: 'number', label: 'Ключевые пасы', defaultValue: 0, admin: { readOnly: true } },
          ],
        },
      ],
    },

    // === Владение и пасы ===
    {
      name: 'possessionStats',
      type: 'group',
      label: 'Владение и пасы',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'possession', type: 'number', label: 'Владение (%)', defaultValue: 0, admin: { readOnly: true } },
            { name: 'passes', type: 'number', label: 'Пасы', defaultValue: 0, admin: { readOnly: true } },
            { name: 'passAccuracy', type: 'number', label: 'Точность пасов (%)', defaultValue: 0, admin: { readOnly: true } },
          ],
        },
      ],
    },

    // === Защита ===
    {
      name: 'defenseStats',
      type: 'group',
      label: 'Защита',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'duels', type: 'number', label: 'Дуэли', defaultValue: 0, admin: { readOnly: true } },
            { name: 'tackles', type: 'number', label: 'Отборы', defaultValue: 0, admin: { readOnly: true } },
            { name: 'interceptions', type: 'number', label: 'Перехваты', defaultValue: 0, admin: { readOnly: true } },
            { name: 'offsides', type: 'number', label: 'Офсайды', defaultValue: 0, admin: { readOnly: true } },
          ],
        },
      ],
    },

    // === Дисциплина ===
    {
      name: 'disciplineStats',
      type: 'group',
      label: 'Дисциплина',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'fouls', type: 'number', label: 'Фолы', defaultValue: 0, admin: { readOnly: true } },
            { name: 'yellowCards', type: 'number', label: 'Жёлтые карточки', defaultValue: 0, admin: { readOnly: true } },
            { name: 'secondYellowCards', type: 'number', label: 'Вторые жёлтые', defaultValue: 0, admin: { readOnly: true } },
            { name: 'redCards', type: 'number', label: 'Красные карточки', defaultValue: 0, admin: { readOnly: true } },
          ],
        },
      ],
    },

    // === Посещаемость ===
    {
      name: 'attendanceStats',
      type: 'group',
      label: 'Посещаемость',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'averageVisitors', type: 'number', label: 'Средняя посещаемость', defaultValue: 0, admin: { readOnly: true } },
            { name: 'totalVisitors', type: 'number', label: 'Всего зрителей', defaultValue: 0, admin: { readOnly: true } },
          ],
        },
      ],
    },

    // === Мета ===
    {
      name: 'lastSyncAt',
      type: 'date',
      label: 'Последняя синхронизация',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
    },
  ],
}

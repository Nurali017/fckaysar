import type { CollectionConfig } from 'payload'

export const PlayerRecommendations: CollectionConfig = {
  slug: 'player-recommendations',
  admin: {
    useAsTitle: 'playerFullName',
    defaultColumns: [
      'playerFullName',
      'position',
      'city',
      'recommenderRelation',
      'status',
      'createdAt',
    ],
    group: 'Скауты',
    description: 'Рекомендации игроков от тренеров, агентов и болельщиков',
  },
  access: {
    // Публичная отправка формы
    create: () => true,
    // Только админы могут просматривать и редактировать
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // === Данные об игроке ===
    {
      type: 'collapsible',
      label: 'Информация об игроке',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'playerFullName',
          type: 'text',
          required: true,
          label: 'Имя и фамилия игрока',
        },
        {
          name: 'birthYear',
          type: 'number',
          required: true,
          label: 'Год рождения',
          min: 1990,
          max: 2020,
        },
        {
          name: 'position',
          type: 'select',
          required: true,
          label: 'Позиция',
          options: [
            { label: 'Вратарь', value: 'goalkeeper' },
            { label: 'Защитник', value: 'defender' },
            { label: 'Полузащитник', value: 'midfielder' },
            { label: 'Нападающий', value: 'forward' },
          ],
        },
        {
          name: 'currentClub',
          type: 'text',
          label: 'Текущий клуб/команда',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'Город/регион',
        },
        {
          name: 'playerContact',
          type: 'text',
          required: true,
          label: 'Контакт игрока/родителей',
          admin: {
            description: 'Телефон или email',
          },
        },
      ],
    },

    // === Данные о рекомендующем ===
    {
      type: 'collapsible',
      label: 'Информация о рекомендующем',
      fields: [
        {
          name: 'recommenderName',
          type: 'text',
          required: true,
          label: 'Имя рекомендующего',
        },
        {
          name: 'recommenderRelation',
          type: 'select',
          required: true,
          label: 'Связь с игроком',
          options: [
            { label: 'Тренер', value: 'coach' },
            { label: 'Агент', value: 'agent' },
            { label: 'Родственник', value: 'family' },
            { label: 'Болельщик', value: 'fan' },
            { label: 'Сам игрок', value: 'self' },
          ],
        },
        {
          name: 'recommenderEmail',
          type: 'email',
          required: true,
          label: 'Email',
        },
        {
          name: 'recommenderPhone',
          type: 'text',
          label: 'Телефон (опционально)',
        },
      ],
    },

    // === Дополнительная информация ===
    {
      type: 'collapsible',
      label: 'Дополнительная информация',
      fields: [
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Ссылка на видео',
          admin: {
            description: 'YouTube, Instagram, TikTok и т.д.',
          },
        },
        {
          name: 'comment',
          type: 'textarea',
          required: true,
          label: 'Комментарий',
          admin: {
            description: 'Опишите почему рекомендуете этого игрока',
          },
        },
        {
          name: 'consentGiven',
          type: 'checkbox',
          required: true,
          label: 'Согласие на обработку данных',
          defaultValue: false,
        },
      ],
    },

    // === Статус и метаданные (для админов) ===
    {
      name: 'status',
      type: 'select',
      label: 'Статус заявки',
      defaultValue: 'new',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'На рассмотрении', value: 'reviewing' },
        { label: 'Приглашен на просмотр', value: 'invited' },
        { label: 'Отклонена', value: 'rejected' },
        { label: 'Архив', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Заметки скаута',
      admin: {
        position: 'sidebar',
        description: 'Внутренние заметки (не видны пользователям)',
      },
    },
  ],
  timestamps: true,
}

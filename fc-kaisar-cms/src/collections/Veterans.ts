import type { CollectionConfig } from 'payload'

export const Veterans: CollectionConfig = {
  slug: 'veterans',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'position', 'yearsInClub', 'isLegend'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Фамилия',
      required: true,
    },
    {
      name: 'displayName',
      type: 'text',
      label: 'Отображаемое имя',
      required: true,
      localized: true,
    },
    {
      name: 'position',
      type: 'select',
      label: 'Позиция',
      options: [
        { label: 'Вратарь', value: 'goalkeeper' },
        { label: 'Защитник', value: 'defender' },
        { label: 'Полузащитник', value: 'midfielder' },
        { label: 'Нападающий', value: 'forward' },
        { label: 'Тренер', value: 'coach' },
      ],
    },
    {
      name: 'yearsInClub',
      type: 'text',
      label: 'Годы в клубе',
      admin: {
        description: 'Например: 1998-2010',
      },
    },
    {
      name: 'jerseyNumber',
      type: 'number',
      label: 'Номер',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Фото',
    },
    {
      name: 'achievements',
      type: 'textarea',
      label: 'Достижения в клубе',
      localized: true,
    },
    {
      name: 'biography',
      type: 'richText',
      label: 'Биография',
      localized: true,
    },
    {
      name: 'statistics',
      type: 'group',
      label: 'Статистика',
      fields: [
        { name: 'matches', type: 'number', label: 'Матчи', defaultValue: 0 },
        { name: 'goals', type: 'number', label: 'Голы', defaultValue: 0 },
        { name: 'assists', type: 'number', label: 'Ассисты', defaultValue: 0 },
      ],
    },
    {
      name: 'isLegend',
      type: 'checkbox',
      label: 'Легенда клуба',
      defaultValue: false,
      admin: {
        description: 'Отмечает игрока как легенду клуба',
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок отображения',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

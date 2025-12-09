import type { CollectionConfig } from 'payload'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'year', 'place'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название достижения',
      required: true,
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Тип достижения',
      required: true,
      options: [
        { label: 'Чемпионат', value: 'championship' },
        { label: 'Кубок', value: 'cup' },
        { label: 'Еврокубки', value: 'eurocup' },
        { label: 'Награда', value: 'award' },
        { label: 'Другое', value: 'other' },
      ],
    },
    {
      name: 'year',
      type: 'number',
      label: 'Год',
      required: true,
    },
    {
      name: 'place',
      type: 'select',
      label: 'Место',
      options: [
        { label: '1 место (Чемпион)', value: '1' },
        { label: '2 место (Серебро)', value: '2' },
        { label: '3 место (Бронза)', value: '3' },
        { label: 'Финалист', value: 'finalist' },
        { label: 'Полуфиналист', value: 'semifinalist' },
        { label: 'Участник', value: 'participant' },
      ],
    },
    {
      name: 'competition',
      type: 'text',
      label: 'Название турнира',
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение',
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

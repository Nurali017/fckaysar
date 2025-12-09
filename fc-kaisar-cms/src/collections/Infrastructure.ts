import type { CollectionConfig } from 'payload'

export const Infrastructure: CollectionConfig = {
  slug: 'infrastructure',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Название',
      required: true,
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Тип объекта',
      required: true,
      options: [
        { label: 'Стадион', value: 'stadium' },
        { label: 'Тренировочная база', value: 'training_base' },
        { label: 'Академия', value: 'academy' },
        { label: 'Офис', value: 'office' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      options: [
        { label: 'Действующий', value: 'active' },
        { label: 'Строится', value: 'construction' },
        { label: 'Планируется', value: 'planned' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
      localized: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание',
      localized: true,
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Главное изображение',
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Галерея',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Особенности',
      localized: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
        },
      ],
    },
    {
      name: 'address',
      type: 'text',
      label: 'Адрес',
      localized: true,
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Координаты',
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Широта',
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Долгота',
        },
      ],
    },
    // Поля для стадиона
    {
      name: 'capacity',
      type: 'number',
      label: 'Вместимость',
      admin: {
        condition: (data) => data?.type === 'stadium',
      },
    },
    {
      name: 'uefaCategory',
      type: 'select',
      label: 'Категория УЕФА',
      options: [
        { label: 'Категория 1', value: '1' },
        { label: 'Категория 2', value: '2' },
        { label: 'Категория 3', value: '3' },
        { label: 'Категория 4', value: '4' },
      ],
      admin: {
        condition: (data) => data?.type === 'stadium',
      },
    },
    {
      name: 'fieldType',
      type: 'text',
      label: 'Тип покрытия поля',
      localized: true,
      admin: {
        condition: (data) => data?.type === 'stadium',
      },
    },
    {
      name: 'lightingLux',
      type: 'number',
      label: 'Освещение (люкс)',
      admin: {
        condition: (data) => data?.type === 'stadium',
      },
    },
    {
      name: 'parkingSpaces',
      type: 'number',
      label: 'Парковочные места',
    },
    // Поля для академии/базы
    {
      name: 'fieldsCount',
      type: 'number',
      label: 'Количество полей',
      admin: {
        condition: (data) => data?.type === 'training_base' || data?.type === 'academy',
      },
    },
    {
      name: 'yearBuilt',
      type: 'number',
      label: 'Год постройки/планируемый год',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок отображения',
      defaultValue: 0,
    },
  ],
}

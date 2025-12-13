import type { CollectionConfig } from 'payload'

export const VipBoxRequests: CollectionConfig = {
  slug: 'vip-box-requests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'guests', 'matchDate', 'status', 'createdAt'],
    group: 'Заявки',
    description: 'Заявки на бронирование VIP-ложи',
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
    // === Контактные данные ===
    {
      type: 'collapsible',
      label: 'Контактные данные',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Имя клиента',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Телефон',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
      ],
    },

    // === Детали бронирования ===
    {
      type: 'collapsible',
      label: 'Детали бронирования',
      fields: [
        {
          name: 'guests',
          type: 'number',
          required: true,
          label: 'Количество гостей',
          min: 1,
          max: 50,
          defaultValue: 2,
        },
        {
          name: 'matchDate',
          type: 'date',
          label: 'Желаемая дата матча',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'd MMM yyyy',
            },
          },
        },
        {
          name: 'comment',
          type: 'textarea',
          label: 'Дополнительные пожелания',
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
        { label: 'В обработке', value: 'processing' },
        { label: 'Подтверждена', value: 'confirmed' },
        { label: 'Отклонена', value: 'rejected' },
        { label: 'Завершена', value: 'completed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Заметки менеджера',
      admin: {
        position: 'sidebar',
        description: 'Внутренние заметки (не видны клиентам)',
      },
    },
  ],
  timestamps: true,
}

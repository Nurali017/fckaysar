import type { CollectionConfig } from 'payload'

export const SeasonPassRequests: CollectionConfig = {
  slug: 'season-pass-requests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'quantity', 'status', 'createdAt'],
    group: 'Заявки',
    description: 'Заявки на оформление абонемента',
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

    // === Детали абонемента ===
    {
      type: 'collapsible',
      label: 'Детали абонемента',
      fields: [
        {
          name: 'quantity',
          type: 'number',
          required: true,
          label: 'Количество абонементов',
          min: 1,
          max: 10,
          defaultValue: 1,
        },
        {
          name: 'seatPreference',
          type: 'text',
          label: 'Предпочтения по местам',
          admin: {
            description: 'Например: Сектор A, ряд 5',
          },
        },
        {
          name: 'comment',
          type: 'textarea',
          label: 'Комментарий',
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
        { label: 'Оплачен', value: 'paid' },
        { label: 'Выдан', value: 'issued' },
        { label: 'Отменён', value: 'cancelled' },
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

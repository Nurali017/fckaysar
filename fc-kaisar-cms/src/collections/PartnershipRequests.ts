import type { CollectionConfig } from 'payload'

export const PartnershipRequests: CollectionConfig = {
  slug: 'partnership-requests',
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'contactPerson', 'partnershipType', 'status', 'createdAt'],
    group: 'Заявки',
    description: 'Заявки на партнёрство и спонсорство',
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
    // === Информация о компании ===
    {
      type: 'collapsible',
      label: 'Информация о компании',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'companyName',
          type: 'text',
          required: true,
          label: 'Название компании',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Сайт компании',
        },
        {
          name: 'partnershipType',
          type: 'select',
          required: true,
          label: 'Тип партнёрства',
          options: [
            { label: 'Спонсорство', value: 'sponsor' },
            { label: 'Медиа-партнёрство', value: 'media' },
            { label: 'Техническое партнёрство', value: 'technical' },
            { label: 'Другое', value: 'other' },
          ],
        },
      ],
    },

    // === Контактные данные ===
    {
      type: 'collapsible',
      label: 'Контактные данные',
      fields: [
        {
          name: 'contactPerson',
          type: 'text',
          required: true,
          label: 'Контактное лицо',
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

    // === Предложение ===
    {
      type: 'collapsible',
      label: 'Предложение',
      fields: [
        {
          name: 'proposal',
          type: 'textarea',
          required: true,
          label: 'Описание предложения',
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
        { label: 'Переговоры', value: 'negotiating' },
        { label: 'Одобрена', value: 'approved' },
        { label: 'Отклонена', value: 'rejected' },
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

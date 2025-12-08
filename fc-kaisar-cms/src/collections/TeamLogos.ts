import type { CollectionConfig } from 'payload'

export const TeamLogos: CollectionConfig = {
  slug: 'team-logos',
  admin: {
    useAsTitle: 'teamName',
    defaultColumns: ['teamId', 'teamName', 'logo', 'updatedAt'],
    description: 'Логотипы команд KPL - загружены локально',
    group: 'SOTA Данные',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'teamId',
      type: 'number',
      required: true,
      unique: true,
      index: true,
      label: 'ID команды (SOTA)',
      admin: {
        description: 'Уникальный ID команды из SOTA API',
      },
    },
    {
      name: 'teamName',
      type: 'text',
      required: true,
      label: 'Название команды',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Логотип',
      admin: {
        description: 'Локальный файл логотипа команды',
      },
    },
  ],
}

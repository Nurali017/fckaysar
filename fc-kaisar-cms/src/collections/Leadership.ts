import type { CollectionConfig } from 'payload'

export const Leadership: CollectionConfig = {
  slug: 'leadership',
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'order', 'isActive', 'updatedAt'],
    description: 'Manage leadership team photos (names and text are in i18n)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'key',
      type: 'select',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier matching i18n keys (e.g., owner → newLeadership.leaders.owner)',
      },
      options: [
        { label: 'Owner (Владелец клуба)', value: 'owner' },
        { label: 'Head Coach (Главный тренер)', value: 'head_coach' },
        { label: 'Sporting Director (Спортивный директор)', value: 'sporting_director' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Leadership photo (recommended: 800x1000px, portrait orientation)',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      max: 99,
      admin: {
        description: 'Display order (1 = first, 2 = second, etc.)',
        step: 1,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Uncheck to temporarily hide this person from the website',
      },
    },
  ],
}

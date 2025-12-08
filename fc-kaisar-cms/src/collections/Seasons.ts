import type { CollectionConfig } from 'payload'

/**
 * Seasons Collection
 * Stores season data with start/end dates for dynamic offseason management
 */
export const Seasons: CollectionConfig = {
  slug: 'seasons',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'startDate', 'endDate', 'isCurrent', 'isNext'],
    description: 'Football seasons with dates for offseason management',
    group: 'Configuration',
  },
  access: {
    read: () => true,
  },
  fields: [
    // === IDENTIFICATION ===
    {
      name: 'sotaId',
      type: 'number',
      label: 'SOTA Season ID',
      required: true,
      unique: true,
      admin: {
        description: 'Season ID from SOTA API (e.g., 61 for 2024/2025)',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Season Name',
      required: true,
      admin: {
        description: 'Display name (e.g., "2024/2025")',
      },
    },

    // === DATES ===
    {
      name: 'startDate',
      type: 'date',
      label: 'Season Start Date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the season starts',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Season End Date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the season ends',
      },
    },

    // === STATUS FLAGS ===
    {
      name: 'isCurrent',
      type: 'checkbox',
      label: 'Is Current Season',
      defaultValue: false,
      admin: {
        description: 'Automatically set based on current date',
      },
    },
    {
      name: 'isNext',
      type: 'checkbox',
      label: 'Is Next Season',
      defaultValue: false,
      admin: {
        description: 'Automatically set - the upcoming season after current',
      },
    },

    // === TOURNAMENT INFO ===
    {
      name: 'tournamentId',
      type: 'number',
      label: 'Tournament ID',
      admin: {
        description: 'Tournament ID from SOTA API (e.g., 7 for KPL)',
      },
    },
    {
      name: 'tournamentName',
      type: 'text',
      label: 'Tournament Name',
      admin: {
        description: 'Tournament name (e.g., "Kazakhstan Premier League")',
      },
    },

    // === META ===
    {
      name: 'lastSyncAt',
      type: 'date',
      label: 'Last Synced',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Last sync timestamp from SOTA API',
        readOnly: true,
      },
    },
  ],
}

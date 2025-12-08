import type { CollectionConfig } from 'payload'

export const Players: CollectionConfig = {
    slug: 'players',
    admin: {
        useAsTitle: 'displayName',
        defaultColumns: ['displayName', 'jerseyNumber', 'position', 'status'],
    },
    access: {
        read: () => true,
    },
    fields: [
        // SOTA Integration
        {
            name: 'sotaId',
            type: 'text',
            label: 'SOTA ID',
            unique: true,
            admin: {
                description: 'UUID игрока из SOTA API (заполняется автоматически)',
                readOnly: true,
            },
        },
        {
            name: 'teamId',
            type: 'number',
            label: 'Team ID',
            admin: {
                description: 'ID команды в SOTA API',
                readOnly: true,
            },
        },
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
            name: 'slug',
            type: 'text',
            unique: true,
            required: true,
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
            name: 'actionPhotos',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
            label: 'Фото в игре',
        },
        {
            name: 'dateOfBirth',
            type: 'date',
            label: 'Дата рождения',
        },
        {
            name: 'height',
            type: 'number',
            label: 'Рост (см)',
        },
        {
            name: 'weight',
            type: 'number',
            label: 'Вес (кг)',
        },
        {
            name: 'displayName',
            type: 'text',
            label: 'Отображаемое имя',
            localized: true,
            required: true,
        },
        {
            name: 'position',
            type: 'select',
            label: 'Позиция',
            localized: true,
            options: [
                { label: 'Вратарь', value: 'goalkeeper' },
                { label: 'Защитник', value: 'defender' },
                { label: 'Полузащитник', value: 'midfielder' },
                { label: 'Нападающий', value: 'forward' },
            ],
        },
        {
            name: 'nationality',
            type: 'text',
            label: 'Гражданство',
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
            type: 'array',
            label: 'Статистика',
            fields: [
                { name: 'season', type: 'text', label: 'Сезон' },
                { name: 'appearances', type: 'number', label: 'Игры' },
                { name: 'goals', type: 'number', label: 'Голы' },
                { name: 'assists', type: 'number', label: 'Ассисты' },
                { name: 'yellowCards', type: 'number', label: 'Желтые карточки' },
                { name: 'redCards', type: 'number', label: 'Красные карточки' },
            ],
        },
        {
            name: 'socialMedia',
            type: 'group',
            label: 'Соцсети',
            fields: [
                { name: 'instagram', type: 'text' },
                { name: 'facebook', type: 'text' },
            ],
        },
        {
            name: 'status',
            type: 'select',
            label: 'Статус',
            options: [
                { label: 'Активен', value: 'active' },
                { label: 'Травмирован', value: 'injured' },
                { label: 'В аренде', value: 'loaned' },
                { label: 'Ушёл', value: 'left' },
            ],
            defaultValue: 'active',
        },
        // Hero player for landing page
        {
            name: 'isHero',
            type: 'checkbox',
            label: 'Главный игрок (Hero)',
            admin: {
                description: 'Отображается на главной странице сайта. Только один игрок может быть главным.',
                position: 'sidebar',
            },
            defaultValue: false,
        },
        // Auto-synced season stats
        {
            name: 'currentSeasonStats',
            type: 'group',
            label: 'Статистика текущего сезона (авто)',
            admin: {
                description: 'Автоматически агрегируется из матчей',
            },
            fields: [
                { name: 'seasonId', type: 'number', label: 'ID сезона' },
                { name: 'seasonName', type: 'text', label: 'Сезон' },
                { name: 'appearances', type: 'number', label: 'Игры', defaultValue: 0 },
                { name: 'goals', type: 'number', label: 'Голы', defaultValue: 0 },
                { name: 'assists', type: 'number', label: 'Ассисты', defaultValue: 0 },
                { name: 'yellowCards', type: 'number', label: 'ЖК', defaultValue: 0 },
                { name: 'redCards', type: 'number', label: 'КК', defaultValue: 0 },
                { name: 'minutesPlayed', type: 'number', label: 'Минуты', defaultValue: 0 },
                { name: 'shots', type: 'number', label: 'Удары', defaultValue: 0 },
                { name: 'shotsOnGoal', type: 'number', label: 'В створ', defaultValue: 0 },
                { name: 'passes', type: 'number', label: 'Пасы', defaultValue: 0 },
                { name: 'duels', type: 'number', label: 'Единоборства', defaultValue: 0 },
                { name: 'tackles', type: 'number', label: 'Отборы', defaultValue: 0 },
                { name: 'avgMinutesPlayed', type: 'number', label: 'Среднее время (мин)', defaultValue: 0 },
                { name: 'cleanSheets', type: 'number', label: 'Сухие матчи', defaultValue: 0 },
            ],
        },
        // Is goalkeeper (from SOTA)
        {
            name: 'isGoalkeeper',
            type: 'checkbox',
            label: 'Вратарь',
            admin: {
                description: 'Определяется автоматически из SOTA API',
            },
        },
        // Last sync timestamp
        {
            name: 'lastSyncAt',
            type: 'date',
            label: 'Последняя синхронизация',
            admin: {
                readOnly: true,
                date: {
                    displayFormat: 'dd.MM.yyyy HH:mm',
                },
            },
        },
    ],
}

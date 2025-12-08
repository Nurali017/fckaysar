import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
    slug: 'gallery',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'uploadDate'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Название',
            required: true,
            localized: true,
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Описание',
            localized: true,
        },
        {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
            label: 'Медиа файлы',
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            label: 'Тип',
            options: [
                { label: 'Фото', value: 'photo' },
                { label: 'Видео', value: 'video' },
            ],
            defaultValue: 'photo',
        },
        {
            name: 'category',
            type: 'select',
            label: 'Категория',
            options: [
                { label: 'Матч', value: 'match' },
                { label: 'Тренировка', value: 'training' },
                { label: 'Мероприятие', value: 'event' },
            ],
        },
        {
            name: 'relatedMatch',
            type: 'relationship',
            relationTo: 'matches',
            label: 'Связанный матч',
        },
        {
            name: 'uploadDate',
            type: 'date',
            label: 'Дата загрузки',
            defaultValue: () => new Date().toISOString(),
        },
        {
            name: 'featured',
            type: 'checkbox',
            label: 'Показывать на главной',
            defaultValue: false,
        },
        {
            name: 'tags',
            type: 'array',
            label: 'Теги',
            fields: [
                {
                    name: 'tag',
                    type: 'text',
                },
            ],
        },
    ],
}

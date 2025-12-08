import type { CollectionConfig } from 'payload'
// Custom components disabled - Payload 3.x has cyclic reference issues
// import { SimpleMultilingualQuestion } from '@/components/admin/fields/SimpleMultilingualQuestion'

export const Polls: CollectionConfig = {
  slug: 'polls',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'status', 'totalVotes', 'createdAt'],
    group: 'Fan Zone',
    description: '🗳️ Создавайте опросы для фанатов. Минимум 2 варианта ответа, максимум 6.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Вопрос опроса',
      localized: true,
      admin: {
        // components: {
        //   Field: SimpleMultilingualQuestion, // Disabled - cyclic reference error in Payload 3.x
        // },
        placeholder: 'Например: Кто станет лучшим бомбардиром сезона?',
        description: '📝 Используйте Poll Translator для удобного перевода: http://localhost:3000/poll-translator.html',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'ID (автогенерируется)',
      admin: {
        position: 'sidebar',
        description: 'Автоматически создается из вопроса. Можно оставить пустым.',
        readOnly: false,
      },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            // Auto-generate slug from question if not provided
            if (operation === 'create' && !value && data?.question) {
              let text: string;
              if (typeof data.question === 'object') {
                // Try ru → kk → en → any available
                text = data.question.ru || data.question.kk || data.question.en || Object.values(data.question)[0] || '';
              } else {
                text = data.question;
              }

              return text
                .toString()
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50) + '-' + Date.now();
            }
            return value;
          }
        ]
      }
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание (необязательно)',
      localized: true,
      admin: {
        // components: {
        //   Field: MultilingualTextAreaField,
        // },
        placeholder: 'Дополнительное пояснение к опросу',
        description: '📝 Заполните на русском, затем переключите язык и используйте Translation API',
      },
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      label: 'Варианты ответов',
      minRows: 2,
      maxRows: 6,
      admin: {
        description: '📝 Добавьте от 2 до 6 вариантов ответа. Заполните текст на всех языках!',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'optionText',
          type: 'text',
          required: true,
          label: 'Текст варианта',
          // localized удалено - варианты одинаковые на всех языках
          admin: {
            // components: {
            //   Field: MultilingualTextField,
            // },
            placeholder: 'Например: Динмухаммед Рустемулы или Плей-офф',
            description: 'Текст варианта ответа (одинаковый на всех языках)',
          },
        },
        {
          name: 'votes',
          type: 'number',
          defaultValue: 0,
          label: 'Голоса',
          admin: {
            readOnly: true,
            description: 'Обновляется автоматически при голосовании',
          },
        },
      ],
    },
    {
      name: 'totalVotes',
      type: 'number',
      defaultValue: 0,
      label: 'Всего голосов',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Общее количество проголосовавших',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      options: [
        {
          label: '🟢 Активен (показывается на сайте)',
          value: 'active'
        },
        {
          label: '🔴 Закрыт (голосование завершено)',
          value: 'closed'
        },
        {
          label: '⚪️ Черновик (не опубликован)',
          value: 'draft'
        },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Только "Активен" опросы показываются на сайте',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: '⭐️ Избранный опрос',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Показывать в топе опросов на главной странице',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Дата начала (необязательно)',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        description: 'Когда опрос станет доступен',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Дата окончания (необязательно)',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        description: 'Когда опрос автоматически закроется',
      },
    },
  ],
}

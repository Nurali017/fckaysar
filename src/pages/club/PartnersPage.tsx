import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import {
  Handshake,
  Building2,
  Megaphone,
  Wrench,
  MoreHorizontal,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import PhoneInput, { validatePhone } from '@/components/ui/PhoneInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubmitPartnershipRequest } from '@/hooks/api/usePartnershipRequest';
import type { PartnershipRequestData } from '@/api/cms/partnership-service';

const PartnersPage = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate, isPending } = useSubmitPartnershipRequest();

  const form = useForm<PartnershipRequestData>({
    defaultValues: {
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      partnershipType: 'sponsor',
      proposal: '',
      website: '',
    },
  });

  const onSubmit = (data: PartnershipRequestData) => {
    mutate(data, {
      onSuccess: response => {
        if (response.success) {
          setIsSubmitted(true);
          form.reset();
        }
      },
    });
  };

  const partnershipTypes = [
    { value: 'sponsor', icon: Building2, labelKey: 'sponsor' },
    { value: 'media', icon: Megaphone, labelKey: 'media' },
    { value: 'technical', icon: Wrench, labelKey: 'technical' },
    { value: 'other', icon: MoreHorizontal, labelKey: 'other' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Handshake className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              {t('partnership.title', 'Партнёры')}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('partnership.subtitle', 'Станьте частью истории ФК Кайсар')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-12 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t('partnership.types.title', 'Виды партнёрства')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={type.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <type.icon className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-gray-300">{t(`partnership.types.${type.labelKey}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-400 text-lg mb-4">
              {t(
                'partnership.description',
                'ФК «Кайсар» открыт для сотрудничества с компаниями, которые разделяют наши ценности и хотят вместе с нами развивать футбол в регионе.'
              )}
            </p>
            <p className="text-gray-500">
              {t(
                'partnership.benefits',
                'Партнёрство с клубом — это узнаваемость бренда, доступ к лояльной аудитории и участие в развитии спорта.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-2 text-center">
              {t('partnership.form.title', 'Предложить партнёрство')}
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              {t('partnership.form.subtitle', 'Заполните форму, и мы свяжемся с вами')}
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg text-gray-300">
                  {t(
                    'partnership.form.success',
                    'Заявка отправлена! Наш менеджер свяжется с вами в ближайшее время.'
                  )}
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-6">
                  {t('playerRecommendation.submitAnother', 'Отправить ещё одну')}
                </Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="companyName"
                    rules={{ required: t('validation.required', 'Обязательное поле') as string }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('partnership.form.companyName', 'Название компании')} *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="ТОО «Компания»" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      rules={{ required: t('validation.required', 'Обязательное поле') as string }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('partnership.form.contactPerson', 'Контактное лицо')} *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Иван Иванов" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      rules={{
                        required: t('validation.required', 'Обязательное поле') as string,
                        validate: value =>
                          validatePhone(value) ||
                          (t('validation.invalidContact', 'Введите корректный телефон') as string),
                      }}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>{t('partnership.form.phone', 'Телефон')} *</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              error={!!fieldState.error}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: t('validation.invalidEmail', 'Неверный формат email'),
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('partnership.form.email', 'Email')}</FormLabel>
                          <FormControl>
                            <Input placeholder="email@company.kz" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="partnershipType"
                      rules={{ required: t('validation.required', 'Обязательное поле') as string }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('partnership.form.type', 'Тип партнёрства')} *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t('partnership.form.selectType', 'Выберите тип')}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sponsor">
                                {t('partnership.types.sponsor', 'Спонсорство')}
                              </SelectItem>
                              <SelectItem value="media">
                                {t('partnership.types.media', 'Медиа-партнёрство')}
                              </SelectItem>
                              <SelectItem value="technical">
                                {t('partnership.types.technical', 'Техническое партнёрство')}
                              </SelectItem>
                              <SelectItem value="other">
                                {t('partnership.types.other', 'Другое')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('partnership.form.website', 'Сайт компании')}</FormLabel>
                        <FormControl>
                          <Input placeholder="https://company.kz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proposal"
                    rules={{
                      required: t('validation.required', 'Обязательное поле') as string,
                      minLength: {
                        value: 20,
                        message: t('validation.minLength', 'Минимум 20 символов'),
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('partnership.form.proposal', 'Ваше предложение')} *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              'partnership.form.proposalPlaceholder',
                              'Опишите ваше предложение о сотрудничестве...'
                            )}
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('common.loading', 'Загрузка...')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t('partnership.form.submit', 'Отправить заявку')}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnersPage;

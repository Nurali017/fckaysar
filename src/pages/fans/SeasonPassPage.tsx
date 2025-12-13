import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import {
  Ticket,
  Calendar,
  Armchair,
  Percent,
  DoorOpen,
  PartyPopper,
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
import { useSubmitSeasonPassRequest } from '@/hooks/api/useSeasonPassRequest';
import type { SeasonPassRequestData } from '@/api/cms/season-pass-service';

const SeasonPassPage = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate, isPending } = useSubmitSeasonPassRequest();

  const form = useForm<SeasonPassRequestData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      seatPreference: '',
      quantity: 1,
      comment: '',
    },
  });

  const onSubmit = (data: SeasonPassRequestData) => {
    mutate(data, {
      onSuccess: response => {
        if (response.success) {
          setIsSubmitted(true);
          form.reset();
        }
      },
    });
  };

  const benefits = [
    { icon: Calendar, key: 'allMatches' },
    { icon: Armchair, key: 'fixedSeat' },
    { icon: Percent, key: 'discount' },
    { icon: DoorOpen, key: 'priority' },
    { icon: PartyPopper, key: 'events' },
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
            <Ticket className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              {t('seasonPass.title', 'Абонемент')}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'seasonPass.subtitle',
                'Оформите абонемент и не пропустите ни одного домашнего матча'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t('seasonPass.benefits.title', 'Преимущества абонемента')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4"
              >
                <benefit.icon className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-gray-300">{t(`seasonPass.benefits.${benefit.key}`)}</p>
              </motion.div>
            ))}
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
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t('seasonPass.form.title', 'Оставить заявку')}
            </h2>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg text-gray-300">
                  {t(
                    'seasonPass.form.success',
                    'Заявка отправлена! Мы свяжемся с вами для оформления абонемента.'
                  )}
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-6">
                  {t('playerRecommendation.submitAnother', 'Отправить ещё одну')}
                </Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: t('validation.required', 'Обязательное поле') as string }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('seasonPass.form.name', 'Ваше имя')} *</FormLabel>
                          <FormControl>
                            <Input placeholder="Асан Усенов" {...field} />
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
                          <FormLabel>{t('seasonPass.form.phone', 'Телефон')} *</FormLabel>
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
                        <FormLabel>{t('seasonPass.form.email', 'Email')}</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      rules={{ required: true, min: 1, max: 10 }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('seasonPass.form.quantity', 'Количество абонементов')} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seatPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('seasonPass.form.seatPreference', 'Предпочтения по местам')}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Сектор A, ряд 5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('seasonPass.form.comment', 'Комментарий')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="..." className="min-h-[100px]" {...field} />
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
                        {t('seasonPass.form.submit', 'Отправить заявку')}
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

export default SeasonPassPage;

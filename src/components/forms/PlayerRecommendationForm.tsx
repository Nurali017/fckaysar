import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { useState } from 'react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SmartContactInput, { validateContact } from '@/components/ui/SmartContactInput';

import { useSubmitPlayerRecommendation } from '@/hooks/api/usePlayerRecommendation';
import type { PlayerRecommendationData } from '@/api/cms/player-recommendations-service';

const PlayerRecommendationForm = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate, isPending } = useSubmitPlayerRecommendation();

  const form = useForm<PlayerRecommendationData>({
    defaultValues: {
      playerFullName: '',
      birthYear: new Date().getFullYear() - 15,
      position: undefined,
      currentClub: '',
      city: '',
      playerContact: '',
      recommenderName: '',
      recommenderRelation: undefined,
      recommenderContact: '',
      videoUrl: '',
      comment: '',
      consentGiven: false,
    },
  });

  const onSubmit = (data: PlayerRecommendationData) => {
    mutate(data, {
      onSuccess: response => {
        if (response.success) {
          setIsSubmitted(true);
          form.reset();
        }
      },
    });
  };

  // Success state
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {t('playerRecommendation.successTitle', 'Спасибо!')}
        </h3>
        <p className="text-gray-400 mb-6">
          {t(
            'playerRecommendation.successMessage',
            'Ваша рекомендация отправлена. Мы свяжемся с вами при необходимости.'
          )}
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          {t('playerRecommendation.submitAnother', 'Отправить ещё одну')}
        </Button>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section: Player Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-500 border-b border-gray-800 pb-2">
            {t('playerRecommendation.playerInfo', 'Информация об игроке')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="playerFullName"
              rules={{ required: t('validation.required', 'Обязательное поле') as string }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('playerRecommendation.playerName', 'Имя и фамилия игрока')} *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Асан Усенов" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthYear"
              rules={{ required: true, min: 1990, max: 2020 }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('playerRecommendation.birthYear', 'Год рождения')} *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1990}
                      max={2020}
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
              name="position"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('playerRecommendation.position', 'Позиция')} *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('playerRecommendation.selectPosition', 'Выберите позицию')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-white/20 text-white">
                      <SelectItem value="goalkeeper">
                        {t('positions.goalkeeper', 'Вратарь')}
                      </SelectItem>
                      <SelectItem value="defender">
                        {t('positions.defender', 'Защитник')}
                      </SelectItem>
                      <SelectItem value="midfielder">
                        {t('positions.midfielder', 'Полузащитник')}
                      </SelectItem>
                      <SelectItem value="forward">
                        {t('positions.forward', 'Нападающий')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentClub"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('playerRecommendation.currentClub', 'Текущий клуб')}</FormLabel>
                  <FormControl>
                    <Input placeholder="СДЮШОР Кызылорда" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('playerRecommendation.city', 'Город/регион')} *</FormLabel>
                  <FormControl>
                    <Input placeholder="Кызылорда" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="playerContact"
              rules={{
                validate: value => validateContact(value, t),
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t('playerRecommendation.playerContact', 'Контакт игрока/родителей')} *
                  </FormLabel>
                  <FormControl>
                    <SmartContactInput
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('playerRecommendation.contactHint', 'Телефон или email для связи')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section: Recommender Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-500 border-b border-gray-800 pb-2">
            {t('playerRecommendation.recommenderInfo', 'Информация о вас')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recommenderName"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('playerRecommendation.recommenderName', 'Ваше имя')} *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommenderRelation"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('playerRecommendation.relation', 'Кто вы для игрока?')} *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('playerRecommendation.selectRelation', 'Выберите')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-white/20 text-white">
                      <SelectItem value="coach">
                        {t('playerRecommendation.relations.coach', 'Тренер')}
                      </SelectItem>
                      <SelectItem value="agent">
                        {t('playerRecommendation.relations.agent', 'Агент')}
                      </SelectItem>
                      <SelectItem value="family">
                        {t('playerRecommendation.relations.family', 'Родственник')}
                      </SelectItem>
                      <SelectItem value="fan">
                        {t('playerRecommendation.relations.fan', 'Болельщик')}
                      </SelectItem>
                      <SelectItem value="self">
                        {t('playerRecommendation.relations.self', 'Сам игрок')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommenderContact"
              rules={{
                validate: value => validateContact(value, t),
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t('playerRecommendation.recommenderContact', 'Ваш контакт')} *
                  </FormLabel>
                  <FormControl>
                    <SmartContactInput
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('playerRecommendation.contactHint', 'Телефон или email для связи')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section: Additional Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-500 border-b border-gray-800 pb-2">
            {t('playerRecommendation.additionalInfo', 'Дополнительная информация')}
          </h3>

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('playerRecommendation.videoUrl', 'Ссылка на видео')}</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/..." {...field} />
                </FormControl>
                <FormDescription>
                  {t('playerRecommendation.videoHint', 'YouTube, Instagram, TikTok и т.д.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            rules={{
              minLength: {
                value: 20,
                message: t('validation.minLength', 'Минимум 20 символов'),
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('playerRecommendation.comment', 'Почему рекомендуете этого игрока?')}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t(
                      'playerRecommendation.commentPlaceholder',
                      'Опишите сильные стороны игрока, его достижения...'
                    )}
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consentGiven"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-800 p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    {t(
                      'playerRecommendation.consent',
                      'Я даю согласие на обработку персональных данных'
                    )}{' '}
                    *
                  </FormLabel>
                  <FormDescription>
                    {t(
                      'playerRecommendation.consentDesc',
                      'Данные будут использованы только для связи по вопросам рекомендации'
                    )}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full bg-red-600 hover:bg-red-700">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('common.loading', 'Загрузка...')}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {t('playerRecommendation.submit', 'Отправить рекомендацию')}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PlayerRecommendationForm;

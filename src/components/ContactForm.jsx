import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useLocalStorage';

function ContactForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Используем React Hook Form для управления формой
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      priority: 'normal'
    }
  });

  // Наш кастомный хук useAsync для имитации API вызова
  const { execute: submitForm, loading, error } = useAsync(async (formData) => {
    // Имитация API вызова с JSONPlaceholder
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: formData.name,
        body: formData.message,
        userId: 1
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке данных');
    }

    const result = await response.json();
    return { success: true, data: result, message: 'Сообщение отправлено успешно!' };
  }, {
    onSuccess: (result) => {
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    }
  });

  // Слежение за полем email для дополнительной валидации
  const watchedEmail = watch('email');
  const watchedMessage = watch('message');

  // Обработчик отправки формы
  const onSubmit = async (data) => {
    try {
      await submitForm(data);
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form-header">
        <h2>Связаться с нами</h2>
        <p>Заполните форму ниже, и мы свяжемся с вами в ближайшее время</p>
      </div>

      {submitSuccess && (
        <div className="success-message">
          ✓ Ваше сообщение успешно отправлено! Мы ответим в течение 24 часов.
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ Произошла ошибка при отправке сообщения. Попробуйте еще раз.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Имя *</label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Имя обязательно для заполнения',
                minLength: {
                  value: 2,
                  message: 'Имя должно содержать минимум 2 символа'
                },
                maxLength: {
                  value: 50,
                  message: 'Имя не должно превышать 50 символов'
                }
              })}
              className={errors.name ? 'error' : ''}
              placeholder="Ваше имя"
            />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email обязателен для заполнения',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Введите корректный email адрес'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="your.email@example.com"
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
            {watchedEmail && !errors.email && (
              <span className="field-success">✓ Email корректен</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Телефон</label>
          <input
            type="tel"
            id="phone"
            {...register('phone', {
              pattern: {
                value: /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
                message: 'Введите корректный номер телефона'
              }
            })}
            placeholder="+7 (999) 999-99-99"
          />
          {errors.phone && <span className="field-error">{errors.phone.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Приоритет</label>
          <select
            id="priority"
            {...register('priority')}
          >
            <option value="low">Низкий</option>
            <option value="normal">Обычный</option>
            <option value="high">Высокий</option>
            <option value="urgent">Срочный</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Сообщение *</label>
          <textarea
            id="message"
            {...register('message', {
              required: 'Сообщение обязательно для заполнения',
              minLength: {
                value: 10,
                message: 'Сообщение должно содержать минимум 10 символов'
              },
              maxLength: {
                value: 1000,
                message: 'Сообщение не должно превышать 1000 символов'
              }
            })}
            className={errors.message ? 'error' : ''}
            placeholder="Опишите ваш вопрос или проблему..."
            rows="4"
          />
          {errors.message && <span className="field-error">{errors.message.message}</span>}
          <div className="char-count">
            {watchedMessage?.length || 0}/1000 символов
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting || loading ? 'loading' : ''}`}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Отправка...' : 'Отправить сообщение'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => reset()}
            disabled={isSubmitting || loading}
          >
            Очистить форму
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../../axios';
import image from './giga.png';
import styles from './Login.module.scss';
import { fetchAuth } from '../../../redux/slices/auth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({...errors, [name]: ''}); // Убраны все проверки
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
 
    
    if (formData.password.length < 6) {
      return setErrors({...errors, password: 'Пароль должен содержать минимум 6 символов'});
    }

    setIsSubmitting(true);
    setErrors({...errors, general: ''});

    try {
      const authResult = await dispatch(fetchAuth({
        username: formData.username,
        password: formData.password
      }));

      if (authResult.payload?.token) {
        navigate('/');
      } else {
        setErrors({...errors, general: 'Неверный username или пароль'});
      }

    } catch (error) {
      console.error('Ошибка входа:', error.response?.data || error.message);
      setErrors({...errors, general: 'Ошибка при входе в систему'});
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className={styles.spinnerInner}></div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className={styles.loadingText}
        >
          Загрузка...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div 
      className={styles.honkyAll}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={styles.honkyPhotoContainer}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <img src={image} alt='' className={styles.honkyPhoto} />
      </motion.div>
      
      <motion.div 
        className={styles.honky2}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.h1 
          className={styles.titleH}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Вход в аккаунт AtomGlide Beta 
        </motion.h1>
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h4 className={styles.subtitleH}>Нет аккаунта?</h4>
          <h4 className={styles.subtitleHo}>
            <Link to="/register" className={styles.subtitleHo}>зарегистрируйтесь</Link>
          </h4>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className={styles.hCat}>
            <h4 className={styles.subtitleHi}>Username</h4>
            <motion.input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder='Введите ваш @username' 
              className={styles.inputH}
              whileFocus={{ borderBottomColor: "#06ec7d", boxShadow: "0 2px 0 0 #06ec7d" }}
            />
            {errors.username && <motion.span 
              className={styles.errorText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.username}
            </motion.span>}
          </div>
          
          <div className={styles.hCat}>
            <h4 className={styles.subtitleHi}>Пароль</h4>
            <motion.input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder='Введите ваш пароль' 
              className={styles.inputH}
              whileFocus={{ borderBottomColor: "#06ec7d", boxShadow: "0 2px 0 0 #06ec7d" }}
            />
            {errors.password && <motion.span 
              className={styles.errorText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.password}
            </motion.span>}
          </div>
          
          {errors.general && <motion.div 
            className={styles.errorMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.general}
          </motion.div>}
          
          <motion.button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Вход...
              </motion.span>
            ) : 'Войти'}
          </motion.button>

          <motion.div 
            className={styles.promoBannersContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div 
              className={styles.promoBanners}
              animate={{ 
                x: ["0%", "-100%"],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.promoBanner}>
                  <h4 className={styles.promoTitle}>{[
                    "Пиши о чём угодно — без цензуры!",
                    "Сохраняй фото — как в Pinterest, но лучше!",
                    "Храни и делись своим кодом как в GitHub"
                  ][i]}</h4>
                  <p className={styles.promoText}>
                    {[
                      "Делитесь мыслями, творчеством и идеями без ограничений. Никаких скрытых блокировок — только честный обмен мнениями.",
                      "Загружай изображения в оригинальном качестве, сортируй их в коллекции и находи вдохновение без лишних ограничений.",
                      "Пишите, тестируйте и сохраняйте код без лишних программ — удобный редактор с подсветкой синтаксиса и мгновенным сохранением."
                    ][i]}
                  </p>
                </div>
              ))}
              {[...Array(3)].map((_, i) => (
                <div key={`copy-${i}`} className={styles.promoBanner}>
                  <h4 className={styles.promoTitle}>{[
                    "Пиши о чём угодно — без цензуры!",
                    "Сохраняй фото — как в Pinterest, но лучше!",
                    "Храни и делись своим кодом как в GitHub"
                  ][i]}</h4>
                  <p className={styles.promoText}>
                    {[
                      "Делитесь мыслями, творчеством и идеями без ограничений. Никаких скрытых блокировок — только честный обмен мнениями.",
                      "Загружай изображения в оригинальном качестве, сортируй их в коллекции и находи вдохновение без лишних ограничений.",
                      "Пишите, тестируйте и сохраняйте код без лишних программ — удобный редактор с подсветкой синтаксиса и мгновенным сохранением."
                    ][i]}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default Login;

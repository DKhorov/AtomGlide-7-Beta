import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import { selectIsAuth } from '../../redux/slices/auth';
import '../../style/work/work.scss';
import { Post } from '../post/post';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Time = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { posts, tags } = useSelector(state => state.posts);
  const userData = useSelector(state => state.auth.data);
  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchPosts());
        await dispatch(fetchTags());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  // Если данные загружаются, показываем скелетоны
  if (isLoading) {
    return (
      <div className="mepost-main">
        <div className="post-main">
          {[...Array(5)].map((_, index) => (
            <Post key={`skeleton-${index}`} isLoading={true} />
          ))}
        </div>
      </div>
    );
  }

  const popularPosts = [...posts.items]
    .sort((a, b) => (b.likes?.count || 0) - (a.likes?.count || 0))
    .slice(0, 10);

  const filteredPosts = posts.items.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 0);
    }
  };
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mepost-main">

      {showSearch && (
        <input 
          type="text"
          className="search-input"
          ref={searchInputRef}
          placeholder="Введите запрос..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

      <div className="post-main">
        {sortedPosts.map((post) => (
          <Post
            key={post._id}
            _id={post._id}
            imageUrl={post.imageUrl}
            title={post.title}
            description={post.description}
            text={post.text}
            tags={post.tags}
            language={post.language}
            viewsCount={post.viewsCount}
            commentsCount={post.commentsCount}
            user={post.user || {}}
            createdAt={post.createdAt}
            isEditable={userData?._id === (post.user?._id || null)}
            likesCount={post.likes?.count || 0}
            dislikesCount={post.dislikes?.count || 0}
            isLoading={false}
          />
        ))}
      </div>
    </div>
  );
}

export default Time;
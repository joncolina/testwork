import React, { useState, useEffect, useCallback, ChangeEvent, SelectHTMLAttributes } from 'react';
import './styles/PostList.css';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userIdOptions, setUserIdsOptions] = useState<number[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const postPerPage: number = 6;

  const fetchPosts = useCallback(async () => {
    const loadingFunction = page === 1 ? setIsLoading : setLoadingMore;
    loadingFunction(true);

    setError(null);
    try {
      let url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${postPerPage}`;

      if (searchTerm) {
        url += `&q=${searchTerm}`;
      }

      if (selectedUserId) {
        url += `&userId=${selectedUserId}`;
      }

      const response = await fetch(
        url,
        {
          method: 'GET'
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Post[] = (await response.json()) as Post[];
      if (data.length === 0) {
        setHasMore(false);
      }
      setPosts((prevPosts) => page === 1 ? [...data] : [...prevPosts, ...data]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      loadingFunction(false);
    }
  }, [page, postPerPage, searchTerm, selectedUserId]);

  const fetchUserIds = useCallback(async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const users = await response.json();
      const userIds = users.map((user: { id: number }) => user.id);
      setUserIdsOptions(userIds);
    } catch (err) {
      console.error('Error fetching user IDs:', err);
    }
  }, []);

  useEffect(() => {
    fetchUserIds();
  }, [fetchUserIds]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchTerm, selectedUserId])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const loadMorePosts = () => {
      setPage((prevPage) => prevPage + 1);
  };

  const getPreviewBody = (body: string) => {
    return body.split(' ').slice(0, 15).join(' ') + '...';
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleUserIdChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(Number(event.target.value) || null);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedUserId(null);
  };
  
  const handleReadMore = (post: Post) => {
    setSelectedPost(post);
  };

  useEffect(() => {
    const filtered = posts.filter(post => {
        const textMatch = searchTerm.length === 0 || (post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.body.toLowerCase().includes(searchTerm.toLowerCase()));
        const userIdMatch = selectedUserId === null || post.userId === selectedUserId;
        return textMatch && userIdMatch;
    });
    setFilteredPosts(filtered);
    if (filtered.length === 0){
      setHasMore(false)
    }
  }, [posts, searchTerm, selectedUserId]);

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  if (selectedPost) {
    return (
      <div className="selected-post-container">
        <h2>{selectedPost.title}</h2>
        <p>{selectedPost.body}</p>
        <button onClick={handleClosePost} className="close-post-button">Close</button>
      </div>
    );
  }


  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="post-list-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          value={selectedUserId || ''}
          onChange={handleUserIdChange}
          className="user-id-select"
        >
          <option value="">All User Post</option>
          {userIdOptions.map((userId) => (
            <option key={userId} value={userId}>
              User {userId}
            </option>
          ))}
        </select>
         <button
            onClick={handleResetFilters}
            className="reset-filters-button"
          >
            Reset Filters
          </button>
      </div>
      <div className="post-grid">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-image-container">
              <div className="post-image-placeholder" />
            </div>
            <div className="post-card-content">
              <h3 className="post-title">
                {post.title.length > 100
                  ? `${post.title.substring(0, 100)}...`
                  : post.title}
              </h3>
              <p className="post-body-preview">
                {getPreviewBody(post.body)}
              </p>
              <button className="read-button" onClick={() => handleReadMore(post)}>Read</button>
            </div>
          </div>
        ))}
      </div>
      <div className="loading-container">
        {filteredPosts.length === 0 && !isLoading && !loadingMore && <div>No posts found.</div>}
        {loadingMore && <div>Loading More...</div>}
        {isLoading && <div>Loading...</div>}
        {!isLoading && !loadingMore && hasMore && (
          <button className="load-more-button" onClick={loadMorePosts}>Load More</button>
        )}
      </div>
    </div>
  );
};

export default PostList;
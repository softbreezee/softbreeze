import React from 'react';
import FormattedDate from './FormattedDate.jsx';
import '../styles/HeroAndLatestPosts.css';

const HeroAndLatestPosts = ({ posts }) => {
  return (
    <section className="hero-posts-container">
      <div className="neon-grid"></div>
      <div className="hero-content">
        <h1 className="hacker-text">
          <span className="code-glitch">Code</span>Universe
        </h1>
        <p className="subtitle">探索前沿技术 | 分享开发心得</p>
      </div>
      <div className="latest-posts-integrated">
        <h2 className="neon-title">
          <span>📌 最新文章</span>
        </h2>
        <ul className="post-cards">
          {posts && posts.slice(0, 3).map((post) => (
            <li className="post-card" key={post.slug}>
              <a href={`/blog/${post.slug}/`}>
                <h3>{post.data.title}</h3>
                <FormattedDate date={post.data.pubDate} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroAndLatestPosts; 
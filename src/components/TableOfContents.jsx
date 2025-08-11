import React, { useEffect, useState } from 'react';
import '../styles/TableOfContents.css';

const TableOfContents = () => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 监听滚动事件，控制目录的收缩状态
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        // 当页头完全滚出视口时，收缩目录
        setIsCollapsed(headerRect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    // 等待 DOM 完全加载
    const timer = setTimeout(() => {
      // 提取所有标题 - 使用更宽泛的选择器
      const headingElements = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');
      
      const headingData = Array.from(headingElements).map((heading, index) => {
        const id = heading.id || `heading-${index}`;
        if (!heading.id) {
          heading.id = id;
        }
        
        return {
          id,
          text: heading.textContent,
          level: parseInt(heading.tagName.charAt(1)),
          element: heading
        };
      });
      
      setHeadings(headingData);

      // 设置 Intersection Observer 来跟踪当前可见的标题
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -35% 0px',
          threshold: 0
        }
      );

      headingElements.forEach((heading) => observer.observe(heading));

      return () => {
        headingElements.forEach((heading) => observer.unobserve(heading));
      };
    }, 500); // 增加延迟时间

    return () => clearTimeout(timer);
  }, [isClient]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };



  if (!isClient) {
    return <div className="toc-placeholder">正在加载目录...</div>;
  }

  if (headings.length === 0) {
    return <div className="toc-placeholder">暂无目录</div>;
  }

  // 如果目录已收缩且未悬停，显示图标
  if (isCollapsed && !isHovered) {
    return (
      <div 
        className="toc-icon"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </div>
    );
  }

  return (
    <nav 
      className={`toc ${isCollapsed ? 'toc-collapsed' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="toc-header">目录 ({headings.length})</div>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc-item toc-level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
          >
            <button
              className="toc-link"
              onClick={() => scrollToHeading(heading.id)}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;

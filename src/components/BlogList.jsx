import React, { useEffect } from "react";
import FormattedDate from "./FormattedDate";
import "../styles/BlogList.css";
import { useTagStore } from "../stores/tagStore";

const BlogList = ({ posts }) => {
  const selectedTag = useTagStore((state) => state.selectedTag);

  useEffect(() => {
    console.log(posts);
    //触发重新渲染
  }, [selectedTag]);

  return (
    <section className='blog-list'>
      <ul>
        {posts
          .filter((post) => selectedTag === "all" || post?.data?.tags?.includes(selectedTag))
          .map((post) => (
            <li>
              <a href={`/blog/${post.id}/`}>
                <img src={post.data.heroImage} alt='' />
                <div>
                  <h4 className='title'>{post.data.title}</h4>
                  <p className='date'>
                    <FormattedDate date={post.data.pubDate} />
                  </p>
                </div>
              </a>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default BlogList;

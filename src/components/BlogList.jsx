
import React from 'react';
import '../styles/BlogList.css';


const BlogList = ({ posts }) => {
  return (<section>
    <ul>
      {
        posts.map((post) => (
          <li>
            <a href={`/blog/${post.id}/`}>
              <img width={720} height={360} src={post.data.heroImage} alt="" />
              <h4 class="title">{post.data.title}</h4>
              <p class="date">
                {/* <FormattedDate date={post.data.pubDate} /> */}
              </p>
            </a>
          </li>
        ))
      }
    </ul>
  </section>)
}

export default BlogList;



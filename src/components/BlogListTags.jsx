import React from "react";
import "../styles/BlogListTags.css";
import { useTagStore } from "../stores/tagStore";
// const

const BolgListTags = ({ tags }) => {
  const [tag, setTag] = React.useState("");

  const setSelectedTag = useTagStore((state) => state.setSelectedTag);
  return (
    <aside className='blog-list-tags'>
      <h4>Tags</h4>
      <ul>
        {tags.map((t) => {
          return (
            <li
              className='tag'
              onClick={(v) => {
                if (v.target.innerText == tag) {
                  setTag("");
                  setSelectedTag("all");
                } else {
                  setTag(v.target.innerText);
                  setSelectedTag(v.target.innerText);
                }
              }}
            >
              {t == tag ? <strong>{t}</strong> : t}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default BolgListTags;

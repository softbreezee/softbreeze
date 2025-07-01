---
# layout: ../../layouts/BlogPostLayout.astro
title: '如何在 Astro 项目中进行 React 组件的通信'
pubDate: 2025-03-24
description: ''
author: '奇迹大陆博客搭配师'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
heroImage: 'https://docs.astro.build/assets/rose.webp'
tags: ["astro", "react", "tech"]
---
# 引子
最近打算构建一个个人播客，搜索了些市面上的开箱即用的博客，感觉都不太满意。于是打算借助 AI，使用 Astro 来自己实现整体的页面构建。使用 Astro 的好处就是，构建简单，并且可以集成 React 等框架组件。因为之前在字节写过一点 React，正好可以捡起来用。通过这篇文章，整体梳理一下这个框架之下，组件之间要如何进行数据的交互。

# React架构下的组件交互
在完全以 React 组件构建的项目中，组件之间根据关系，有不同的通信实现：

## 父子组件
- 父组件向子组件传递参数：通过 props 属性传递。将需要传递的参数封装在 props，当父组件某个状态变量发生改变时，通过 props 传递，将变化同步给子组件。
- 子组件向父组件传递参数：通过 props 属性传递一个回调函数。在父组件内定义一个函数，通过 props 将函数传递给子组件。当子组件内某个状态变量发生改变时，调用通过 props 传入的函数。父组件在函数内调用 setState ，来实现变化的同步。
```js
// 父组件
function Parent() {
  const [count, setCount] = useState(0);

  return <Child count={count} onUpdate={v => setCount(v)} />
}

// 子组件
function Child({ count, onUpdate }) {
  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => onUpdate(count + 1)}>增加</button>
    </div>
  );
}
```

## 兄弟组件
- 状态提升：两个组件之间没有直接的调用关系，将状态变量定义在父组件中。当子组件 A 发生变化时，首先通过上述**子组件向父组件传递参数**的方式，完成子组件 A 的传递。然后通过**父组件向子组件传递参数**的方式，完成父组件到子组件 B 的传递。从而实现子组件 A 到子组件 B 的参数传递。
```js
function Parent() {
  const [data, setData] = useState('');

  return (
    <>
      <Sender onSend={setData} />
      <Receiver data={data} />
    </>
  );
}
```

## 跨级组件
- **Context API**：Context提供了一种在组件树中传递数据的方法，无需逐层传递 props。通过`React.createContext()` 创建一个Context对象，在父组件中使用 Provider 提供数据，子组件中使用 Consumer 或 useContext Hook来获取数据。
```js
// Context创建
const DataContext = createContext();

function App() {
  return (
    <DataContext.Provider value={{ data: '全局数据' }}>
      <DeepComponent />
    </DataContext.Provider>
  );
}

// 深层子组件
function DeepComponent() {
  const { data } = useContext(DataContext);
  return <div>{data}</div>;
}
```

## 非关系组件
- **使用状态管理库（如Redux）**：Redux等状态管理库提供了一个全局的状态存储，任何组件都可以通过连接到这个存储来读取和更新状态，从而实现组件间的通信。
- **状态管理库（Zustand）**：基于 Hooks 的状态管理库，与 React 紧密集成。允许在组件中使用类似 useState 的 API 创建和管理状态。无需单独的 Store，每个状态都是独立的 Hook，管理更灵活
- **使用事件总线（Event Bus）**：创建一个全局的事件中心，组件可以通过发布和订阅事件来进行通信。这种方法适用于组件之间关系复杂且不需要共享状态的场景。

## 其他关系
- **使用refs**：父组件可以通过refs直接访问子组件的实例，并调用其方法或访问其属性。这种方法通常用于需要直接控制子组件行为的场景。

# Astro-React 混合架构下的组件交互
回到我们的 Astro 的项目上来说，会稍微复杂一点。Astro 组件主要是静态的，它们是**纯 HTML、无需客户端运行**的模板组件。这点非常重要，Astro 组件会在构建打包时直接构建为 HTML，不会在客户端进行渲染。这也是 Astro 快的原因。

在这过程中，frontmatter 中编写的 js 代码只会在构建的时候执行一次，构建完成则不会保留。如果需要客户端执行 js 交互，可以通过`<script></script>`来保留 js 代码或者通过`client: load`激活别的 UI 框架组件，例如 react。

所以如果在 Astro 组件中引入 React 组件时，除了在构建时，执行 frontmatter 中 js 可以完成一次从 Astro 组件到 React 组件的参数传递之外，在客户端上进行交互，可以通过以下的方式（我们以点击右面 tag 列表中的 tag，触发左面 blog 列表重新加载为例）：

## React 组件封装
因为 Astro 组件在客户端是纯 Html 的状态。可以将所有具有交互功能的组件，都封装为 React 组件。 Astro 组件只用做页面布置，引入 React 组件。**注意 React 组件中不能引入 Astro 组件**。
- 封装触发组件
```js
import { useState } from 'react';

const TriggerComp = () => {

  return (
    <div>
      <button>Tech</button>
      <button>Design</button>
    </div>
  );
};

export default TriggerComp;
```

- 定义响应组件
```js
import React, { useEffect } from "react";  

const ResponseComp = () => {
  const [blogs, setBlogs] = useState(["blog1", "blog2"]);
  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>{blog.title}</div>
      ))}
    </div>
  );
};

export default ResponseComp;
```

## 使用 Zustand 全局状态管理（推荐）
- 安装 Zustand
```bash
	npm install zustand
```

- 创建全局状态文件 `src/stores/tagStore.ts`
```js
//创建全局状态文件 `src/stores/tagStore.ts`
import { create } from 'zustand';

interface TagState {
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}

export const useTagStore = create<TagState>((set) => ({
  selectedTag: 'all',
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
```

- 修改触发组件
```tsx
import { useTagStore } from '../stores/tagStore';

const TriggerComp = () => {
  const setSelectedTag = useTagStore((state) => state.setSelectedTag);

  return (
    <div>
      <button onClick={() => setSelectedTag('tech')}>Tech</button>
      <button onClick={() => setSelectedTag('design')}>Design</button>
    </div>
  );
};

export default TriggerComp;
```

- 修改响应组件
```tsx
import { useEffect, useState } from 'react';
import { useTagStore } from '../stores/tagStore';
import { fetchBlogsByTag } from '../api'; // 假设有数据获取函数

const ResponseComp = () => {
  const selectedTag = useTagStore((state) => state.selectedTag);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // 根据标签获取数据
    fetchBlogsByTag(selectedTag).then((data) => setBlogs(data));
  }, [selectedTag]);

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>{blog.title}</div>
      ))}
    </div>
  );
};

export default ResponseComp;
```

- 在 Astro 页面中引入组件
```js
---
import BlogList from '../components/BlogList';
import BlogListTags from '../components/BlogListTags';
---

<html>
  <body>
    <!-- 启用客户端交互，实现TriggerComp数据传递到ResponseComp -->
    <TriggerComp client:load />
    <ResponseComp client:load />
  </body>
</html>
```

## 使用自定义事件（无需外部库）：
- 修改触发组件
```tsx
const TriggerComp = () => {
  const handleTagSelect = (tag: string) => {
    // 通过浏览器原生事件系统实现组件通信。
    // 触发自定义事件
    const event = new CustomEvent('tagChange', { detail: tag });
    window.dispatchEvent(event);
  };

  return (
    <div>
      <button onClick={() => handleTagSelect('tech')}>Tech</button>
      <button onClick={() => handleTagSelect('design')}>Design</button>
    </div>
  );
};

export default TriggerComp;
```

- 修改响应组件
```tsx
import { useEffect, useState } from 'react';
import { fetchBlogsByTag } from '../api';

const ResponseComp = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    // 监听自定义事件
    const handleTagChange = (e: CustomEvent) => {
      setSelectedTag(e.detail);
    };

    window.addEventListener('tagChange', handleTagChange);
    return () => window.removeEventListener('tagChange', handleTagChange);
  }, []);

  useEffect(() => {
    // 根据标签获取数据
    fetchBlogsByTag(selectedTag).then((data) => setBlogs(data));
  }, [selectedTag]);

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>{blog.title}</div>
      ))}
    </div>
  );
};

export default ResponseComp;
```

- 在 Astro 页面中引入组件（同上）
```js
---
import BlogList from '../components/BlogList';
import BlogListTags from '../components/BlogListTags';
---

<html>
  <body>
    <BlogListTags client:load />
    <BlogList client:load />
  </body>
</html>
```


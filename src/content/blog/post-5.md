---
# layout: ../../layouts/MarkdownPostLayout.astro
title: 'xxxxxx'
author: 'Astro 学习者'
description: "这篇文章会自己出现在列表中！"
image:
  url: "https://docs.astro.build/default-og-image.png"
  alt: "The word astro against an illustration of planets and stars."
heroImage: '/blog-placeholder-4.jpg'
pubDate: 2022-08-09
tags: ["astro", "successes"]
---
这篇文章应该会与其他的博客文章一起显示，因为 `import.meta.glob()` 会返回一个包含所有文章的列表，以创建这个文章列表。
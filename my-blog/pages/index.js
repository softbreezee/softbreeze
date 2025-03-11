import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">我的博客</h1>
      <ul>
        <li>
          <Link href="/posts/first-post">
            <a className="text-blue-500">第一篇文章</a>
          </Link>
        </li>
        {/* ...existing code... */}
      </ul>
    </div>
  );
}

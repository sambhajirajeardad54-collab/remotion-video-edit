import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="empty stack">
      <h1>404</h1>
      <p>पान सापडले नाही · Page not found</p>
      <Link href="/" className="btn btn-primary">
        मुख्यपृष्ठ · Home
      </Link>
    </div>
  );
}

"use client";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="error-page container">
      <h1>404</h1>
      <h4>Page Not Found</h4>
      <p>The page you’re looking for doesn’t exist or has been moved.</p>
      <Link href={`/`} className={`main-button`}>
        Back to Home
      </Link>
    </div>
  );
}

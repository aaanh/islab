import "@/app/globals.css";
import Link from "next/link";

export default function BackToHome() {
  return (
    <div
      preferred-color-scheme="dark"
      data-theme="dark"
      className="flex justify-between items-center bg-primary p-2 text-background"
    >
      <h1 className="text-2xl">Inertial Sensing Lab | Content Studio</h1>
      <Link
        className="hover:bg-background/10 p-2 rounded-lg transition-all ease-in-out"
        href="/"
      >
        Back to home
      </Link>
    </div>
  );
}

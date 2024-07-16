"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/images/logo.webp";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <ol className="p-0 m-3 list-none flex gap-x-3 items-center">
        <Image className="mr-10" src={logo} alt="CV Chatbot Logo" width={36} />
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/ask">Chat</Link>
        </li>
      </ol>
    </nav>
  );
};

export default NavBar;

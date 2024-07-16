import React from "react";
import NavBar from "./component/navbar";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="overview-text prose text-gray-300">
        <h1 className="font-bold text-3xl text-gray-400">CV Chatbot</h1>

        <p>
          Dies ist eine Beispiel Chat Anwendung. Sie dient als Prove of Concept
          für eine RAG Anwendung. Sie nutzt KI um mit den eigenen Daten zu
          interagieren.
        </p>

        <h2 className="italic text-gray-400">Architektur</h2>
        <ol>
          <li>Frontend + Backend: Next.js</li>
          <li>LLM: OpenAI&apos;s Chat API (GPT-3.5-Turbo)</li>
          <li>Embeddings: MongoDB Atlas vector store</li>
          <li>Request Augmented Retrieval: Lang Chain</li>
        </ol>

        <p>
          Als Beispiel habe ich meinen CV in MongoDB Atlas gespeichert. Dieser
          kann hier direkt heruntergeladen werden.
          <br />
          <Link
            href={
              "https://docs.google.com/document/d/1ybGyvHxuJP4mBPh9NHnB9-kWMUIB9KLnMwgk9aSuUYw/export?format=pdf"
            }
          >
            <button className="rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Download CV
            </button>
          </Link>
        </p>
        <p>
          Sobald es Änderungen an meinem CV gibt, wird automatisch ein Webhook
          getriggert, der dann den neuen CV in die Datenbank speichert.
        </p>
      </div>
    </div>
  );
};

export default Home;

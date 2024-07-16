"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import NavBar from "../component/navbar";
import img1484 from "@/images/1484.gif";
import imgUser from "@/images/user.png";
import imgBot from "@/images/bot.png";
import Image from "next/image";

export default function Home() {
  const [waitingForAI, setWaitingForAI] = useState<Boolean>(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      <NavBar />
      <div
        style={{
          height: "70vh",
          flexDirection: "column-reverse",
          display: "flex",
        }}
      >
        <>
          {waitingForAI && (
            <div className="loading">
              <Image src={img1484} alt="Waiting display image" />
            </div>
          )}
        </>
        <>
          {messages.length == 0 && (
            <p className="text-gray-300 text-center text-4xl">
              Stelle eine Frage zu meinem CV.
              <br /> Z.b. Wo finde ich Christoph auf LinkedIn?
            </p>
          )}
        </>
        <div className="pr-4 messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className="flex gap-3 my-4 text-gray-600 text-sm flex-1"
            >
              <span
                className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8"
                style={{ margin: "30px", marginTop: "0px" }}
              >
                <div className="rounded-full bg-gray-100 border p-1">
                  {m.role === "user" ? (
                    <Image src={imgUser} alt="user avatar image" />
                  ) : (
                    <Image src={imgBot} alt="bot avatar image" />
                  )}
                </div>
              </span>
              <p className="leading-relaxed" style={{ color: "aliceblue" }}>
                <span className="block font-bold">{m.role.toUpperCase()}</span>
                {m.content}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center pt-0 chat-window">
          <form
            className="flex items-center justify-center w-full space-x-2"
            onSubmit={handleSubmit}
          >
            <input
              value={input}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Tippe hier deine Frage ein..."
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
            >
              Senden
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

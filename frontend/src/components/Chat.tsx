import React, { useMemo, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

type Props = {};

interface Message {
  name: string;
  message: string;
}

export const Chat = (props: Props) => {
  const location = useLocation();
  const inputRef = useRef<any>();

  const queryParams = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return {
      auction_id: query.get("auction_id"),
      name: query.get("name"),
    };
  }, [location]);

  // const socket = useMemo<SocketIOClient.Socket>(
  //   () => io("http://localhost:3333", { query: { name: queryParams.name } }),
  //   [queryParams]
  // );

  const socket = useMemo<SocketIOClient.Socket>(
    () => io("http://localhost:3333/auction"),
    []
  );

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on(
      "receive-message",
      (content: { message: string; name: string }) => {
        console.log(content);
        setMessages((prevState) => [...prevState, content]);
      }
    );

    socket.on("connect", () => {
      console.log("abriu a conexao");
      socket.emit("join", {
        name: queryParams.name,
        auction_id: queryParams.auction_id,
      });
    });
  }, [socket, queryParams]);

  function sendMessage() {
    const message = inputRef.current.value;
    socket.emit("send-message", { message });
    const name = queryParams.name as string;
    const content = { message, name };
    setMessages((prevState) => [...prevState, content]);
  }

  return (
    <div>
      <h1>Chat Leilão</h1>
      <ul>
        {messages.map((message, key) => (
          <li key={key}>
            {message.name} - {message.message}
          </li>
        ))}
      </ul>
      <div>
        <label htmlFor="message">Message</label>
        <input type="text" id="message" ref={inputRef} />
        <button type="button" onClick={() => sendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
};

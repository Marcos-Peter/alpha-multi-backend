import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

interface AuctionModel {
  id: string;
  name: string;
}

export const Auction = (props: Props) => {
  const [auctions, setAuctions] = useState<AuctionModel[]>([]);
  const inputRef = useRef<any>();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3333/auctions").then((response) => {
      setAuctions(response.data);
    });
  }, []);

  console.log(auctions);

  function toChat(auctionId: string) {
    const name = inputRef.current.value;
    navigate(`/chat?auction_id=${auctionId}&name=${name}`);
    console.log(auctionId, name);
  }

  return (
    <div>
      <h1>Salas</h1>
      <div>
        <label htmlFor="name">Nome</label>
        <input type="text" id="name" ref={inputRef} />
      </div>
      <ul>
        {auctions.map((auction, key) => (
          <li key={key} onClick={() => toChat(auction.id)}>
            {auction.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

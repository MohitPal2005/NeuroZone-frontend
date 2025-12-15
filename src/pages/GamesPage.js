import React from "react";
import { useNavigate } from "react-router-dom";
import { TbWheel } from "react-icons/tb";
import { LuSmartphoneNfc } from "react-icons/lu";
import { BsShieldCheck } from "react-icons/bs";
import "./GamesPage.css";

export default function GamesPage() {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      name: "Spin the Wheel",
      description: "Fast, exciting rewards!",
      path: "/games/spinwheel", // ✅ kept old path for connectivity
      icon: <TbWheel className="game-icon" />,
    },
    {
      id: 2,
      name: "Scratch & Win",
      description: "Instant mobile fun!",
      path: "/games/scratchcard", // ✅ kept old path
      icon: <LuSmartphoneNfc className="game-icon" />,
    },
    {
      id: 3,
      name: "Daily Quest",
      description: "Boost knowledge & habits",
      path: "/games/quiz", // ✅ old path was already correct
      icon: <BsShieldCheck className="game-icon" />,
    },
  ];

  return (
    <div className="games-page-container">
      <h1 className="games-page-title">Choose Your Game</h1>
      <div className="games-container">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(game.path)}
            onKeyPress={(e) => {
              if (e.key === "Enter") navigate(game.path);
            }}
          >
            {game.icon}
            <h2 className="game-card-title">{game.name}</h2>
            <p className="game-card-description">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

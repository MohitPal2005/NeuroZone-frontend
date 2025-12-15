import React, { useState, useEffect } from "react";
import { saveCoupon, getUserCoupons } from "../../utils/firestore";
import { toast } from "react-toastify";
import styled from "styled-components";

const questions = [
  {
    id: 1,
    question: "What type of products do you prefer?",
    options: ["Electronics", "Fashion", "Groceries", "Home Decor"],
  },
  {
    id: 2,
    question: "What’s your budget range?",
    options: ["Below ₹500", "₹500 - ₹2000", "₹2000 - ₹5000", "Above ₹5000"],
  },
  {
    id: 3,
    question: "How often do you shop online?",
    options: ["Daily", "Weekly", "Monthly", "Rarely"],
  },
];


const Wrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const Card = styled.div`
  width: 480px;
  padding: 30px;
  border-radius: 18px;
  animation: fadeIn 0.4s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(14px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);

  body.dark & {
    background: rgba(30, 41, 59, 0.65);
    box-shadow: 0 4px 22px rgba(0, 255, 255, 0.12);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 20px;
  color: #555;

  body.dark & {
    color: #cdd6e3;
  }
`;

const Question = styled.h2`
  margin-top: 20px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
`;

const Options = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionBtn = styled.button`
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background: white;
  transition: 0.25s ease;
  font-weight: 500;

  &:hover {
    background: #f0f9ff;
  }

  ${({ selected }) =>
    selected &&
    `
    background: #0ea5e9;
    color: white;
    border-color: #0284c7;
    transform: scale(1.02);
  `}

  body.dark & {
    background: rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
    border-color: #475569;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    ${({ selected }) =>
      selected &&
      `
      background: #0ea5e9;
      color: white;
      border-color: #0284c7;
    `}
  }
`;

const NextBtn = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 25px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  background: #0284c7;
  transition: 0.25s;

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0369a1;
  }
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
  margin-bottom: 25px;
`;

const ResultItem = styled.div`
  padding: 12px 16px;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.85);

  body.dark & {
    background: rgba(51, 65, 85, 0.55);
  }
`;

const CouponPill = styled.div`
  padding: 10px;
  background: #e8f0ff;
  border-radius: 12px;
  margin-top: 8px;
  font-weight: 600;
  color: #0050c8;

  body.dark & {
    background: rgba(14, 165, 233, 0.15);
    color: #38bdf8;
    border: 1px solid #0ea5e9;
  }
`;


export default function QuizGame() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [canPlay, setCanPlay] = useState(true);

  const q = questions[currentQ];
  const selected = answers[q.id];

  useEffect(() => {
    const fetchCoupons = async () => {
      const all = await getUserCoupons();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCoupons = all.filter((c) => {
        const date = c.createdAt?.toDate
          ? c.createdAt.toDate()
          : new Date(c.createdAt);
        return date >= today;
      });

      setCoupons(todayCoupons);
      setCanPlay(todayCoupons.length < 2);
    };

    fetchCoupons();
  }, []);

  const choose = (option) => setAnswers((p) => ({ ...p, [q.id]: option }));

  const next = () => {
    if (!selected) return;
    if (currentQ < questions.length - 1) setCurrentQ((x) => x + 1);
    else {
      setSubmitted(true);
      handleQuizWin();
    }
  };

  const restart = () => {
    setAnswers({});
    setCurrentQ(0);
    setSubmitted(false);
  };

  const handleQuizWin = async () => {
    if (!canPlay) {
      toast.error("Daily coupon limit reached (max 2 per day)");
      return;
    }

    const coupon = {
      code: `QUIZ${Math.floor(Math.random() * 9000 + 1000)}`,
      value: Math.floor(Math.random() * 30) + 10,
    };

    const saved = await saveCoupon(coupon);
    setCoupons((p) => [...p, saved]);
    toast.success(`Coupon ${saved.code} generated!`);
  };

  return (
    <Wrapper>
      <Card>
        {!submitted ? (
          <>
            <Title>Customer Preference Quiz</Title>
            <Subtitle>Answer a few quick questions to unlock smart deals.</Subtitle>

            <p style={{ textAlign: "center" }}>
              Question {currentQ + 1} of {questions.length}
            </p>

            <Question>{q.question}</Question>

            <Options>
              {q.options.map((opt) => (
                <OptionBtn
                  key={opt}
                  selected={selected === opt}
                  onClick={() => choose(opt)}
                >
                  {opt}
                </OptionBtn>
              ))}
            </Options>

            <NextBtn onClick={next} disabled={!selected}>
              {currentQ === questions.length - 1
                ? "Submit & Get Coupon"
                : "Next"}
            </NextBtn>
          </>
        ) : (
          <>
            <Title>🎉 Thank You!</Title>
            <Subtitle>Here is a summary of your choices:</Subtitle>

            <ResultList>
              {questions.map((qq) => (
                <ResultItem key={qq.id}>
                  <span>{qq.question}</span>
                  <span style={{ fontWeight: "600", color: "#0284c7" }}>
                    {answers[qq.id]}
                  </span>
                </ResultItem>
              ))}
            </ResultList>

            <h3 style={{ marginTop: 15 }}>Today's Coupons</h3>
            {coupons.map((c) => (
              <CouponPill key={c.id}>
                {c.code} — {c.value}% OFF
              </CouponPill>
            ))}

            <NextBtn onClick={restart} style={{ marginTop: 30 }}>
              Retake Quiz
            </NextBtn>
          </>
        )}
      </Card>
    </Wrapper>
  );
}

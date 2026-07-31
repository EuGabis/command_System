"use client";

import { useEffect, useRef, useState } from "react";

interface Step {
  who: "cliente" | "ai";
  text: string;
  pause?: number;
}

const STEPS: Step[] = [
  { who: "cliente", text: "Olá, quero uma passagem para Lisboa", pause: 900 },
  { who: "ai", text: "Olá! Ótima escolha. Para quando seria e quantas pessoas?", pause: 1100 },
  { who: "cliente", text: "Ida 10/08, volta 20/08 — 2 adultos", pause: 1000 },
  { who: "ai", text: "Perfeito. Já estou buscando as melhores opções para vocês.", pause: 1400 },
  { who: "ai", text: "Encontrei ida e volta a partir de R$ 3.480. Quer que eu segure essa tarifa?", pause: 2200 },
  { who: "cliente", text: "Quero sim, por favor", pause: 1200 },
  { who: "ai", text: "Fechado. Envio o link de pagamento em seguida. Boa viagem!", pause: 2600 },
];

export default function ChatDemo() {
  const [shown, setShown] = useState<Step[]>([]);
  const [typing, setTyping] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let i = 0;
    const run = () => {
      if (i >= STEPS.length) {
        timers.push(setTimeout(() => {
          setShown([]);
          i = 0;
          run();
        }, 3000));
        return;
      }
      const step = STEPS[i];
      if (step.who === "ai") {
        setTyping(true);
        timers.push(setTimeout(() => {
          setTyping(false);
          setShown((s) => [...s, step]);
          i++;
          timers.push(setTimeout(run, step.pause ?? 1100));
        }, 1000));
      } else {
        setShown((s) => [...s, step]);
        i++;
        timers.push(setTimeout(run, step.pause ?? 900));
      }
    };
    timers.push(setTimeout(run, 700));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [shown, typing]);

  return (
    <div className="g-phone">
      <div className="g-phone-top">
        <div className="g-phone-ava">G</div>
        <div>
          <div className="g-phone-name">GAABTUR</div>
          <div className="g-phone-status"><span className="g-online" /> online agora</div>
        </div>
      </div>
      <div className="g-phone-body" ref={boxRef}>
        {shown.map((m, i) => (
          <div key={i} className={`g-msg ${m.who === "cliente" ? "me" : "them"}`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="g-msg them g-typing">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>
    </div>
  );
}

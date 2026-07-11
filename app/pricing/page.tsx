import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { ParticleOrb } from "../particle-orb";

const plans = [
  {
    name: "Free",
    price: "0 ₽",
    note: "Чтобы познакомиться с Carry",
    features: ["5 стартовых токенов", "Быстрый анализ", "Базовая оценка вероятности"],
  },
  {
    name: "Pro",
    price: "Скоро",
    note: "Для регулярного анализа матчей",
    featured: true,
    features: ["Все режимы анализа", "Расширенные источники", "История прогнозов", "Приоритетная обработка"],
  },
  {
    name: "Team",
    price: "Скоро",
    note: "Для аналитиков и команд",
    features: ["Общий workspace", "Командная история", "Экспорт отчётов", "Персональная поддержка"],
  },
];

export default function PricingPage() {
  return (
    <main className="pricingPage">
      <header className="pricingHeader">
        <Link href="/" className="pricingBack"><ArrowLeft size={17} />Вернуться в чат</Link>
        <div className="pricingBrand"><span className="brandMark" />CARRY</div>
        <span className="pricingStatus">PAYMENTS / SOON</span>
      </header>

      <section className="pricingHero">
        <div className="pricingOrb"><ParticleOrb /></div>
        <span className="pricingEyebrow">CARRY ACCESS</span>
        <h1>Выберите глубину анализа</h1>
        <p>Оплата пока отключена. Сейчас можно использовать бесплатный доступ, а платные планы появятся после запуска биллинга.</p>
      </section>

      <section className="pricingGrid" aria-label="Тарифы Carry">
        {plans.map((plan) => (
          <article key={plan.name} className={plan.featured ? "priceCard featured" : "priceCard"}>
            <div className="priceCardHead">
              <h2>{plan.name}</h2>
              {plan.featured && <span>Рекомендуем</span>}
            </div>
            <strong className="priceValue">{plan.price}</strong>
            <p>{plan.note}</p>
            <button disabled={plan.name !== "Free"}>{plan.name === "Free" ? "Начать бесплатно" : "Уведомить о запуске"}</button>
            <ul>
              {plan.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}

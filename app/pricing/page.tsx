import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    tokens: "5 токенов",
    description: "Для первого знакомства с Carry AI",
    features: ["5 токенов при регистрации", "Быстрый ответ за 1 токен", "Стандартный анализ за 3 токена"],
    cta: "Начать бесплатно",
  },
  {
    name: "Pro",
    price: "$29.99",
    period: "/ месяц",
    tokens: "50 токенов",
    description: "Для регулярной аналитики матчей",
    features: ["50 токенов каждый месяц", "Все типы анализа", "Глубокий анализ за 5 токенов", "Полный анализ с источниками за 10 токенов"],
    cta: "Скоро",
    popular: true,
  },
  {
    name: "High",
    price: "$59.99",
    period: "/ месяц",
    tokens: "100 токенов",
    description: "Для профессиональных аналитиков",
    features: ["100 токенов каждый месяц", "Все возможности Pro", "API-доступ", "Персональная поддержка"],
    cta: "Скоро",
  },
];

const tokenPacks = [
  { amount: "10 токенов", price: "$9.99" },
  { amount: "50 токенов", price: "$49.99" },
  { amount: "100 токенов", price: "$89.99" },
];

export default function PricingPage() {
  return (
    <main className="pricingPage">
      <header className="pricingHeader">
        <Link href="/" className="pricingBack"><ArrowLeft size={17} />Вернуться в чат</Link>
        <div className="pricingBrand"><span className="brandMark" />CARRY</div>
        <span className="pricingStatus">PRICING / PREVIEW</span>
      </header>

      <section className="pricingHero compact">
        <h1>Обновите свой план</h1>
        <p>Выберите объём и глубину анализа. Оплата появится позже — сейчас тарифы доступны для предварительного просмотра.</p>
      </section>

      <section className="pricingGrid" aria-label="Тарифы Carry">
        {plans.map((plan) => (
          <article key={plan.name} className={plan.popular ? "priceCard featured" : "priceCard"}>
            <div className="priceCardHead">
              <h2>{plan.name}</h2>
              {plan.popular && <span>Рекомендуем</span>}
            </div>
            <div className="priceLine"><strong className="priceValue">{plan.price}</strong><span>{plan.period}</span></div>
            <strong className="tokenValue">{plan.tokens}</strong>
            <p>{plan.description}</p>
            <button disabled={plan.name !== "Free"}>{plan.cta}</button>
            <ul>
              {plan.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="tokenSection">
        <div className="tokenSectionHead"><span>TOKEN PACKS</span><h2>Купить токены отдельно</h2></div>
        <div className="tokenGrid">
          {tokenPacks.map((pack) => (
            <article key={pack.amount} className="tokenCard">
              <strong>{pack.amount}</strong>
              <span>{pack.price}</span>
              <button disabled>Скоро</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

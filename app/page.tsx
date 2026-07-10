"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUp, Check, ChevronDown, ChevronRight, CircleHelp, LogOut, Menu,
  MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Settings, SlidersHorizontal,
  Sparkles, Telescope, UserRound,
} from "lucide-react";

type Language = "ru" | "en";
type Theme = "light" | "dark";

const copy = {
  ru: { newChat:"Новый чат", research:"Глубокое исследование", recent:"Недавнее", title:"С чего начнём?", placeholder:"Спросите что-нибудь", answer:"Привет! Чем я могу помочь?", settings:"Настройки", language:"Язык", theme:"Тема интерфейса", light:"Светлая", dark:"Тёмная", close:"Готово" },
  en: { newChat:"New chat", research:"Deep research", recent:"Recent", title:"Where should we begin?", placeholder:"Ask anything", answer:"Hello! How can I help?", settings:"Settings", language:"Language", theme:"Interface theme", light:"Light", dark:"Dark", close:"Done" },
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [sidebar, setSidebar] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<Theme>("light");
  const t = copy[language];

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = message.trim();
    if (!value) return;
    setSent((items) => [...items, value]);
    setMessage("");
  }

  function openSettings() {
    setProfileOpen(false);
    setSettingsOpen(true);
  }

  return (
    <main className={`shell theme-${theme}`}>
      <aside className={sidebar ? "sidebar open" : "sidebar closed"} aria-label="Chat navigation">
        <div className="sideTop">
          <button className="wordmark" aria-label="ChatGPT home">ChatGPT</button>
          <button className="iconButton" aria-label="Close sidebar" onClick={() => setSidebar(false)}><PanelLeftClose size={19} /></button>
        </div>

        <nav className="navList">
          <button><MessageSquarePlus /><span>{t.newChat}</span></button>
          <button><Telescope /><span>{t.research}</span></button>
        </nav>

        <div className="recentBlock">
          <div className="recentTitle"><span>{t.recent}</span><ChevronRight size={14} /></div>
          <div className="recentLine" />
          {sent.slice().reverse().slice(0, 5).map((item, i) => <button className="recentChat" key={`${item}-${i}`}>{item}</button>)}
        </div>

        <div className="profileArea">
          {profileOpen && (
            <div className="profileMenu" role="menu">
              <button className="menuIdentity"><span className="avatar coral">vo</span><span><strong>Вася</strong><small>Plus</small></span><ChevronRight size={18} /></button>
              <div className="menuDivider" />
              <button><Sparkles /><span>Изменить план</span></button>
              <button><SlidersHorizontal /><span>Персонализация</span></button>
              <button><UserRound /><span>Профиль</span></button>
              <button onClick={openSettings}><Settings /><span>Настройки</span></button>
              <div className="menuDivider" />
              <button><CircleHelp /><span>Справка</span><ChevronRight className="push" /></button>
              <button><LogOut /><span>Выйти</span></button>
            </div>
          )}
          <div className="profileRow">
            <button className="profileMain" onClick={() => setProfileOpen((v) => !v)} aria-expanded={profileOpen}>
              <span className="avatar">В</span><span><strong>Вася</strong><small>Free</small></span>
            </button>
            <button className="profileMore" aria-label="Profile options" onClick={() => setProfileOpen((v) => !v)}><span>•••</span></button>
          </div>
        </div>
      </aside>

      <section className="chat">
        <header>
          <button className={sidebar ? "openSidebar hidden" : "openSidebar"} aria-label="Open sidebar" onClick={() => setSidebar(true)}><PanelLeftOpen size={20} /></button>
          <button className="mobileMenu" aria-label="Open sidebar" onClick={() => setSidebar(true)}><Menu size={20} /></button>
          <button className="model">ChatGPT <ChevronDown size={15} /></button>
          <div className="headerActions"><button className="login">Log in</button><button className="signup">Sign up for free</button></div>
        </header>

        <div className="chatBody">
          {sent.length === 0 ? <div className="emptyState"><h1>{t.title}</h1></div> : (
            <div className="messages">
              {sent.map((item, i) => (
                <div className="turn" key={`${item}-${i}`}>
                  <div className="bubble">{item}</div>
                  <div className="assistantMsg">{t.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="composerDock">
          <form className="composer" onSubmit={submit}>
            <input aria-label="Message ChatGPT" placeholder={t.placeholder} value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="send" aria-label="Send message" disabled={!message.trim()}><ArrowUp size={19} strokeWidth={2.4} /></button>
          </form>
          <footer>ChatGPT может допускать ошибки. Проверяйте важную информацию.</footer>
        </div>
      </section>

      {sidebar && <button className="scrim" aria-label="Close sidebar" onClick={() => setSidebar(false)} />}

      {settingsOpen && (
        <div className="modalBackdrop" onMouseDown={() => setSettingsOpen(false)}>
          <section className="settingsModal" role="dialog" aria-modal="true" aria-label={t.settings} onMouseDown={(e) => e.stopPropagation()}>
            <div className="settingsHead"><h2>{t.settings}</h2><button onClick={() => setSettingsOpen(false)}>×</button></div>
            <div className="settingRow"><span>{t.language}</span><div className="segmented"><button className={language === "ru" ? "selected" : ""} onClick={() => setLanguage("ru")}>Русский{language === "ru" && <Check />}</button><button className={language === "en" ? "selected" : ""} onClick={() => setLanguage("en")}>English{language === "en" && <Check />}</button></div></div>
            <div className="settingRow"><span>{t.theme}</span><div className="segmented"><button className={theme === "light" ? "selected" : ""} onClick={() => setTheme("light")}>{t.light}{theme === "light" && <Check />}</button><button className={theme === "dark" ? "selected" : ""} onClick={() => setTheme("dark")}>{t.dark}{theme === "dark" && <Check />}</button></div></div>
            <button className="doneButton" onClick={() => setSettingsOpen(false)}>{t.close}</button>
          </section>
        </div>
      )}
    </main>
  );
}

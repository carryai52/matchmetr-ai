"use client";

import { FormEvent, useState } from "react";
import { ParticleOrb } from "./particle-orb";
import {
  AppWindow, ArrowUp, Bell, CalendarClock, Check, ChevronDown, ChevronRight,
  CircleHelp, Database, Ellipsis, Images, LayoutGrid, LogOut, Menu,
  MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Plug, Search, Settings,
  Shield, SlidersHorizontal, Sparkles, Telescope, UserRound, X,
} from "lucide-react";

type Language = "ru" | "en";
type Theme = "light" | "dark";
type SettingsSection = "general" | "notifications" | "personalization" | "apps" | "data" | "security" | "account";
type AnalysisMode = "instant" | "balance" | "deep" | "full";

const analysisModes = [
  { id: "instant", label: "Instant", cost: "1 токен", description: "Быстрый прогноз по главным сигналам" },
  { id: "balance", label: "Balance", cost: "3 токена", description: "Форма, составы и очные встречи" },
  { id: "deep", label: "Deep", cost: "5 токенов", description: "Расширенный анализ данных и рисков" },
  { id: "full", label: "Full", cost: "10 токенов", description: "Полный разбор с источниками" },
] as const;

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
  const [theme, setTheme] = useState<Theme>("dark");
  const [authenticated, setAuthenticated] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("general");
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("instant");
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const t = copy[language];
  const selectedMode = analysisModes.find((mode) => mode.id === analysisMode) ?? analysisModes[0];

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

  function openSettingsAt(section:SettingsSection) {
    setProfileOpen(false);
    setSettingsSection(section);
    setSettingsOpen(true);
  }

  const composer = (
    <form className="composer" onSubmit={submit}>
      <input aria-label="Message Carry" placeholder={t.placeholder} value={message} onChange={(event) => setMessage(event.target.value)} />
      <div className="modePicker">
        {analysisOpen && (
          <div className="modeMenu" role="menu">
            <div className="modeMenuTitle">Глубина анализа</div>
            {analysisModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={analysisMode === mode.id ? "modeOption selected" : "modeOption"}
                onClick={() => { setAnalysisMode(mode.id); setAnalysisOpen(false); }}
              >
                <span className="modeOptionTop"><strong>{mode.label}</strong><em>{mode.cost}</em></span>
                <small>{mode.description}</small>
              </button>
            ))}
          </div>
        )}
        <button type="button" className="modeTrigger" aria-expanded={analysisOpen} onClick={() => setAnalysisOpen((open) => !open)}>
          <span><strong>{selectedMode.label}</strong><small>{selectedMode.cost}</small></span>
          <ChevronDown size={14} />
        </button>
      </div>
      <button className="send" aria-label="Отправить" disabled={!message.trim()}><ArrowUp size={19} strokeWidth={2.4} /></button>
    </form>
  );

  return (
    <main className={`shell theme-${theme}`}>
      <aside className={sidebar ? "sidebar open" : "sidebar closed"} aria-label="Chat navigation">
        <div className="sideTop">
          <button className="wordmark" aria-label="Carry home"><span className="brandMark" />CARRY</button>
          <button className="iconButton" aria-label="Close sidebar" onClick={() => setSidebar(false)}><PanelLeftClose size={19} /></button>
        </div>

        <nav className="navList">
          <button><MessageSquarePlus /><span>{t.newChat}</span></button>
          <button><Search /><span>{language === "ru" ? "Искать чаты" : "Search chats"}</span></button>
          <button><Images /><span>{language === "ru" ? "Изображения" : "Images"}</span></button>
          <button><AppWindow /><span>{language === "ru" ? "Приложения" : "Apps"}</span></button>
          <button><Telescope /><span>{t.research}</span></button>
          <button><LayoutGrid /><span>{language === "ru" ? "Проекты" : "Projects"}</span></button>
          <button><CalendarClock /><span>{language === "ru" ? "Запланированное" : "Scheduled"}</span></button>
          <button><Plug /><span>{language === "ru" ? "Плагины" : "Plugins"}</span></button>
          <button><Ellipsis /><span>{language === "ru" ? "Больше" : "More"}</span></button>
        </nav>

        <div className="recentBlock">
          <div className="recentTitle"><span>{t.recent}</span><ChevronRight size={14} /></div>
          <div className="recentLine" />
          {sent.slice().reverse().slice(0, 5).map((item, i) => <button className="recentChat" key={`${item}-${i}`}>{item}</button>)}
        </div>

        <div className="profileArea">
          {!authenticated ? <div className="guestCard"><strong>{language === "ru" ? "Получайте ответы специально для вас" : "Get answers tailored to you"}</strong><p>{language === "ru" ? "Войдите, чтобы использовать историю, изображения и файлы." : "Sign in to use history, images and files."}</p><button onClick={() => setAuthMode("login")}>{language === "ru" ? "Войти" : "Log in"}</button></div> : <>
          {profileOpen && (
            <div className="profileMenu" role="menu">
              <button className="menuIdentity"><span className="avatar coral">vo</span><span><strong>Вася</strong><small>Plus</small></span><ChevronRight size={18} /></button>
              <div className="menuDivider" />
              <button onClick={() => { setProfileOpen(false); setNotice("Тариф Plus уже выбран для демонстрации."); }}><Sparkles /><span>Изменить план</span></button>
              <button onClick={() => openSettingsAt("personalization")}><SlidersHorizontal /><span>Персонализация</span></button>
              <button onClick={() => openSettingsAt("account")}><UserRound /><span>Профиль</span></button>
              <button onClick={openSettings}><Settings /><span>Настройки</span></button>
              <div className="menuDivider" />
              <button onClick={() => { setProfileOpen(false); setNotice("Центр справки: выберите тему или задайте вопрос службе поддержки."); }}><CircleHelp /><span>Справка</span><ChevronRight className="push" /></button>
              <button onClick={() => { setAuthenticated(false); setProfileOpen(false); }}><LogOut /><span>Выйти</span></button>
            </div>
          )}
          <div className="profileRow">
            <button className="profileMain" onClick={() => setProfileOpen((v) => !v)} aria-expanded={profileOpen}>
              <span className="avatar">В</span><span><strong>Вася</strong><small>Free</small></span>
            </button>
            <button className="profileMore" aria-label="Profile options" onClick={() => setProfileOpen((v) => !v)}><span>•••</span></button>
          </div>
          </>}
        </div>
      </aside>

      <section className="chat">
        <header>
          <button className={sidebar ? "openSidebar hidden" : "openSidebar"} aria-label="Open sidebar" onClick={() => setSidebar(true)}><PanelLeftOpen size={20} /></button>
          <button className="mobileMenu" aria-label="Open sidebar" onClick={() => setSidebar(true)}><Menu size={20} /></button>
        </header>

        <div className={sent.length === 0 ? "chatBody initial" : "chatBody"}>
          {sent.length === 0 ? <div className="emptyState"><div className="carryOrbStage"><ParticleOrb /></div><div className="carryIntro"><h1>{language === "ru" ? "Какой матч разберём?" : "Which match should we analyze?"}</h1><p>{language === "ru" ? "Carry AI скажет вероятность победы" : "Carry AI will estimate the probability of victory"}</p></div><div className="composerDock initialDock">{composer}</div></div> : (
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

        {sent.length > 0 && <div className="composerDock">{composer}</div>}
      </section>

      {sidebar && <button className="scrim" aria-label="Close sidebar" onClick={() => setSidebar(false)} />}

      {settingsOpen && (
        <div className="modalBackdrop" onMouseDown={() => setSettingsOpen(false)}>
          <section className="settingsModal" role="dialog" aria-modal="true" aria-label={t.settings} onMouseDown={(e) => e.stopPropagation()}>
            <div className="settingsHead"><h2>{t.settings}</h2><button aria-label="Закрыть" onClick={() => setSettingsOpen(false)}><X /></button></div>
            <div className="settingsLayout">
              <nav className="settingsNav">
                {([['general',Settings,'Общие'],['notifications',Bell,'Уведомления'],['personalization',SlidersHorizontal,'Персонализация'],['apps',Plug,'Приложения'],['data',Database,'Управление данными'],['security',Shield,'Безопасность'],['account',UserRound,'Аккаунт']] as const).map(([id,Icon,label]) => <button key={id} className={settingsSection === id ? "active" : ""} onClick={() => setSettingsSection(id)}><Icon />{label}</button>)}
              </nav>
              <div className="settingsContent">
                {settingsSection === "general" ? <>
                  <h3>Общие</h3>
                  <div className="settingRow"><span>{t.language}</span><div className="segmented horizontal"><button className={language === "ru" ? "selected" : ""} onClick={() => setLanguage("ru")}>Русский{language === "ru" && <Check />}</button><button className={language === "en" ? "selected" : ""} onClick={() => setLanguage("en")}>English{language === "en" && <Check />}</button></div></div>
                  <div className="settingRow"><span>{t.theme}</span><div className="segmented horizontal"><button className={theme === "light" ? "selected" : ""} onClick={() => setTheme("light")}>{t.light}{theme === "light" && <Check />}</button><button className={theme === "dark" ? "selected" : ""} onClick={() => setTheme("dark")}>{t.dark}{theme === "dark" && <Check />}</button></div></div>
                  <ToggleRow label="Акцентный цвет" /><ToggleRow label="Показывать код встроенно" />
                </> : <SettingsPanel section={settingsSection} />}
              </div>
            </div>
          </section>
        </div>
      )}

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSuccess={() => { setAuthenticated(true); setAuthMode(null); }} onSwitch={setAuthMode} />}
      {notice && <div className="notice"><span>{notice}</span><button aria-label="Закрыть уведомление" onClick={() => setNotice(null)}><X /></button></div>}
    </main>
  );
}

function ToggleRow({ label }: { label:string }) {
  const [on,setOn] = useState(true);
  return <div className="optionRow"><span>{label}</span><button className={on ? "switch on" : "switch"} onClick={() => setOn(!on)}><span /></button></div>;
}

function SettingsPanel({ section }: { section:SettingsSection }) {
  const content:Record<Exclude<SettingsSection,"general">,{title:string;rows:string[]}> = {
    notifications:{title:"Уведомления",rows:["Ответы и обновления", "Задачи и напоминания", "Рекомендации"]},
    personalization:{title:"Персонализация",rows:["Память", "Ссылаться на историю чатов", "Пользовательские инструкции"]},
    apps:{title:"Приложения и подключения",rows:["Подключённые приложения", "Поиск подключений", "Расширенные настройки"]},
    data:{title:"Управление данными",rows:["Улучшать модель для всех", "Общие ссылки", "Экспортировать данные"]},
    security:{title:"Безопасность",rows:["Многофакторная аутентификация", "Выйти на всех устройствах", "Активные сеансы"]},
    account:{title:"Аккаунт",rows:["План: Free", "Электронная почта", "Удалить аккаунт"]},
  };
  const data=content[section as Exclude<SettingsSection,"general">];
  return <><h3>{data.title}</h3>{data.rows.map((row,i) => i < 2 ? <ToggleRow key={row} label={row} /> : <button className="wideSetting" key={row}>{row}<ChevronRight /></button>)}</>;
}

function AuthModal({mode,onClose,onSuccess,onSwitch}:{mode:"login"|"signup";onClose:()=>void;onSuccess:()=>void;onSwitch:(m:"login"|"signup")=>void}) {
  const login=mode === "login";
  return <div className="authBackdrop"><section className="authModal"><button className="authClose" aria-label="Закрыть" onClick={onClose}><X /></button><div className="authLogo">◉</div><h2>{login ? "С возвращением" : "Создайте аккаунт"}</h2><p>{login ? "Войдите в ChatGPT" : "Зарегистрируйтесь, чтобы продолжить"}</p><input type="email" placeholder="Адрес электронной почты" /><button className="authContinue" onClick={onSuccess}>Продолжить</button><div className="or"><span>или</span></div><button className="provider">G&nbsp;&nbsp; Продолжить с Google</button><button className="provider">▦&nbsp;&nbsp; Продолжить с Microsoft</button><button className="provider">●&nbsp;&nbsp; Продолжить с Apple</button><p className="authSwitch">{login ? "Нет аккаунта?" : "Уже есть аккаунт?"} <button onClick={() => onSwitch(login ? "signup" : "login")}>{login ? "Регистрация" : "Войти"}</button></p></section></div>;
}

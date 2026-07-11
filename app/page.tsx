"use client";

import { FormEvent, useEffect, useState } from "react";
import { ParticleOrb } from "./particle-orb";
import {
  ArrowUp, Bell, Check, ChevronDown, ChevronRight, CircleHelp, Database,
  Ellipsis, LogOut, Menu, MessageSquarePlus, PanelLeftClose, PanelLeftOpen,
  Plug, Settings, Shield, SlidersHorizontal, Sparkles, UserRound, X,
} from "lucide-react";

type Language = "ru" | "en";
type Theme = "light" | "dark";
type SettingsSection = "general" | "notifications" | "personalization" | "apps" | "data" | "security" | "account";
type AnalysisMode = "instant" | "medium" | "high" | "full";

type ChatTurn = { user: string; assistant: string };
type ChatSession = { id: string; title: string; turns: ChatTurn[]; closed: boolean; updatedAt: number };

const analysisModes = [
  { id: "instant", label: "Instant", cost: "1 токен", description: "Быстрый ответ: вероятность и короткий вывод." },
  { id: "medium", label: "Medium", cost: "3 токена", description: "Обычный анализ: форма команд и базовые факторы." },
  { id: "high", label: "High", cost: "5 токенов", description: "Глубокий анализ: форма, составы, новости, личные встречи и риски." },
  { id: "full", label: "Full", cost: "10 токенов", description: "Полный анализ: источники, карты, коэффициенты, личные встречи и расширенные факторы." },
] as const;

const CHAT_STORAGE_KEY = "carry-chat-sessions";

const copy = {
  ru: { newChat:"Новый чат", research:"Глубокое исследование", recent:"Недавнее", title:"С чего начнём?", placeholder:"Спросите что-нибудь", answer:"Привет! Чем я могу помочь?", settings:"Настройки", language:"Язык", theme:"Тема интерфейса", light:"Светлая", dark:"Тёмная", close:"Готово" },
  en: { newChat:"New chat", research:"Deep research", recent:"Recent", title:"Where should we begin?", placeholder:"Ask anything", answer:"Hello! How can I help?", settings:"Settings", language:"Language", theme:"Interface theme", light:"Light", dark:"Dark", close:"Done" },
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
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
  const activeChat = sessions.find((session) => session.id === activeChatId) ?? null;
  const turns = activeChat?.turns ?? [];
  const hasMessages = turns.length > 0;
  const chatIsReadOnly = Boolean(activeChat?.closed);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) ?? "[]") as ChatSession[];
      setSessions(stored.map((session) => ({ ...session, closed: true })));
    } catch {
      setSessions([]);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions, storageReady]);

  useEffect(() => {
    const closeCurrentChat = () => {
      if (!activeChatId || !storageReady) return;
      const next = sessions.map((session) => session.id === activeChatId ? { ...session, closed: true } : session);
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
    };
    window.addEventListener("beforeunload", closeCurrentChat);
    return () => window.removeEventListener("beforeunload", closeCurrentChat);
  }, [activeChatId, sessions, storageReady]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = message.trim();
    if (!value || chatIsReadOnly) return;
    const turn = { user: value, assistant: t.answer };
    if (activeChatId) {
      setSessions((items) => items.map((session) => session.id === activeChatId
        ? { ...session, turns: [...session.turns, turn], updatedAt: Date.now() }
        : session));
    } else {
      const id = crypto.randomUUID();
      setSessions((items) => [{ id, title: value, turns: [turn], closed: false, updatedAt: Date.now() }, ...items]);
      setActiveChatId(id);
    }
    setMessage("");
  }

  function startNewChat() {
    setActiveChatId(null);
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
          <span><strong>{selectedMode.label}</strong></span>
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
          <button onClick={startNewChat}><MessageSquarePlus /><span>{t.newChat}</span></button>
        </nav>

        <div className="recentBlock">
          <div className="recentTitle"><span>{t.recent}</span><ChevronRight size={14} /></div>
          <div className="recentLine" />
          {sessions.slice().sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 8).map((session) => (
            <button className={activeChatId === session.id ? "recentChat active" : "recentChat"} key={session.id} onClick={() => setActiveChatId(session.id)}>{session.title}</button>
          ))}
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

        <div className={!hasMessages ? "chatBody initial" : "chatBody"}>
          {!hasMessages ? <div className="emptyState"><div className="carryOrbStage"><ParticleOrb /></div><div className="carryIntro"><h1>{language === "ru" ? "Какой матч разберём?" : "Which match should we analyze?"}</h1><p>{language === "ru" ? "Carry AI скажет вероятность победы" : "Carry AI will estimate the probability of victory"}</p></div><div className="composerDock initialDock">{composer}</div></div> : (
            <div className="messages">
              {turns.map((turn, index) => (
                <div className="turn" key={`${activeChatId}-${index}`}>
                  <div className="bubble">{turn.user}</div>
                  <div className="assistantMsg">{turn.assistant}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasMessages && !chatIsReadOnly && <div className="composerDock">{composer}</div>}
        {hasMessages && chatIsReadOnly && <div className="closedChatNotice"><span>Этот чат завершён</span><button onClick={startNewChat}>Начать новый чат</button></div>}
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

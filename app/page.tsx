"use client";

import { FormEvent, useRef, useState } from "react";
import {
  AppWindow, ArrowUp, Bell, CalendarClock, Check, ChevronDown, ChevronRight,
  CircleHelp, Database, Ellipsis, Images, LayoutGrid, Library, LogOut, Menu,
  MessageSquarePlus, Mic, PanelLeftClose, PanelLeftOpen, Plug, Search, Settings,
  Plus, Share, Shield, SlidersHorizontal, Sparkles, Telescope, UserRound, Volume2, X,
} from "lucide-react";

type Language = "ru" | "en";
type Theme = "light" | "dark";
type SettingsSection = "general" | "notifications" | "personalization" | "apps" | "data" | "security" | "account";

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
  const [authenticated, setAuthenticated] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("general");
  const [attachOpen, setAttachOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const messageBeforeDictationRef = useRef("");
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

  function openSettingsAt(section:SettingsSection) {
    setProfileOpen(false);
    setSettingsSection(section);
    setSettingsOpen(true);
  }

  function stopAudio() {
    recognitionRef.current?.stop?.();
    recognitionRef.current = null;
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setListening(false);
  }

  async function startAudio(transcribe:boolean) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorder.start();
      mediaRecorderRef.current = recorder;
      setListening(true);
      if (transcribe) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.lang = language === "ru" ? "ru-RU" : "en-US";
          recognition.interimResults = true;
          recognition.continuous = true;
          recognition.onresult = (event:any) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i += 1) transcript += event.results[i][0].transcript;
            if (transcript.trim()) setMessage(transcript.trim());
          };
          recognition.onerror = () => setNotice("Не удалось распознать речь. Проверьте доступ к микрофону.");
          recognitionRef.current = recognition;
          recognition.start();
        } else setNotice("Запись началась, но распознавание речи не поддерживается этим браузером.");
      }
    } catch {
      setNotice("Доступ к микрофону запрещён. Разрешите его в адресной строке браузера и попробуйте снова.");
      stopAudio();
    }
  }

  async function toggleDictation() {
    if (listening) confirmDictation();
    else {
      messageBeforeDictationRef.current = message;
      await startAudio(true);
    }
  }

  function cancelDictation() {
    stopAudio();
    setMessage(messageBeforeDictationRef.current);
  }

  function confirmDictation() {
    stopAudio();
  }

  async function startVoiceMode() {
    await startAudio(false);
    if (streamRef.current) setVoiceOpen(true);
  }

  function closeVoiceMode() {
    stopAudio();
    setVoiceOpen(false);
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
          <button className="model">ChatGPT <ChevronDown size={15} /></button>
          <div className="headerActions">{authenticated ? <><button className="headerIcon"><Share />{language === "ru" ? "Поделиться" : "Share"}</button><button className="plainIcon"><SlidersHorizontal /></button><button className="plainIcon"><Ellipsis /></button></> : <><button className="login" onClick={() => setAuthMode("login")}>Log in</button><button className="signup" onClick={() => setAuthMode("signup")}>Sign up for free</button></>}</div>
        </header>

        <div className={sent.length === 0 ? "chatBody initial" : "chatBody"}>
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

        <div className={sent.length === 0 ? "composerDock initialDock" : "composerDock"}>
          {attachOpen && <div className="attachMenu"><button onClick={() => setNotice("Демонстрация: файл выбран.")}><Library />Добавить фотографии и файлы</button><button onClick={() => setNotice("Демонстрация: проект выбран.")}><LayoutGrid />Выбрать проект</button></div>}
          <form className={listening && !voiceOpen ? "composer dictating" : "composer"} onSubmit={submit}>
            {listening && !voiceOpen ? <>
              <div className="waveform"><span className="waveLine" /><span className="liveBars">{[8,18,30,24,34,28,36,26,18,32,34,22,30].map((height,i) => <i key={i} style={{height}} />)}</span></div>
              <div className="dictationBottom">
                <button type="button" className="composerIcon" aria-label="Add files" onClick={() => setAttachOpen((v) => !v)}><Plus /></button>
                <div className="dictationActions"><button type="button" aria-label="Отменить диктовку" onClick={cancelDictation}><X /></button><button type="button" aria-label="Подтвердить диктовку" onClick={confirmDictation}><Check /></button></div>
              </div>
            </> : <>
              <button type="button" className="composerIcon" aria-label="Add files" onClick={() => setAttachOpen((v) => !v)}><Plus /></button>
              <input aria-label="Message ChatGPT" placeholder={t.placeholder} value={message} onChange={(e) => setMessage(e.target.value)} />
              <button type="button" className="composerIcon" aria-label="Start dictation" onClick={toggleDictation}><Mic /></button>
              <button type="button" className="voiceButton" aria-label="Voice mode" onClick={startVoiceMode}><Volume2 /></button>
              <button className="send" aria-label="Send message" disabled={!message.trim()}><ArrowUp size={19} strokeWidth={2.4} /></button>
            </>}
          </form>
          <footer>ChatGPT может допускать ошибки. Проверяйте важную информацию.</footer>
        </div>
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
      {voiceOpen && <div className="voiceOverlay"><button className="voiceClose" aria-label="Закрыть голосовой режим" onClick={closeVoiceMode}><X /></button><div className="voiceOrb live"><Mic /></div><h2>Слушаю…</h2><p>Голосовой режим использует микрофон</p><button className="voiceStop" onClick={closeVoiceMode}>Завершить</button></div>}
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

"use client";

import { FormEvent, useState } from "react";
import {
  AppWindow, ArrowUp, ChevronDown, Images, LayoutGrid, Menu,
  MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Search, Telescope,
} from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [sidebar, setSidebar] = useState(true);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = message.trim();
    if (!value) return;
    setSent((items) => [...items, value]);
    setMessage("");
  }

  return (
    <main className="shell">
      <aside className={sidebar ? "sidebar open" : "sidebar closed"} aria-label="Chat navigation">
        <div className="sideTop">
          <button className="brandBtn" aria-label="ChatGPT home"><span className="brandMark">◉</span></button>
          <button className="roundBtn" aria-label="Close sidebar" onClick={() => setSidebar(false)}><PanelLeftClose size={19} strokeWidth={1.8} /></button>
        </div>
        <nav className="navList">
          <button><MessageSquarePlus /><span>New chat</span><kbd>Ctrl ⇧ O</kbd></button>
          <button><Search /><span>Search chats</span><kbd>Ctrl K</kbd></button>
          <button><Images /><span>Images</span></button>
          <button><AppWindow /><span>Apps</span></button>
          <button><Telescope /><span>Deep research</span></button>
          <button><LayoutGrid /><span>Projects</span></button>
        </nav>
        <div className="sideBottom">
          <button className="profile" aria-label="Open profile menu"><span className="avatar">В</span><span><strong>Вася</strong><small>Free</small></span><span className="profileDots">•••</span></button>
        </div>
      </aside>

      <section className="chat">
        <header>
          <button className={sidebar ? "openSidebar hidden" : "openSidebar"} aria-label="Open sidebar" onClick={() => setSidebar(true)}><PanelLeftOpen size={20} /></button>
          <button className="mobileMenu" aria-label="Open sidebar" onClick={() => setSidebar(true)}><Menu size={20} /></button>
          <button className="model">ChatGPT <ChevronDown size={16} /></button>
          <div className="headerActions"><button className="login">Log in</button><button className="signup">Sign up for free</button></div>
        </header>

        <div className="conversation">
          {sent.length === 0 ? <h1>Where should we begin?</h1> : (
            <div className="messages">
              {sent.map((item, i) => <div className="bubble" key={`${item}-${i}`}>{item}</div>)}
              <div className="assistantMsg">How can I help you with that?</div>
            </div>
          )}

          <form className="composer" onSubmit={submit}>
            <input aria-label="Message ChatGPT" placeholder="Ask anything" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="send" aria-label="Send message" disabled={!message.trim()}><ArrowUp size={19} strokeWidth={2.4} /></button>
          </form>
        </div>

        <footer>By messaging ChatGPT, you agree to our <a href="#">Terms</a> and have read our <a href="#">Privacy Policy</a>.</footer>
      </section>
      {sidebar && <button className="scrim" aria-label="Close sidebar" onClick={() => setSidebar(false)} />}
    </main>
  );
}

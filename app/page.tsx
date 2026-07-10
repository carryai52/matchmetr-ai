"use client";

import { FormEvent, useState } from "react";

const Icon = ({ children }: { children: React.ReactNode }) => <span className="icon" aria-hidden="true">{children}</span>;

export default function Home() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [sidebar, setSidebar] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = message.trim();
    if (!value) return;
    setSent((items) => [...items, value]);
    setMessage("");
  }

  return (
    <main className="shell">
      <aside className={sidebar ? "sidebar open" : "sidebar"} aria-label="Chat navigation">
        <div className="sideTop">
          <button className="brandBtn" aria-label="Open menu"><span className="mark">◎</span></button>
          <button className="roundBtn" aria-label="Close sidebar" onClick={() => setSidebar(false)}>‹</button>
        </div>
        <nav className="navList">
          <button><Icon>⌑</Icon><span>New chat</span><kbd>⌘ ⇧ O</kbd></button>
          <button><Icon>⌕</Icon><span>Search chats</span><kbd>⌘ K</kbd></button>
          <button><Icon>▧</Icon><span>Images</span></button>
          <button><Icon>◈</Icon><span>Apps</span></button>
          <button><Icon>▱</Icon><span>Deep research</span></button>
          <button><Icon>◇</Icon><span>Projects</span></button>
        </nav>
        <div className="sideBottom">
          <button><Icon>?</Icon><span><strong>Help</strong><small>Get answers and support</small></span></button>
          <button><Icon>⚙</Icon><span><strong>Settings</strong><small>Customize ChatGPT</small></span></button>
        </div>
      </aside>

      <section className="chat">
        <header>
          <button className="mobileMenu" aria-label="Open sidebar" onClick={() => setSidebar(true)}>☰</button>
          <button className="model">ChatGPT <span>⌄</span></button>
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
            <textarea aria-label="Message ChatGPT" placeholder="Ask anything" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }} />
            <div className="composerTools">
              <button type="button" className="toolBtn" aria-label="Add attachment">＋</button>
              <button type="button" className="tools"><span>⊹</span> Tools</button>
              <div className="spacer" />
              <button type="button" className="voice" aria-label="Voice mode">⌁</button>
              <button className="send" aria-label="Send message" disabled={!message.trim()}>↑</button>
            </div>
          </form>
        </div>

        <footer>By messaging ChatGPT, you agree to our <a href="#">Terms</a> and have read our <a href="#">Privacy Policy</a>.</footer>
      </section>
      {sidebar && <button className="scrim" aria-label="Close sidebar" onClick={() => setSidebar(false)} />}
    </main>
  );
}

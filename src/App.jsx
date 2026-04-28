import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronRight,
  House,
  Pause,
  Play,
  RefreshCw,
  Sparkles
} from "lucide-react";

const sectionOrder = ["voice", "character", "story"];
const storyFieldOrder = ["background", "moral", "length"];

const voices = [
  { id: "mom", label: "따뜻한 엄마 목소리", desc: "부드럽고 안정적인 읽기 톤" },
  { id: "friend", label: "밝은 친구 목소리", desc: "경쾌하고 반응이 빠른 톤" },
  { id: "narrator", label: "차분한 내레이터", desc: "발음이 또렷한 설명형 톤" },
  { id: "grandpa", label: "할아버지 이야기꾼", desc: "느긋하고 포근한 고전 톤" }
];

const characters = [
  { id: "lulu", label: "토끼 루루", trait: "호기심 많고 빠른 주인공", avatar: "루" },
  { id: "popo", label: "꼬마 용 포포", trait: "겁은 많지만 따뜻한 친구", avatar: "포" },
  { id: "mio", label: "우주 고양이 미오", trait: "상상력이 풍부한 탐험가", avatar: "미" }
];

const backgrounds = [
  { id: "forest", label: "반짝이는 숲속" },
  { id: "cloud", label: "구름 위 왕국" },
  { id: "ocean", label: "달빛 바닷가" },
  { id: "space", label: "별이 많은 우주" }
];

const morals = [
  { id: "courage", label: "용기 내기" },
  { id: "teamwork", label: "친구와 협동" },
  { id: "promise", label: "약속 지키기" },
  { id: "respect", label: "다름을 존중하기" }
];

const lengths = [
  { id: "short", label: "짧게 3분" },
  { id: "normal", label: "보통 5분" },
  { id: "long", label: "길게 8분" },
  { id: "sleep", label: "잠자리 모드" }
];

const libraryStories = [
  {
    id: "s1",
    title: "토끼 루루의 숲속 모험",
    progress: "42%",
    background: "forest",
    character: "lulu",
    moral: "teamwork",
    length: "normal",
    voice: "mom"
  },
  {
    id: "s2",
    title: "달빛 바다의 약속",
    progress: "0%",
    background: "ocean",
    character: "popo",
    moral: "promise",
    length: "short",
    voice: "narrator"
  },
  {
    id: "s3",
    title: "우주 고양이 미오",
    progress: "100%",
    background: "space",
    character: "mio",
    moral: "courage",
    length: "long",
    voice: "friend"
  }
];

const screenLabel = {
  landing: "홈",
  library: "동화 읽기",
  create: "동화 만들기",
  confirm: "AI 줄거리 확인",
  player: "재생"
};

const fieldLabel = {
  background: "배경",
  moral: "교훈",
  length: "길이"
};

const initialSelection = {
  voice: "mom",
  character: "lulu",
  background: "forest",
  moral: "teamwork",
  length: "normal"
};

function pickLabel(options, id) {
  const found = options.find((option) => option.id === id);
  return found ? found.label : "";
}

function cycleId(options, currentId, direction) {
  const index = options.findIndex((option) => option.id === currentId);
  const nextIndex =
    (index + direction + options.length) % (options.length || 1);
  return options[nextIndex].id;
}

function buildPlot(selection) {
  const character = pickLabel(characters, selection.character);
  const background = pickLabel(backgrounds, selection.background);
  const moral = pickLabel(morals, selection.moral);
  const voice = pickLabel(voices, selection.voice);
  const length = pickLabel(lengths, selection.length);
  const endings = [
    "마지막 장면에서 모두가 하늘을 올려다보며 미소를 나눕니다.",
    "마무리에서는 작은 약속이 큰 용기로 이어집니다.",
    "끝에서는 친구들이 서로의 다름을 응원하며 손을 맞잡습니다."
  ];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  return `${character}는 ${background}에서 신비한 신호를 발견하고 ${moral}를 배우는 모험을 시작해요. ${voice}로 이야기가 진행되고, ${length} 분량으로 장면이 차분하게 확장됩니다. ${ending}`;
}

function buildLines(selection) {
  const character = pickLabel(characters, selection.character);
  const background = pickLabel(backgrounds, selection.background);
  const moral = pickLabel(morals, selection.moral);
  return [
    `${character}는 ${background} 입구에서 반짝이는 지도를 주웠어요.`,
    "길을 막은 수수께끼 앞에서 친구들은 숨을 고르고 지혜를 모았어요.",
    `${moral}를 떠올린 순간, 닫혀 있던 문이 조용히 열렸어요.`,
    `해가 기울 무렵 ${character}는 오늘의 모험을 환하게 이야기했답니다.`
  ];
}

function makeTitle(selection) {
  return `${pickLabel(characters, selection.character)}의 ${pickLabel(
    backgrounds,
    selection.background
  )} 이야기`;
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [landingFocus, setLandingFocus] = useState(0);
  const [libraryFocus, setLibraryFocus] = useState(0);
  const [section, setSection] = useState("voice");
  const [storyField, setStoryField] = useState("background");
  const [confirmFocus, setConfirmFocus] = useState("ok");
  const [selection, setSelection] = useState(initialSelection);
  const [generatedPlot, setGeneratedPlot] = useState(buildPlot(initialSelection));
  const [playback, setPlayback] = useState({
    title: makeTitle(initialSelection),
    background: initialSelection.background,
    character: initialSelection.character,
    lines: buildLines(initialSelection),
    lineIndex: 0,
    playing: true
  });

  const summary = useMemo(
    () => [
      `보이스: ${pickLabel(voices, selection.voice)}`,
      `캐릭터: ${pickLabel(characters, selection.character)}`,
      `배경: ${pickLabel(backgrounds, selection.background)}`,
      `교훈: ${pickLabel(morals, selection.moral)}`,
      `길이: ${pickLabel(lengths, selection.length)}`
    ],
    [selection]
  );

  const progressPercent =
    playback.lines.length > 0
      ? ((playback.lineIndex + 1) / playback.lines.length) * 100
      : 0;

  const currentLine = playback.lines[playback.lineIndex] || "";
  const nextLine = playback.lines[playback.lineIndex + 1] || "이야기가 마무리됩니다.";

  const landingActions = [
    {
      id: "read",
      label: "동화 읽기",
      icon: BookOpen,
      action: () => setScreen("library")
    },
    {
      id: "create",
      label: "동화 생성하기",
      icon: Sparkles,
      action: () => {
        setSection("voice");
        setScreen("create");
      }
    }
  ];

  function openLanding() {
    setScreen("landing");
  }

  function setNextSection() {
    const index = sectionOrder.indexOf(section);
    if (index < sectionOrder.length - 1) {
      setSection(sectionOrder[index + 1]);
    }
  }

  function generatePreview() {
    setGeneratedPlot(buildPlot(selection));
    setConfirmFocus("ok");
    setScreen("confirm");
  }

  function startPlayerFromSelection() {
    setPlayback({
      title: makeTitle(selection),
      background: selection.background,
      character: selection.character,
      lines: buildLines(selection),
      lineIndex: 0,
      playing: true
    });
    setScreen("player");
  }

  function startPlayerFromLibrary(index) {
    const story = libraryStories[index];
    setPlayback({
      title: story.title,
      background: story.background,
      character: story.character,
      lines: buildLines(story),
      lineIndex: 0,
      playing: true
    });
    setScreen("player");
  }

  function cycleSelection(field, options, direction) {
    setSelection((prev) => ({
      ...prev,
      [field]: cycleId(options, prev[field], direction)
    }));
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
        return;
      }

      let handled = false;
      const key = event.key;

      if (screen === "landing") {
        if (key === "ArrowLeft" || key === "ArrowUp") {
          setLandingFocus((prev) => Math.max(0, prev - 1));
          handled = true;
        } else if (key === "ArrowRight" || key === "ArrowDown") {
          setLandingFocus((prev) => Math.min(landingActions.length - 1, prev + 1));
          handled = true;
        } else if (key === "Enter") {
          landingActions[landingFocus].action();
          handled = true;
        }
      } else if (screen === "library") {
        if (key === "ArrowLeft" || key === "ArrowUp") {
          setLibraryFocus((prev) => Math.max(0, prev - 1));
          handled = true;
        } else if (key === "ArrowRight" || key === "ArrowDown") {
          setLibraryFocus((prev) => Math.min(libraryStories.length - 1, prev + 1));
          handled = true;
        } else if (key === "Enter") {
          startPlayerFromLibrary(libraryFocus);
          handled = true;
        } else if (key === "Escape" || key === "Backspace") {
          openLanding();
          handled = true;
        }
      } else if (screen === "create") {
        const sectionIndex = sectionOrder.indexOf(section);
        const storyFieldIndex = storyFieldOrder.indexOf(storyField);
        const storyOptions = {
          background: backgrounds,
          moral: morals,
          length: lengths
        };

        if (key === "Escape" || key === "Backspace") {
          openLanding();
          handled = true;
        } else if (key === "ArrowLeft") {
          if (section === "story" && storyFieldIndex > 0) {
            setStoryField(storyFieldOrder[storyFieldIndex - 1]);
          } else if (sectionIndex > 0) {
            setSection(sectionOrder[sectionIndex - 1]);
          }
          handled = true;
        } else if (key === "ArrowRight") {
          if (section === "story" && storyFieldIndex < storyFieldOrder.length - 1) {
            setStoryField(storyFieldOrder[storyFieldIndex + 1]);
          } else if (sectionIndex < sectionOrder.length - 1) {
            setSection(sectionOrder[sectionIndex + 1]);
          }
          handled = true;
        } else if (key === "ArrowUp" || key === "ArrowDown") {
          const direction = key === "ArrowDown" ? 1 : -1;
          if (section === "voice") {
            cycleSelection("voice", voices, direction);
          } else if (section === "character") {
            cycleSelection("character", characters, direction);
          } else {
            cycleSelection(storyField, storyOptions[storyField], direction);
          }
          handled = true;
        } else if (key === "Enter") {
          if (section === "story") {
            generatePreview();
          } else {
            setNextSection();
          }
          handled = true;
        }
      } else if (screen === "confirm") {
        if (key === "ArrowLeft" || key === "ArrowRight") {
          setConfirmFocus((prev) => (prev === "ok" ? "retry" : "ok"));
          handled = true;
        } else if (key === "Enter") {
          if (confirmFocus === "retry") {
            setGeneratedPlot(buildPlot(selection));
          } else {
            startPlayerFromSelection();
          }
          handled = true;
        } else if (key === "Escape" || key === "Backspace") {
          setScreen("create");
          handled = true;
        }
      } else if (screen === "player") {
        if (key === " " || key === "Enter") {
          setPlayback((prev) => ({ ...prev, playing: !prev.playing }));
          handled = true;
        } else if (key === "ArrowLeft") {
          setPlayback((prev) => ({
            ...prev,
            lineIndex: Math.max(0, prev.lineIndex - 1)
          }));
          handled = true;
        } else if (key === "ArrowRight") {
          setPlayback((prev) => ({
            ...prev,
            lineIndex: Math.min(prev.lines.length - 1, prev.lineIndex + 1)
          }));
          handled = true;
        } else if (key === "Escape" || key === "Backspace") {
          openLanding();
          handled = true;
        }
      }

      if (handled) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    confirmFocus,
    landingActions,
    landingFocus,
    libraryFocus,
    screen,
    section,
    selection,
    storyField
  ]);

  useEffect(() => {
    if (screen !== "player" || !playback.playing) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setPlayback((prev) => {
        if (prev.lineIndex >= prev.lines.length - 1) {
          return { ...prev, playing: false };
        }
        return { ...prev, lineIndex: prev.lineIndex + 1 };
      });
    }, 2600);

    return () => window.clearInterval(timer);
  }, [playback.playing, screen]);

  return (
    <div className={`app screen-${screen}`}>
      <header className="app-header">
        <div className="brand-wrap">
          <span className="brand-chip">Samsung TV</span>
          <strong className="brand-title">Kids Tale</strong>
        </div>
        <div className="header-actions">
          <span className="screen-tag">{screenLabel[screen]}</span>
          {screen !== "landing" && (
            <button className="icon-btn" type="button" onClick={openLanding} aria-label="홈">
              <House size={18} />
            </button>
          )}
        </div>
      </header>

      <main className="tv-shell">
        {screen === "landing" && (
          <section className="screen landing-screen">
            <div className="landing-hero">
              <p>오늘은 어떤 동화를 시작할까요?</p>
              <div className="landing-actions">
                {landingActions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={`landing-btn ${landingFocus === index ? "focused" : ""}`}
                      type="button"
                      onMouseEnter={() => setLandingFocus(index)}
                      onFocus={() => setLandingFocus(index)}
                      onClick={item.action}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="landing-rail">
              <h2>최근 동화</h2>
              <div className="mini-stories">
                {libraryStories.map((story) => (
                  <button
                    key={story.id}
                    className={`mini-story cover-${story.background}`}
                    type="button"
                    onClick={() => setScreen("library")}
                  >
                    <strong>{story.title}</strong>
                    <span>{story.progress}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {screen === "library" && (
          <section className="screen library-screen">
            <div className="library-head">
              <h2>기존 동화</h2>
              <button
                className="ghost-btn"
                type="button"
                onClick={() => {
                  setSection("voice");
                  setScreen("create");
                }}
              >
                <Sparkles size={16} />
                <span>새 동화 만들기</span>
              </button>
            </div>
            <div className="library-grid">
              {libraryStories.map((story, index) => (
                <button
                  key={story.id}
                  className={`library-card cover-${story.background} ${
                    libraryFocus === index ? "focused" : ""
                  }`}
                  type="button"
                  onMouseEnter={() => setLibraryFocus(index)}
                  onFocus={() => setLibraryFocus(index)}
                  onClick={() => startPlayerFromLibrary(index)}
                >
                  <div className="library-card-copy">
                    <strong>{story.title}</strong>
                    <span>{story.progress}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "create" && (
          <section className="screen create-screen">
            <div className="create-head">
              <div className="create-tabs">
                <button
                  type="button"
                  className={section === "voice" ? "active" : ""}
                  onClick={() => setSection("voice")}
                >
                  보이스
                </button>
                <button
                  type="button"
                  className={section === "character" ? "active" : ""}
                  onClick={() => setSection("character")}
                >
                  캐릭터
                </button>
                <button
                  type="button"
                  className={section === "story" ? "active" : ""}
                  onClick={() => setSection("story")}
                >
                  스토리
                </button>
              </div>
            </div>

            <div className="create-body">
              <section className="option-area">
                {section === "voice" && (
                  <div className="option-list">
                    {voices.map((voice) => (
                      <button
                        key={voice.id}
                        type="button"
                        className={selection.voice === voice.id ? "selected" : ""}
                        onClick={() =>
                          setSelection((prev) => ({ ...prev, voice: voice.id }))
                        }
                      >
                        <strong>{voice.label}</strong>
                        <small>{voice.desc}</small>
                      </button>
                    ))}
                  </div>
                )}

                {section === "character" && (
                  <div className="character-list">
                    {characters.map((character) => (
                      <button
                        key={character.id}
                        type="button"
                        className={selection.character === character.id ? "selected" : ""}
                        onClick={() =>
                          setSelection((prev) => ({
                            ...prev,
                            character: character.id
                          }))
                        }
                      >
                        <div className="avatar">{character.avatar}</div>
                        <div className="character-copy">
                          <strong>{character.label}</strong>
                          <small>{character.trait}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {section === "story" && (
                  <div className="story-columns">
                    {storyFieldOrder.map((field) => {
                      const options =
                        field === "background"
                          ? backgrounds
                          : field === "moral"
                          ? morals
                          : lengths;
                      return (
                        <section
                          key={field}
                          className={`story-column ${
                            storyField === field ? "active-field" : ""
                          }`}
                        >
                          <h3>{fieldLabel[field]}</h3>
                          {options.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              className={selection[field] === option.id ? "selected" : ""}
                              onClick={() => {
                                setStoryField(field);
                                setSelection((prev) => ({
                                  ...prev,
                                  [field]: option.id
                                }));
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </section>
                      );
                    })}
                  </div>
                )}
              </section>

              <aside className="summary-area">
                <h3>선택 요약</h3>
                <ul>
                  {summary.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            </div>

            <div className="create-foot">
              {section !== "story" ? (
                <button className="primary-btn" type="button" onClick={setNextSection}>
                  <span>다음 단계</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button className="primary-btn gemini-btn" type="button" onClick={generatePreview}>
                  <Sparkles size={18} />
                  <span>Gemini 줄거리 만들기</span>
                </button>
              )}
            </div>
          </section>
        )}

        {screen === "confirm" && (
          <section className="screen confirm-screen">
            <h2>AI가 만든 줄거리</h2>
            <p className="plot-box">{generatedPlot}</p>
            <div className="confirm-row">
              <button
                type="button"
                className={confirmFocus === "retry" ? "focused" : ""}
                onFocus={() => setConfirmFocus("retry")}
                onMouseEnter={() => setConfirmFocus("retry")}
                onClick={() => setGeneratedPlot(buildPlot(selection))}
              >
                <RefreshCw size={17} />
                <span>다시 생성</span>
              </button>
              <button
                type="button"
                className={confirmFocus === "ok" ? "focused ok" : "ok"}
                onFocus={() => setConfirmFocus("ok")}
                onMouseEnter={() => setConfirmFocus("ok")}
                onClick={startPlayerFromSelection}
              >
                <Check size={17} />
                <span>확인 후 재생</span>
              </button>
            </div>
          </section>
        )}

        {screen === "player" && (
          <section className={`screen player-screen cover-${playback.background}`}>
            <div className={`player-character char-${playback.character}`}>
              {pickLabel(characters, playback.character).slice(0, 1)}
            </div>
            <div className="player-content">
              <div className="player-title">
                <strong>{playback.title}</strong>
                <span>
                  {playback.lineIndex + 1} / {playback.lines.length}
                </span>
              </div>
              <div className="caption-box">
                <p className="caption-current">{currentLine}</p>
                <p className="caption-next">{nextLine}</p>
              </div>
              <div className="progress-track">
                <span style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="player-controls">
                <button
                  className="icon-btn"
                  type="button"
                  onClick={() =>
                    setPlayback((prev) => ({ ...prev, playing: !prev.playing }))
                  }
                  aria-label="재생 제어"
                >
                  {playback.playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button className="icon-btn" type="button" onClick={openLanding} aria-label="홈">
                  <House size={18} />
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="summary-strip">
        {summary.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </footer>
    </div>
  );
}

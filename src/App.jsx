import { useEffect, useMemo, useRef, useState } from "react";
import pawPatrol from "./assets/paw-patrol.png";
import zootopia from "./assets/zootopia.png";
import mario from "./assets/super-mario-galaxy-hero-16x9.jpg";
import {
  BookOpen,
  Check,
  ChevronRight,
  House,
  RefreshCw,
  Sparkles
} from "lucide-react";
import storyScene1 from "./assets/story/scene_1.png";
import storyVideo0 from "./assets/story/video_0.mp4";
import storyVideo1 from "./assets/story/video_1.mp4";

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
  { id: "p4", label: "4p" },
  { id: "p6", label: "6p" },
  { id: "p8", label: "8p" },
  { id: "p10", label: "10p" }
];

const libraryStories = [
  {
    id: "s1",
    title: "꼬마토끼의 반쪽당근",
    progress: "0%",
    background: "forest",
    character: "lulu",
    moral: "teamwork",
    length: "p6",
    voice: "mom"
  },
  {
    id: "s2",
    title: "달빛 바다의 약속",
    progress: "0%",
    background: "ocean",
    character: "popo",
    moral: "promise",
    length: "p4",
    voice: "narrator"
  },
  {
    id: "s3",
    title: "우주 고양이 미오",
    progress: "100%",
    background: "space",
    character: "mio",
    moral: "courage",
    length: "p8",
    voice: "friend"
  }
];

const screenLabel = {
  opening: "오프닝",
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
  length: "p6"
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
  return `${character}는 ${background}에서 신비한 신호를 발견하고 ${moral}를 배우는 모험을 시작해요. ${voice}로 이야기가 진행되고, ${length} 구성으로 장면이 차분하게 확장됩니다. ${ending}`;
}

function buildLines(selection) {
  return [
    "꼬마토끼가 주황색 당근을 가지고 걸어가다 엉엉 울고 있는 곰을 만났어요."
  ];
}

function makeTitle(selection) {
  return `${pickLabel(characters, selection.character)}의 ${pickLabel(
    backgrounds,
    selection.background
  )} 이야기`;
}

export default function App() {
  const [bgIndex, setBgIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bgImages = [mario, pawPatrol, zootopia, mario, pawPatrol];


  const [screen, setScreen] = useState("landing");
  const [landingActionFocus, setLandingActionFocus] = useState(0);
  const [landingStoryFocus, setLandingStoryFocus] = useState(0);
  const [landingZone, setLandingZone] = useState("actions");
  const [libraryFocus, setLibraryFocus] = useState(0);
  const [libraryZone, setLibraryZone] = useState("cards");
  const [section, setSection] = useState("voice");
  const [storyField, setStoryField] = useState("background");
  const [confirmFocus, setConfirmFocus] = useState("ok");
  const [selection, setSelection] = useState(initialSelection);
  const [generatedPlot, setGeneratedPlot] = useState(buildPlot(initialSelection));
  const historyRef = useRef([]);
  const videoRef = useRef(null);
  const openingVideoRef = useRef(null);
  const openingPlaybackRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [playback, setPlayback] = useState({
    title: makeTitle(initialSelection),
    background: initialSelection.background,
    character: initialSelection.character,
    lines: buildLines(initialSelection),
    lineIndex: 0,
    playing: false,
    subtitleEnabled: false,
    subtitleWordIndex: -1,
    videoStarted: false,
    videoEnded: false
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
  const nextLine = playback.lines[playback.lineIndex + 1] || "";
  const currentWords = currentLine.split(" ").filter(Boolean);
  const showSubtitleScene = !playback.videoStarted;
  const showVideoScene = playback.videoStarted;
  const isCarrotStoryTitle = playback.title === "꼬마토끼의 반쪽당근";
  const highlightedWordIndex = playback.subtitleEnabled
    ? Math.min(playback.subtitleWordIndex, currentWords.length - 1)
    : -1;

  const landingActions = [
    {
      id: "read",
      label: "동화 읽기",
      icon: BookOpen,
      action: () => openLibrary(0)
    },
    {
      id: "create",
      label: "동화 생성하기",
      icon: Sparkles,
      action: () => openCreate()
    }
  ];

  function openLanding() {
    openingPlaybackRef.current = null;
    setScreen("landing");
  }

  function finishOpening() {
    if (openingPlaybackRef.current) {
      setPlayback(openingPlaybackRef.current);
      openingPlaybackRef.current = null;
      setScreen("player");
      return;
    }
    setScreen("landing");
  }

  function navigateTo(nextScreen) {
    if (screen === nextScreen) {
      return;
    }
    historyRef.current.push(screen);
    setScreen(nextScreen);
  }

  function goBack() {
    const prevScreen = historyRef.current.pop();
    if (prevScreen) {
      setScreen(prevScreen);
    }
  }

  function openLibrary(index = 0) {
    setLibraryFocus(index);
    setLibraryZone("cards");
    navigateTo("library");
  }

  function openCreate() {
    setSection("voice");
    navigateTo("create");
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
    navigateTo("confirm");
  }

  function triggerPlayerSpaceAction() {
    setPlayback((prev) => {
      if (isCarrotStoryTitle) {
        if (!prev.videoStarted) {
          return { ...prev, videoStarted: true, playing: true, videoEnded: false };
        }
        return { ...prev, playing: !prev.playing };
      }
      if (!prev.subtitleEnabled) {
        return {
          ...prev,
          subtitleEnabled: true,
          subtitleWordIndex: 0,
          videoStarted: false,
          playing: false,
          videoEnded: false
        };
      }
      if (!prev.videoStarted) {
        return { ...prev, videoStarted: true, playing: true, videoEnded: false };
      }
      return { ...prev, playing: !prev.playing };
    });
  }

  function startPlayerFromSelection() {
    setPlayback({
      title: makeTitle(selection),
      background: selection.background,
      character: selection.character,
      lines: buildLines(selection),
      lineIndex: 0,
      playing: false,
      subtitleEnabled: false,
      subtitleWordIndex: -1,
      videoStarted: false,
      videoEnded: false
    });
    navigateTo("player");
  }

  function startPlayerFromLibrary(index) {
    const story = libraryStories[index];
    const storyPlayback = {
      title: story.title,
      background: story.background,
      character: story.character,
      lines: buildLines(story),
      lineIndex: 0,
      playing: false,
      subtitleEnabled: false,
      subtitleWordIndex: -1,
      videoStarted: false,
      videoEnded: false
    };

    if (story.id === "s1") {
      openingPlaybackRef.current = storyPlayback;
      navigateTo("opening");
      return;
    }

    setPlayback(storyPlayback);
    navigateTo("player");
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

      if (screen === "opening") {
        if (key === " " || key === "Enter" || key === "Escape") {
          finishOpening();
          handled = true;
        }
      } else if (screen === "landing") {
        if (key === "ArrowLeft") {
          if (landingZone === "actions") {
            setLandingActionFocus((prev) => Math.max(0, prev - 1));
          } else {
            setLandingStoryFocus((prev) => Math.max(0, prev - 1));
          }
          handled = true;
        } else if (key === "ArrowRight") {
          if (landingZone === "actions") {
            setLandingActionFocus((prev) =>
              Math.min(landingActions.length - 1, prev + 1)
            );
          } else {
            setLandingStoryFocus((prev) =>
              Math.min(libraryStories.length - 1, prev + 1)
            );
          }
          handled = true;
        } else if (key === "ArrowDown") {
          if (landingZone === "actions") {
            setLandingZone("stories");
            setLandingStoryFocus((prev) =>
              Math.min(libraryStories.length - 1, Math.max(prev, landingActionFocus))
            );
          }
          handled = true;
        } else if (key === "ArrowUp") {
          if (landingZone === "stories") {
            setLandingZone("actions");
            setLandingActionFocus((prev) =>
              Math.min(landingActions.length - 1, Math.max(prev, landingStoryFocus))
            );
          }
          handled = true;
        } else if (key === "Enter") {
          if (landingZone === "actions") {
            landingActions[landingActionFocus].action();
          } else {
            startPlayerFromLibrary(landingStoryFocus);
          }
          handled = true;
        } else if (key === "b" || key === "B") {
          if (!isTransitioning) {
            setIsTransitioning(true);
            setBgIndex((prev) => prev - 1);
          }
          handled = true;
        } else if (key === "n" || key === "N") {
          if (!isTransitioning) {
            setIsTransitioning(true);
            setBgIndex((prev) => prev + 1);
          }
          handled = true;
        }
      } else if (screen === "library") {
        if (key === "ArrowLeft") {
          if (libraryZone === "cards") {
            setLibraryFocus((prev) => Math.max(0, prev - 1));
          }
          handled = true;
        } else if (key === "ArrowRight") {
          if (libraryZone === "cards") {
            setLibraryFocus((prev) => Math.min(libraryStories.length - 1, prev + 1));
          }
          handled = true;
        } else if (key === "ArrowUp") {
          if (libraryZone === "cards") {
            setLibraryZone("create");
          } else if (libraryZone === "create") {
            setLibraryZone("home");
          }
          handled = true;
        } else if (key === "ArrowDown") {
          if (libraryZone === "home") {
            setLibraryZone("create");
          } else if (libraryZone === "create") {
            setLibraryZone("cards");
          }
          handled = true;
        } else if (key === "Enter") {
          if (libraryZone === "cards") {
            startPlayerFromLibrary(libraryFocus);
          } else if (libraryZone === "create") {
            openCreate();
          } else {
            openLanding();
          }
          handled = true;
        } else if (key === "Escape" || key === "Backspace") {
          if (key === "Backspace") {
            goBack();
          } else {
            openLanding();
          }
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
          if (key === "Backspace") {
            goBack();
          } else {
            openLanding();
          }
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
        if (
          key === "ArrowLeft" ||
          key === "ArrowRight" ||
          key === "ArrowUp" ||
          key === "ArrowDown"
        ) {
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
          if (key === "Backspace") {
            goBack();
          } else {
            setScreen("create");
          }
          handled = true;
        }
      } else if (screen === "player") {
        if (playback.videoEnded && key === "Enter") {
          openLanding();
          handled = true;
        } else if (key === " " || key === "Enter") {
          triggerPlayerSpaceAction();
          handled = true;
        } else if (key === "ArrowLeft") {
          setPlayback((prev) => ({
            ...prev,
            lineIndex: Math.max(0, prev.lineIndex - 1),
            subtitleWordIndex: prev.subtitleEnabled ? 0 : -1
          }));
          handled = true;
        } else if (key === "ArrowRight") {
          setPlayback((prev) => ({
            ...prev,
            lineIndex: Math.min(prev.lines.length - 1, prev.lineIndex + 1),
            subtitleWordIndex: prev.subtitleEnabled ? 0 : -1
          }));
          handled = true;
        } else if (key === "Escape" || key === "Backspace") {
          if (key === "Backspace") {
            goBack();
          } else {
            openLanding();
          }
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
    landingActionFocus,
    landingStoryFocus,
    landingZone,
    libraryFocus,
    libraryZone,
    screen,
    section,
    selection,
    storyField,
    playback.videoEnded,
    isTransitioning,
    bgImages.length
  ]);

  useEffect(() => {
    if (screen !== "opening") {
      return;
    }
    const openingVideo = openingVideoRef.current;
    if (!openingVideo) {
      return;
    }
    void openingVideo.play();
  }, [screen]);

  useEffect(() => {
    if (screen !== "player" || !playback.subtitleEnabled || playback.videoStarted) {
      return;
    }

    const timer = window.setInterval(() => {
      setPlayback((prev) => {
        const words = (prev.lines[prev.lineIndex] || "").split(" ").filter(Boolean);
        if (words.length === 0 || prev.subtitleWordIndex >= words.length - 1) {
          return prev;
        }
        return { ...prev, subtitleWordIndex: prev.subtitleWordIndex + 1 };
      });
    }, 340);

    return () => window.clearInterval(timer);
  }, [playback.subtitleEnabled, playback.videoStarted, screen]);

  useEffect(() => {
    if (screen !== "player") {
      return;
    }

    const video = videoRef.current;
    if (!video || !playback.videoStarted) {
      return;
    }

    if (playback.playing) {
      void video.play();
    } else {
      video.pause();
    }
  }, [playback.playing, playback.videoStarted, screen]);

  useEffect(() => {
    if (screen !== "player" || !playback.videoEnded) {
      return;
    }
    nextButtonRef.current?.focus();
  }, [playback.videoEnded, screen]);

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
            <button
              className={`icon-btn ${
                screen === "library" && libraryZone === "home" ? "focused" : ""
              }`}
              type="button"
              onFocus={() => {
                if (screen === "library") {
                  setLibraryZone("home");
                }
              }}
              onClick={openLanding}
              aria-label="홈"
            >
              <House size={18} />
            </button>
          )}
        </div>
      </header>

      <main className="tv-shell">
        {screen === "opening" && (
          <section className="screen opening-screen">
            <video
              ref={openingVideoRef}
              className="opening-video"
              src={storyVideo0}
              autoPlay
              muted
              playsInline
              onEnded={finishOpening}
            />
          </section>
        )}

        {screen === "landing" && (
          <section className="screen landing-screen">
            <div
              className={`landing-bg-slider ${isTransitioning ? "" : "no-transition"}`}
              style={{ transform: `translateX(-${bgIndex * 100}%)` }}
              onTransitionEnd={() => {
                setIsTransitioning(false);
                if (bgIndex === 0) {
                  setBgIndex(bgImages.length - 2);
                } else if (bgIndex === bgImages.length - 1) {
                  setBgIndex(1);
                }
              }}
            >
              {bgImages.map((img, idx) => (
                <div
                  key={idx}
                  className="landing-bg-slide"
                  style={{ backgroundImage: `linear-gradient(130deg, rgba(9, 14, 30, 0.66), rgba(18, 23, 38, 0.62)), url(${img})` }}
                />
              ))}
            </div>
            <div className="landing-hero">
              <p>오늘은 어떤 동화를 시작할까요?</p>
              <div className="landing-actions">
                {landingActions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={`landing-btn ${
                        landingZone === "actions" && landingActionFocus === index
                          ? "focused"
                          : ""
                      }`}
                      type="button"
                      onMouseEnter={() => {
                        setLandingZone("actions");
                        setLandingActionFocus(index);
                      }}
                      onFocus={() => {
                        setLandingZone("actions");
                        setLandingActionFocus(index);
                      }}
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
                    className={`mini-story cover-${story.background} ${
                      landingZone === "stories" &&
                      landingStoryFocus ===
                        libraryStories.findIndex((item) => item.id === story.id)
                        ? "focused"
                        : ""
                    }`}
                    type="button"
                    onMouseEnter={() => {
                      setLandingZone("stories");
                      setLandingStoryFocus(
                        libraryStories.findIndex((item) => item.id === story.id)
                      );
                    }}
                    onFocus={() => {
                      setLandingZone("stories");
                      setLandingStoryFocus(
                        libraryStories.findIndex((item) => item.id === story.id)
                      );
                    }}
                    onClick={() => {
                      startPlayerFromLibrary(
                        libraryStories.findIndex((item) => item.id === story.id)
                      );
                    }}
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
                className={`ghost-btn ${
                  screen === "library" && libraryZone === "create" ? "focused" : ""
                }`}
                type="button"
                onFocus={() => {
                  setLibraryZone("create");
                }}
                onClick={openCreate}
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
                    libraryZone === "cards" && libraryFocus === index ? "focused" : ""
                  }`}
                  type="button"
                  onFocus={() => {
                    setLibraryZone("cards");
                    setLibraryFocus(index);
                  }}
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
          <section
            className={`screen player-screen ${
              showSubtitleScene || showVideoScene
                ? "media-scene"
                : `cover-${playback.background}`
            }`}
          >
            {showSubtitleScene && (
              <img className="player-scene-image" src={storyScene1} alt="" />
            )}
            {showVideoScene && (
              <video
                ref={videoRef}
                className="player-video"
                src={storyVideo1}
                playsInline
                onEnded={() => {
                  setPlayback((prev) => ({ ...prev, playing: false, videoEnded: true }));
                }}
              />
            )}
            {!showSubtitleScene && !showVideoScene && (
              <div className={`player-character char-${playback.character}`}>
                {pickLabel(characters, playback.character).slice(0, 1)}
              </div>
            )}
            <div className="player-content">
              <div className="player-title">
                <strong className={isCarrotStoryTitle ? "story-title-fancy" : ""}>
                  {isCarrotStoryTitle ? (
                    <span aria-label={playback.title}>
                      {Array.from(playback.title).map((char, index) => (
                        <span key={`${char}-${index}`} className="story-title-char">
                          {char === " " ? "\u00A0" : char}
                        </span>
                      ))}
                    </span>
                  ) : (
                    playback.title
                  )}
                </strong>
                <span>
                  {playback.lineIndex + 1} / {playback.lines.length}
                </span>
              </div>
              <div className="caption-box">
                <p className="caption-current">
                  {currentWords.map((word, index) => (
                    <span
                      key={`${word}-${index}`}
                      className={`caption-word ${
                        index <= highlightedWordIndex ? "active" : ""
                      }`}
                    >
                      {index > 0 ? " " : ""}
                      {word}
                    </span>
                  ))}
                </p>
                {nextLine && <p className="caption-next">{nextLine}</p>}
                <button
                  ref={nextButtonRef}
                  className={`dialog-next-btn ${playback.videoEnded ? "focused" : ""}`}
                  type="button"
                  onClick={openLanding}
                >
                  다음으로
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}

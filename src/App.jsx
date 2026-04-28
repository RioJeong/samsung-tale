import { useEffect, useMemo, useRef, useState } from "react";
import pawPatrol from "./assets/paw-patrol.png";
import zootopia from "./assets/zootopia.png";
import mario from "./assets/super-mario-galaxy-hero-16x9.jpg";
import rabbitThumb from "./assets/little-rabit-thumbnail.png";
import hbnb from "./assets/hbnb.png";
import spaceCat from "./assets/space-cat.png";
import {
  BookOpen,
  Check,
  ChevronRight,
  House,
  Lock,
  RefreshCw,
  Sparkles
} from "lucide-react";
import storyScene1 from "./assets/story/scene_1.png";
import storyScene2 from "./assets/story/scene_2.png";
import storyScene3 from "./assets/story/scene_3.png";
import storyScene4 from "./assets/story/scene_4.png";
import storyVideo0 from "./assets/story/video_0.mp4";
import storyVideo1 from "./assets/story/video_1.mp4";
import storyVideo2 from "./assets/story/video_2.mp4";
import storyVideo3 from "./assets/story/video_3.mp4";
import storyVideo4 from "./assets/story/video_4.mp4";
import openingBrightAudio from "./assets/story/bright.wav";
import speech1Audio from "./assets/story/speech-1.wav";
import speech2Audio from "./assets/story/speech-2.wav";
import speech3Audio from "./assets/story/speech-3.wav";
import speech4Audio from "./assets/story/speech-4.wav";
import luluThumb from "./assets/characters/ruru.png";
import mioThumb from "./assets/characters/mio.png";
import rumiThumb from "./assets/characters/rumi.png";
import yoshiThumb from "./assets/characters/yoshi.png";

const carrotSteps = [
  {
    scene: storyScene1,
    video: storyVideo1,
    line: '커다란 당근을 든 토끼가 배고파서 "엉엉" 울고 있는 곰을 만났어요.'
  },
  {
    scene: storyScene2,
    video: storyVideo2,
    line: '토끼는 당근을 "똑!" 나눠 곰에게 주었지요.'
  },
  {
    scene: storyScene3,
    video: storyVideo3,
    line: '둘은 나란히 앉아 "아삭아삭" 맛있게 먹었어요.'
  },
  {
    scene: storyScene4,
    video: storyVideo4,
    line: "함께 나눠 먹으니 훨씬 더 달콤했답니다."
  }
];
const carrotStoryTitle = "꼬마토끼의 반쪽 당근";

const sectionOrder = ["character", "style", "story"];
const storyFieldOrder = ["background", "moral", "length"];

const styles = [
  {
    id: "kids",
    label: "기본 어린이 스타일",
    tagline: "친숙하고 따뜻한 동화 일러스트",
    description:
      "동화책에서 자주 보는 부드러운 색감과 둥근 선의 일러스트 스타일. 어떤 이야기에도 잘 어울리는 기본값입니다.",
    swatch: "linear-gradient(135deg, #ffd6a5, #fdffb6 50%, #caffbf 75%, #9bf6ff)",
    locked: false
  },
  {
    id: "cartoon",
    label: "귀여운 카툰",
    tagline: "밝고 발랄한 색감",
    description:
      "선이 또렷하고 표정이 풍부한 카툰 스타일. 활기찬 모험 이야기에 잘 어울려요.",
    swatch: "linear-gradient(135deg, #ff6b9d, #ffd93d 55%, #6bcfff)",
    locked: false
  },
  {
    id: "pixel",
    label: "픽셀 아트",
    tagline: "레트로 게임 감성",
    description:
      "도트 한 점 한 점이 살아있는 8비트 게임 풍 그림. 모험과 퀘스트 분위기에 어울려요.",
    swatch:
      "repeating-linear-gradient(45deg, #2d3047 0 8px, #419d78 8px 16px, #e0a458 16px 24px, #fff3b0 24px 32px)",
    locked: false
  },
  {
    id: "baekheena",
    label: "백희나 풍 인형 동화",
    tagline: "손으로 빚은 인형의 입체 동화",
    description:
      "찰흙·천·종이로 만든 인형과 미니어처 무대를 사진으로 담아내는 따뜻한 입체 동화 스타일. 손맛이 살아있는 질감과 포근한 조명이 매력적입니다.",
    swatch:
      "radial-gradient(circle at 70% 25%, #fff4dd 0 22%, transparent 55%), linear-gradient(135deg, #d8a373 0%, #e9c46a 35%, #c98056 70%, #f5e6d3 100%)",
    locked: true,
    premium: true
  }
];

const characters = [
  {
    id: "lulu",
    label: "토끼 루루",
    initial: "루",
    tagline: "호기심 많고 빠른 주인공",
    description:
      "당근밭 너머 세상이 궁금한 어린 토끼. 작은 발자국으로 큰 모험을 만듭니다.",
    tags: ["호기심", "빠름", "친구사랑"],
    thumbnail: luluThumb,
    accent: "#ffb3c1",
    locked: false
  },
  {
    id: "mio",
    label: "우주 고양이 미오",
    initial: "미",
    tagline: "상상력이 풍부한 탐험가",
    description:
      "별과 별 사이를 떠다니며 새로운 이야기를 모으는 호기심 가득한 우주 여행자.",
    tags: ["상상력", "차분함", "탐험"],
    thumbnail: mioThumb,
    accent: "#a0c4ff",
    locked: false
  },
  {
    id: "rumi",
    label: "케이팝 스타, 루미",
    initial: "루",
    tagline: "무대 위에서는 화려한 퍼포머, 밤에는 악마를 쫓는 빛의 수호자.",
    description:
      "전 세계를 열광시키는 아이돌이지만, 사실은 리듬을 마력으로 변환해 악마를 퇴치하는 비밀스러운 데몬 헌터입니다. 마이크 대신 빛의 검을 휘두르며 오늘도 무대와 밤의 어둠 사이에서 균형을 지킵니다.",
    tags: ["열정적", "당당함", "비밀스러운"],
    thumbnail: rumiThumb,
    accent: "#ff5d8f",
    locked: true,
    premium: true
  },
  {
    id: "yoshi",
    label: "요시",
    initial: "요",
    tagline: "버섯 왕국의 든든한 동료",
    description:
      "긴 혀와 따뜻한 마음으로 어떤 모험에서도 친구를 지켜주는 초록빛 공룡 친구.",
    tags: ["용감함", "든든함", "스페셜"],
    thumbnail: yoshiThumb,
    accent: "#7ed957",
    locked: true,
    premium: true
  }
];

const backgrounds = [
  { id: "forest", label: "반짝이는 숲속" },
  { id: "cloud", label: "구름 위 왕국" },
  { id: "ocean", label: "달빛 바닷가" },
  { id: "space", label: "별이 많은 우주" }
];

const morals = [
  { id: "res", label: "다름의 인정과 존중 (편견 깨기)" },
  { id: "share", label: "나눔과 배려의 기쁨" },
  { id: "resp", label: "정직함과 책임감" },
  { id: "npng", label: "포기하지 않는 끈기와 성실함" },
  { id: "friendship", label: "협동과 우정의 힘" },
  { id: "self-resp", label: "스스로를 사랑하는 마음 (자존감)" },
  { id: "cour", label: "두려움을 이겨내는 용기" },
  { id: "druid", label: "자연과 생명에 대한 사랑" },
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
    title: "흥부 놀부",
    progress: "75%",
    background: "ocean",
    character: "lulu",
    moral: "promise",
    length: "p4",
    image: hbnb
  },
  {
    id: "s2",
    title: "우주 고양이 미오",
    progress: "100%",
    background: "space",
    character: "mio",
    moral: "respect",
    length: "p8",
    image: spaceCat
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
  character: "lulu",
  style: "kids",
  background: "forest",
  moral: "res",
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
  const style = pickLabel(styles, selection.style);
  const background = pickLabel(backgrounds, selection.background);
  const moral = pickLabel(morals, selection.moral);
  const length = pickLabel(lengths, selection.length);
  const endings = [
    "마지막 장면에서 모두가 하늘을 올려다보며 미소를 나눕니다.",
    "마무리에서는 작은 약속이 큰 용기로 이어집니다.",
    "끝에서는 친구들이 서로의 다름을 응원하며 손을 맞잡습니다."
  ];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  return `${character}는 ${background}에서 신비한 신호를 발견하고 ${moral}를 배우는 모험을 시작해요. ${style} 화풍으로 ${length} 구성의 장면이 차분하게 확장됩니다. ${ending}`;
}

function buildLines(selection) {
  if (
    selection?.id === "s1" ||
    selection?.title === "꼬마토끼의 반쪽당근" ||
    selection?.title === carrotStoryTitle
  ) {
    return carrotSteps.map((step) => step.line);
  }
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingFullStory, setIsCreatingFullStory] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const bgImages = [mario, pawPatrol, zootopia, mario, pawPatrol];


  const [screen, setScreen] = useState("landing");
  const [landingActionFocus, setLandingActionFocus] = useState(0);
  const [landingStoryFocus, setLandingStoryFocus] = useState(0);
  const [landingZone, setLandingZone] = useState("actions");
  const [libraryFocus, setLibraryFocus] = useState(0);
  const [libraryZone, setLibraryZone] = useState("cards");
  const [section, setSection] = useState("character");
  const [storyField, setStoryField] = useState("background");
  const [focusedCharacter, setFocusedCharacter] = useState(initialSelection.character);
  const [characterFocusZone, setCharacterFocusZone] = useState("grid");
  const [focusedStyle, setFocusedStyle] = useState(initialSelection.style);
  const [styleFocusZone, setStyleFocusZone] = useState("grid");
  const [proConfirm, setProConfirm] = useState({ open: false, item: null, field: null });
  const [proConfirmFocus, setProConfirmFocus] = useState("yes");
  const [confirmFocus, setConfirmFocus] = useState("ok");
  const [selection, setSelection] = useState(initialSelection);
  const [generatedPlot, setGeneratedPlot] = useState(buildPlot(initialSelection));
  const historyRef = useRef([]);
  const videoRef = useRef(null);
  const openingVideoRef = useRef(null);
  const openingAudioRef = useRef(null);
  const openingAudioFadeTimerRef = useRef(null);
  const openingAudioFadeStartedRef = useRef(false);
  const speech1AudioRef = useRef(null);
  const speech2AudioRef = useRef(null);
  const speech3AudioRef = useRef(null);
  const speech4AudioRef = useRef(null);
  const playerVideo1BrightAudioRef = useRef(null);
  const openingPlaybackRef = useRef(null);
  const nextButtonRef = useRef(null);
  const nextActionLockRef = useRef(false);
  const nextActionLockTimerRef = useRef(null);
  const [playback, setPlayback] = useState({
    storyId: "generated",
    title: makeTitle(initialSelection),
    background: initialSelection.background,
    character: initialSelection.character,
    lines: buildLines(initialSelection),
    lineIndex: 0,
    playing: false,
    subtitleEnabled: false,
    subtitleWordIndex: -1,
    videoStarted: false,
    videoReady: false,
    videoEnded: false
  });

  const summary = useMemo(
    () => [
      `캐릭터: ${pickLabel(characters, selection.character)}`,
      `화풍: ${pickLabel(styles, selection.style)}`,
      `배경: ${pickLabel(backgrounds, selection.background)}`,
      `교훈: ${pickLabel(morals, selection.moral)}`,
      `길이: ${pickLabel(lengths, selection.length)}`
    ],
    [selection]
  );

  const focusedChar =
    characters.find((char) => char.id === focusedCharacter) || characters[0];

  const focusedStyleItem =
    styles.find((style) => style.id === focusedStyle) || styles[0];

  const progressPercent =
    playback.lines.length > 0
      ? ((playback.lineIndex + 1) / playback.lines.length) * 100
      : 0;

  const currentLine = playback.lines[playback.lineIndex] || "";
  const currentWords = currentLine.split(" ").filter(Boolean);
  const showSubtitleScene = !playback.videoStarted || !playback.videoReady;
  const showVideoScene = playback.videoStarted;
  const isCarrotStoryTitle = playback.storyId === "s1";
  const currentSceneIndex = Math.min(playback.lineIndex, carrotSteps.length - 1);
  const currentCarrotStep = carrotSteps[currentSceneIndex] || carrotSteps[0];
  const currentSceneAsset = isCarrotStoryTitle
    ? currentCarrotStep.scene
    : storyScene1;
  const currentVideoAsset = isCarrotStoryTitle
    ? currentCarrotStep.video
    : storyVideo1;
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

  function stopOpeningAudio() {
    if (openingAudioFadeTimerRef.current) {
      window.clearInterval(openingAudioFadeTimerRef.current);
      openingAudioFadeTimerRef.current = null;
    }
    openingAudioFadeStartedRef.current = false;
    if (openingAudioRef.current) {
      openingAudioRef.current.pause();
      openingAudioRef.current.currentTime = 0;
      openingAudioRef.current.volume = 1;
    }
  }

  function completeOpeningTransition() {
    if (openingPlaybackRef.current) {
      setPlayback(openingPlaybackRef.current);
      openingPlaybackRef.current = null;
      setScreen("player");
      return;
    }
    setScreen("landing");
  }

  function finishOpening() {
    stopOpeningAudio();
    completeOpeningTransition();
  }

  function getSpeechAudioRefByIndex(index) {
    if (index === 0) return speech1AudioRef;
    if (index === 1) return speech2AudioRef;
    if (index === 2) return speech3AudioRef;
    if (index === 3) return speech4AudioRef;
    return null;
  }

  function stopSpeechAudios() {
    [speech1AudioRef, speech2AudioRef, speech3AudioRef, speech4AudioRef].forEach((ref) => {
      if (!ref.current) {
        return;
      }
      ref.current.pause();
      ref.current.currentTime = 0;
    });
  }

  function stopPlayerVideo1BrightAudio() {
    const audio = playerVideo1BrightAudioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
  }

  function playSpeechAudioByIndex(index) {
    const ref = getSpeechAudioRefByIndex(index);
    const audio = ref?.current;
    if (!audio) {
      return;
    }
    stopSpeechAudios();
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }

  function startOpeningAudioFade(durationMs = 1500) {
    const audio = openingAudioRef.current;
    if (!audio || audio.paused || openingAudioFadeStartedRef.current) {
      return;
    }
    openingAudioFadeStartedRef.current = true;

    if (openingAudioFadeTimerRef.current) {
      window.clearInterval(openingAudioFadeTimerRef.current);
      openingAudioFadeTimerRef.current = null;
    }

    const tickMs = 50;
    const initialVolume = Math.max(0, Math.min(1, audio.volume ?? 1));
    const totalSteps = Math.max(1, Math.ceil(durationMs / tickMs));
    let step = 0;

    openingAudioFadeTimerRef.current = window.setInterval(() => {
      step += 1;
      const ratio = Math.max(0, 1 - step / totalSteps);
      audio.volume = initialVolume * ratio;

      if (step >= totalSteps) {
        if (openingAudioFadeTimerRef.current) {
          window.clearInterval(openingAudioFadeTimerRef.current);
          openingAudioFadeTimerRef.current = null;
        }
        audio.volume = 0;
      }
    }, tickMs);
  }

  function handleOpeningVideoTimeUpdate() {
    const video = openingVideoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }
    const remain = video.duration - video.currentTime;
    if (remain <= 1.5) {
      startOpeningAudioFade(Math.max(250, remain * 1000));
    }
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
    setSection("character");
    setFocusedCharacter(selection.character);
    setFocusedStyle(selection.style);
    setCharacterFocusZone("grid");
    setStyleFocusZone("grid");
    navigateTo("create");
  }

  function pickCharacter(char) {
    setFocusedCharacter(char.id);
    if (char.locked) {
      setProConfirm({ open: true, item: char, field: "character" });
      setProConfirmFocus("yes");
      return;
    }
    setSelection((prev) => ({ ...prev, character: char.id }));
  }

  function pickStyle(style) {
    setFocusedStyle(style.id);
    if (style.locked) {
      setProConfirm({ open: true, item: style, field: "style" });
      setProConfirmFocus("yes");
      return;
    }
    setSelection((prev) => ({ ...prev, style: style.id }));
  }

  function confirmProPurchase() {
    const { item, field } = proConfirm;
    if (item && field) {
      setSelection((prev) => ({ ...prev, [field]: item.id }));
    }
    setProConfirm({ open: false, item: null, field: null });
  }

  function cancelProPurchase() {
    setProConfirm({ open: false, item: null, field: null });
  }

  function moveGridFocus(items, currentId, setFocus, direction) {
    const cols = 4;
    const idx = items.findIndex((i) => i.id === currentId);
    const safeIdx = idx === -1 ? 0 : idx;
    const row = Math.floor(safeIdx / cols);
    const col = safeIdx % cols;
    const lastRow = Math.floor((items.length - 1) / cols);

    let nextRow = row;
    let nextCol = col;
    if (direction === "left") nextCol = Math.max(0, col - 1);
    else if (direction === "right") nextCol = Math.min(cols - 1, col + 1);
    else if (direction === "up") nextRow = Math.max(0, row - 1);
    else if (direction === "down") nextRow = Math.min(lastRow, row + 1);

    const nextIdx = Math.min(items.length - 1, nextRow * cols + nextCol);
    setFocus(items[nextIdx].id);
  }

  function moveCharacterFocus(direction) {
    moveGridFocus(characters, focusedCharacter, setFocusedCharacter, direction);
  }

  function moveStyleFocus(direction) {
    moveGridFocus(styles, focusedStyle, setFocusedStyle, direction);
  }

  function setNextSection() {
    const index = sectionOrder.indexOf(section);
    if (index < sectionOrder.length - 1) {
      setSection(sectionOrder[index + 1]);
    }
  }

  function generatePreview() {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPlot(buildPlot(selection));
      setConfirmFocus("ok");
      setIsGenerating(false);
      navigateTo("confirm");
    }, 3000);
  }

  function triggerPlayerSpaceAction() {
    setPlayback((prev) => {
      const words = (prev.lines[prev.lineIndex] || "").split(" ").filter(Boolean);
      const lastWordIndex = words.length - 1;

      if (isCarrotStoryTitle) {
        if (prev.videoStarted) {
          if (prev.videoEnded) {
            return prev;
          }
          return { ...prev, playing: !prev.playing };
        }
        if (!prev.subtitleEnabled) {
          playSpeechAudioByIndex(prev.lineIndex);
          return {
            ...prev,
            subtitleEnabled: true,
            subtitleWordIndex: 0,
            videoStarted: false,
            videoReady: false,
            playing: false,
            videoEnded: false
          };
        }
        if (prev.subtitleWordIndex < lastWordIndex) {
          return { ...prev, subtitleWordIndex: prev.subtitleWordIndex + 1 };
        }
        stopSpeechAudios();
        return {
          ...prev,
          videoStarted: true,
          videoReady: false,
          playing: true,
          videoEnded: false
        };
      }
      if (!prev.subtitleEnabled) {
        return {
          ...prev,
          subtitleEnabled: true,
          subtitleWordIndex: 0,
          videoStarted: false,
          videoReady: false,
          playing: false,
          videoEnded: false
        };
      }
      if (prev.subtitleWordIndex < lastWordIndex) {
        return { ...prev, subtitleWordIndex: prev.subtitleWordIndex + 1 };
      }
      if (!prev.videoStarted) {
        return {
          ...prev,
          videoStarted: true,
          videoReady: false,
          playing: true,
          videoEnded: false
        };
      }
      return { ...prev, playing: !prev.playing };
    });
  }

  function moveToNextCarrotStep() {
    if (!playback.videoEnded) {
      return;
    }
    stopSpeechAudios();
    stopPlayerVideo1BrightAudio();
    if (playback.lineIndex >= playback.lines.length - 1) {
      openLanding();
      return;
    }
    setPlayback((prev) => ({
      ...prev,
      lineIndex: prev.lineIndex + 1,
      playing: false,
      subtitleEnabled: false,
      subtitleWordIndex: -1,
      videoStarted: false,
      videoReady: false,
      videoEnded: false
    }));
  }

  function handlePlayerNext() {
    if (nextActionLockRef.current) {
      return;
    }
    nextActionLockRef.current = true;
    if (nextActionLockTimerRef.current) {
      window.clearTimeout(nextActionLockTimerRef.current);
    }
    nextActionLockTimerRef.current = window.setTimeout(() => {
      nextActionLockRef.current = false;
      nextActionLockTimerRef.current = null;
    }, 220);

    if (playback.storyId === "s1") {
      moveToNextCarrotStep();
      return;
    }
    openLanding();
  }

  function startPlayerFromSelection() {
    stopSpeechAudios();
    setIsCreatingFullStory(true);
    setTimeout(() => {
      setIsCreatingFullStory(false);
      setShowFinalConfirm(true);
    }, 3000);
  }

  function proceedToPlayer() {
    setShowFinalConfirm(false);
    stopSpeechAudios();

    if (selection.character === "lulu") {
      const luluStory = libraryStories.find((story) => story.id === "s1");
      if (luluStory) {
        openingPlaybackRef.current = {
          storyId: luluStory.id,
          title: carrotStoryTitle,
          background: luluStory.background,
          character: luluStory.character,
          lines: buildLines(luluStory),
          lineIndex: 0,
          playing: false,
          subtitleEnabled: false,
          subtitleWordIndex: -1,
          videoStarted: false,
          videoReady: false,
          videoEnded: false
        };
        navigateTo("opening");
        return;
      }
    }

    setPlayback({
      storyId: "generated",
      title: makeTitle(selection),
      background: selection.background,
      character: selection.character,
      lines: buildLines(selection),
      lineIndex: 0,
      playing: false,
      subtitleEnabled: false,
      subtitleWordIndex: -1,
      videoStarted: false,
      videoReady: false,
      videoEnded: false
    });
    navigateTo("player");
  }

  function startPlayerFromLibrary(index) {
    stopSpeechAudios();
    const story = libraryStories[index];
    const resolvedTitle = story.id === "s1" ? carrotStoryTitle : story.title;
    const storyPlayback = {
      storyId: story.id,
      title: resolvedTitle,
      background: story.background,
      character: story.character,
      lines: buildLines(story),
      lineIndex: 0,
      playing: false,
      subtitleEnabled: false,
      subtitleWordIndex: -1,
      videoStarted: false,
      videoReady: false,
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

      if (proConfirm.open) {
        if (key === "Enter") {
          if (proConfirmFocus === "yes") {
            confirmProPurchase();
          } else {
            cancelProPurchase();
          }
          handled = true;
        } else if (key === "Escape" || key === "Backspace") {
          cancelProPurchase();
          handled = true;
        } else if (
          key === "ArrowLeft" ||
          key === "ArrowRight" ||
          key === "Tab"
        ) {
          setProConfirmFocus((prev) => (prev === "yes" ? "no" : "yes"));
          handled = true;
        }

        if (handled) {
          event.preventDefault();
        }
        return;
      }

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
            setLibraryFocus((prev) => Math.min(libraryStories.length, prev + 1));
          }
          handled = true;
        } else if (key === "ArrowUp") {
          if (libraryZone === "cards") {
            if (libraryFocus <= 2) {
               setLibraryZone("home");
            } else {
               setLibraryFocus((prev) => Math.max(0, prev - 3));
            }
          }
          handled = true;
        } else if (key === "ArrowDown") {
          if (libraryZone === "home") {
            setLibraryZone("cards");
            setLibraryFocus(0);
          } else if (libraryZone === "cards") {
            setLibraryFocus((prev) => Math.min(libraryStories.length, prev + 3));
          }
          handled = true;
        } else if (key === "Enter") {
          if (libraryZone === "cards") {
            if (libraryFocus === libraryStories.length) {
              openCreate();
            } else {
              startPlayerFromLibrary(libraryFocus);
            }
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
          if (section === "character") {
            if (characterFocusZone === "grid") {
              moveCharacterFocus("left");
            }
          } else if (section === "style") {
            if (styleFocusZone === "grid") {
              moveStyleFocus("left");
            }
          } else if (section === "story" && storyFieldIndex > 0) {
            setStoryField(storyFieldOrder[storyFieldIndex - 1]);
          } else if (sectionIndex > 0) {
            setSection(sectionOrder[sectionIndex - 1]);
          }
          handled = true;
        } else if (key === "ArrowRight") {
          if (section === "character") {
            if (characterFocusZone === "grid") {
              moveCharacterFocus("right");
            }
          } else if (section === "style") {
            if (styleFocusZone === "grid") {
              moveStyleFocus("right");
            }
          } else if (section === "story" && storyFieldIndex < storyFieldOrder.length - 1) {
            setStoryField(storyFieldOrder[storyFieldIndex + 1]);
          } else if (sectionIndex < sectionOrder.length - 1) {
            setSection(sectionOrder[sectionIndex + 1]);
          }
          handled = true;
        } else if (key === "ArrowUp" || key === "ArrowDown") {
          if (section === "character") {
            if (key === "ArrowDown") {
              if (characterFocusZone === "grid") {
                const cols = 4;
                const idx = characters.findIndex((c) => c.id === focusedCharacter);
                const safeIdx = idx === -1 ? 0 : idx;
                const row = Math.floor(safeIdx / cols);
                const lastRow = Math.floor((characters.length - 1) / cols);
                if (row === lastRow) {
                  setCharacterFocusZone("footer");
                } else {
                  moveCharacterFocus("down");
                }
              }
            } else {
              if (characterFocusZone === "footer") {
                setCharacterFocusZone("grid");
              } else {
                moveCharacterFocus("up");
              }
            }
          } else if (section === "style") {
            if (key === "ArrowDown") {
              if (styleFocusZone === "grid") {
                const cols = 4;
                const idx = styles.findIndex((s) => s.id === focusedStyle);
                const safeIdx = idx === -1 ? 0 : idx;
                const row = Math.floor(safeIdx / cols);
                const lastRow = Math.floor((styles.length - 1) / cols);
                if (row === lastRow) {
                  setStyleFocusZone("footer");
                } else {
                  moveStyleFocus("down");
                }
              }
            } else {
              if (styleFocusZone === "footer") {
                setStyleFocusZone("grid");
              } else {
                moveStyleFocus("up");
              }
            }
          } else {
            const direction = key === "ArrowDown" ? 1 : -1;
            cycleSelection(storyField, storyOptions[storyField], direction);
          }
          handled = true;
        } else if (key === "Enter") {
          if (section === "character") {
            if (characterFocusZone === "footer") {
              setNextSection();
            } else {
              pickCharacter(focusedChar);
            }
          } else if (section === "style") {
            if (styleFocusZone === "footer") {
              setNextSection();
            } else {
              pickStyle(focusedStyleItem);
            }
          } else if (section === "story") {
            generatePreview();
          } else {
            setNextSection();
          }
          handled = true;
        }
      } else if (screen === "confirm") {
        if (showFinalConfirm) {
          if (key === "Enter") {
            proceedToPlayer();
            handled = true;
          } else if (key === "Escape" || key === "Backspace") {
            setShowFinalConfirm(false);
            handled = true;
          }
        } else if (
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
        if ((key === " " || key === "Enter") && event.repeat) {
          handled = true;
        } else if (playback.videoEnded && (key === "Enter" || key === " ")) {
          handlePlayerNext();
          handled = true;
        } else if (key === " " || key === "Enter") {
          triggerPlayerSpaceAction();
          handled = true;
        } else if (key === "ArrowLeft") {
          if (playback.storyId === "s1") {
            handled = true;
            event.preventDefault();
            return;
          }
          setPlayback((prev) => ({
            ...prev,
            lineIndex: Math.max(0, prev.lineIndex - 1),
            subtitleWordIndex: prev.subtitleEnabled ? 0 : -1
          }));
          handled = true;
        } else if (key === "ArrowRight") {
          if (playback.storyId === "s1") {
            handled = true;
            event.preventDefault();
            return;
          }
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
    characterFocusZone,
    confirmFocus,
    focusedCharacter,
    landingActions,
    landingActionFocus,
    landingStoryFocus,
    landingZone,
    libraryFocus,
    libraryZone,
    proConfirm.open,
    proConfirm.item,
    proConfirm.field,
    proConfirmFocus,
    focusedStyle,
    styleFocusZone,
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
      stopOpeningAudio();
      return;
    }
    const openingVideo = openingVideoRef.current;
    const openingAudio = openingAudioRef.current;
    if (!openingVideo) {
      return;
    }
    void openingVideo.play();
    if (openingAudio) {
      openingAudioFadeStartedRef.current = false;
      openingAudio.volume = 1;
      openingAudio.currentTime = 0;
      void openingAudio.play().catch(() => {});
    }
  }, [screen]);

  useEffect(() => {
    if (screen !== "player") {
      stopSpeechAudios();
    }
  }, [screen]);

  useEffect(() => {
    if (screen !== "player") {
      stopPlayerVideo1BrightAudio();
      return;
    }

    const video = videoRef.current;
    const brightAudio = playerVideo1BrightAudioRef.current;
    const isCarrotVideoStep =
      playback.storyId === "s1" &&
      playback.videoStarted &&
      playback.lineIndex >= 0 &&
      playback.lineIndex <= 3;

    if (!video || !playback.videoStarted) {
      stopPlayerVideo1BrightAudio();
      return;
    }

    if (playback.playing) {
      void video.play();
      if (isCarrotVideoStep && brightAudio) {
        if (Math.abs(brightAudio.currentTime - video.currentTime) > 0.25) {
          brightAudio.currentTime = Math.max(0, video.currentTime);
        }
        void brightAudio.play().catch(() => {});
      }
    } else {
      video.pause();
      if (brightAudio) {
        brightAudio.pause();
      }
    }

    if (!isCarrotVideoStep) {
      stopPlayerVideo1BrightAudio();
    }
  }, [playback.playing, playback.videoStarted, playback.lineIndex, playback.storyId, screen]);

  useEffect(() => {
    if (screen !== "player" || !playback.videoEnded) {
      return;
    }
    nextButtonRef.current?.focus();
  }, [playback.videoEnded, screen]);

  useEffect(() => {
    return () => {
      if (nextActionLockTimerRef.current) {
        window.clearTimeout(nextActionLockTimerRef.current);
      }
      if (openingAudioFadeTimerRef.current) {
        window.clearInterval(openingAudioFadeTimerRef.current);
      }
      stopSpeechAudios();
      stopPlayerVideo1BrightAudio();
    };
  }, []);

  function handlePlayerVideoTimeUpdate() {
    const video = videoRef.current;
    const audio = playerVideo1BrightAudioRef.current;
    const isCarrotVideoStep =
      playback.storyId === "s1" &&
      playback.videoStarted &&
      playback.lineIndex >= 0 &&
      playback.lineIndex <= 3;

    if (!video || !audio || !isCarrotVideoStep) {
      return;
    }
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    const remain = video.duration - video.currentTime;
    if (remain <= 1) {
      audio.volume = Math.max(0, Math.min(1, remain / 1));
    } else {
      audio.volume = 1;
    }
  }

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
        {isGenerating && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>AI가 줄거리를 만들고 있어요...</p>
          </div>
        )}
        {isCreatingFullStory && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>AI가 동화를 완성하고 있어요...</p>
          </div>
        )}
        {showFinalConfirm && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>동화가 다 만들어졌어요,<br/>바로 확인하시겠어요?</p>
              <button
                type="button"
                className="focused"
                onClick={proceedToPlayer}
              >
                확인
              </button>
            </div>
          </div>
        )}
        {screen === "opening" && (
          <section className="screen opening-screen">
            <video
              ref={openingVideoRef}
              className="opening-video"
              src={storyVideo0}
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleOpeningVideoTimeUpdate}
              onEnded={finishOpening}
            />
            <audio ref={openingAudioRef} src={openingBrightAudio} preload="auto" />
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
                    style={{
                      backgroundImage: `linear-gradient(rgba(12, 17, 24, 0.5), rgba(12, 17, 24, 0.5)), url(${story.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
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
              <h2>동화 목록</h2>
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
                  style={{
                    backgroundImage: `linear-gradient(rgba(12, 17, 24, 0.4), rgba(12, 17, 24, 0.8)), url(${story.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="library-card-copy">
                    <strong>{story.title}</strong>
                    <span>{story.progress}</span>
                  </div>
                </button>
              ))}
              <button
                className={`library-card create-card ${
                  libraryZone === "cards" && libraryFocus === libraryStories.length ? "focused" : ""
                }`}
                type="button"
                onFocus={() => {
                  setLibraryZone("cards");
                  setLibraryFocus(libraryStories.length);
                }}
                onClick={openCreate}
              >
                <div className="create-card-content">
                  <div className="plus-icon">+</div>
                  <span>새 동화 만들기</span>
                </div>
              </button>
            </div>
          </section>
        )}

        {screen === "create" && (
          <section className="screen create-screen">
            <div className="create-head">
              <div className="create-tabs">
                <button
                  type="button"
                  className={section === "character" ? "active" : ""}
                  onClick={() => setSection("character")}
                >
                  캐릭터
                </button>
                <button
                  type="button"
                  className={section === "style" ? "active" : ""}
                  onClick={() => setSection("style")}
                >
                  화풍
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
                {section === "character" && (
                  <div className="character-screen">
                    <div className="character-grid">
                      {characters.map((character) => {
                        const isSelected = selection.character === character.id;
                        const isFocused = focusedCharacter === character.id;
                        const classes = [
                          "character-card",
                          isSelected ? "selected" : "",
                          isFocused ? "focused" : "",
                          character.locked ? "locked" : ""
                        ]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <button
                            key={character.id}
                            type="button"
                            className={classes}
                            style={{ "--accent": character.accent }}
                            onMouseEnter={() => {
                              setFocusedCharacter(character.id);
                              setCharacterFocusZone("grid");
                            }}
                            onFocus={() => {
                              setFocusedCharacter(character.id);
                              setCharacterFocusZone("grid");
                            }}
                            onClick={() => pickCharacter(character)}
                          >
                            {character.locked && (
                              <span className="lock-badge">
                                <Lock size={12} />
                                <span>PRO</span>
                              </span>
                            )}
                            {character.thumbnail ? (
                              <img
                                className="character-thumb"
                                src={character.thumbnail}
                                alt={character.label}
                              />
                            ) : (
                              <div
                                className="character-thumb fallback"
                                style={{
                                  background: `linear-gradient(135deg, ${character.accent}, #ffffff)`
                                }}
                              >
                                {character.initial}
                              </div>
                            )}
                            <span className="character-card-name">{character.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <aside className="character-detail">
                      {focusedChar.locked && (
                        <div
                          key={focusedChar.id}
                          className="lock-banner"
                        >
                          <Lock size={14} />
                          <span>프리미엄 캐릭터 — 사용 시 20포인트 차감</span>
                        </div>
                      )}
                      <h3 className="character-detail-name">{focusedChar.label}</h3>
                      <p className="character-detail-tagline">"{focusedChar.tagline}"</p>
                      <div className="character-tags">
                        {focusedChar.tags.map((tag) => (
                          <span key={tag} className="tag-chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="character-detail-desc">{focusedChar.description}</p>
                    </aside>
                  </div>
                )}

                {section === "style" && (
                  <div className="character-screen">
                    <div className="character-grid style-grid">
                      {styles.map((style) => {
                        const isSelected = selection.style === style.id;
                        const isFocused = focusedStyle === style.id;
                        const classes = [
                          "character-card style-card",
                          isSelected ? "selected" : "",
                          isFocused ? "focused" : "",
                          style.locked ? "locked" : ""
                        ]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <button
                            key={style.id}
                            type="button"
                            className={classes}
                            onMouseEnter={() => {
                              setFocusedStyle(style.id);
                              setStyleFocusZone("grid");
                            }}
                            onFocus={() => {
                              setFocusedStyle(style.id);
                              setStyleFocusZone("grid");
                            }}
                            onClick={() => pickStyle(style)}
                          >
                            {style.locked && (
                              <span className="lock-badge">
                                <Lock size={12} />
                                <span>PRO</span>
                              </span>
                            )}
                            <div
                              className="style-swatch"
                              style={{ backgroundImage: style.swatch }}
                            />
                            <span className="character-card-name">{style.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <aside className="character-detail">
                      {focusedStyleItem.locked && (
                        <div key={focusedStyleItem.id} className="lock-banner">
                          <Lock size={14} />
                          <span>프리미엄 화풍 — 사용 시 20포인트 차감</span>
                        </div>
                      )}
                      <h3 className="character-detail-name">{focusedStyleItem.label}</h3>
                      <p className="character-detail-tagline">"{focusedStyleItem.tagline}"</p>
                      <div
                        className="style-preview"
                        style={{ backgroundImage: focusedStyleItem.swatch }}
                      />
                      <p className="character-detail-desc">{focusedStyleItem.description}</p>
                    </aside>
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
                <button
                  className={`primary-btn ${
                    (section === "character" && characterFocusZone === "footer") ||
                    (section === "style" && styleFocusZone === "footer")
                      ? "focused"
                      : ""
                  }`}
                  type="button"
                  onMouseEnter={() => {
                    if (section === "character") setCharacterFocusZone("footer");
                    if (section === "style") setStyleFocusZone("footer");
                  }}
                  onClick={setNextSection}
                >
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
            {(showSubtitleScene || showVideoScene) &&
              <img
                key={`scene-${playback.storyId}-${currentSceneIndex}`}
                className="player-scene-image active-scene"
                src={currentSceneAsset}
                alt=""
              />}
            {showVideoScene && (
              <video
                key={`story-video-${playback.storyId}-${playback.lineIndex}`}
                ref={videoRef}
                className={`player-video ${playback.videoReady ? "ready" : ""}`}
                src={currentVideoAsset}
                playsInline
                preload="auto"
                onTimeUpdate={handlePlayerVideoTimeUpdate}
                onLoadedData={() => {
                  setPlayback((prev) =>
                    prev.videoStarted ? { ...prev, videoReady: true } : prev
                  );
                }}
                onEnded={() => {
                  stopPlayerVideo1BrightAudio();
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
                <button
                  ref={nextButtonRef}
                  className={`dialog-next-btn ${playback.videoEnded ? "focused" : ""}`}
                  type="button"
                  disabled={!playback.videoEnded}
                  onClick={handlePlayerNext}
                >
                  다음으로
                </button>
              </div>
            </div>
            <audio ref={speech1AudioRef} src={speech1Audio} preload="auto" />
            <audio ref={speech2AudioRef} src={speech2Audio} preload="auto" />
            <audio ref={speech3AudioRef} src={speech3Audio} preload="auto" />
            <audio ref={speech4AudioRef} src={speech4Audio} preload="auto" />
            <audio ref={playerVideo1BrightAudioRef} src={openingBrightAudio} preload="auto" />
          </section>
        )}
      </main>

      {proConfirm.open && (
        <div className="modal-overlay" onClick={cancelProPurchase}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">
              <Lock size={14} />
              <span>{proConfirm.item?.label}</span>
            </p>
            <p className="modal-message">20포인트가 차감됩니다. 사용할까요?</p>
            <div className="modal-actions">
              <button
                type="button"
                className={`modal-btn ${proConfirmFocus === "no" ? "focused" : ""}`}
                onMouseEnter={() => setProConfirmFocus("no")}
                onClick={cancelProPurchase}
              >
                아니요
              </button>
              <button
                type="button"
                className={`modal-btn primary ${proConfirmFocus === "yes" ? "focused" : ""}`}
                onMouseEnter={() => setProConfirmFocus("yes")}
                onClick={confirmProPurchase}
              >
                네, 사용할게요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

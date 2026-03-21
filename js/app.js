const moduleTitle = document.getElementById("moduleTitle")
const moduleGoal = document.getElementById("moduleGoal")
const moduleDescription = document.getElementById("moduleDescription")
const moduleImage = document.getElementById("moduleImage")
const heroBadge = document.getElementById("heroBadge")
const heroStats = document.getElementById("heroStats")
const moduleSummary = document.getElementById("moduleSummary")
const topicsContainer = document.getElementById("topicsContainer")
const practiceList = document.getElementById("practiceList")
const finalThought = document.getElementById("finalThought")
const outcomesList = document.getElementById("outcomesList")
const trackBadge = document.getElementById("trackBadge")

const trackNav = document.getElementById("trackNav")
const moduleNav = document.getElementById("moduleNav")
const topicNav = document.getElementById("topicNav")
const topicNavWrap = document.getElementById("topicNavWrap")
const topicsToggle = document.getElementById("topicsToggle")
const moduleEmptyState = document.getElementById("moduleEmptyState")

const unlockButton = document.getElementById("unlockButton")
const sectionSubtitle = document.getElementById("sectionSubtitle")
const buyAccessBtn = document.getElementById("buyAccessBtn")

const practiceCard = document.getElementById("practiceCard")
const thoughtCard = document.getElementById("thoughtCard")
const outcomesCard = document.getElementById("outcomesCard")

const unlockModal = document.getElementById("unlockModal")
const unlockForm = document.getElementById("unlockForm")
const unlockCodeInput = document.getElementById("unlockCodeInput")
const unlockMessage = document.getElementById("unlockMessage")
const modalCloseBtn = document.getElementById("modalCloseBtn")

const sidebarOpenBtn = document.getElementById("sidebarOpenBtn")
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn")
const sidebarOverlay = document.getElementById("sidebarOverlay")

const mapPage = document.getElementById("mapPage")
const modulePage = document.getElementById("modulePage")
const mapPageContent = document.getElementById("mapPageContent")
const mapViewLink = document.getElementById("mapViewLink")
const moduleViewLink = document.getElementById("moduleViewLink")
const topicsViewLink = document.getElementById("topicsViewLink")
const practiceViewLink = document.getElementById("practiceViewLink")
const landingMapLink = document.getElementById("landingMapLink")

const courseProgressBar = document.getElementById("courseProgressBar")
const courseProgressPercent = document.getElementById("courseProgressPercent")
const moduleProgressBar = document.getElementById("moduleProgressBar")
const moduleProgressPercent = document.getElementById("moduleProgressPercent")
const completionScreen = document.getElementById("completionScreen")

let appData = null
let statusData = null
let currentTrackId = null
let currentModuleId = null
let currentTopicSpyObserver = null
let currentRevealObserver = null
let currentProgressObserver = null
let currentView = "module"
let mapPageLoaded = false

const CURRENT_LANG = getCurrentLang()
const BASE_PREFIX = getBasePrefix()
const STORAGE_KEY = "bytewebnest_access_unlocked"
const TOPICS_COLLAPSED_KEY = "bytewebnest_topics_collapsed"
const LAST_TRACK_KEY = `bytewebnest_last_track_${CURRENT_LANG}`
const LAST_MODULE_KEY = `bytewebnest_last_module_${CURRENT_LANG}`
const COURSE_PROGRESS_KEY = `bytewebnest_progress_${CURRENT_LANG}`

const UI = {
  en: {
    loadJsonError: "JSON loading error",
    noModules: "The JSON file does not contain a modules array",
    noTracks: "The JSON file does not contain a tracks array",
    allUnlocked: "All topics, practice and final outcomes are unlocked.",
    moduleLocked:
      "This module is locked. After unlocking, all topics, practice and final outcomes will become available.",
    topicsOpenedPartial: freeCount =>
      `Currently ${freeCount} topic(s) are open. The remaining topics, practice and final outcomes are available after unlocking.`,
    topicsOpenedPracticeLocked: "Topics are open, but practice and final outcomes become available after unlocking.",
    moduleSmall: index => `Module ${index + 1}`,
    locked: "locked",
    topicLabel: index => `Topic ${index + 1}`,
    topicLocked: "locked",
    studyTitle: "What to study",
    deepDiveTitle: "What to deepen your understanding of",
    comingSoonSection: "Section in development",
    opensOn: date => `Available: ${date || "Coming soon"}`,
    comingSoonDescription: "This section is being prepared and will become available later.",
    comingSoonSummary:
      "This section is currently in development. As soon as the materials are ready, full modules, topics, practice and outcomes will appear here.",
    followUpdates: "Follow course updates — this section will be added later.",
    contentUnavailable: "This level content is not available yet.",
    newContent: "New content",
    openingDate: "Launch date",
    futureModules: "Future modules",
    noModulesTitle: "There are no modules in this level yet",
    addModulesJson: "Add modules to JSON",
    contentLater: "Content will appear later.",
    futureModulesText: "You will be able to add the next modules of this level here.",
    topicsNotAdded: "Topics have not been added yet.",
    unlockError: "Wrong code. Try again.",
    unlockSuccess: "Access granted. All content is unlocked.",
    collapse: "Collapse",
    expand: "Expand",
    mapLoadError: "Roadmap loading error",
    mapFallback:
      "The learning roadmap is currently in development. A visual structure of all levels and modules will appear here soon.",
    loadModuleFail: "Could not load the module",
    checkContentFile: "Check the file data/content.en.json",
    reasonPrefix: "Reason",
    emptyTrackComingSoon: date => `This section is being prepared. Access will open: ${date || "Coming soon"}.`,
    emptyTrackPrepared: "This level structure is already prepared, but you will add modules for it later.",
    completionTitle: "🎉 Course completed",
    completionText: "You finished the ByteWebNest JavaScript course. You now understand the core of modern JavaScript.",
    completionBtn: "Restart learning",
  },
  ru: {
    loadJsonError: "Ошибка загрузки JSON",
    noModules: "В JSON нет массива modules",
    noTracks: "В JSON нет массива tracks",
    allUnlocked: "Все темы, практика и итоговые результаты открыты.",
    moduleLocked: "Этот модуль закрыт. После разблокировки откроются все темы, практика и итоговые результаты.",
    topicsOpenedPartial: freeCount =>
      `Сейчас открыто ${freeCount} тем(ы). Остальные темы, практика и итоговые результаты доступны после разблокировки.`,
    topicsOpenedPracticeLocked: "Темы открыты, но практика и итоговые результаты доступны после разблокировки.",
    moduleSmall: index => `Модуль ${index + 1}`,
    locked: "закрыто",
    topicLabel: index => `Тема ${index + 1}`,
    topicLocked: "закрыто",
    studyTitle: "Что изучить",
    deepDiveTitle: "На что углубить понимание",
    comingSoonSection: "Раздел в разработке",
    opensOn: date => `Доступ откроется: ${date || "Скоро"}`,
    comingSoonDescription: "Этот раздел готовится и станет доступен позже.",
    comingSoonSummary:
      "Сейчас этот раздел находится в разработке. Как только материалы будут готовы, здесь появятся полноценные модули, темы, практика и результаты.",
    followUpdates: "Следи за обновлениями курса — этот раздел будет добавлен позже.",
    contentUnavailable: "Контент этого уровня пока недоступен.",
    newContent: "Новый контент",
    openingDate: "Дата открытия",
    futureModules: "Будущие модули",
    noModulesTitle: "В этом уровне пока нет модулей",
    addModulesJson: "Добавь модули в JSON",
    contentLater: "Контент появится позже.",
    futureModulesText: "Сюда можно будет добавить следующие модули этого уровня.",
    topicsNotAdded: "Темы пока не добавлены.",
    unlockError: "Неверный код. Попробуй ещё раз.",
    unlockSuccess: "Доступ открыт. Весь контент разблокирован.",
    collapse: "Свернуть",
    expand: "Развернуть",
    mapLoadError: "Ошибка при загрузке карты",
    mapFallback:
      "Карта обучения сейчас в разработке. Скоро здесь появится визуальная структура всех уровней и модулей.",
    loadModuleFail: "Не удалось загрузить модуль",
    checkContentFile: "Проверь файл data/content.ru.json",
    reasonPrefix: "Причина",
    emptyTrackComingSoon: date => `Этот раздел готовится. Доступ откроется: ${date || "Скоро"}.`,
    emptyTrackPrepared: "Этот уровень уже подготовлен в структуре, но модули для него ты добавишь позже.",
    completionTitle: "🎉 Курс завершён",
    completionText: "Ты завершил JavaScript-курс ByteWebNest. Теперь ты понимаешь основу современного JavaScript.",
    completionBtn: "Начать обучение заново",
  },
  uk: {
    loadJsonError: "Помилка завантаження JSON",
    noModules: "У JSON немає масиву modules",
    noTracks: "У JSON немає масиву tracks",
    allUnlocked: "Усі теми, практика та підсумкові результати відкриті.",
    moduleLocked: "Цей модуль закритий. Після розблокування відкриються всі теми, практика та підсумкові результати.",
    topicsOpenedPartial: freeCount =>
      `Зараз відкрито ${freeCount} тем(и). Решта тем, практика та підсумкові результати доступні після розблокування.`,
    topicsOpenedPracticeLocked: "Теми відкриті, але практика та підсумкові результати доступні після розблокування.",
    moduleSmall: index => `Модуль ${index + 1}`,
    locked: "закрито",
    topicLabel: index => `Тема ${index + 1}`,
    topicLocked: "закрито",
    studyTitle: "Що вивчити",
    deepDiveTitle: "Що варто поглибити",
    comingSoonSection: "Розділ у розробці",
    opensOn: date => `Доступ відкриється: ${date || "Скоро"}`,
    comingSoonDescription: "Цей розділ готується і стане доступним пізніше.",
    comingSoonSummary:
      "Зараз цей розділ перебуває в розробці. Щойно матеріали будуть готові, тут з’являться повноцінні модулі, теми, практика та результати.",
    followUpdates: "Слідкуй за оновленнями курсу — цей розділ буде додано пізніше.",
    contentUnavailable: "Контент цього рівня поки недоступний.",
    newContent: "Новий контент",
    openingDate: "Дата відкриття",
    futureModules: "Майбутні модулі",
    noModulesTitle: "У цьому рівні поки немає модулів",
    addModulesJson: "Додай модулі в JSON",
    contentLater: "Контент з’явиться пізніше.",
    futureModulesText: "Сюди можна буде додати наступні модулі цього рівня.",
    topicsNotAdded: "Теми ще не додані.",
    unlockError: "Неправильний код. Спробуй ще раз.",
    unlockSuccess: "Доступ відкрито. Увесь контент розблоковано.",
    collapse: "Згорнути",
    expand: "Розгорнути",
    mapLoadError: "Помилка під час завантаження карти",
    mapFallback: "Карта навчання зараз у розробці. Незабаром тут з’явиться візуальна структура всіх рівнів і модулів.",
    loadModuleFail: "Не вдалося завантажити модуль",
    checkContentFile: "Перевір файл data/content.uk.json",
    reasonPrefix: "Причина",
    emptyTrackComingSoon: date => `Цей розділ готується. Доступ відкриється: ${date || "Скоро"}.`,
    emptyTrackPrepared: "Структура цього рівня вже підготовлена, але модулі для нього ти додаси пізніше.",
    completionTitle: "🎉 Курс завершено",
    completionText: "Ти завершив JavaScript-курс ByteWebNest. Тепер ти розумієш основу сучасного JavaScript.",
    completionBtn: "Почати навчання заново",
  },
}

function t(key, ...args) {
  const dict = UI[CURRENT_LANG] || UI.en
  const value = dict[key] ?? UI.en[key]
  return typeof value === "function" ? value(...args) : value
}

function getCurrentLang() {
  const htmlLang = document.documentElement.lang?.trim().toLowerCase()
  if (htmlLang === "ru" || htmlLang === "uk" || htmlLang === "en") {
    return htmlLang
  }

  const path = window.location.pathname.toLowerCase()
  if (path.includes("/ru/")) return "ru"
  if (path.includes("/uk/")) return "uk"
  return "en"
}

function getBasePrefix() {
  return CURRENT_LANG === "en" ? "./" : "../"
}

function getContentPath() {
  return `${BASE_PREFIX}data/content.${CURRENT_LANG}.json`
}

function getStatusPath() {
  return `${BASE_PREFIX}data/module-status.${CURRENT_LANG}.json`
}

function getRoadmapPath() {
  return `${BASE_PREFIX}partials/${CURRENT_LANG}/roadmap.${CURRENT_LANG}.html`
}

function getAssetPath(path) {
  if (!path) return ""
  if (/^(https?:)?\/\//.test(path)) return path
  return CURRENT_LANG === "en" ? path : `../${path.replace(/^\.?\//, "")}`
}

function updateCompletionScreenText() {
  const title = completionScreen?.querySelector("h2")
  const text = completionScreen?.querySelector("p")
  const button = completionScreen?.querySelector(".btn")

  if (title) title.textContent = t("completionTitle")
  if (text) text.textContent = t("completionText")
  if (button) button.textContent = t("completionBtn")
}

async function loadContent() {
  try {
    updateCompletionScreenText()

    const [contentResponse, statusResponse] = await Promise.all([fetch(getContentPath()), fetch(getStatusPath())])

    if (!contentResponse.ok) {
      throw new Error(`${t("loadJsonError")}: ${contentResponse.status}`)
    }

    appData = await contentResponse.json()

    if (statusResponse.ok) {
      statusData = await statusResponse.json()
    } else {
      statusData = { tracks: {} }
    }

    if (!appData.modules || !appData.modules.length) {
      throw new Error(t("noModules"))
    }

    if (!appData.tracks || !appData.tracks.length) {
      throw new Error(t("noTracks"))
    }

    currentTrackId = getInitialTrackId()
    currentModuleId = getInitialModuleId()

    ensureAllowedInitialTrackAndModule()
    restoreLastOpenedModule()
    restoreTopicsPanelState()
    bindEvents()
    renderApp()

    if (window.location.hash === "#map") {
      await showMapView()
    }
  } catch (error) {
    console.error("Content loading error:", error)
    showFallbackError(error.message)
  }
}

function bindEvents() {
  if (bindEvents.isBound) return
  bindEvents.isBound = true

  unlockButton?.addEventListener("click", openUnlockModal)
  modalCloseBtn?.addEventListener("click", closeUnlockModal)

  unlockModal?.addEventListener("click", event => {
    if (event.target.hasAttribute("data-close-modal")) {
      closeUnlockModal()
    }
  })

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && unlockModal?.classList.contains("is-open")) {
      closeUnlockModal()
    }

    if (event.key === "Escape" && document.body.classList.contains("is-sidebar-open")) {
      closeSidebar()
    }
  })

  unlockForm?.addEventListener("submit", handleUnlockSubmit)

  document.querySelectorAll(".lockable-card__overlay-btn").forEach(button => {
    button.addEventListener("click", openUnlockModal)
  })

  sidebarOpenBtn?.addEventListener("click", function (e) {
    e.stopPropagation()

    if (document.body.classList.contains("is-sidebar-open")) {
      closeSidebar()
    } else {
      openSidebar()
    }
  })
  sidebarCloseBtn?.addEventListener("click", closeSidebar)
  sidebarOverlay?.addEventListener("click", closeSidebar)
  buyAccessBtn?.addEventListener("click", openUnlockModal)

  topicsToggle?.addEventListener("click", toggleTopicsPanel)

  mapViewLink?.addEventListener("click", async event => {
    event.preventDefault()
    window.location.hash = "map"
    await showMapView()
  })

  landingMapLink?.addEventListener("click", async event => {
    event.preventDefault()
    window.location.hash = "map"
    await showMapView()
  })

  moduleViewLink?.addEventListener("click", event => {
    event.preventDefault()

    if (!currentModuleId) return

    if (currentView !== "module") {
      window.location.hash = `module-${currentModuleId}`
      showModuleView()
      renderApp()
    }

    requestAnimationFrame(() => {
      const target = document.getElementById("overview")
      if (!target) return

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  })

  topicsViewLink?.addEventListener("click", event => {
    event.preventDefault()
    openLastModuleSection("topics")
  })

  practiceViewLink?.addEventListener("click", event => {
    event.preventDefault()
    openLastModuleSection("practice")
  })

  window.addEventListener("hashchange", handleHashChange)
  initBurgerIcon()
}

async function handleHashChange() {
  if (!appData) return

  const rawHash = window.location.hash.trim()

  if (rawHash === "#map") {
    await showMapView()
    return
  }

  const moduleIdFromHash = rawHash.replace("#module-", "").trim()
  if (!moduleIdFromHash) return

  const targetModule = getModuleById(moduleIdFromHash)
  if (!targetModule) return

  const targetTrack = getTrackByModuleId(moduleIdFromHash)
  if (!targetTrack) return

  if (!isModuleAccessible(targetModule.id)) {
    openUnlockModal()
    window.location.hash = `module-${currentModuleId}`
    return
  }

  currentTrackId = targetTrack.id
  currentModuleId = targetModule.id
  showModuleView()
  renderApp()
}

function getInitialTrackId() {
  const rawHash = window.location.hash.trim()

  if (rawHash && rawHash !== "#map") {
    const fromHash = rawHash.replace("#module-", "").trim()
    const track = getTrackByModuleId(fromHash)
    if (track) return track.id
  }

  const savedTrackId = localStorage.getItem(LAST_TRACK_KEY)
  if (savedTrackId && getTrackById(savedTrackId)) {
    return savedTrackId
  }

  return appData.defaultTrackId || appData.tracks[0].id
}

function getInitialModuleId() {
  const rawHash = window.location.hash.trim()

  if (rawHash && rawHash !== "#map") {
    const fromHash = rawHash.replace("#module-", "").trim()
    if (fromHash && getModuleById(fromHash)) {
      return fromHash
    }
  }

  const savedModuleId = localStorage.getItem(LAST_MODULE_KEY)
  const savedTrackId = localStorage.getItem(LAST_TRACK_KEY)

  if (
    savedModuleId &&
    savedTrackId &&
    getModuleById(savedModuleId) &&
    getTrackById(savedTrackId) &&
    getTrackById(savedTrackId).modules.includes(savedModuleId)
  ) {
    return savedModuleId
  }

  const initialTrack = getTrackById(currentTrackId)
  if (initialTrack && initialTrack.modules.length) {
    return initialTrack.modules[0]
  }

  return appData.defaultModuleId || appData.modules[0].id
}

function ensureAllowedInitialTrackAndModule() {
  const currentModule = getModuleById(currentModuleId)

  if (currentModule && isModuleAccessible(currentModule.id)) {
    return
  }

  currentModuleId = appData.access.freeModuleId || appData.modules[0].id

  const freeTrack = getTrackByModuleId(currentModuleId)
  if (freeTrack) {
    currentTrackId = freeTrack.id
  }
}

function getTrackById(trackId) {
  return appData.tracks.find(track => track.id === trackId) || null
}

function getModuleById(moduleId) {
  return appData.modules.find(module => module.id === moduleId) || null
}

function getTrackByModuleId(moduleId) {
  return appData.tracks.find(track => track.modules.includes(moduleId)) || null
}

function getCurrentTrack() {
  return getTrackById(currentTrackId) || appData.tracks[0]
}

function getCurrentModule() {
  if (!currentModuleId) return null
  return getModuleById(currentModuleId) || null
}

function getModulesForTrack(trackId) {
  const track = getTrackById(trackId)
  if (!track) return []

  return track.modules.map(moduleId => getModuleById(moduleId)).filter(Boolean)
}

function saveLastOpenedModule() {
  if (!currentTrackId || !currentModuleId) return

  localStorage.setItem(LAST_TRACK_KEY, currentTrackId)
  localStorage.setItem(LAST_MODULE_KEY, currentModuleId)
}

function restoreLastOpenedModule() {
  const savedTrackId = localStorage.getItem(LAST_TRACK_KEY)
  const savedModuleId = localStorage.getItem(LAST_MODULE_KEY)

  if (!savedTrackId || !savedModuleId) return false

  const savedTrack = getTrackById(savedTrackId)
  const savedModule = getModuleById(savedModuleId)

  if (!savedTrack || !savedModule) return false
  if (!savedTrack.modules.includes(savedModuleId)) return false
  if (!isModuleAccessible(savedModuleId)) return false

  currentTrackId = savedTrackId
  currentModuleId = savedModuleId
  return true
}

function getTrackStatus(trackId) {
  return statusData?.tracks?.[trackId] || null
}

function shouldShowComingSoon(trackId) {
  const trackStatus = getTrackStatus(trackId)
  return Boolean(trackStatus?.showComingSoon)
}

function isGloballyUnlocked() {
  return localStorage.getItem(STORAGE_KEY) === "true"
}

function isModuleAccessible(moduleId) {
  if (isGloballyUnlocked()) return true
  return moduleId === appData.access.freeModuleId
}

function isTopicAccessible(moduleId, topicIndex) {
  if (isGloballyUnlocked()) return true

  if (moduleId !== appData.access.freeModuleId) {
    return false
  }

  return topicIndex < Number(appData.access.freeTopicsCount || 0)
}

function isPremiumSectionAccessible() {
  return isGloballyUnlocked()
}

function getLockedTopicsText(moduleId, totalTopics) {
  if (isGloballyUnlocked()) {
    return t("allUnlocked")
  }

  if (moduleId !== appData.access.freeModuleId) {
    return t("moduleLocked")
  }

  const freeCount = Number(appData.access.freeTopicsCount || 0)
  const lockedCount = Math.max(totalTopics - freeCount, 0)

  if (lockedCount <= 0) {
    return t("topicsOpenedPracticeLocked")
  }

  return t("topicsOpenedPartial", freeCount)
}

function updateUnlockButtonState() {
  if (!unlockButton) return

  const unlocked = isGloballyUnlocked()

  if (unlocked) {
    unlockButton.hidden = true
    unlockButton.setAttribute("aria-hidden", "true")
  } else {
    unlockButton.hidden = false
    unlockButton.removeAttribute("aria-hidden")
  }
}

function renderApp() {
  const currentTrack = getCurrentTrack()
  const currentModule = getCurrentModule()

  renderTracks(appData.tracks, currentTrack.id)
  renderModulesForTrack(currentTrack.id, currentModule?.id || null)
  renderTopicNavigation(currentModule)
  renderModuleContent(currentTrack, currentModule)
  updateUnlockButtonState()

  saveLastOpenedModule()

  requestAnimationFrame(() => {
    initRevealAnimation()
    initTopicSpy()
    initProgressTracking()
    updateProgress()
  })
}

function renderTracks(tracks, activeTrackId) {
  trackNav.innerHTML = ""

  tracks.forEach(track => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = `track-link ${track.id === activeTrackId ? "is-active" : ""}`

    button.innerHTML = `
      <span class="track-link__title">${escapeHtml(track.title)}</span>
      <span class="track-link__text">${escapeHtml(track.subtitle)}</span>
    `

    button.addEventListener("click", () => {
      if (currentTrackId === track.id) return

      currentTrackId = track.id

      const modules = getModulesForTrack(track.id)
      if (modules.length) {
        const firstAccessible = modules.find(module => isModuleAccessible(module.id))
        currentModuleId = firstAccessible ? firstAccessible.id : modules[0].id
      } else {
        currentModuleId = null
      }

      showModuleView()
      renderApp()
      scrollPageTop()
      closeSidebar()
    })

    trackNav.appendChild(button)
  })
}

function renderModulesForTrack(trackId, activeModuleId) {
  moduleNav.innerHTML = ""
  moduleEmptyState.classList.remove("is-visible")

  const modules = getModulesForTrack(trackId)

  if (!modules.length) {
    const trackStatus = getTrackStatus(trackId)
    const showComingSoon = shouldShowComingSoon(trackId)

    moduleEmptyState.textContent =
      showComingSoon && trackStatus ? t("emptyTrackComingSoon", trackStatus.availableDate) : t("emptyTrackPrepared")

    moduleEmptyState.classList.add("is-visible")
    return
  }

  modules.forEach((module, index) => {
    const isAccessible = isModuleAccessible(module.id)
    const button = document.createElement("button")

    button.type = "button"
    button.className = `module-link ${module.id === activeModuleId ? "is-active" : ""} ${!isAccessible ? "is-locked" : ""}`

    button.innerHTML = `
      <span class="module-link__content">
        <span class="module-link__small">${escapeHtml(t("moduleSmall", index))}</span>
        <span class="module-link__title">${escapeHtml(module.hero.module)}</span>
      </span>
      ${!isAccessible ? `<span class="module-link__lock">${escapeHtml(t("locked"))}</span>` : ""}
    `

    button.addEventListener("click", () => {
      if (!isAccessible) {
        openUnlockModal()
        return
      }

      closeSidebar()

      currentModuleId = module.id
      window.location.hash = `module-${module.id}`

      setTimeout(() => {
        showModuleView()
        renderApp()
        scrollPageTop()
      }, 50)
    })

    moduleNav.appendChild(button)
  })
}

function renderTopicNavigation(module) {
  topicNav.innerHTML = ""

  if (!module) return

  module.topics.forEach((topic, index) => {
    const isAccessible = isTopicAccessible(module.id, index)
    const element = document.createElement(isAccessible ? "a" : "button")

    element.className = `topic-link ${!isAccessible ? "is-locked" : ""}`
    element.setAttribute("data-topic-link", `topic-${index + 1}`)

    if (isAccessible) {
      element.href = `#topic-${index + 1}`
    } else {
      element.type = "button"
    }

    element.innerHTML = `
      <span class="topic-link__content">${index + 1}. ${escapeHtml(topic.title)}</span>
      ${!isAccessible ? `<span class="topic-link__lock">${escapeHtml(t("topicLocked"))}</span>` : ""}
    `

    if (!isAccessible) {
      element.addEventListener("click", openUnlockModal)
    } else {
      element.addEventListener("click", event => {
        event.preventDefault()

        closeSidebar()

        setTimeout(() => {
          const target = document.getElementById(`topic-${index + 1}`)
          if (!target) return

          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }, 280)
      })
    }

    topicNav.appendChild(element)
  })
}

function renderModuleContent(track, module) {
  if (!module) {
    const trackStatus = track ? getTrackStatus(track.id) : null
    const showComingSoon = track ? shouldShowComingSoon(track.id) : false

    if (showComingSoon && trackStatus) {
      document.title = `${track.title} — BYTEWEBNEST`

      moduleTitle.textContent = trackStatus.title || t("comingSoonSection")
      moduleGoal.textContent = t("opensOn", trackStatus.availableDate)
      moduleDescription.textContent = trackStatus.description || t("comingSoonDescription")
      moduleSummary.textContent = t("comingSoonSummary")
      finalThought.textContent = t("followUpdates")
      sectionSubtitle.textContent = t("contentUnavailable")
      trackBadge.textContent = track ? track.title : "BYTEWEBNEST ROADMAP"
      heroBadge.textContent = trackStatus.availableDate ? trackStatus.availableDate : "Soon"
      heroStats.innerHTML = `
        <li class="fade-up">
          <strong>${escapeHtml(trackStatus.availableDate ? trackStatus.availableDate : CURRENT_LANG === "en" ? "Soon" : "Скоро")}</strong>
          <span>${escapeHtml(t("newContent"))}</span>
        </li>
        <li class="fade-up">
          <strong>${escapeHtml(trackStatus.availableDate || "TBA")}</strong>
          <span>${escapeHtml(t("openingDate"))}</span>
        </li>
        <li class="fade-up">
          <strong>+</strong>
          <span>${escapeHtml(t("futureModules"))}</span>
        </li>
      `

      topicsContainer.innerHTML = ""
      practiceList.innerHTML = ""
      outcomesList.innerHTML = ""

      moduleImage.src = getAssetPath("images/logo.png")
      moduleImage.alt = "BYTEWEBNEST"

      updatePremiumSectionsState()
      updateProgress()
      return
    }

    moduleTitle.textContent = t("noModulesTitle")
    moduleGoal.textContent = t("addModulesJson")
    moduleDescription.textContent = track ? track.description : t("contentLater")
    moduleSummary.textContent = t("futureModulesText")
    finalThought.textContent = ""
    sectionSubtitle.textContent = t("topicsNotAdded")
    trackBadge.textContent = track ? track.title : "BYTEWEBNEST ROADMAP"
    heroBadge.textContent = track ? track.title : "Module"
    heroStats.innerHTML = ""
    topicsContainer.innerHTML = ""
    practiceList.innerHTML = ""
    outcomesList.innerHTML = ""
    updatePremiumSectionsState()
    updateProgress()
    return
  }

  const { hero, summary, stats, topics, practice, outcomes } = module

  document.title = `${hero.module} — BYTEWEBNEST`

  trackBadge.textContent = track ? `${track.title} — ${track.subtitle}` : "BYTEWEBNEST ROADMAP"
  moduleTitle.textContent = hero.module
  moduleGoal.textContent = hero.goal
  moduleDescription.textContent = hero.description
  heroBadge.textContent = hero.badge || hero.module
  moduleSummary.textContent = summary
  finalThought.textContent = practice.finalThought
  sectionSubtitle.textContent = getLockedTopicsText(module.id, topics.length)

  moduleImage.src = getAssetPath(hero.image.src)
  moduleImage.alt = hero.image.alt

  renderStats(stats)
  renderTopics(module.id, topics)
  renderPractice(practice.tasks)
  renderOutcomes(outcomes)
  updatePremiumSectionsState()
}

function renderStats(stats = []) {
  heroStats.innerHTML = ""

  stats.forEach(item => {
    const li = document.createElement("li")
    li.classList.add("fade-up")
    li.innerHTML = `
      <strong>${escapeHtml(item.value)}</strong>
      <span>${escapeHtml(item.label)}</span>
    `
    heroStats.appendChild(li)
  })
}

function renderTopics(moduleId, topics = []) {
  topicsContainer.innerHTML = ""

  topics.forEach((topic, index) => {
    const isAccessible = isTopicAccessible(moduleId, index)
    const article = document.createElement("article")
    article.className = `topic-card fade-up ${!isAccessible ? "is-locked" : ""}`
    article.id = `topic-${index + 1}`
    article.dataset.topic = `${moduleId}::topic-${index + 1}`

    const studyList = createList(topic.study)
    const deepList = createList(topic.deepDive)

    const exampleMarkup = topic.example
      ? `
        <div class="code-example">
          <code>${escapeHtml(topic.example)}</code>
        </div>
      `
      : ""

    const importantMarkup = topic.important
      ? `
        <div class="note-box">
          ${escapeHtml(topic.important)}
        </div>
      `
      : ""

    article.innerHTML = `
      <div class="topic-card__content">
        <div class="topic-card__head">
          <div>
            <span class="topic-card__label">${escapeHtml(t("topicLabel", index))}</span>
            <h3 class="topic-card__title">${escapeHtml(topic.title)}</h3>
          </div>
        </div>

        <p class="topic-card__intro">${escapeHtml(topic.intro)}</p>

        <div class="topic-layout">
          <div class="info-box">
            <h4 class="info-box__title">${escapeHtml(t("studyTitle"))}</h4>
            <ul class="token-list">
              ${studyList}
            </ul>
          </div>

          <div class="info-box">
            <h4 class="info-box__title">${escapeHtml(t("deepDiveTitle"))}</h4>
            <ul class="token-list">
              ${deepList}
            </ul>
          </div>
        </div>

        ${exampleMarkup}
        ${importantMarkup}
      </div>

      ${
        !isAccessible
          ? `
            <div class="topic-card__overlay">
              <button class="topic-card__overlay-btn" type="button">
                ${escapeHtml(unlockButton?.textContent?.trim() || "Unlock")}
              </button>
            </div>
          `
          : ""
      }
    `

    if (!isAccessible) {
      const overlayButton = article.querySelector(".topic-card__overlay-btn")
      overlayButton.addEventListener("click", openUnlockModal)
    }

    topicsContainer.appendChild(article)
  })
}

function renderPractice(tasks = []) {
  practiceList.innerHTML = ""

  tasks.forEach(task => {
    const li = document.createElement("li")
    li.classList.add("fade-up")
    li.textContent = task
    practiceList.appendChild(li)
  })
}

function renderOutcomes(outcomes = []) {
  outcomesList.innerHTML = ""

  outcomes.forEach(outcome => {
    const li = document.createElement("li")
    li.classList.add("fade-up")
    li.textContent = outcome
    outcomesList.appendChild(li)
  })
}

function updatePremiumSectionsState() {
  const isAccessible = isPremiumSectionAccessible()

  toggleLockableCard(practiceCard, isAccessible)
  toggleLockableCard(thoughtCard, isAccessible)
  toggleLockableCard(outcomesCard, isAccessible)
}

function toggleLockableCard(element, isAccessible) {
  if (!element) return

  element.classList.toggle("is-locked", !isAccessible)

  const button = element.querySelector(".lockable-card__overlay-btn")
  if (!button) return

  button.onclick = null

  if (!isAccessible) {
    button.onclick = openUnlockModal
  }
}

function createList(items = []) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join("")
}

function keepActiveTopicVisible(activeId) {
  if (!activeId || !topicNavWrap || topicNavWrap.classList.contains("is-collapsed")) return

  const activeLink = topicNav.querySelector(`[data-topic-link="${activeId}"]`)
  if (!activeLink) return

  const containerRect = topicNavWrap.getBoundingClientRect()
  const linkRect = activeLink.getBoundingClientRect()

  const isAbove = linkRect.top < containerRect.top + 12
  const isBelow = linkRect.bottom > containerRect.bottom - 12

  if (isAbove || isBelow) {
    activeLink.scrollIntoView({
      block: "nearest",
      behavior: window.innerWidth <= 980 ? "auto" : "smooth",
    })
  }
}

function openLastModuleSection(sectionId) {
  if (!currentModuleId) return

  if (currentView !== "module") {
    closeSidebar()

    window.location.hash = `module-${currentModuleId}`
    showModuleView()
    renderApp()

    setTimeout(() => {
      const target = document.getElementById(sectionId)
      if (!target) return

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 1000)

    return
  }

  closeSidebar()

  setTimeout(() => {
    const target = document.getElementById(sectionId)
    if (!target) return

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, 120)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function initRevealAnimation() {
  const elements = document.querySelectorAll(".fade-up")

  if (currentRevealObserver) {
    currentRevealObserver.disconnect()
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"))
    return
  }

  const isMobile = window.innerWidth <= 980

  currentRevealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("is-visible")
        obs.unobserve(entry.target)
      })
    },
    {
      threshold: isMobile ? 0.02 : 0.12,
      rootMargin: isMobile ? "0px 0px -8% 0px" : "0px 0px -12% 0px",
    },
  )

  elements.forEach(el => {
    const rect = el.getBoundingClientRect()

    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add("is-visible")
      return
    }

    currentRevealObserver.observe(el)
  })
}

function initTopicSpy() {
  const sections = document.querySelectorAll(".topic-card")
  const links = document.querySelectorAll("[data-topic-link]")

  if (currentTopicSpyObserver) {
    currentTopicSpyObserver.disconnect()
  }

  if (!("IntersectionObserver" in window) || !sections.length) return

  currentTopicSpyObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const id = entry.target.id
        links.forEach(link => {
          link.classList.toggle("is-active", link.getAttribute("data-topic-link") === id)
        })

        keepActiveTopicVisible(id)
      })
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: 0.1,
    },
  )

  sections.forEach(section => currentTopicSpyObserver.observe(section))
}

function scrollPageTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function openUnlockModal() {
  if (!unlockModal) return

  unlockModal.classList.add("is-open")
  unlockModal.setAttribute("aria-hidden", "false")
  document.body.classList.add("is-modal-open")

  if (unlockMessage) {
    unlockMessage.textContent = ""
    unlockMessage.className = "modal__message"
  }

  setTimeout(() => {
    unlockCodeInput?.focus()
  }, 30)
}

function closeUnlockModal() {
  if (!unlockModal) return

  unlockModal.classList.remove("is-open")
  unlockModal.setAttribute("aria-hidden", "true")
  document.body.classList.remove("is-modal-open")
  unlockForm?.reset()

  if (unlockMessage) {
    unlockMessage.textContent = ""
    unlockMessage.className = "modal__message"
  }
}

function handleUnlockSubmit(event) {
  event.preventDefault()

  const enteredCode = unlockCodeInput?.value.trim() || ""
  const validCode = String(appData.access.unlockCode)

  if (enteredCode !== validCode) {
    if (unlockMessage) {
      unlockMessage.textContent = t("unlockError")
      unlockMessage.className = "modal__message is-error"
    }
    unlockCodeInput?.focus()
    unlockCodeInput?.select()
    return
  }

  localStorage.setItem(STORAGE_KEY, "true")

  if (unlockMessage) {
    unlockMessage.textContent = t("unlockSuccess")
    unlockMessage.className = "modal__message is-success"
  }

  setTimeout(() => {
    closeUnlockModal()
    renderApp()
  }, 600)
}

function openSidebar() {
  document.body.classList.add("is-sidebar-open")
}

function closeSidebar() {
  document.body.classList.remove("is-sidebar-open")
}

function toggleTopicsPanel() {
  if (!topicNavWrap || !topicsToggle) return

  const isCollapsed = topicNavWrap.classList.toggle("is-collapsed")
  topicsToggle.textContent = isCollapsed ? t("expand") : t("collapse")
  localStorage.setItem(TOPICS_COLLAPSED_KEY, String(isCollapsed))
}

function restoreTopicsPanelState() {
  if (!topicNavWrap || !topicsToggle) return

  const isCollapsed = localStorage.getItem(TOPICS_COLLAPSED_KEY) === "true"
  topicNavWrap.classList.toggle("is-collapsed", isCollapsed)
  topicsToggle.textContent = isCollapsed ? t("expand") : t("collapse")
}

async function loadMapPage() {
  if (mapPageLoaded || !mapPageContent) return

  try {
    const response = await fetch(getRoadmapPath())

    if (!response.ok) {
      throw new Error(`${t("mapLoadError")}: ${response.status}`)
    }

    const html = await response.text()
    mapPageContent.innerHTML = html
    mapPageLoaded = true
  } catch (error) {
    console.error("Roadmap loading error:", error)

    mapPageContent.innerHTML = `
      <div class="map-page__loading">
        ${escapeHtml(t("mapFallback"))}
      </div>
    `
  }
}

async function showMapView() {
  currentView = "map"

  if (modulePage) modulePage.hidden = true
  if (mapPage) mapPage.hidden = false

  await loadMapPage()

  closeSidebar()

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function showModuleView() {
  currentView = "module"

  if (mapPage) mapPage.hidden = true
  if (modulePage) modulePage.hidden = false

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function showFallbackError(message = "") {
  if (moduleTitle) moduleTitle.textContent = t("loadModuleFail")
  if (moduleGoal) moduleGoal.textContent = t("checkContentFile")
  if (moduleDescription) moduleDescription.textContent = `${t("reasonPrefix")}: ${message}`
}

/* ================= PROGRESS SYSTEM ================= */

function getProgress() {
  const data = localStorage.getItem(COURSE_PROGRESS_KEY)
  return data ? JSON.parse(data) : {}
}

function saveProgress(data) {
  localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(data))
}

function completeTopic(topicId) {
  if (!topicId) return

  const progress = getProgress()

  if (progress[topicId]) return

  progress[topicId] = true
  saveProgress(progress)
  updateProgress()
}

function getTotalCourseTopicsCount() {
  if (!appData?.modules?.length) return 0

  return appData.modules.reduce((sum, module) => {
    return sum + (Array.isArray(module.topics) ? module.topics.length : 0)
  }, 0)
}

function updateProgress() {
  const progress = getProgress()

  const currentTopicCards = document.querySelectorAll(".topic-card")
  const currentTopicsTotal = currentTopicCards.length

  let currentCompleted = 0
  currentTopicCards.forEach(topic => {
    const id = topic.dataset.topic
    if (id && progress[id]) {
      currentCompleted += 1
    }
  })

  const modulePercent = currentTopicsTotal ? Math.round((currentCompleted / currentTopicsTotal) * 100) : 0

  animateProgress(moduleProgressBar, moduleProgressPercent, modulePercent)

  const totalCourseTopics = getTotalCourseTopicsCount()
  const completedCourseTopics = Object.keys(progress).length
  const coursePercent = totalCourseTopics ? Math.round((completedCourseTopics / totalCourseTopics) * 100) : 0

  animateProgress(courseProgressBar, courseProgressPercent, coursePercent)

  if (coursePercent === 100) {
    showCompletionScreen()
  } else {
    hideCompletionScreen()
  }
}

function animateProgress(bar, label, value) {
  if (bar) {
    bar.style.width = `${value}%`
  }

  if (label) {
    label.textContent = `${value}%`
  }
}

function initProgressTracking() {
  const cards = document.querySelectorAll(".topic-card")

  if (currentProgressObserver) {
    currentProgressObserver.disconnect()
  }

  if (!cards.length || !("IntersectionObserver" in window)) {
    return
  }

  currentProgressObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const topicId = entry.target.dataset.topic
        completeTopic(topicId)
        observer.unobserve(entry.target)
      })
    },
    {
      threshold: window.innerWidth <= 980 ? 0.35 : 0.6,
    },
  )

  cards.forEach(card => currentProgressObserver.observe(card))
}

function showCompletionScreen() {
  if (!completionScreen) return
  completionScreen.style.display = "flex"
}

function hideCompletionScreen() {
  if (!completionScreen) return
  completionScreen.style.display = "none"
}

loadContent()

/* ===== BURGER INIT ===== */

function initBurgerIcon() {
  const btn = document.getElementById("sidebarOpenBtn")
  if (!btn) return

  if (btn.querySelector(".burger-icon")) return

  btn.textContent = ""

  const burger = document.createElement("span")
  burger.className = "burger-icon"

  burger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `

  btn.appendChild(burger)
}

/* ===== STATE SYNC (АНИМАЦИЯ БУРГЕРА) ===== */

const originalOpenSidebar = openSidebar
const originalCloseSidebar = closeSidebar

openSidebar = function () {
  originalOpenSidebar()
  const btn = document.getElementById("sidebarOpenBtn")
  btn?.classList.add("is-active")
}

closeSidebar = function () {
  originalCloseSidebar()
  const btn = document.getElementById("sidebarOpenBtn")
  btn?.classList.remove("is-active")
}

/* ===== SAFE CLICK OUTSIDE ===== */

document.addEventListener("click", event => {
  // ❗ защита от странных мобильных/фантомных кликов
  if (!event.isTrusted) return

  const sidebarPanel = document.querySelector(".sidebar__panel")
  if (!sidebarPanel) return

  // игнор клика по бургеру
  if (event.target.closest("#sidebarOpenBtn")) return

  if (
    document.body.classList.contains("is-sidebar-open") &&
    !sidebarPanel.contains(event.target)
  ) {
    closeSidebar()
  }
})
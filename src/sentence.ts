declare const navigator: Navigator | any;

export const sentenceList = {
  ["gunpowder casing"]: { ja: "Gunpowder\nCasing", en: "Gunpowder\nCasing" },
  ["railgun casing"]: { ja: "Railgun\nCasing", en: "Railgun\nCasing" },
  ["diameter"]: { ja: "砲弾直径", en: "Shell diam." },
  ["velocity"]: { ja: "砲弾初速", en: "Velocity" },
  ["module"]: { ja: "モジュール", en: "Module" },
  ["shell length"]: { ja: "弾薬長", en: "Shell len." },
  ["barrel count"]: { ja: "砲身数", en: "Number of barrels" },
  ["loader size"]: { ja: "ローダーサイズ", en: "Size of autoloader" },
  ["number of autoloaders"]: {
    ja: "接続するローダーの数",
    en: "number of autoloaders"
  },
  ["number of clips"]: {
    ja: "接続するクリップの数",
    en: "Ammo clips / autoloader"
  },
  ["reload time"]: {
    ja: "装填時間(ローダー1つあたり)",
    en: "Reload time (a loader)"
  },
  ["cool time"]: {
    ja: "推奨冷却時間(1砲身)",
    en: "Recommended cool time (a barrel)"
  },
  ["fire rate"]: { ja: "最高分間投射量", en: "Fire rate(per minute)" },
  ["feeder require"]: {
    ja: "必要フィーダー数(ローダー1つあたり)",
    en: "Requirement of feeder(per loader)"
  },
  ["cooling require"]: {
    ja: "必要クーリングユニット数",
    en: "Requirement of guage cooling unit"
  }
};

export const lang =
  (
    navigator.browserLanguage ||
    navigator.language ||
    navigator.userLanguage
  ).substr(0, 2) === "ja"
    ? "ja"
    : "en";

export const sentence: any = [...Object.entries(sentenceList)]
  .map(([key, value]) => ({
    key: key,
    value: value[lang]
  }))
  .reduce(
    (accum, current) => Object.assign(accum, { [current.key]: current.value }),
    {}
  );

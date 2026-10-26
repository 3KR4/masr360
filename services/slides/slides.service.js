import api from "../axios";
import { ENDPOINTS } from "../endpoints";

const safeStr = (val, lang = "EN") => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    const upper = String(lang).toUpperCase();
    const lower = String(lang).toLowerCase();
    const resolved =
      val[upper] ??
      val[lower] ??
      val.EN ??
      val.en ??
      val.AR ??
      val.ar ??
      val.title ??
      val.desc ??
      val.smallTitle ??
      "";
    if (typeof resolved === "string") return resolved;
    if (typeof resolved === "number") return String(resolved);
  }
  return "";
};

export const normalizeSlide = (s) => {
  if (!s) return null;

  let translations = s.translations;
  if (typeof translations === "string") {
    try {
      translations = JSON.parse(translations);
    } catch {
      translations = null;
    }
  }

  const enTrans = translations?.EN || translations?.en || {};
  const arTrans = translations?.AR || translations?.ar || {};

  return {
    id: s?._id || s?.id,
    _id: s?._id || s?.id,
    title:
      (typeof enTrans.title === "string" && enTrans.title) ||
      safeStr(s.title, "EN"),
    smallTitle:
      (typeof enTrans.smallTitle === "string" && enTrans.smallTitle) ||
      safeStr(s.smallTitle, "EN") ||
      safeStr(s.small, "EN"),
    desc:
      (typeof enTrans.desc === "string" && enTrans.desc) ||
      safeStr(s.desc, "EN") ||
      safeStr(s.paragraph, "EN"),
    link: typeof s?.link === "string" ? s.link : "",
    img: s?.img || null,
    image:
      (typeof s?.img === "object" && s?.img?.url) ||
      (typeof s?.image === "string" && s.image) ||
      (typeof s?.img === "string" && s.img) ||
      "",
    isActive: s?.isActive !== false,
    translations: {
      EN: {
        title:
          (typeof enTrans.title === "string" && enTrans.title) ||
          safeStr(s.title, "EN"),
        smallTitle:
          (typeof enTrans.smallTitle === "string" && enTrans.smallTitle) ||
          safeStr(s.smallTitle, "EN") ||
          safeStr(s.small, "EN"),
        desc:
          (typeof enTrans.desc === "string" && enTrans.desc) ||
          safeStr(s.desc, "EN") ||
          safeStr(s.paragraph, "EN"),
      },
      AR: {
        title:
          (typeof arTrans.title === "string" && arTrans.title) ||
          safeStr(s.title, "AR"),
        smallTitle:
          (typeof arTrans.smallTitle === "string" && arTrans.smallTitle) ||
          safeStr(s.smallTitle, "AR") ||
          safeStr(s.small, "AR"),
        desc:
          (typeof arTrans.desc === "string" && arTrans.desc) ||
          safeStr(s.desc, "AR") ||
          safeStr(s.paragraph, "AR"),
      },
    },
    createdAt: s?.createdAt || null,
    updatedAt: s?.updatedAt || null,
  };
};

export const normalizeSlidesResponse = (res) => {
  const data = res?.data;

  if (data && Array.isArray(data.data)) {
    return {
      slides: data.data.map(normalizeSlide).filter(Boolean),
      totalCount:
        typeof data.total === "number"
          ? data.total
          : data.count || data.data.length,
      page: data.page || 1,
      limit: data.limit || 10,
    };
  }

  if (Array.isArray(data)) {
    return {
      slides: data.map(normalizeSlide).filter(Boolean),
      totalCount: data.length,
      page: 1,
      limit: data.length,
    };
  }

  return {
    slides: [],
    totalCount: 0,
    page: 1,
    limit: 10,
  };
};

export const create = (payload) => {
  return api.post(ENDPOINTS.SLIDES.CREATE, payload);
};

export const update = (id, payload) => {
  return api.put(ENDPOINTS.SLIDES.UPDATE(id), payload);
};

export const remove = (id) => {
  return api.delete(ENDPOINTS.SLIDES.DELETE(id));
};

export const getAll = async (page = 1, limit = 10) => {
  const res = await api.get(ENDPOINTS.SLIDES.GET_ALL(page, limit), {
    skipAuth: true,
  });
  return normalizeSlidesResponse(res);
};

export const getOne = async (id) => {
  const res = await api.get(ENDPOINTS.SLIDES.GET_ONE(id), {
    skipAuth: true,
  });
  const slide = res?.data?.data || res?.data?.slide || res?.data;
  return {
    ...res,
    data: {
      slide: normalizeSlide(slide),
    },
  };
};

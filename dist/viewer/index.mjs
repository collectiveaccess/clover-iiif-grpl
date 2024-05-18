import t, { useReducer as Tt, useState as C, useRef as ye, useEffect as w, useCallback as oe, createContext as Mt, useContext as Lt, cloneElement as Rt, Fragment as zt, useLayoutEffect as Ft } from "react";
import { Vault as pe } from "@iiif/vault";
import { v4 as ae } from "uuid";
import * as be from "@radix-ui/react-collapsible";
import ie from "openseadragon";
import { decodeContentState as Pt } from "@iiif/vault-helpers";
import { ErrorBoundary as _e } from "react-error-boundary";
import { createStitches as Vt, createTheme as Ht } from "@stitches/react";
import * as le from "@radix-ui/react-tabs";
import * as se from "@radix-ui/react-radio-group";
import { parse as Bt } from "node-webvtt";
import * as q from "@radix-ui/react-form";
import Ot from "sanitize-html";
import B from "hls.js";
import * as Q from "@radix-ui/react-popover";
import * as ee from "@radix-ui/react-select";
import { SelectValue as Dt, SelectIcon as Nt, SelectPortal as Wt, SelectScrollUpButton as _t, SelectViewport as jt, SelectGroup as Gt, SelectScrollDownButton as Ut, SelectItemText as qt, SelectItemIndicator as Zt } from "@radix-ui/react-select";
import * as je from "@radix-ui/react-switch";
const Xt = (e) => {
  const n = e.toString().split(":"), r = Math.ceil(parseInt(n[0])), a = Math.ceil(parseInt(n[1])), o = Jt(Math.ceil(parseInt(n[2])), 2);
  let l = `${r !== 0 && a < 10 ? (a + "").padStart(2, "0") : a}:${o}`;
  return r !== 0 && (l = `${r}:${l}`), l;
}, Ge = (e) => {
  const n = new Date(e * 1e3).toISOString().substr(11, 8);
  return Xt(n);
}, Ue = (e, n) => {
  if (typeof e != "object" || e === null)
    return n;
  for (const r in n)
    typeof n[r] == "object" && n[r] !== null && !Array.isArray(n[r]) ? (e[r] || (e[r] = {}), e[r] = Ue(e[r], n[r])) : e[r] = n[r];
  return e;
}, Yt = (e) => e.split("").reduce(function(n, r) {
  return n = (n << 5) - n + r.charCodeAt(0), n & n;
}, 0), qe = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, Jt = (e, n) => String(e).padStart(n, "0"), Kt = {
  behavior: "smooth",
  block: "center"
}, _ = {
  annotationOverlays: {
    backgroundColor: "#6666ff",
    borderColor: "#000099",
    borderType: "solid",
    borderWidth: "1px",
    opacity: "0.5",
    renderOverlays: !0,
    zoomLevel: 2
  },
  background: "transparent",
  canvasBackgroundColor: "#6662",
  canvasHeight: "500px",
  contentSearch: {
    searchResultsLimit: 20,
    overlays: {
      backgroundColor: "#ff6666",
      borderColor: "#990000",
      borderType: "solid",
      borderWidth: "1px",
      opacity: "0.5",
      renderOverlays: !0,
      zoomLevel: 4
    }
  },
  ignoreCaptionLabels: [],
  informationPanel: {
    vtt: {
      autoScroll: {
        enabled: !0,
        settings: Kt
      }
    },
    open: !0,
    renderAbout: !0,
    renderSupplementing: !0,
    renderToggle: !0,
    renderAnnotation: !0,
    renderContentSearch: !0
  },
  openSeadragon: {},
  requestHeaders: { "Content-Type": "application/json" },
  showDownload: !0,
  showIIIFBadge: !0,
  showTitle: !0,
  withCredentials: !1,
  localeText: {
    contentSearch: {
      tabLabel: "Search Results",
      formPlaceholder: "Enter search words",
      noSearchResults: "No search results",
      loading: "Loading...",
      moreResults: "more results"
    }
  }
};
function Ze(e) {
  let n = {
    ..._.informationPanel.vtt.autoScroll
  };
  return typeof e == "object" && (n = "enabled" in e ? e : { enabled: !0, settings: e }), e === !1 && (n.enabled = !1), Qt(n.settings), n;
}
function Qt({ behavior: e, block: n }) {
  const r = ["auto", "instant", "smooth"], a = ["center", "end", "nearest", "start"];
  if (!r.includes(e))
    throw TypeError(`'${e}' not in ${r.join(" | ")}`);
  if (!a.includes(n))
    throw TypeError(`'${n}' not in ${a.join(" | ")}`);
}
var De, Ne;
const en = Ze(
  (Ne = (De = _ == null ? void 0 : _.informationPanel) == null ? void 0 : De.vtt) == null ? void 0 : Ne.autoScroll
);
var We;
const ce = {
  activeCanvas: "",
  activeManifest: "",
  OSDImageLoaded: !1,
  collection: {},
  configOptions: _,
  customDisplays: [],
  plugins: [],
  isAutoScrollEnabled: en.enabled,
  isAutoScrolling: !1,
  isInformationOpen: (We = _ == null ? void 0 : _.informationPanel) == null ? void 0 : We.open,
  isLoaded: !1,
  isUserScrolling: void 0,
  vault: new pe(),
  contentSearchVault: new pe(),
  openSeadragonViewer: null,
  viewerId: ae()
}, Xe = t.createContext(ce), Ye = t.createContext(ce);
function tn(e, n) {
  switch (n.type) {
    case "updateActiveCanvas":
      return n.canvasId || (n.canvasId = ""), {
        ...e,
        activeCanvas: n.canvasId
      };
    case "updateActiveManifest":
      return {
        ...e,
        activeManifest: n.manifestId
      };
    case "updateOSDImageLoaded":
      return {
        ...e,
        OSDImageLoaded: n.OSDImageLoaded
      };
    case "updateAutoScrollAnnotationEnabled":
      return {
        ...e,
        isAutoScrollEnabled: n.isAutoScrollEnabled
      };
    case "updateAutoScrolling":
      return {
        ...e,
        isAutoScrolling: n.isAutoScrolling
      };
    case "updateCollection":
      return {
        ...e,
        collection: n.collection
      };
    case "updateConfigOptions":
      return {
        ...e,
        configOptions: Ue(e.configOptions, n.configOptions)
      };
    case "updateInformationOpen":
      return {
        ...e,
        isInformationOpen: n.isInformationOpen
      };
    case "updateIsLoaded":
      return {
        ...e,
        isLoaded: n.isLoaded
      };
    case "updateUserScrolling":
      return {
        ...e,
        isUserScrolling: n.isUserScrolling
      };
    case "updateOpenSeadragonViewer":
      return {
        ...e,
        openSeadragonViewer: n.openSeadragonViewer
      };
    case "updateViewerId":
      return {
        ...e,
        viewerId: n.viewerId
      };
    default:
      throw new Error(`Unhandled action type: ${n.type}`);
  }
}
const nn = ({
  initialState: e = ce,
  children: n
}) => {
  const [r, a] = Tt(tn, e);
  return /* @__PURE__ */ t.createElement(Xe.Provider, { value: r }, /* @__PURE__ */ t.createElement(
    Ye.Provider,
    {
      value: a
    },
    n
  ));
};
function I() {
  const e = t.useContext(Xe);
  if (e === void 0)
    throw new Error("useViewerState must be used within a ViewerProvider");
  return e;
}
function z() {
  const e = t.useContext(Ye);
  if (e === void 0)
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  return e;
}
const rn = (e, n) => {
  const r = e.get({
    id: n,
    type: "Canvas"
  });
  return !(r != null && r.annotations) || !r.annotations[0] ? [] : e.get(r.annotations).filter((o) => !o.items || !o.items.length ? !1 : o).map((o) => {
    const i = o.label || { none: ["Annotations"] };
    return { ...o, label: i };
  });
}, Je = async (e, n, r, a) => {
  if (a == null || a.q == null)
    return { label: { none: [r] } };
  const o = `${n}?q=${a.q.trim()}&exact=${a.exact}`;
  let i;
  try {
    i = await e.load(o);
  } catch {
    return console.log("Could not load content search."), {};
  }
  return i.label == null && (i.label = { none: [r] }), i;
}, Ke = (e, n, r, a) => {
  var l, c;
  const o = {
    canvas: void 0,
    accompanyingCanvas: void 0,
    annotationPage: void 0,
    annotations: []
  }, i = (s) => {
    if (s) {
      if (!s.body || !s.motivation) {
        console.error(
          "Invalid annotation after Hyperion parsing: missing either 'body' or 'motivation'",
          s
        );
        return;
      }
      let d = s.body;
      Array.isArray(d) && (d = d[0]);
      const h = e.get(d.id);
      if (!h)
        return;
      switch (r) {
        case "painting":
          return s.target === n.id && s.motivation && s.motivation[0] === "painting" && a.includes(h.type) && (s.body = h), !!s;
        case "supplementing":
          return;
        default:
          throw new Error("Invalid annotation motivation.");
      }
    }
  };
  if (o.canvas = e.get(n), o.canvas && (o.annotationPage = e.get(o.canvas.items[0]), o.accompanyingCanvas = (l = o.canvas) != null && l.accompanyingCanvas ? e.get((c = o.canvas) == null ? void 0 : c.accompanyingCanvas) : void 0), o.annotationPage) {
    const s = e.get(o.annotationPage.items).map((h) => ({
      body: e.get(h.body[0].id),
      motivation: h.motivation,
      type: "Annotation"
    })), d = [];
    s.forEach((h) => {
      h.body.type === "Choice" ? h.body.items.forEach(
        (m) => d.push({
          ...h,
          id: m.id,
          body: e.get(m.id)
        })
      ) : d.push(h);
    }), o.annotations = d.filter(i);
  }
  return o;
}, X = (e, n = "en") => {
  if (!e)
    return "";
  if (!e[n]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return e[n];
}, re = (e, n) => {
  const r = Ke(
    e,
    { id: n, type: "Canvas" },
    "painting",
    ["Image", "Sound", "Video"]
  );
  if (r.annotations.length !== 0 && r.annotations && r.annotations)
    return r.annotations.map(
      (a) => a == null ? void 0 : a.body
    );
}, on = (e, n, r, a) => {
  const o = [];
  if (n.canvas && n.canvas.thumbnail.length > 0) {
    const c = e.get(
      n.canvas.thumbnail[0]
    );
    o.push(c);
  }
  if (n.annotations[0]) {
    if (n.annotations[0].thumbnail && n.annotations[0].thumbnail.length > 0) {
      const s = e.get(
        n.annotations[0].thumbnail[0]
      );
      o.push(s);
    }
    if (!n.annotations[0].body)
      return;
    const c = n.annotations[0].body;
    c.type === "Image" && o.push(c);
  }
  return o.length === 0 ? void 0 : {
    id: o[0].id,
    format: o[0].format,
    type: o[0].type,
    width: r,
    height: a
  };
};
let G = window.OpenSeadragon;
if (!G && (G = ie, !G))
  throw new Error("OpenSeadragon is missing.");
const Ae = "http://www.w3.org/2000/svg";
G.Viewer && (G.Viewer.prototype.svgOverlay = function() {
  return this._svgOverlayInfo ? this._svgOverlayInfo : (this._svgOverlayInfo = new xe(this), this._svgOverlayInfo);
});
const xe = function(e) {
  const n = this;
  this._viewer = e, this._containerWidth = 0, this._containerHeight = 0, this._svg = document.createElementNS(Ae, "svg"), this._svg.style.position = "absolute", this._svg.style.left = 0, this._svg.style.top = 0, this._svg.style.width = "100%", this._svg.style.height = "100%", this._viewer.canvas.appendChild(this._svg), this._node = document.createElementNS(Ae, "g"), this._svg.appendChild(this._node), this._viewer.addHandler("animation", function() {
    n.resize();
  }), this._viewer.addHandler("open", function() {
    n.resize();
  }), this._viewer.addHandler("rotate", function() {
    n.resize();
  }), this._viewer.addHandler("flip", function() {
    n.resize();
  }), this._viewer.addHandler("resize", function() {
    n.resize();
  }), this.resize();
};
xe.prototype = {
  // ----------
  node: function() {
    return this._node;
  },
  // ----------
  resize: function() {
    this._containerWidth !== this._viewer.container.clientWidth && (this._containerWidth = this._viewer.container.clientWidth, this._svg.setAttribute("width", this._containerWidth)), this._containerHeight !== this._viewer.container.clientHeight && (this._containerHeight = this._viewer.container.clientHeight, this._svg.setAttribute("height", this._containerHeight));
    const e = this._viewer.viewport.pixelFromPoint(new G.Point(0, 0), !0), n = this._viewer.viewport.getZoom(!0), r = this._viewer.viewport.getRotation(), a = this._viewer.viewport.getFlip(), o = this._viewer.viewport._containerInnerSize.x;
    let i = o * n;
    const l = i;
    a && (i = -i, e.x = -e.x + o), this._node.setAttribute(
      "transform",
      "translate(" + e.x + "," + e.y + ") scale(" + i + "," + l + ") rotate(" + r + ")"
    );
  },
  // ----------
  onClick: function(e, n) {
    new G.MouseTracker({
      element: e,
      clickHandler: n
    }).setTracking(!0);
  }
};
const an = (e) => new xe(e), Qe = (e) => {
  var r, a;
  let n = {
    id: typeof e == "string" ? e : e.source
  };
  if (typeof e == "string") {
    if (e.includes("#xywh=")) {
      const o = e.split("#xywh=");
      if (o && o[1]) {
        const [i, l, c, s] = o[1].split(",").map((d) => Number(d));
        n = {
          id: o[0],
          rect: {
            x: i,
            y: l,
            w: c,
            h: s
          }
        };
      }
    } else if (e.includes("#t=")) {
      const o = e.split("#t=");
      o && o[1] && (n = {
        id: o[0],
        t: o[1]
      });
    }
  } else
    typeof e == "object" && (((r = e.selector) == null ? void 0 : r.type) === "PointSelector" ? n = {
      id: e.source,
      point: {
        x: e.selector.x,
        y: e.selector.y
      }
    } : ((a = e.selector) == null ? void 0 : a.type) === "SvgSelector" && (n = {
      id: e.source,
      svg: e.selector.value
    }));
  return n;
}, ln = (e) => fetch(`${e.replace(/\/$/, "")}/info.json`).then((n) => n.json()).then((n) => n).catch((n) => {
  console.error(
    `The IIIF tilesource ${e.replace(
      /\/$/,
      ""
    )}/info.json failed to load: ${n}`
  );
}), sn = (e) => {
  let n, r;
  if (Array.isArray(e) && (n = e[0], n)) {
    let a;
    "@id" in n ? a = n["@id"] : a = n.id, r = a;
  }
  return r;
}, Ee = (e) => {
  var a;
  let n, r;
  if (un(e))
    n = e, r = {};
  else {
    const o = JSON.parse(Pt(e));
    switch (o == null ? void 0 : o.type) {
      case "SpecificResource":
      case "Range":
      case "Annotation":
        n = o == null ? void 0 : o.target.partOf[0].id, r = {
          manifest: n,
          canvas: o == null ? void 0 : o.target.id
        };
        break;
      case "Canvas":
        n = o == null ? void 0 : o.partOf[0].id, r = {
          manifest: n,
          canvas: o == null ? void 0 : o.id
        };
        break;
      case "Manifest":
        n = o == null ? void 0 : o.id, r = {
          collection: (a = o == null ? void 0 : o.partOf[0]) == null ? void 0 : a.id,
          manifest: o == null ? void 0 : o.id
        };
        break;
      case "Collection":
        n = o == null ? void 0 : o.id, r = {
          collection: n
        };
        break;
    }
  }
  return { resourceId: n, active: r };
}, cn = (e) => {
  const { resourceId: n, active: r } = Ee(e);
  return r.collection || r.manifest || n;
}, dn = (e, n) => {
  const r = n.items.map((i) => i.id), { active: a } = Ee(e), o = a.canvas;
  return r.includes(o) ? o : r[0];
}, mn = (e, n) => {
  const { active: r } = Ee(e), a = r.manifest, o = n.items.filter((i) => i.type === "Manifest").map((i) => i.id);
  return o.length == 0 ? null : o.includes(a) ? a : o[0];
}, un = (e) => {
  try {
    new URL(e);
  } catch {
    return !1;
  }
  return !0;
};
var K = /* @__PURE__ */ ((e) => (e.TiledImage = "tiledImage", e.SimpleImage = "simpleImage", e))(K || {});
function et(e, n, r, a, o) {
  if (!e)
    return;
  const i = 1 / n.width;
  a.forEach((l) => {
    if (!l.target)
      return;
    const c = Qe(l.target), { point: s, rect: d, svg: h } = c;
    if (d) {
      const { x: m, y: b, w: g, h: v } = d;
      fn(
        e,
        m * i,
        b * i,
        g * i,
        v * i,
        r,
        o
      );
    }
    if (s) {
      const { x: m, y: b } = s, g = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${m}" cy="${b}" r="20" />
        </svg>
      `;
      Te(e, g, r, i, o);
    }
    h && Te(e, h, r, i, o);
  });
}
function pn(e, n, r) {
  let a, o, i = 40, l = 40;
  n.rect && (a = n.rect.x, o = n.rect.y, i = n.rect.w, l = n.rect.h), n.point && (a = n.point.x, o = n.point.y);
  const c = 1 / e.width;
  return new ie.Rect(
    a * c - i * c / 2 * (r - 1),
    o * c - l * c / 2 * (r - 1),
    i * c * r,
    l * c * r
  );
}
function fn(e, n, r, a, o, i, l) {
  const c = new ie.Rect(n, r, a, o), s = document.createElement("div");
  if (i) {
    const { backgroundColor: d, opacity: h, borderType: m, borderColor: b, borderWidth: g } = i;
    s.style.backgroundColor = d, s.style.opacity = h, s.style.border = `${m} ${g} ${b}`, s.className = l;
  }
  e.addOverlay(s, c);
}
function hn(e) {
  if (!e)
    return null;
  const n = document.createElement("template");
  return n.innerHTML = e.trim(), n.content.children[0];
}
function Te(e, n, r, a, o) {
  const i = hn(n);
  if (i)
    for (const l of i.children)
      tt(e, l, r, a, o);
}
function tt(e, n, r, a, o) {
  var i;
  if (n.nodeName === "#text")
    vn(n);
  else {
    const l = gn(n, r, a), c = an(e);
    c.node().append(l), (i = c._svg) == null || i.setAttribute("class", o), n.childNodes.forEach((s) => {
      tt(e, s, r, a, o);
    });
  }
}
function gn(e, n, r) {
  let a = !1, o = !1, i = !1, l = !1;
  const c = document.createElementNS(
    "http://www.w3.org/2000/svg",
    e.nodeName
  );
  if (e.attributes.length > 0)
    for (let s = 0; s < e.attributes.length; s++) {
      const d = e.attributes[s];
      switch (d.name) {
        case "fill":
          i = !0;
          break;
        case "stroke":
          a = !0;
          break;
        case "stroke-width":
          o = !0;
          break;
        case "fill-opacity":
          l = !0;
          break;
      }
      c.setAttribute(d.name, d.textContent);
    }
  return a || (c.style.stroke = n == null ? void 0 : n.borderColor), o || (c.style.strokeWidth = n == null ? void 0 : n.borderWidth), i || (c.style.fill = n == null ? void 0 : n.backgroundColor), l || (c.style.fillOpacity = n == null ? void 0 : n.opacity), c.setAttribute("transform", `scale(${r})`), c;
}
function vn(e) {
  e.textContent && (e.textContent.includes(`
`) || console.log(
    "nodeName:",
    e.nodeName,
    ", textContent:",
    e.textContent,
    ", childNodes.length",
    e.childNodes.length
  ));
}
const yn = (e) => {
  const n = Array.isArray(e == null ? void 0 : e.service) && (e == null ? void 0 : e.service.length) > 0, r = n ? sn(e == null ? void 0 : e.service) : e == null ? void 0 : e.id, a = n ? K.TiledImage : K.SimpleImage;
  return {
    uri: r,
    imageType: a
  };
}, bn = (e, n) => {
  const r = n ? K.TiledImage : K.SimpleImage;
  return {
    uri: e,
    imageType: r
  };
};
function nt(e, n) {
  if (!e)
    return;
  n.startsWith(".") || (n = "." + n);
  const r = document.querySelectorAll(n);
  r && r.forEach((a) => e.removeOverlay(a));
}
function fe(e, n, r, a) {
  const o = Qe(r), { point: i, rect: l, svg: c } = o;
  if (i || l || c) {
    const s = pn(
      a,
      o,
      n
    );
    e == null || e.viewport.fitBounds(s);
  }
}
function xn(e, n, r, a, o) {
  var l;
  if (!(n != null && n.items) || (n == null ? void 0 : n.items.length) === 0)
    return;
  const i = [];
  n.items.forEach((c) => {
    const s = e.get(c.id);
    typeof s.target == "string" && s.target.startsWith(a.id) && i.push(s);
  }), r && ((l = o.contentSearch) != null && l.overlays) && et(
    r,
    a,
    o.contentSearch.overlays,
    i,
    "content-search-overlay"
  );
}
const de = 209, En = {
  colors: {
    /*
     * Black and dark grays in a light theme.
     * Must contrast to 4.5 or greater with `secondary`.
     */
    primary: "#1a1d1e",
    primaryMuted: "#26292b",
    primaryAlt: "#151718",
    /*
     * Key brand color(s).
     * Must contrast to 4.5 or greater with `secondary`.
     */
    accent: `hsl(${de} 100% 38.2%)`,
    accentMuted: `hsl(${de} 80% 61.8%)`,
    accentAlt: `hsl(${de} 80% 30%)`,
    /*
     * White and light grays in a light theme.
     * Must contrast to 4.5 or greater with `primary` and  `accent`.
     */
    secondary: "#FFFFFF",
    secondaryMuted: "#e6e8eb",
    secondaryAlt: "#c1c8cd"
  },
  fontSizes: {
    1: "12px",
    2: "13px",
    3: "15px",
    4: "17px",
    5: "19px",
    6: "21px",
    7: "27px",
    8: "35px",
    9: "59px"
  },
  lineHeights: {
    1: "12px",
    2: "13px",
    3: "15px",
    4: "17px",
    5: "19px",
    6: "21px",
    7: "27px",
    8: "35px",
    9: "59px"
  },
  sizes: {
    1: "5px",
    2: "10px",
    3: "15px",
    4: "20px",
    5: "25px",
    6: "35px",
    7: "45px",
    8: "65px",
    9: "80px"
  },
  space: {
    1: "5px",
    2: "10px",
    3: "15px",
    4: "20px",
    5: "25px",
    6: "35px",
    7: "45px",
    8: "65px",
    9: "80px"
  },
  radii: {
    1: "4px",
    2: "6px",
    3: "8px",
    4: "12px",
    round: "50%",
    pill: "9999px"
  },
  transitions: {
    all: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)"
  },
  zIndices: {
    1: "100",
    2: "200",
    3: "300",
    4: "400",
    max: "999"
  }
}, we = {
  xxs: "(max-width: 349px)",
  xs: "(max-width: 575px)",
  sm: "(max-width: 767px)",
  md: "(max-width: 991px)",
  lg: "(max-width: 90rem)",
  xl: "(min-width: calc(90rem + 1px))"
}, { styled: f, css: Va, keyframes: Se, createTheme: Ha } = Vt({
  theme: En,
  media: we
}), wn = f("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}), Sn = f("p", {
  fontWeight: "bold",
  fontSize: "x-large"
}), Cn = f("span", {
  fontSize: "medium"
}), rt = ({ error: e }) => {
  const { message: n } = e;
  return /* @__PURE__ */ t.createElement(wn, { role: "alert" }, /* @__PURE__ */ t.createElement(Sn, { "data-testid": "headline" }, "Something went wrong"), n && /* @__PURE__ */ t.createElement(Cn, null, `Error message: ${n}`, " "));
}, ot = f("div", {
  position: "relative",
  zIndex: "0"
}), at = f("div", {
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  overflow: "hidden",
  "@sm": {
    flexDirection: "column"
  }
}), it = f("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  width: "61.8%",
  "@sm": {
    width: "100%"
  }
}), lt = f(be.Trigger, {
  display: "none",
  border: "none",
  padding: "0",
  transition: "$all",
  opacity: "1",
  background: "#6663",
  margin: "1rem 0",
  borderRadius: "6px",
  "&[data-information-panel='false']": {
    opacity: "0",
    marginTop: "-59px"
  },
  "@sm": {
    display: "flex",
    "> span": {
      display: "flex",
      flexGrow: "1",
      fontSize: "0.8333em",
      justifyContent: "center",
      padding: "0.5rem",
      fontFamily: "inherit"
    }
  }
}), st = f(be.Content, {
  width: "100%",
  display: "flex"
}), kn = f("aside", {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  width: "38.2%",
  maxHeight: "100%",
  "@sm": {
    width: "100%"
  }
}), In = f("div", {
  display: "flex",
  flexDirection: "column",
  fontSmooth: "auto",
  webkitFontSmoothing: "antialiased",
  '&[data-absolute-position="true"]': {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: "0"
  },
  "> div": {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    justifyContent: "flex-start",
    height: "100%",
    maxHeight: "100%",
    "@sm": {
      [`& ${at}`]: {
        flexGrow: "1"
      },
      [`& ${it}`]: {
        flexGrow: "0"
      }
    }
  },
  "@sm": {
    padding: "0"
  },
  "&[data-information-panel-open='true']": {
    "@sm": {
      position: "fixed",
      height: "100%",
      width: "100%",
      top: "0",
      left: "0",
      zIndex: "2500000000",
      [`& ${ot}`]: {
        display: "none"
      },
      [`& ${lt}`]: {
        margin: "1rem"
      },
      [`& ${st}`]: {
        height: "100%"
      }
    }
  }
}), $n = f(le.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  flexGrow: "1",
  flexShrink: "0",
  position: "relative",
  zIndex: "1",
  maskImage: "linear-gradient(180deg, rgba(0, 0, 0, 1) calc(100% - 2rem), transparent 100%)",
  "@sm": {
    marginTop: "0.5rem",
    boxShadow: "none"
  }
}), An = f(le.List, {
  display: "flex",
  flexGrow: "0",
  margin: "0 1.618rem",
  borderBottom: "4px solid #6663",
  "@sm": {
    margin: "0 1rem"
  }
}), te = f(le.Trigger, {
  display: "flex",
  position: "relative",
  padding: "0.5rem 1rem",
  background: "none",
  backgroundColor: "transparent",
  fontFamily: "inherit",
  border: "none",
  opacity: "0.7",
  fontSize: "1rem",
  marginRight: "1rem",
  lineHeight: "1rem",
  whiteSpace: "nowrap",
  cursor: "pointer",
  fontWeight: 400,
  transition: "$all",
  "&::after": {
    width: "0",
    height: "4px",
    content: "",
    position: "absolute",
    bottom: "-4px",
    left: "0",
    transition: "$all"
  },
  "&[data-state='active']": {
    opacity: "1",
    fontWeight: 700,
    "&::after": {
      width: "100%",
      backgroundColor: "$accent"
    }
  }
}), ne = f(le.Content, {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  position: "absolute",
  top: "0",
  left: "0",
  "&[data-state='active']": {
    width: "100%",
    height: "calc(100% - 2rem)",
    padding: "1.618rem 0"
  }
}), Tn = ({
  handleScroll: e,
  children: n,
  className: r
}) => /* @__PURE__ */ t.createElement("div", { className: r, onScroll: e }, n), Mn = f(Tn, {
  position: "relative",
  height: "100%",
  width: "100%",
  overflowY: "scroll"
}), ct = {
  position: "relative",
  cursor: "pointer",
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  textAlign: "left",
  margin: "0",
  padding: "0.5rem 1.618rem",
  fontFamily: "inherit",
  lineHeight: "1.25em",
  fontSize: "1rem",
  color: "inherit",
  border: "none",
  background: "none"
}, dt = f("button", {
  textAlign: "left",
  "&:hover": {
    color: "$accent"
  }
}), Ln = f("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), Rn = f("div", {
  ...ct
}), zn = f("div", {
  "&:hover": {
    color: "$accent"
  }
}), Me = ({
  value: e,
  handleClick: n
}) => /* @__PURE__ */ t.createElement(dt, { onClick: n }, e), Fn = ({
  value: e,
  handleClick: n
}) => /* @__PURE__ */ t.createElement(
  zn,
  {
    dangerouslySetInnerHTML: { __html: e },
    onClick: n
  }
), Pn = () => {
  function e(o) {
    return o.map((i) => {
      const l = i.identifier || ae();
      return { ...i, identifier: l };
    });
  }
  function n(o) {
    var s;
    const i = [], l = [], c = e(o);
    for (const d of c) {
      for (; l.length > 0 && l[l.length - 1].end <= d.start; )
        l.pop();
      l.length > 0 ? (l[l.length - 1].children || (l[l.length - 1].children = []), (s = l[l.length - 1].children) == null || s.push(d), l.push(d)) : (i.push(d), l.push(d));
    }
    return i;
  }
  function r(o, i = []) {
    return i.some(
      (l) => o.start >= l.start && o.end <= l.end
    );
  }
  function a(o = []) {
    return o.sort((i, l) => i.start - l.start);
  }
  return {
    addIdentifiersToParsedCues: e,
    createNestedCues: n,
    isChild: r,
    orderCuesByTime: a
  };
}, Le = Se({
  from: { transform: "rotate(360deg)" },
  to: { transform: "rotate(0deg)" }
}), Vn = f(se.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%"
}), mt = f(se.Item, {
  ...ct,
  "@sm": {
    padding: "0.5rem 1rem",
    fontSize: "0.8333rem"
  },
  "&::before": {
    content: "",
    width: "12px",
    height: "12px",
    borderRadius: "12px",
    position: "absolute",
    backgroundColor: "$primaryMuted",
    opacity: "0",
    left: "8px",
    marginTop: "3px",
    boxSizing: "content-box",
    "@sm": {
      content: "unset"
    }
  },
  "&::after": {
    content: "",
    width: "4px",
    height: "6px",
    position: "absolute",
    backgroundColor: "$secondary",
    opacity: "0",
    clipPath: "polygon(100% 50%, 0 100%, 0 0)",
    left: "13px",
    marginTop: "6px",
    boxSizing: "content-box",
    "@sm": {
      content: "unset"
    }
  },
  strong: {
    marginLeft: "1rem"
  },
  "&:hover": {
    color: "$accent",
    "&::before": {
      backgroundColor: "$accent",
      opacity: "1"
    },
    "&::after": {
      content: "",
      width: "4px",
      height: "6px",
      position: "absolute",
      backgroundColor: "$secondary",
      clipPath: "polygon(100% 50%, 0 100%, 0 0)",
      opacity: "1"
    }
  },
  "&[aria-checked='true']": {
    backgroundColor: "#6663",
    "&::before": {
      content: "",
      width: "6px",
      height: "6px",
      position: "absolute",
      backgroundColor: "transparent",
      border: "3px solid $accentMuted",
      borderRadius: "12px",
      left: "8px",
      marginTop: "4px",
      opacity: "1",
      animation: "1s linear infinite",
      animationName: Le,
      boxSizing: "content-box",
      "@sm": {
        content: "unset"
      }
    },
    "&::after": {
      content: "",
      width: "6px",
      height: "6px",
      position: "absolute",
      backgroundColor: "transparent",
      border: "3px solid $accent",
      clipPath: "polygon(100% 0, 100% 100%, 0 0)",
      borderRadius: "12px",
      left: "8px",
      marginTop: "4px",
      opacity: "1",
      animation: "1.5s linear infinite",
      animationName: Le,
      boxSizing: "content-box",
      "@sm": {
        content: "unset"
      }
    }
  }
}), Hn = 750, Bn = (e) => {
  for (; e && e !== document.body; ) {
    const n = window.getComputedStyle(e).overflowY;
    if (n !== "visible" && n !== "hidden" && e.scrollHeight > e.clientHeight)
      return e;
    e = e.parentNode;
  }
  return null;
}, On = ({ label: e, start: n, end: r }) => {
  var g, v;
  const a = z(), {
    configOptions: o,
    isAutoScrollEnabled: i,
    isUserScrolling: l
  } = I(), c = (v = (g = o == null ? void 0 : o.informationPanel) == null ? void 0 : g.vtt) == null ? void 0 : v.autoScroll, [s, d] = C(!1), h = ye(null), m = document.getElementById(
    "clover-iiif-video"
  );
  w(() => (m == null || m.addEventListener("timeupdate", () => {
    const { currentTime: u } = m;
    d(n <= u && u < r);
  }), () => document.removeEventListener("timeupdate", () => {
  })), [r, n, m]), w(() => {
    var p;
    const u = (y) => {
      a({ type: "updateAutoScrolling", isAutoScrolling: !0 }), y(), setTimeout(
        () => a({ type: "updateAutoScrolling", isAutoScrolling: !1 }),
        Hn
      );
    };
    if (i && s && h.current && !l) {
      const y = h.current;
      if (y && y instanceof HTMLElement) {
        const x = Bn(y);
        if (x && x instanceof HTMLElement) {
          let k;
          switch ((p = c == null ? void 0 : c.settings) == null ? void 0 : p.block) {
            case "center":
              const A = x.getBoundingClientRect();
              k = y.offsetTop + y.offsetHeight - Math.floor((A.bottom - A.top) / 2);
              break;
            case "end":
              k = y.offsetTop + y.offsetHeight - (x.clientHeight - y.clientHeight) + 2;
              break;
            default:
              k = y.offsetTop - 2;
              break;
          }
          u(
            () => {
              var A;
              return x.scrollTo({
                top: k,
                left: 0,
                behavior: (A = c == null ? void 0 : c.settings) == null ? void 0 : A.behavior
              });
            }
          );
        }
      }
    }
  }, [
    c,
    s,
    l,
    i,
    a
  ]);
  const b = () => {
    m && (m.pause(), m.currentTime = n, m.play());
  };
  return /* @__PURE__ */ t.createElement(
    mt,
    {
      ref: h,
      "aria-checked": s,
      "data-testid": "information-panel-cue",
      onClick: b,
      value: e
    },
    e,
    /* @__PURE__ */ t.createElement("strong", null, Ge(n))
  );
}, Dn = f("ul", {
  listStyle: "none",
  paddingLeft: "1rem",
  position: "relative",
  "&&:first-child": {
    paddingLeft: "0"
  },
  "& li ul": {
    [`& ${mt}`]: {
      backgroundColor: "unset",
      "&::before": {
        content: "none"
      },
      "&::after": {
        content: "none"
      }
    }
  },
  "&:first-child": {
    margin: "0 0 1.618rem"
  }
}), ut = ({ items: e }) => /* @__PURE__ */ t.createElement(Dn, null, e.map((n) => {
  const { text: r, start: a, end: o, children: i, identifier: l } = n;
  return /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement(On, { label: r, start: a, end: o }), i && /* @__PURE__ */ t.createElement(ut, { items: i }));
})), Nn = ({
  label: e,
  vttUri: n
}) => {
  const [r, a] = t.useState([]), { createNestedCues: o, orderCuesByTime: i } = Pn(), [l, c] = t.useState();
  return w(
    () => {
      n && fetch(n, {
        headers: {
          "Content-Type": "text/plain",
          Accept: "application/json"
        }
      }).then((s) => s.text()).then((s) => {
        const d = Bt(s).cues, h = i(d), m = o(h);
        a(m);
      }).catch((s) => {
        console.error(n, s.toString()), c(s);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n]
  ), /* @__PURE__ */ t.createElement(
    Vn,
    {
      "data-testid": "annotation-item-vtt",
      "aria-label": `navigate ${X(e, "en")}`
    },
    l && /* @__PURE__ */ t.createElement("div", { "data-testid": "error-message" }, "Network Error: ", l.toString()),
    /* @__PURE__ */ t.createElement(ut, { items: r })
  );
}, Wn = ({
  caption: e,
  handleClick: n,
  imageUri: r
}) => /* @__PURE__ */ t.createElement(dt, { onClick: n }, /* @__PURE__ */ t.createElement("img", { src: r, alt: `A visual annotation for ${e}` }), /* @__PURE__ */ t.createElement("span", null, e)), _n = ({ annotation: e }) => {
  var g, v;
  const { target: n } = e, r = I(), { openSeadragonViewer: a, vault: o, activeCanvas: i, configOptions: l } = r, c = e.body.map((u) => o.get(u.id)), s = ((g = c.find((u) => u.format)) == null ? void 0 : g.format) || "", d = ((v = c.find((u) => u.value)) == null ? void 0 : v.value) || "", h = o.get({
    id: i,
    type: "Canvas"
  });
  function m() {
    var p;
    if (!n)
      return;
    const u = ((p = l.annotationOverlays) == null ? void 0 : p.zoomLevel) || 1;
    fe(a, u, n, h);
  }
  function b() {
    var u, p;
    switch (s) {
      case "text/plain":
        return /* @__PURE__ */ t.createElement(
          Me,
          {
            value: d,
            handleClick: m
          }
        );
      case "text/html":
        return /* @__PURE__ */ t.createElement(
          Fn,
          {
            value: d,
            handleClick: m
          }
        );
      case "text/vtt":
        return /* @__PURE__ */ t.createElement(
          Nn,
          {
            label: c[0].label,
            vttUri: c[0].id || ""
          }
        );
      case ((u = s.match(/^image\//)) == null ? void 0 : u.input):
        const y = ((p = c.find((x) => {
          var k;
          return !((k = x.id) != null && k.includes("vault://"));
        })) == null ? void 0 : p.id) || "";
        return /* @__PURE__ */ t.createElement(
          Wn,
          {
            caption: d,
            handleClick: m,
            imageUri: y
          }
        );
      default:
        return /* @__PURE__ */ t.createElement(
          Me,
          {
            value: d,
            handleClick: m
          }
        );
    }
  }
  return /* @__PURE__ */ t.createElement(Rn, null, b());
}, jn = ({ annotationPage: e }) => {
  var o;
  const n = I(), { vault: r } = n;
  if (!e || !e.items || ((o = e.items) == null ? void 0 : o.length) === 0)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const a = e.items.map((i) => r.get(i.id));
  return a ? /* @__PURE__ */ t.createElement(Ln, { "data-testid": "annotation-page" }, a == null ? void 0 : a.map((i) => /* @__PURE__ */ t.createElement(_n, { key: i.id, annotation: i }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
}, Gn = f("button", {
  textAlign: "left",
  "&:hover": {
    color: "$accent"
  }
}), Un = f("li", {
  margin: "0.25rem 0"
}), qn = f("ol", {
  listStyleType: "auto",
  marginBottom: "1rem",
  listStylePosition: "inside"
}), Zn = f("div", {
  margin: "0.5rem 1.618rem"
}), Xn = f("div", {
  fontWeight: "bold"
}), Yn = f("div", {
  marginBottom: "1rem"
}), Jn = ({
  value: e,
  handleClick: n,
  target: r,
  canvas: a
}) => /* @__PURE__ */ t.createElement(
  Gn,
  {
    onClick: n,
    "data-target": r,
    "data-canvas": a
  },
  e
), Kn = ({
  annotation: e,
  activeContentSearchTarget: n,
  setActiveContentSearchTarget: r
}) => {
  var k, A, R;
  const a = z(), o = I(), {
    openSeadragonViewer: i,
    vault: l,
    contentSearchVault: c,
    activeCanvas: s,
    configOptions: d,
    OSDImageLoaded: h
  } = o, m = l.get({
    id: s,
    type: "Canvas"
  }), g = ((k = e.body.map(($) => c.get($.id)).find(($) => $.value)) == null ? void 0 : k.value) || "";
  let v;
  e.target && typeof e.target == "string" && (v = e.target);
  let u;
  if (v) {
    const $ = v.split("#xywh");
    $.length > 1 && (u = $[0]);
  }
  const p = ((R = (A = d.contentSearch) == null ? void 0 : A.overlays) == null ? void 0 : R.zoomLevel) || 1;
  w(() => {
    h && i && e.target && e.target == n && fe(i, p, v, m);
  }, [i, h]);
  function y($) {
    if (!i)
      return;
    const P = JSON.parse($.target.dataset.target), V = $.target.dataset.canvas;
    s === V ? fe(i, p, v, m) : (a({
      type: "updateOSDImageLoaded",
      OSDImageLoaded: !1
    }), a({
      type: "updateActiveCanvas",
      canvasId: V
    }), r(P));
  }
  const x = JSON.stringify(v);
  return /* @__PURE__ */ t.createElement(Un, null, /* @__PURE__ */ t.createElement(
    Jn,
    {
      target: x,
      canvas: u,
      value: g,
      handleClick: y
    }
  ));
}, Qn = ({ annotationPage: e }) => {
  var m, b, g;
  const n = I(), { contentSearchVault: r, configOptions: a } = n, [o, i] = C(), l = (m = a.contentSearch) == null ? void 0 : m.searchResultsLimit, c = (b = a.localeText) == null ? void 0 : b.contentSearch;
  function s(v) {
    const u = {};
    return v.items.forEach((p) => {
      const y = r.get(
        p.id
      );
      let x = "";
      if (y.label) {
        const k = X(y.label);
        k && (x = k[0]);
      }
      u[x] == null && (u[x] = []), u[x].push(y);
    }), u;
  }
  function d(v) {
    return (l ? v.slice(0, l) : v).map((p, y) => /* @__PURE__ */ t.createElement(
      Kn,
      {
        key: y,
        annotation: p,
        activeContentSearchTarget: o,
        setActiveContentSearchTarget: i
      }
    ));
  }
  function h(v) {
    if (l) {
      const u = v.length - l;
      if (u > 0)
        return /* @__PURE__ */ t.createElement(Yn, null, u, " ", c == null ? void 0 : c.moreResults);
    }
  }
  return !e || !e.items || ((g = e.items) == null ? void 0 : g.length) === 0 ? /* @__PURE__ */ t.createElement("p", null, c == null ? void 0 : c.noSearchResults) : /* @__PURE__ */ t.createElement(t.Fragment, null, Object.entries(s(e)).map(
    ([v, u], p) => /* @__PURE__ */ t.createElement("div", { key: p }, /* @__PURE__ */ t.createElement(Xn, { className: "content-search-results-title" }, v), /* @__PURE__ */ t.createElement(qn, { className: "content-search-results" }, d(u)), h(u))
  ));
}, er = f("div", {
  ".content-search-form": { display: "flex", marginBottom: "1rem" },
  input: {
    padding: ".25rem",
    marginRight: "1rem"
  }
}), tr = f("button", {
  display: "flex",
  background: "none",
  border: "none",
  width: "2rem",
  height: "2rem",
  padding: "0",
  margin: "0",
  fontWeight: "700",
  borderRadius: "2rem",
  backgroundColor: "$accent",
  color: "$secondary",
  cursor: "pointer",
  boxSizing: "content-box",
  transition: "$all",
  svg: {
    height: "60%",
    width: "60%",
    padding: "20%",
    fill: "$secondary",
    stroke: "$secondary",
    opacity: "1",
    filter: "drop-shadow(5px 5px 5px #000D)",
    boxSizing: "inherit",
    transition: "$all"
  },
  "&:disabled": {
    backgroundColor: "transparent",
    boxShadow: "none",
    svg: { opacity: "0.25" }
  }
}), nr = ({
  searchServiceUrl: e,
  setContentSearchResource: n,
  setLoading: r
}) => {
  var u;
  const [a, o] = C(), [i, l] = C("1"), c = I(), { contentSearchVault: s, openSeadragonViewer: d, configOptions: h } = c, m = (u = h.localeText) == null ? void 0 : u.contentSearch;
  async function b(p) {
    p.preventDefault();
    const y = m == null ? void 0 : m.tabLabel;
    if (d && e) {
      if (!a || a.trim() === "") {
        n({
          label: { none: [y] }
        });
        return;
      }
      r(!0), Je(s, e, y, {
        q: a,
        exact: i
      }).then((x) => {
        n(x), r(!1);
      });
    }
  }
  const g = (p) => {
    p.preventDefault(), o(p.target.value);
  }, v = (p) => {
    console.log("set exact", p.target.checked), l(p.target.checked ? "1" : "0");
  };
  return /* @__PURE__ */ t.createElement(er, null, /* @__PURE__ */ t.createElement(q.Root, { onSubmit: b, className: "content-search-form" }, /* @__PURE__ */ t.createElement(
    q.Field,
    {
      className: "FormField",
      name: "searchTerms",
      onChange: g
    },
    /* @__PURE__ */ t.createElement(q.Control, { placeholder: m == null ? void 0 : m.formPlaceholder })
  ), /* @__PURE__ */ t.createElement(q.Submit, { asChild: !0 }, /* @__PURE__ */ t.createElement(tr, { type: "submit" }, /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Search"), /* @__PURE__ */ t.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" })))), /* @__PURE__ */ t.createElement(q.Field, { name: "exactMode", onChange: v }, /* @__PURE__ */ t.createElement(q.Control, { asChild: !0 }, /* @__PURE__ */ t.createElement("p", { style: { margin: "0 0 0 10px" } }, /* @__PURE__ */ t.createElement("input", { type: "checkbox", value: "1", name: "exactMode" }), " Exact?")))));
}, rr = ({
  searchServiceUrl: e,
  setContentSearchResource: n,
  activeCanvas: r,
  annotationPage: a
}) => {
  const [o, i] = C(!1);
  return /* @__PURE__ */ t.createElement(Zn, null, /* @__PURE__ */ t.createElement(
    nr,
    {
      searchServiceUrl: e,
      setContentSearchResource: n,
      activeCanvas: r,
      setLoading: i
    }
  ), !o && /* @__PURE__ */ t.createElement(Qn, { annotationPage: a }), o && /* @__PURE__ */ t.createElement("span", null, "Loading..."));
}, or = f("div", {
  padding: " 0 1.618rem 2rem",
  display: "flex",
  flexDirection: "column",
  overflow: "scroll",
  position: "absolute",
  fontWeight: "400",
  fontSize: "1rem",
  zIndex: "0",
  img: {
    maxWidth: "100px",
    maxHeight: "100px",
    objectFit: "contain",
    color: "transparent",
    margin: "0 0 1rem",
    borderRadius: "3px",
    backgroundColor: "$secondaryMuted"
  },
  video: {
    display: "none"
  },
  "a, a:visited": {
    color: "$accent"
  },
  p: {
    fontSize: "1rem",
    lineHeight: "1.45em",
    margin: "0"
  },
  dl: {
    margin: "0",
    dt: {
      fontWeight: "700",
      margin: "1rem 0 0.25rem"
    },
    dd: {
      margin: "0"
    }
  },
  ".manifest-property-title": {
    fontWeight: "700",
    margin: "1rem 0 0.25rem"
  },
  "ul, ol": {
    padding: "0",
    margin: "0",
    li: {
      fontSize: "1rem",
      lineHeight: "1.45em",
      listStyle: "none",
      margin: "0.25rem 0 0.25rem"
    }
  }
}), ar = f("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), pt = (e, n = "none") => {
  if (!e)
    return null;
  if (typeof e == "string")
    return [e];
  if (!e[n]) {
    const r = Object.getOwnPropertyNames(e);
    if (r.length > 0)
      return e[r[0]];
  }
  return !e[n] || !Array.isArray(e[n]) ? null : e[n];
}, F = (e, n = "none", r = ", ") => {
  const a = pt(e, n);
  return Array.isArray(a) ? a.join(`${r}`) : a;
};
function ir(e) {
  return { __html: lr(e) };
}
function O(e, n) {
  const r = Object.keys(e).filter(
    (o) => n.includes(o) ? null : o
  ), a = new Object();
  return r.forEach((o) => {
    a[o] = e[o];
  }), a;
}
function lr(e) {
  return Ot(e, {
    allowedAttributes: {
      a: ["href"],
      img: ["alt", "src", "height", "width"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedTags: [
      "a",
      "b",
      "br",
      "i",
      "img",
      "p",
      "small",
      "span",
      "sub",
      "sup"
    ]
  });
}
const sr = f("span", {}), j = (e) => {
  const { as: n, label: r } = e, o = O(e, ["as", "label"]);
  return /* @__PURE__ */ t.createElement(sr, { as: n, ...o }, F(r, o.lang));
}, cr = (e, n = "200,", r = "full") => {
  Array.isArray(e) && (e = e[0]);
  const { id: a, service: o } = e;
  let i;
  if (!o)
    return a;
  if (Array.isArray(e.service) && e.service.length > 0 && (i = o[0]), i) {
    if (i["@id"])
      return `${i["@id"]}/${r}/${n}/0/default.jpg`;
    if (i.id)
      return `${i.id}/${r}/${n}/0/default.jpg`;
  }
}, Re = f("img", { objectFit: "cover" }), dr = (e) => {
  const n = ye(null), { contentResource: r, altAsLabel: a, region: o = "full" } = e;
  let i;
  a && (i = F(a));
  const c = O(e, ["contentResource", "altAsLabel"]), { type: s, id: d, width: h = 200, height: m = 200, duration: b } = r;
  w(() => {
    if (!d && !n.current || ["Image"].includes(s) || !d.includes("m3u8"))
      return;
    const u = new B();
    return n.current && (u.attachMedia(n.current), u.on(B.Events.MEDIA_ATTACHED, function() {
      u.loadSource(d);
    })), u.on(B.Events.ERROR, function(p, y) {
      if (y.fatal)
        switch (y.type) {
          case B.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${p} network error encountered, try to recover`
            ), u.startLoad();
            break;
          case B.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${p} media error encountered, try to recover`
            ), u.recoverMediaError();
            break;
          default:
            u.destroy();
            break;
        }
    }), () => {
      u && (u.detachMedia(), u.destroy());
    };
  }, [d, s]);
  const g = oe(() => {
    if (!n.current)
      return;
    let u = 0, p = 30;
    if (b && (p = b), !d.split("#t=") && b && (u = b * 0.1), d.split("#t=").pop()) {
      const x = d.split("#t=").pop();
      x && (u = parseInt(x.split(",")[0]));
    }
    const y = n.current;
    y.autoplay = !0, y.currentTime = u, setTimeout(() => g(), p * 1e3);
  }, [b, d]);
  w(() => g(), [g]);
  const v = cr(
    r,
    `${h},${m}`,
    o
  );
  switch (s) {
    case "Image":
      return /* @__PURE__ */ t.createElement(
        Re,
        {
          as: "img",
          alt: i,
          css: { width: h, height: m },
          key: d,
          src: v,
          ...c
        }
      );
    case "Video":
      return /* @__PURE__ */ t.createElement(
        Re,
        {
          as: "video",
          css: { width: h, height: m },
          disablePictureInPicture: !0,
          key: d,
          loop: !0,
          muted: !0,
          onPause: g,
          ref: n,
          src: d
        }
      );
    default:
      return console.warn(
        `Resource type: ${s} is not valid or not yet supported in Primitives.`
      ), /* @__PURE__ */ t.createElement(t.Fragment, null);
  }
}, mr = f("a", {}), ur = (e) => {
  const { children: n, homepage: r } = e, o = O(e, ["children", "homepage"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, r && r.map((i) => {
    const l = F(
      i.label,
      o.lang
    );
    return /* @__PURE__ */ t.createElement(
      mr,
      {
        "aria-label": n ? l : void 0,
        href: i.id,
        key: i.id,
        ...o
      },
      n || l
    );
  }));
}, pr = {
  delimiter: ", "
}, Ce = Mt(void 0), ft = () => {
  const e = Lt(Ce);
  if (e === void 0)
    throw new Error(
      "usePrimitivesContext must be used with a PrimitivesProvider"
    );
  return e;
}, ke = ({
  children: e,
  initialState: n = pr
}) => {
  const r = fr(n, "delimiter");
  return /* @__PURE__ */ t.createElement(Ce.Provider, { value: { delimiter: r } }, e);
}, fr = (e, n) => Object.hasOwn(e, n) ? e[n].toString() : void 0, hr = f("span", {}), ze = (e) => {
  const { as: n, markup: r } = e, { delimiter: a } = ft();
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const i = O(e, ["as", "markup"]), l = ir(
    F(r, i.lang, a)
  );
  return /* @__PURE__ */ t.createElement(hr, { as: n, ...i, dangerouslySetInnerHTML: l });
}, ht = (e) => t.useContext(Ce) ? /* @__PURE__ */ t.createElement(ze, { ...e }) : /* @__PURE__ */ t.createElement(ke, null, /* @__PURE__ */ t.createElement(ze, { ...e })), gr = ({ as: e = "dd", lang: n, value: r }) => /* @__PURE__ */ t.createElement(ht, { markup: r, as: e, lang: n }), vr = f("span", {}), yr = ({
  as: e = "dd",
  customValueContent: n,
  lang: r,
  value: a
}) => {
  var l;
  const { delimiter: o } = ft(), i = (l = pt(a, r)) == null ? void 0 : l.map((c) => Rt(n, {
    value: c
  }));
  return /* @__PURE__ */ t.createElement(vr, { as: e, lang: r }, i == null ? void 0 : i.map((c, s) => [
    s > 0 && `${o}`,
    /* @__PURE__ */ t.createElement(zt, { key: s }, c)
  ]));
}, gt = (e) => {
  var c;
  const { item: n, lang: r, customValueContent: a } = e, { label: o, value: i } = n, l = (c = F(o)) == null ? void 0 : c.replace(" ", "-").toLowerCase();
  return /* @__PURE__ */ t.createElement("div", { role: "group", "data-label": l }, /* @__PURE__ */ t.createElement(j, { as: "dt", label: o, lang: r }), a ? /* @__PURE__ */ t.createElement(
    yr,
    {
      as: "dd",
      customValueContent: a,
      value: i,
      lang: r
    }
  ) : /* @__PURE__ */ t.createElement(gr, { as: "dd", value: i, lang: r }));
};
function br(e, n) {
  const r = n.filter((a) => {
    const { matchingLabel: o } = a, i = Object.keys(a.matchingLabel)[0], l = F(o, i);
    if (F(e, i) === l)
      return !0;
  }).map((a) => a.Content);
  if (Array.isArray(r))
    return r[0];
}
const xr = f("dl", {}), Er = (e) => {
  const { as: n, customValueContent: r, metadata: a } = e;
  if (!Array.isArray(a))
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const o = qe(e, "customValueDelimiter"), l = O(e, [
    "as",
    "customValueContent",
    "customValueDelimiter",
    "metadata"
  ]);
  return /* @__PURE__ */ t.createElement(
    ke,
    {
      ...typeof o == "string" ? { initialState: { delimiter: o } } : void 0
    },
    a.length > 0 && /* @__PURE__ */ t.createElement(xr, { as: n, ...l }, a.map((c, s) => {
      const d = r ? br(c.label, r) : void 0;
      return /* @__PURE__ */ t.createElement(
        gt,
        {
          customValueContent: d,
          item: c,
          key: s,
          lang: l == null ? void 0 : l.lang
        }
      );
    }))
  );
};
f("li", {});
f("ul", {});
const wr = f("li", {}), Sr = f("ul", {}), Cr = (e) => {
  const { as: n, rendering: r } = e, o = O(e, ["as", "rendering"]);
  return /* @__PURE__ */ t.createElement(Sr, { as: n }, r && r.map((i) => {
    const l = F(
      i.label,
      o.lang
    );
    return /* @__PURE__ */ t.createElement(wr, { key: i.id }, /* @__PURE__ */ t.createElement("a", { href: i.id, ...o, target: "_blank" }, l || i.id));
  }));
}, kr = f("dl", {}), Ir = (e) => {
  const { as: n, requiredStatement: r } = e;
  if (!r)
    return /* @__PURE__ */ t.createElement(t.Fragment, null);
  const a = qe(e, "customValueDelimiter"), i = O(e, ["as", "customValueDelimiter", "requiredStatement"]);
  return /* @__PURE__ */ t.createElement(
    ke,
    {
      ...typeof a == "string" ? { initialState: { delimiter: a } } : void 0
    },
    /* @__PURE__ */ t.createElement(kr, { as: n, ...i }, /* @__PURE__ */ t.createElement(gt, { item: r, lang: i.lang }))
  );
}, $r = f("li", {}), Ar = f("ul", {}), Tr = (e) => {
  const { as: n, seeAlso: r } = e, o = O(e, ["as", "seeAlso"]);
  return /* @__PURE__ */ t.createElement(Ar, { as: n }, r && r.map((i) => {
    const l = F(
      i.label,
      o.lang
    );
    return /* @__PURE__ */ t.createElement($r, { key: i.id }, /* @__PURE__ */ t.createElement("a", { href: i.id, ...o }, l || i.id));
  }));
}, Mr = (e) => {
  const { as: n, summary: r } = e, o = O(e, ["as", "customValueDelimiter", "summary"]);
  return /* @__PURE__ */ t.createElement(ht, { as: n, markup: r, ...o });
}, vt = (e) => {
  const { thumbnail: n, region: r } = e, o = O(e, ["thumbnail"]);
  return /* @__PURE__ */ t.createElement(t.Fragment, null, n && n.map((i) => /* @__PURE__ */ t.createElement(
    dr,
    {
      contentResource: i,
      key: i.id,
      region: r,
      ...o
    }
  )));
}, Lr = ({
  homepage: e
}) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Homepage"), /* @__PURE__ */ t.createElement(ur, { homepage: e })), Rr = ({
  id: e,
  htmlLabel: n,
  parent: r = "manifest"
}) => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, n), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank", id: `iiif-${r}-id` }, e)), zr = ({
  metadata: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Er, { metadata: e, id: `iiif-${n}-metadata` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), Fr = ({
  rendering: e
}) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Alternate formats"), /* @__PURE__ */ t.createElement(Cr, { rendering: e })), Pr = ({
  requiredStatement: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  Ir,
  {
    requiredStatement: e,
    id: `iiif-${n}-required-statement`
  }
)) : /* @__PURE__ */ t.createElement(t.Fragment, null), Vr = ({ rights: e }) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "Rights"), /* @__PURE__ */ t.createElement("a", { href: e, target: "_blank" }, e)) : /* @__PURE__ */ t.createElement(t.Fragment, null), Hr = ({ seeAlso: e }) => (e == null ? void 0 : e.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("span", { className: "manifest-property-title" }, "See Also"), /* @__PURE__ */ t.createElement(Tr, { seeAlso: e })), Br = ({
  summary: e,
  parent: n = "manifest"
}) => e ? /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Mr, { summary: e, as: "p", id: `iiif-${n}-summary` })) : /* @__PURE__ */ t.createElement(t.Fragment, null), Or = ({
  label: e,
  thumbnail: n
}) => (n == null ? void 0 : n.length) === 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  vt,
  {
    altAsLabel: e || { none: ["resource"] },
    thumbnail: n,
    style: { backgroundColor: "#6663", objectFit: "cover" }
  }
)), Dr = () => {
  const e = I(), { activeManifest: n, vault: r } = e, [a, o] = C(), [i, l] = C([]), [c, s] = C([]), [d, h] = C([]), [m, b] = C([]);
  return w(() => {
    var v, u, p, y;
    const g = r.get(n);
    o(g), ((v = g.homepage) == null ? void 0 : v.length) > 0 && l(r.get(g.homepage)), ((u = g.seeAlso) == null ? void 0 : u.length) > 0 && s(r.get(g.seeAlso)), ((p = g.rendering) == null ? void 0 : p.length) > 0 && h(r.get(g.rendering)), ((y = g.thumbnail) == null ? void 0 : y.length) > 0 && b(r.get(g.thumbnail));
  }, [n, r]), a ? /* @__PURE__ */ t.createElement(ar, null, /* @__PURE__ */ t.createElement(or, null, /* @__PURE__ */ t.createElement(Or, { thumbnail: m, label: a.label }), /* @__PURE__ */ t.createElement(Br, { summary: a.summary }), /* @__PURE__ */ t.createElement(zr, { metadata: a.metadata }), /* @__PURE__ */ t.createElement(Pr, { requiredStatement: a.requiredStatement }), /* @__PURE__ */ t.createElement(Vr, { rights: a.rights }), /* @__PURE__ */ t.createElement(
    Lr,
    {
      homepage: i
    }
  ), /* @__PURE__ */ t.createElement(
    Hr,
    {
      seeAlso: c
    }
  ), /* @__PURE__ */ t.createElement(
    Fr,
    {
      rendering: d
    }
  ), /* @__PURE__ */ t.createElement(Rr, { id: a.id, htmlLabel: "IIIF Manifest" }))) : /* @__PURE__ */ t.createElement(t.Fragment, null);
};
function Nr(e) {
  const n = [];
  return e.forEach((r) => {
    var a;
    (a = r.informationPanel) != null && a.component && n.push(r);
  }), { pluginsWithInfoPanel: n };
}
const Wr = 1500, _r = ({
  activeCanvas: e,
  annotationResources: n,
  searchServiceUrl: r,
  setContentSearchResource: a,
  contentSearchResource: o
}) => {
  const i = z(), l = I(), {
    isAutoScrolling: c,
    configOptions: { informationPanel: s },
    configOptions: d,
    isUserScrolling: h,
    vault: m,
    plugins: b,
    activeManifest: g,
    openSeadragonViewer: v
  } = l, u = m.get({
    id: e,
    type: "Canvas"
  }), [p, y] = C(), x = s == null ? void 0 : s.renderAbout, k = s == null ? void 0 : s.renderAnnotation, A = s == null ? void 0 : s.renderContentSearch, { pluginsWithInfoPanel: R } = Nr(b);
  function $(S, T) {
    var D, N;
    const H = (D = S == null ? void 0 : S.informationPanel) == null ? void 0 : D.component;
    return H === void 0 ? /* @__PURE__ */ t.createElement(t.Fragment, null) : /* @__PURE__ */ t.createElement(ne, { key: T, value: S.id }, /* @__PURE__ */ t.createElement(
      H,
      {
        ...(N = S == null ? void 0 : S.informationPanel) == null ? void 0 : N.componentProps,
        activeManifest: g,
        canvas: u,
        viewerConfigOptions: d,
        openSeadragonViewer: v,
        useViewerDispatch: z,
        useViewerState: I
      }
    ));
  }
  w(() => {
    if (!p)
      if (s != null && s.defaultTab) {
        const S = ["manifest-about", "manifest-content-search"];
        u.annotations.length > 0 && u.annotations.forEach(
          (T) => S.push(T.id)
        ), S.includes(s == null ? void 0 : s.defaultTab) ? y(s.defaultTab) : y("manifest-about");
      } else
        x ? y("manifest-about") : A ? y("manifest-content-search") : n && (n == null ? void 0 : n.length) > 0 && y(n[0].id);
  }, [
    s == null ? void 0 : s.defaultTab,
    e,
    p,
    x,
    A,
    n,
    o,
    u == null ? void 0 : u.annotations,
    b
  ]);
  function P() {
    if (!c) {
      clearTimeout(h);
      const S = setTimeout(() => {
        i({
          type: "updateUserScrolling",
          isUserScrolling: void 0
        });
      }, Wr);
      i({
        type: "updateUserScrolling",
        isUserScrolling: S
      });
    }
  }
  const V = (S) => {
    y(S);
  };
  return /* @__PURE__ */ t.createElement(
    $n,
    {
      "data-testid": "information-panel",
      defaultValue: p,
      onValueChange: V,
      orientation: "horizontal",
      value: p,
      className: "clover-viewer-information-panel"
    },
    /* @__PURE__ */ t.createElement(An, { "aria-label": "select chapter", "data-testid": "information-panel-list" }, A && o && /* @__PURE__ */ t.createElement(te, { value: "manifest-content-search" }, /* @__PURE__ */ t.createElement(j, { label: o.label })), k && n && n.map((S, T) => /* @__PURE__ */ t.createElement(te, { key: T, value: S.id }, /* @__PURE__ */ t.createElement(j, { label: S.label }))), R && R.map((S, T) => {
      var H;
      return /* @__PURE__ */ t.createElement(te, { key: T, value: S.id }, /* @__PURE__ */ t.createElement(
        j,
        {
          label: (H = S.informationPanel) == null ? void 0 : H.label
        }
      ));
    }), x && /* @__PURE__ */ t.createElement(te, { value: "manifest-about" }, "About")),
    /* @__PURE__ */ t.createElement(Mn, { handleScroll: P }, A && o && /* @__PURE__ */ t.createElement(ne, { value: "manifest-content-search" }, /* @__PURE__ */ t.createElement(
      rr,
      {
        searchServiceUrl: r,
        setContentSearchResource: a,
        activeCanvas: e,
        annotationPage: o
      }
    )), k && n && n.map((S) => /* @__PURE__ */ t.createElement(ne, { key: S.id, value: S.id }, /* @__PURE__ */ t.createElement(jn, { annotationPage: S }))), R && R.map(
      (S, T) => $(S, T)
    ), x && /* @__PURE__ */ t.createElement(ne, { value: "manifest-about" }, /* @__PURE__ */ t.createElement(Dr, null)))
  );
}, yt = f("div", {
  position: "absolute",
  right: "1rem",
  top: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: "1"
}), jr = f("input", {
  flexGrow: "1",
  border: "none",
  backgroundColor: "$secondaryMuted",
  color: "$primary",
  marginRight: "1rem",
  height: "2rem",
  padding: "0 1rem",
  borderRadius: "2rem",
  fontFamily: "inherit",
  fontSize: "1rem",
  lineHeight: "1rem",
  boxShadow: "inset 1px 1px 2px #0003",
  "&::placeholder": {
    color: "$primaryMuted"
  }
}), me = f("button", {
  display: "flex",
  background: "none",
  border: "none",
  width: "2rem !important",
  height: "2rem !important",
  padding: "0",
  margin: "0",
  fontWeight: "700",
  borderRadius: "2rem",
  backgroundColor: "$accent",
  color: "$secondary",
  cursor: "pointer",
  boxSizing: "content-box !important",
  transition: "$all",
  svg: {
    height: "60%",
    width: "60%",
    padding: "20%",
    fill: "$secondary",
    stroke: "$secondary",
    opacity: "1",
    filter: "drop-shadow(5px 5px 5px #000D)",
    boxSizing: "inherit",
    transition: "$all"
  },
  "&:disabled": {
    backgroundColor: "transparent",
    boxShadow: "none",
    svg: { opacity: "0.25" }
  }
}), Gr = f("div", {
  display: "flex",
  marginRight: "0.618rem",
  backgroundColor: "$accentAlt",
  borderRadius: "2rem",
  boxShadow: "5px 5px 5px #0003",
  color: "$secondary",
  alignItems: "center",
  "> span": {
    display: "flex",
    margin: "0 0.5rem",
    fontSize: "0.7222rem"
  }
}), Ur = f("div", {
  display: "flex",
  position: "relative",
  zIndex: "1",
  width: "100%",
  padding: "0",
  transition: "$all",
  variants: {
    isToggle: {
      true: {
        paddingTop: "2.618rem",
        [`& ${yt}`]: {
          width: "calc(100% - 2rem)",
          "@sm": {
            width: "calc(100% - 2rem)"
          }
        }
      }
    }
  }
}), qr = (e, n) => {
  w(() => {
    function r(a) {
      a.key === e && n();
    }
    return window.addEventListener("keyup", r), () => window.removeEventListener("keyup", r);
  }, []);
}, Zr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Back"), /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M244 400L100 256l144-144M120 256h292"
  }
)), Xr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Arrow Forward"), /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M268 112l144 144-144 144M392 256H100"
  }
)), Yr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Close"), /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })), Jr = () => /* @__PURE__ */ t.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" }, /* @__PURE__ */ t.createElement("title", null, "Search"), /* @__PURE__ */ t.createElement("path", { d: "M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" })), Kr = ({
  handleCanvasToggle: e,
  handleFilter: n,
  activeIndex: r,
  canvasLength: a
}) => {
  const [o, i] = C(!1), [l, c] = C(!1), [s, d] = C(!1);
  w(() => {
    d(r === 0), r === a - 1 ? c(!0) : c(!1);
  }, [r, a]), qr("Escape", () => {
    i(!1), n("");
  });
  const h = () => {
    i((b) => !b), n("");
  }, m = (b) => n(b.target.value);
  return /* @__PURE__ */ t.createElement(Ur, { isToggle: o }, /* @__PURE__ */ t.createElement(yt, null, o && /* @__PURE__ */ t.createElement(jr, { autoFocus: !0, onChange: m, placeholder: "Search" }), !o && /* @__PURE__ */ t.createElement(Gr, null, /* @__PURE__ */ t.createElement(
    me,
    {
      onClick: () => e(-1),
      disabled: s,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(Zr, null)
  ), /* @__PURE__ */ t.createElement("span", null, r + 1, " of ", a), /* @__PURE__ */ t.createElement(
    me,
    {
      onClick: () => e(1),
      disabled: l,
      type: "button"
    },
    /* @__PURE__ */ t.createElement(Xr, null)
  )), /* @__PURE__ */ t.createElement(me, { onClick: h, type: "button" }, o ? /* @__PURE__ */ t.createElement(Yr, null) : /* @__PURE__ */ t.createElement(Jr, null))));
}, Qr = f(se.Root, {
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  padding: "1.618rem",
  overflowX: "scroll",
  position: "relative",
  zIndex: "0"
}), eo = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M256 112v288M400 256H112"
  }
), to = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("path", { d: "M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z" }), /* @__PURE__ */ t.createElement("path", { d: "M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z" }), /* @__PURE__ */ t.createElement("path", { d: "M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z" })), no = () => /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" }), ro = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  "path",
  {
    d: "M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32"
  }
), /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M176 272l80 80 80-80M256 48v288"
  }
)), oo = () => /* @__PURE__ */ t.createElement("path", { d: "M416 64H96a64.07 64.07 0 00-64 64v256a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V128a64.07 64.07 0 00-64-64zm-80 64a48 48 0 11-48 48 48.05 48.05 0 0148-48zM96 416a32 32 0 01-32-32v-67.63l94.84-84.3a48.06 48.06 0 0165.8 1.9l64.95 64.81L172.37 416zm352-32a32 32 0 01-32 32H217.63l121.42-121.42a47.72 47.72 0 0161.64-.16L448 333.84z" }), ao = () => /* @__PURE__ */ t.createElement("path", { d: "M464 384.39a32 32 0 01-13-2.77 15.77 15.77 0 01-2.71-1.54l-82.71-58.22A32 32 0 01352 295.7v-79.4a32 32 0 0113.58-26.16l82.71-58.22a15.77 15.77 0 012.71-1.54 32 32 0 0145 29.24v192.76a32 32 0 01-32 32zM268 400H84a68.07 68.07 0 01-68-68V180a68.07 68.07 0 0168-68h184.48A67.6 67.6 0 01336 179.52V332a68.07 68.07 0 01-68 68z" }), bt = f("svg", {
  display: "inline-flex",
  variants: {
    isLarge: {
      true: {
        height: "4rem",
        width: "4rem"
      }
    },
    isMedium: {
      true: {
        height: "2rem",
        width: "2rem"
      }
    },
    isSmall: {
      true: {
        height: "1rem",
        width: "1rem"
      }
    }
  }
}), io = ({ children: e }) => /* @__PURE__ */ t.createElement("title", null, e), L = (e) => /* @__PURE__ */ t.createElement(
  bt,
  {
    ...e,
    "data-testid": "icon-svg",
    role: "img",
    viewBox: "0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg"
  },
  e.children
);
L.Title = io;
L.Add = eo;
L.Audio = to;
L.Close = no;
L.Download = ro;
L.Image = oo;
L.Video = ao;
const lo = Se({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), so = Se({
  "0%": { opacity: 0, transform: "translateY(1rem)" },
  "100%": { opacity: 1, transform: "translateY(0)" }
}), xt = f(Q.Arrow, {
  fill: "$secondaryAlt"
}), co = f(Q.Close, {
  position: "absolute",
  right: "0",
  top: "0",
  padding: "0.5rem",
  margin: "0",
  cursor: "pointer",
  border: "none",
  background: "none",
  fill: "inherit",
  "&:hover": {
    opacity: "0.75"
  }
}), mo = f(Q.Content, {
  border: "none",
  backgroundColor: "white",
  fill: "inhrerit",
  padding: "1rem 2rem 1rem 1rem",
  width: "auto",
  minWidth: "200px",
  maxWidth: "350px",
  borderRadius: "3px",
  boxShadow: "5px 5px 13px #0002",
  /**
   * Animate toggle
   */
  animationDuration: "0.3s",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  '&[data-side="top"]': { animationName: so },
  '&[data-side="bottom"]': { animationName: lo },
  /**
   *
   */
  '&[data-align="end"]': {
    [`& ${xt}`]: {
      margin: "0 0.7rem"
    }
  }
}), uo = f(Q.Trigger, {
  display: "inline-flex",
  padding: "0.5rem 0",
  margin: "0 0.5rem 0 0",
  cursor: "pointer",
  border: "none",
  background: "none",
  "> button, > span": {
    margin: "0"
  }
}), po = f(Q.Root, {
  boxSizing: "content-box"
}), fo = (e) => /* @__PURE__ */ t.createElement(uo, { ...e }, e.children), ho = (e) => /* @__PURE__ */ t.createElement(mo, { ...e }, /* @__PURE__ */ t.createElement(xt, null), /* @__PURE__ */ t.createElement(co, null, /* @__PURE__ */ t.createElement(L, { isSmall: !0 }, /* @__PURE__ */ t.createElement(L.Close, null))), e.children), U = ({ children: e }) => /* @__PURE__ */ t.createElement(po, null, e);
U.Trigger = fo;
U.Content = ho;
const he = f("div", {
  // Reset
  boxSizing: "border-box",
  // Custom
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "5px",
  padding: "$1",
  marginBottom: "$2",
  marginRight: "$2",
  backgroundColor: "$lightGrey",
  color: "$richBlack50",
  textTransform: "uppercase",
  fontSize: "$2",
  objectFit: "contain",
  lineHeight: "1em !important",
  "&:last-child": {
    marginRight: "0"
  },
  [`${bt}`]: {
    position: "absolute",
    left: "$1",
    height: "$3",
    width: "$3"
  },
  variants: {
    isIcon: {
      true: { position: "relative", paddingLeft: "$5" }
    }
  }
}), ge = f("span", {
  display: "flex"
}), go = f("span", {
  display: "flex",
  width: "1.2111rem",
  height: "0.7222rem"
}), vo = f("span", {
  display: "inline-flex",
  marginLeft: "5px",
  marginBottom: "-1px"
}), yo = f(se.Item, {
  display: "flex",
  flexShrink: "0",
  margin: "0 1.618rem 0 0",
  padding: "0",
  cursor: "pointer",
  background: "none",
  border: "none",
  fontFamily: "inherit",
  lineHeight: "1.25em",
  fontSize: "1rem",
  textAlign: "left",
  "&:last-child": {
    marginRight: "1rem"
  },
  figure: {
    margin: "0",
    width: "161.8px",
    "> div": {
      position: "relative",
      display: "flex",
      backgroundColor: "$secondaryAlt",
      width: "inherit",
      height: "100px",
      overflow: "hidden",
      borderRadius: "3px",
      transition: "$all",
      img: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "blur(0)",
        transform: "scale3d(1, 1, 1)",
        transition: "$all",
        color: "transparent"
      },
      [`& ${ge}`]: {
        position: "absolute",
        right: "0",
        bottom: "0",
        [`& ${he}`]: {
          margin: "0",
          paddingLeft: "0",
          fontSize: "0.7222rem",
          backgroundColor: "#000d",
          color: "$secondary",
          fill: "$secondary",
          borderBottomLeftRadius: "0",
          borderTopRightRadius: "0"
        }
      }
    },
    figcaption: {
      marginTop: "0.5rem",
      fontWeight: "400",
      fontSize: "0.8333rem",
      display: "-webkit-box",
      overflow: "hidden",
      MozBoxOrient: "vertical",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: "5",
      "@sm": {
        fontSize: "0.8333rem"
      }
    }
  },
  "&[aria-checked='true']": {
    figure: {
      "> div": {
        backgroundColor: "$primaryAlt",
        "&::before": {
          position: "absolute",
          zIndex: "1",
          color: "$secondaryMuted",
          content: "Active Item",
          textTransform: "uppercase",
          fontWeight: "700",
          fontSize: "0.6111rem",
          letterSpacing: "0.03rem",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          textShadow: "5px 5px 5px #0003"
        },
        img: {
          opacity: "0.3",
          transform: "scale3d(1.1, 1.1, 1.1)",
          filter: "blur(2px)"
        },
        [`& ${ge}`]: {
          [`& ${he}`]: {
            backgroundColor: "$accent"
          }
        }
      }
    },
    figcaption: {
      fontWeight: "700"
    }
  }
}), bo = ({ type: e }) => {
  switch (e) {
    case "Sound":
      return /* @__PURE__ */ t.createElement(L.Audio, null);
    case "Image":
      return /* @__PURE__ */ t.createElement(L.Image, null);
    case "Video":
      return /* @__PURE__ */ t.createElement(L.Video, null);
    default:
      return /* @__PURE__ */ t.createElement(L.Image, null);
  }
}, xo = ({
  canvas: e,
  canvasIndex: n,
  isActive: r,
  thumbnail: a,
  type: o,
  handleChange: i
}) => /* @__PURE__ */ t.createElement(
  yo,
  {
    "aria-checked": r,
    "data-testid": "media-thumbnail",
    "data-canvas": n,
    onClick: () => i(e.id),
    value: e.id
  },
  /* @__PURE__ */ t.createElement("figure", null, /* @__PURE__ */ t.createElement("div", null, (a == null ? void 0 : a.id) && /* @__PURE__ */ t.createElement(
    "img",
    {
      src: a.id,
      alt: e != null && e.label ? X(e.label) : ""
    }
  ), /* @__PURE__ */ t.createElement(ge, null, /* @__PURE__ */ t.createElement(he, { isIcon: !0, "data-testid": "thumbnail-tag" }, /* @__PURE__ */ t.createElement(go, null), /* @__PURE__ */ t.createElement(L, { "aria-label": o }, /* @__PURE__ */ t.createElement(bo, { type: o })), ["Video", "Sound"].includes(o) && /* @__PURE__ */ t.createElement(vo, null, Ge(e.duration))))), (e == null ? void 0 : e.label) && /* @__PURE__ */ t.createElement("figcaption", { "data-testid": "fig-caption" }, /* @__PURE__ */ t.createElement(j, { label: e.label })))
), Eo = (e) => e.body ? e.body.type : "Image", wo = ({ items: e }) => {
  const n = z(), r = I(), { activeCanvas: a, vault: o } = r, [i, l] = C(""), [c, s] = C([]), [d, h] = C(0), m = t.useRef(null), b = "painting", g = (p) => {
    a !== p && n({
      type: "updateActiveCanvas",
      canvasId: p
    });
  };
  w(() => {
    if (!c.length) {
      const p = ["Image", "Sound", "Video"], y = e.map(
        (x) => Ke(o, x, b, p)
      ).filter((x) => x.annotations.length > 0);
      s(y);
    }
  }, [e, c.length, o]), w(() => {
    c.forEach((p, y) => {
      p != null && p.canvas && p.canvas.id === a && h(y);
    });
  }, [a, c]), w(() => {
    const p = document.querySelector(
      `[data-canvas="${d}"]`
    );
    if (p instanceof HTMLElement && m.current) {
      const y = p.offsetLeft - m.current.offsetWidth / 2 + p.offsetWidth / 2;
      m.current.scrollTo({ left: y, behavior: "smooth" });
    }
  }, [d]);
  const v = (p) => l(p), u = (p) => {
    const y = c[d + p];
    y != null && y.canvas && g(y.canvas.id);
  };
  return /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
    Kr,
    {
      handleFilter: v,
      handleCanvasToggle: u,
      activeIndex: d,
      canvasLength: c.length
    }
  ), /* @__PURE__ */ t.createElement(Qr, { "aria-label": "select item", "data-testid": "media", ref: m }, c.filter((p) => {
    var y;
    if ((y = p.canvas) != null && y.label) {
      const x = X(p.canvas.label);
      if (Array.isArray(x))
        return x[0].toLowerCase().includes(i.toLowerCase());
    }
  }).map((p, y) => {
    var x, k;
    return /* @__PURE__ */ t.createElement(
      xo,
      {
        canvas: p.canvas,
        canvasIndex: y,
        handleChange: g,
        isActive: a === ((x = p == null ? void 0 : p.canvas) == null ? void 0 : x.id),
        key: (k = p == null ? void 0 : p.canvas) == null ? void 0 : k.id,
        thumbnail: on(o, p, 200, 200),
        type: Eo(p.annotations[0])
      }
    );
  })));
}, Et = f("button", {
  position: "absolute",
  background: "none",
  border: "none",
  cursor: "zoom-in",
  margin: "0",
  padding: "0",
  width: "100%",
  height: "100%",
  transition: "$all",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    color: "transparent",
    transition: "$all"
  },
  variants: {
    isMedia: {
      true: {
        cursor: "pointer"
      }
    }
  }
}), wt = f("button", {
  display: "flex",
  height: "2rem",
  width: "2rem",
  borderRadius: "2rem",
  padding: "0",
  margin: "0",
  fontFamily: "inherit",
  background: "none",
  backgroundColor: "$primary",
  border: "none",
  color: "white",
  cursor: "pointer",
  marginLeft: "0.618rem",
  filter: "drop-shadow(2px 2px 5px #0003)",
  transition: "$all",
  boxSizing: "content-box !important",
  "&:first-child": {
    marginLeft: "0"
  },
  "@xs": {
    marginBottom: "0.618rem",
    marginLeft: "0",
    "&:last-child": {
      marginBottom: "0"
    }
  },
  svg: {
    height: "60%",
    width: "60%",
    padding: "20%",
    fill: "$secondary",
    stroke: "$secondary",
    filter: "drop-shadow(2px 2px 5px #0003)",
    transition: "$all",
    boxSizing: "inherit"
  },
  "&:hover, &:focus": {
    backgroundColor: "$accent"
  },
  "&[data-button=rotate-right]": {
    "&:hover, &:focus": {
      svg: {
        rotate: "45deg"
      }
    }
  },
  "&[data-button=rotate-left]": {
    transform: "scaleX(-1)",
    "&:hover, &:focus": {
      svg: {
        rotate: "45deg"
      }
    }
  },
  "&[data-button=reset]": {
    "&:hover, &:focus": {
      svg: {
        rotate: "-15deg"
      }
    }
  }
}), St = f(wt, {
  position: "absolute",
  width: "2rem",
  top: "1rem",
  right: "1rem",
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  transition: "$all",
  borderRadius: "50%",
  backgroundColor: "$accent",
  cursor: "pointer",
  "&:hover, &:focus": {
    backgroundColor: "$accent !important"
  },
  variants: {
    isInteractive: {
      true: {
        "&:hover": {
          opacity: "1"
        }
      },
      false: {}
    },
    isMedia: {
      true: {
        cursor: "pointer !important"
      }
    }
  },
  compoundVariants: [
    {
      isInteractive: !1,
      isMedia: !0,
      css: {
        top: "50%",
        right: "50%",
        width: "4rem",
        height: "4rem",
        transform: "translate(50%,-50%)"
      }
    }
  ]
}), So = f("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  gap: "1rem",
  zIndex: "0",
  overflow: "hidden",
  "&:hover": {
    [`${St}`]: {
      backgroundColor: "$accent"
    },
    [`${Et}`]: {
      backgroundColor: "#6662"
    }
  }
}), Co = f("div", {
  width: "100%",
  height: "100%"
}), ko = f("svg", {
  height: "19px",
  color: "$accent",
  fill: "$accent",
  stroke: "$accent",
  display: "flex",
  margin: "0.25rem 0.85rem"
}), Io = f(ee.Trigger, {
  fontSize: "1.25rem",
  fontWeight: "400",
  fontFamily: "inherit",
  alignSelf: "flex-start",
  flexGrow: "1",
  cursor: "pointer",
  transition: "$all",
  border: "1px solid #6663",
  boxShadow: "2px 2px 5px #0001",
  borderRadius: "3px",
  display: "flex",
  alignItems: "center",
  paddingLeft: "0.5rem",
  width: "100%",
  "@sm": {
    fontSize: "1rem"
  }
}), $o = f(ee.Content, {
  borderRadius: "3px",
  boxShadow: "3px 3px 8px #0003",
  backgroundColor: "$secondary",
  marginTop: "2.25rem",
  marginLeft: "6px",
  paddingBottom: "0.25rem",
  maxHeight: "calc(61.8vh - 2.5rem) !important",
  borderTopLeftRadius: "0",
  border: "1px solid $secondaryMuted",
  maxWidth: "90vw"
}), Ao = f(ee.Item, {
  display: "flex",
  alignItems: "center",
  fontFamily: "inherit",
  padding: "0.25rem 0.5rem",
  color: "$primary",
  fontWeight: "400",
  fontSize: "0.8333rem",
  cursor: "pointer",
  backgroundColor: "$secondary",
  width: "calc(100% - 1rem)",
  "> span": {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  },
  '&[data-state="checked"]': {
    fontWeight: "700",
    color: "$primary !important"
  },
  "&:hover": {
    color: "$accent"
  },
  img: {
    width: "31px",
    height: "31px",
    marginRight: "0.5rem",
    borderRadius: "3px"
  }
}), To = f(ee.Label, {
  color: "$primaryMuted",
  fontFamily: "inherit",
  fontSize: "0.85rem",
  padding: "0.5rem 1rem 0.5rem 0.5rem",
  display: "flex",
  alignItems: "center",
  marginBottom: "0.25rem",
  borderRadius: "3px",
  borderTopLeftRadius: "0",
  borderBottomLeftRadius: "0",
  borderBottomRightRadius: "0",
  backgroundColor: "$secondaryMuted"
}), Ct = f(ee.Root, {
  position: "relative",
  zIndex: "5",
  width: "100%"
}), ue = ({ direction: e, title: n }) => {
  const r = () => /* @__PURE__ */ t.createElement("path", { d: "M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" }), a = () => /* @__PURE__ */ t.createElement("path", { d: "M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" });
  return /* @__PURE__ */ t.createElement(
    ko,
    {
      xmlns: "http://www.w3.org/2000/svg",
      focusable: "false",
      viewBox: "0 0 512 512",
      role: "img"
    },
    /* @__PURE__ */ t.createElement("title", null, n),
    e === "up" && /* @__PURE__ */ t.createElement(r, null),
    e === "down" && /* @__PURE__ */ t.createElement(a, null)
  );
}, kt = ({
  children: e,
  label: n,
  maxHeight: r,
  onValueChange: a,
  value: o
}) => /* @__PURE__ */ t.createElement(Ct, { onValueChange: a, value: o }, /* @__PURE__ */ t.createElement(Io, { "data-testid": "select-button" }, /* @__PURE__ */ t.createElement(Dt, { "data-testid": "select-button-value" }), /* @__PURE__ */ t.createElement(Nt, null, /* @__PURE__ */ t.createElement(ue, { direction: "down", title: "select" }))), /* @__PURE__ */ t.createElement(Wt, null, /* @__PURE__ */ t.createElement(
  $o,
  {
    css: { maxHeight: `${r} !important` },
    "data-testid": "select-content"
  },
  /* @__PURE__ */ t.createElement(_t, null, /* @__PURE__ */ t.createElement(ue, { direction: "up", title: "scroll up for more" })),
  /* @__PURE__ */ t.createElement(jt, null, /* @__PURE__ */ t.createElement(Gt, null, n && /* @__PURE__ */ t.createElement(To, null, /* @__PURE__ */ t.createElement(j, { "data-testid": "select-label", label: n })), e)),
  /* @__PURE__ */ t.createElement(Ut, null, /* @__PURE__ */ t.createElement(ue, { direction: "down", title: "scroll down for more" }))
))), It = (e) => /* @__PURE__ */ t.createElement(Ao, { ...e }, e.thumbnail && /* @__PURE__ */ t.createElement(vt, { thumbnail: e.thumbnail }), /* @__PURE__ */ t.createElement(qt, null, /* @__PURE__ */ t.createElement(j, { label: e.label })), /* @__PURE__ */ t.createElement(Zt, null)), ve = f("div", {
  position: "absolute !important",
  zIndex: "1",
  top: "1rem",
  left: "1rem",
  width: "161.8px",
  height: "100px",
  backgroundColor: "#000D",
  boxShadow: "5px 5px 5px #0002",
  borderRadius: "3px",
  ".displayregion": {
    border: " 3px solid $accent !important",
    boxShadow: "0 0 3px #0006"
  },
  "@sm": {
    width: "123px",
    height: "76px"
  },
  "@xs": {
    width: "100px",
    height: "61.8px"
  }
}), Mo = f("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), Lo = f("div", {
  width: "100%",
  height: "100%",
  maxHeight: "100vh",
  background: "transparent",
  backgroundSize: "contain",
  color: "white",
  position: "relative",
  zIndex: "0",
  overflow: "hidden",
  variants: {
    hasNavigator: {
      true: {
        [`${ve}`]: {
          display: "block"
        }
      },
      false: {
        [`${ve}`]: {
          display: "none"
        }
      }
    }
  }
}), Z = ({ className: e, id: n, label: r, children: a }) => {
  const o = r.toLowerCase().replace(/\s/g, "-");
  return /* @__PURE__ */ t.createElement(
    wt,
    {
      id: n,
      className: e,
      "data-testid": "openseadragon-button",
      "data-button": o
    },
    /* @__PURE__ */ t.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        "aria-labelledby": `${n}-svg-title`,
        "data-testid": "openseadragon-button-svg",
        focusable: "false",
        viewBox: "0 0 512 512",
        role: "img"
      },
      /* @__PURE__ */ t.createElement("title", { id: `${n}-svg-title` }, r),
      a
    )
  );
}, Ro = f("div", {
  position: "absolute",
  zIndex: "1",
  top: "1rem",
  right: "1rem",
  display: "flex",
  "@xs": {
    flexDirection: "column",
    zIndex: "2"
  },
  variants: {
    hasPlaceholder: {
      true: {
        right: "3.618rem",
        "@xs": {
          top: "3.618rem",
          right: "1rem"
        }
      },
      false: {
        right: "1rem",
        "@xs": {
          top: "1rem",
          right: "1rem"
        }
      }
    }
  }
}), zo = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M256 112v288M400 256H112"
  }
), Fo = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 256H112"
  }
), Po = () => /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "32",
    d: "M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
  }
), Vo = () => /* @__PURE__ */ t.createElement("path", { d: "M448 440a16 16 0 01-12.61-6.15c-22.86-29.27-44.07-51.86-73.32-67C335 352.88 301 345.59 256 344.23V424a16 16 0 01-27 11.57l-176-168a16 16 0 010-23.14l176-168A16 16 0 01256 88v80.36c74.14 3.41 129.38 30.91 164.35 81.87C449.32 292.44 464 350.9 464 424a16 16 0 01-16 16z" }), Fe = () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
  "path",
  {
    fill: "none",
    strokeLinecap: "round",
    strokeMiterlimit: "10",
    strokeWidth: "45",
    d: "M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
  }
), /* @__PURE__ */ t.createElement("path", { d: "M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z" })), Ho = ({
  _cloverViewerHasPlaceholder: e,
  config: n
}) => {
  const r = I(), {
    activeCanvas: a,
    configOptions: o,
    openSeadragonViewer: i,
    plugins: l,
    vault: c,
    activeManifest: s
  } = r, d = c.get({
    id: a,
    type: "Canvas"
  });
  function h() {
    return l.filter((m) => {
      var b;
      return (b = m.imageViewer) == null ? void 0 : b.menu;
    }).map((m, b) => {
      var v, u, p, y;
      const g = (u = (v = m.imageViewer) == null ? void 0 : v.menu) == null ? void 0 : u.component;
      return /* @__PURE__ */ t.createElement(
        g,
        {
          key: b,
          ...(y = (p = m == null ? void 0 : m.imageViewer) == null ? void 0 : p.menu) == null ? void 0 : y.componentProps,
          activeManifest: s,
          canvas: d,
          viewerConfigOptions: o,
          openSeadragonViewer: i,
          useViewerDispatch: z,
          useViewerState: I
        }
      );
    });
  }
  return /* @__PURE__ */ t.createElement(
    Ro,
    {
      "data-testid": "clover-iiif-image-openseadragon-controls",
      hasPlaceholder: e
    },
    n.showZoomControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Z, { id: n.zoomInButton, label: "zoom in" }, /* @__PURE__ */ t.createElement(zo, null)), /* @__PURE__ */ t.createElement(Z, { id: n.zoomOutButton, label: "zoom out" }, /* @__PURE__ */ t.createElement(Fo, null))),
    n.showFullPageControl && /* @__PURE__ */ t.createElement(Z, { id: n.fullPageButton, label: "full page" }, /* @__PURE__ */ t.createElement(Po, null)),
    n.showRotationControl && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(Z, { id: n.rotateRightButton, label: "rotate right" }, /* @__PURE__ */ t.createElement(Fe, null)), /* @__PURE__ */ t.createElement(Z, { id: n.rotateLeftButton, label: "rotate left" }, /* @__PURE__ */ t.createElement(Fe, null))),
    n.showHomeControl && /* @__PURE__ */ t.createElement(Z, { id: n.homeButton, label: "reset" }, /* @__PURE__ */ t.createElement(Vo, null)),
    h()
  );
}, Bo = ({
  ariaLabel: e,
  config: n,
  uri: r,
  _cloverViewerHasPlaceholder: a,
  imageType: o,
  openSeadragonCallback: i
}) => {
  const [l, c] = C(), [s, d] = C(), h = z(), m = ye(!1);
  return w(() => (m.current || (m.current = !0, s || d(ie(n))), () => s == null ? void 0 : s.destroy()), []), w(() => {
    s && i && i(s);
  }, [s, i]), w(() => {
    s && r !== l && (s == null || s.forceRedraw(), c(r));
  }, [s, l, r]), w(() => {
    if (l && s)
      switch (o) {
        case "simpleImage":
          s == null || s.addSimpleImage({
            url: l
          });
          break;
        case "tiledImage":
          ln(l).then((b) => {
            try {
              if (!b)
                throw new Error(`No tile source found for ${l}`);
              s == null || s.addTiledImage({
                tileSource: b,
                success: () => {
                  typeof h == "function" && h({
                    type: "updateOSDImageLoaded",
                    OSDImageLoaded: !0
                  });
                }
              });
            } catch (g) {
              console.error(g);
            }
          });
          break;
        default:
          s == null || s.close(), console.warn(
            `Unable to render ${l} in OpenSeadragon as type: "${o}"`
          );
          break;
      }
  }, [o, l]), /* @__PURE__ */ t.createElement(
    Lo,
    {
      className: "clover-iiif-image-openseadragon",
      "data-testid": "clover-iiif-image-openseadragon",
      "data-openseadragon-instance": n.id,
      hasNavigator: n.showNavigator
    },
    /* @__PURE__ */ t.createElement(
      Ho,
      {
        _cloverViewerHasPlaceholder: a,
        config: n
      }
    ),
    n.showNavigator && /* @__PURE__ */ t.createElement(
      ve,
      {
        id: n.navigatorId,
        "data-testid": "clover-iiif-image-openseadragon-navigator"
      }
    ),
    /* @__PURE__ */ t.createElement(
      Mo,
      {
        id: n.id,
        "data-testid": "clover-iiif-image-openseadragon-viewport",
        role: "img",
        ...e && { "aria-label": e }
      }
    )
  );
};
function Oo(e) {
  return {
    id: `openseadragon-${e}`,
    navigatorId: `openseadragon-navigator-${e}`,
    loadTilesWithAjax: !0,
    fullPageButton: `fullPage-${e}`,
    homeButton: `reset-${e}`,
    rotateLeftButton: `rotateLeft-${e}`,
    rotateRightButton: `rotateRight-${e}`,
    zoomInButton: `zoomIn-${e}`,
    zoomOutButton: `zoomOut-${e}`,
    showNavigator: !0,
    showFullPageControl: !0,
    showHomeControl: !0,
    showRotationControl: !0,
    showZoomControl: !0,
    navigatorBorderColor: "transparent",
    gestureSettingsMouse: {
      clickToZoom: !0,
      dblClickToZoom: !0,
      pinchToZoom: !0,
      scrollToZoom: !1
    }
  };
}
const Do = ({
  _cloverViewerHasPlaceholder: e = !1,
  body: n,
  instanceId: r,
  isTiledImage: a = !1,
  label: o,
  src: i = "",
  openSeadragonCallback: l,
  openSeadragonConfig: c = {}
}) => {
  const s = r || ae(), d = typeof o == "string" ? o : F(o), h = {
    ...Oo(s),
    ...c
  }, { imageType: m, uri: b } = n ? yn(n) : bn(i, a);
  return b ? /* @__PURE__ */ t.createElement(_e, { FallbackComponent: rt }, /* @__PURE__ */ t.createElement(
    Bo,
    {
      _cloverViewerHasPlaceholder: e,
      ariaLabel: d,
      config: h,
      imageType: m,
      key: s,
      uri: b,
      openSeadragonCallback: l
    }
  )) : null;
}, No = ({
  isMedia: e,
  label: n,
  placeholderCanvas: r,
  setIsInteractive: a
}) => {
  const { vault: o } = I(), i = re(o, r), l = i ? i[0] : void 0, c = n ? X(n) : ["placeholder image"];
  return /* @__PURE__ */ t.createElement(
    Et,
    {
      onClick: () => a(!0),
      isMedia: e,
      className: "clover-viewer-placeholder"
    },
    /* @__PURE__ */ t.createElement(
      "img",
      {
        src: (l == null ? void 0 : l.id) || "",
        alt: c.join(),
        height: l == null ? void 0 : l.height,
        width: l == null ? void 0 : l.width
      }
    )
  );
}, Wo = f("canvas", {
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: "0"
}), _o = t.forwardRef(
  (e, n) => {
    const r = t.useRef(null), a = oe(() => {
      var g, v;
      if ((g = n.current) != null && g.currentTime && ((v = n.current) == null ? void 0 : v.currentTime) > 0)
        return;
      const i = n.current;
      if (!i)
        return;
      const l = new AudioContext(), c = l.createMediaElementSource(i), s = l.createAnalyser(), d = r.current;
      if (!d)
        return;
      d.width = i.offsetWidth, d.height = i.offsetHeight;
      const h = d.getContext("2d");
      c.connect(s), s.connect(l.destination), s.fftSize = 256;
      const m = s.frequencyBinCount, b = new Uint8Array(m);
      setInterval(function() {
        o(
          s,
          h,
          m,
          b,
          d.width,
          d.height
        );
      }, 20);
    }, [n]);
    t.useEffect(() => {
      !n || !n.current || (n.current.onplay = a);
    }, [a, n]);
    function o(i, l, c, s, d, h) {
      const m = d / c * 2.6;
      let b, g = 0;
      i.getByteFrequencyData(s), l.fillStyle = "#000000", l.fillRect(0, 0, d, h);
      for (let v = 0; v < c; v++)
        b = s[v] * 2, l.fillStyle = "rgba(78, 42, 132, 1)", l.fillRect(g, h - b, m, b), g += m + 6;
    }
    return /* @__PURE__ */ t.createElement(Wo, { ref: r, role: "presentation" });
  }
), jo = f("div", {
  position: "relative",
  backgroundColor: "$primaryAlt",
  display: "flex",
  flexGrow: "0",
  flexShrink: "1",
  height: "100%",
  zIndex: "1",
  video: {
    backgroundColor: "transparent",
    objectFit: "contain",
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: "1"
  }
}), Go = ({ resource: e, ignoreCaptionLabels: n }) => {
  const r = X(e.label, "en");
  return Array.isArray(r) && r.some((o) => n.includes(o)) ? null : /* @__PURE__ */ t.createElement(
    "track",
    {
      key: e.id,
      src: e.id,
      label: Array.isArray(r) ? r[0] : r,
      srcLang: "en",
      "data-testid": "player-track"
    }
  );
}, Uo = [
  // Apple santioned
  "application/vnd.apple.mpegurl",
  "vnd.apple.mpegurl",
  // Apple sanctioned for backwards compatibility
  "audio/mpegurl",
  // Very common
  "audio/x-mpegurl",
  // Very common
  "application/x-mpegurl",
  // Included for completeness
  "video/x-mpegurl",
  "video/mpegurl",
  "application/mpegurl"
], qo = ({
  allSources: e,
  annotationResources: n,
  painting: r
}) => {
  const [a, o] = t.useState(0), [i, l] = t.useState(), c = t.useRef(null), s = (r == null ? void 0 : r.type) === "Sound", d = I(), { activeCanvas: h, configOptions: m, vault: b } = d;
  return w(() => {
    if (!r.id || !c.current)
      return;
    if (c != null && c.current) {
      const u = c.current;
      u.src = r.id, u.load();
    }
    if (r.id.split(".").pop() !== "m3u8" && r.format && !Uo.includes(r.format))
      return;
    const g = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      xhrSetup: function(u, p) {
        u.withCredentials = !!m.withCredentials;
      }
    }, v = new B(g);
    return v.attachMedia(c.current), v.on(B.Events.MEDIA_ATTACHED, function() {
      v.loadSource(r.id);
    }), v.on(B.Events.ERROR, function(u, p) {
      if (p.fatal)
        switch (p.type) {
          case B.ErrorTypes.NETWORK_ERROR:
            console.error(
              `fatal ${u} network error encountered, try to recover`
            ), v.startLoad();
            break;
          case B.ErrorTypes.MEDIA_ERROR:
            console.error(
              `fatal ${u} media error encountered, try to recover`
            ), v.recoverMediaError();
            break;
          default:
            v.destroy();
            break;
        }
    }), () => {
      if (v && c.current) {
        const u = c.current;
        v.detachMedia(), v.destroy(), u.currentTime = 0;
      }
    };
  }, [m.withCredentials, r.id]), w(() => {
    var y, x, k, A;
    const g = b.get(h), v = (y = g.accompanyingCanvas) != null && y.id ? re(b, (x = g.accompanyingCanvas) == null ? void 0 : x.id) : null, u = (k = g.placeholderCanvas) != null && k.id ? re(b, (A = g.placeholderCanvas) == null ? void 0 : A.id) : null;
    !!(v && u) ? l(a === 0 ? u[0].id : v[0].id) : (v && l(v[0].id), u && l(u[0].id));
  }, [h, a, b]), w(() => {
    if (c != null && c.current) {
      const g = c.current;
      return g == null || g.addEventListener(
        "timeupdate",
        () => o(g.currentTime)
      ), () => document.removeEventListener("timeupdate", () => {
      });
    }
  }, []), /* @__PURE__ */ t.createElement(
    jo,
    {
      css: {
        backgroundColor: m.canvasBackgroundColor,
        maxHeight: m.canvasHeight,
        position: "relative"
      },
      "data-testid": "player-wrapper",
      className: "clover-viewer-player-wrapper"
    },
    /* @__PURE__ */ t.createElement(
      "video",
      {
        id: "clover-iiif-video",
        key: r.id,
        ref: c,
        controls: !0,
        height: r.height,
        width: r.width,
        crossOrigin: "anonymous",
        poster: i,
        style: {
          maxHeight: m.canvasHeight,
          position: "relative",
          zIndex: "1"
        }
      },
      e.map((g) => /* @__PURE__ */ t.createElement("source", { src: g.id, type: g.format, key: g.id })),
      (n == null ? void 0 : n.length) > 0 && n.map((g) => {
        const v = [];
        return g.items.forEach((u) => {
          b.get(
            u.id
          ).body.forEach((y) => {
            const x = b.get(
              y.id
            );
            v.push(x);
          });
        }), v.map((u) => /* @__PURE__ */ t.createElement(
          Go,
          {
            resource: u,
            ignoreCaptionLabels: m.ignoreCaptionLabels || [],
            key: u.id
          }
        ));
      }),
      "Sorry, your browser doesn't support embedded videos."
    ),
    s && /* @__PURE__ */ t.createElement(_o, { ref: c })
  );
}, Zo = () => /* @__PURE__ */ t.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    "aria-labelledby": "close-svg-title",
    focusable: "false",
    viewBox: "0 0 512 512",
    role: "img"
  },
  /* @__PURE__ */ t.createElement("title", { id: "close-svg-title" }, "close"),
  /* @__PURE__ */ t.createElement("path", { d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" })
), Xo = ({ isMedia: e }) => /* @__PURE__ */ t.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    "aria-labelledby": "open-svg-title",
    focusable: "false",
    viewBox: "0 0 512 512",
    role: "img"
  },
  /* @__PURE__ */ t.createElement("title", { id: "open-svg-title" }, "open"),
  e ? /* @__PURE__ */ t.createElement("path", { d: "M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z" }) : /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("path", { d: "m456.69,421.39l-94.09-94.09c22.65-30.16,34.88-66.86,34.84-104.58,0-96.34-78.38-174.72-174.72-174.72S48,126.38,48,222.72s78.38,174.72,174.72,174.72c37.72.04,74.42-12.19,104.58-34.84l94.09,94.09c10.29,9.2,26.1,8.32,35.3-1.98,8.48-9.49,8.48-23.83,0-33.32Zm-233.97-73.87c-68.89-.08-124.72-55.91-124.8-124.8h0c0-68.93,55.87-124.8,124.8-124.8s124.8,55.87,124.8,124.8-55.87,124.8-124.8,124.8Z" }), /* @__PURE__ */ t.createElement("path", { d: "m279.5,197.76h-3.35s-28.47,0-28.47,0v-31.82c-.77-13.79-12.57-24.33-26.36-23.56-12.71.71-22.85,10.86-23.56,23.56v3.35h0v28.47h-31.82c-13.79.77-24.33,12.57-23.56,26.36.71,12.71,10.86,22.85,23.56,23.56h3.35s28.47,0,28.47,0v31.82c.77,13.79,12.57,24.33,26.36,23.56,12.71-.71,22.85-10.86,23.56-23.56v-3.35h0v-28.47h31.82c13.79-.77,24.33-12.57,23.56-26.36-.71-12.71-10.86-22.85-23.56-23.56Z" }))
), Yo = ({
  handleToggle: e,
  isInteractive: n,
  isMedia: r
}) => /* @__PURE__ */ t.createElement(
  St,
  {
    onClick: e,
    isInteractive: n,
    isMedia: r,
    "data-testid": "placeholder-toggle"
  },
  n ? /* @__PURE__ */ t.createElement(Zo, null) : /* @__PURE__ */ t.createElement(Xo, { isMedia: r })
), Jo = ({
  activeCanvas: e,
  annotationResources: n,
  isMedia: r,
  painting: a
}) => {
  var T, H, D, N, Y;
  const [o, i] = t.useState(0), [l, c] = t.useState(!1), {
    configOptions: s,
    customDisplays: d,
    openSeadragonViewer: h,
    vault: m,
    viewerId: b
  } = I(), g = z(), v = m.get(e), u = (T = v == null ? void 0 : v.placeholderCanvas) == null ? void 0 : T.id, p = !!u, y = (a == null ? void 0 : a.length) > 1, x = u && !l && !r, k = `${b}-${Yt(e + o)}`, A = () => c(!l), R = (E) => {
    const M = a.findIndex((W) => W.id === E);
    i(M);
  }, $ = d.find((E) => {
    var Ie;
    let M = !1;
    const { canvasId: W, paintingFormat: J } = E.target;
    if (Array.isArray(W) && W.length > 0 && (M = W.includes(e)), Array.isArray(J) && J.length > 0) {
      const $e = ((Ie = a[o]) == null ? void 0 : Ie.format) || "";
      M = !!($e && J.includes($e));
    }
    return M;
  }), P = [];
  (D = (H = n[0]) == null ? void 0 : H.items) == null || D.forEach((E) => {
    const M = m.get(E.id);
    P.push(M);
  }), w(() => {
    var E;
    P && h && ((E = s.annotationOverlays) != null && E.renderOverlays) && (nt(h, "annotation-overlay"), et(
      h,
      v,
      s.annotationOverlays,
      P,
      "annotation-overlay"
    ));
  }, [v, P, h, s]);
  const V = (E) => {
    E && (h == null ? void 0 : h.id) !== `openseadragon-${k}` && g({
      type: "updateOpenSeadragonViewer",
      openSeadragonViewer: E
    });
  }, S = (N = $ == null ? void 0 : $.display) == null ? void 0 : N.component;
  return /* @__PURE__ */ t.createElement(So, { className: "clover-viewer-painting" }, /* @__PURE__ */ t.createElement(
    Co,
    {
      style: {
        backgroundColor: s.canvasBackgroundColor,
        height: "100%"
      }
    },
    u && !r && /* @__PURE__ */ t.createElement(
      Yo,
      {
        handleToggle: A,
        isInteractive: l,
        isMedia: r
      }
    ),
    x && !r && /* @__PURE__ */ t.createElement(
      No,
      {
        isMedia: r,
        label: v == null ? void 0 : v.label,
        placeholderCanvas: u,
        setIsInteractive: c
      }
    ),
    !x && !$ && (r ? /* @__PURE__ */ t.createElement(
      qo,
      {
        allSources: a,
        painting: a[o],
        annotationResources: n
      }
    ) : a && /* @__PURE__ */ t.createElement(
      Do,
      {
        _cloverViewerHasPlaceholder: p,
        body: a[o],
        instanceId: k,
        key: k,
        openSeadragonCallback: V,
        openSeadragonConfig: s.openSeadragon
      }
    )),
    !x && S && /* @__PURE__ */ t.createElement(
      S,
      {
        id: e,
        annotationBody: a[o],
        ...$ == null ? void 0 : $.display.componentProps
      }
    )
  ), y && /* @__PURE__ */ t.createElement(
    kt,
    {
      value: (Y = a[o]) == null ? void 0 : Y.id,
      onValueChange: R,
      maxHeight: "200px"
    },
    a == null ? void 0 : a.map((E) => /* @__PURE__ */ t.createElement(
      It,
      {
        value: E == null ? void 0 : E.id,
        key: E == null ? void 0 : E.id,
        label: E == null ? void 0 : E.label
      }
    ))
  ));
}, Ko = ({
  activeCanvas: e,
  annotationResources: n,
  searchServiceUrl: r,
  setContentSearchResource: a,
  contentSearchResource: o,
  isAudioVideo: i,
  items: l,
  painting: c
}) => {
  const { isInformationOpen: s, configOptions: d } = I(), { informationPanel: h } = d, m = (h == null ? void 0 : h.renderAbout) && s, b = (h == null ? void 0 : h.renderAnnotation) && n.length > 0 && !h.open || o;
  return /* @__PURE__ */ t.createElement(
    at,
    {
      className: "clover-viewer-content",
      style: { height: d.canvasHeight ?? "100%" },
      "data-testid": "clover-viewer-content"
    },
    /* @__PURE__ */ t.createElement(it, null, /* @__PURE__ */ t.createElement(
      Jo,
      {
        activeCanvas: e,
        annotationResources: n,
        isMedia: i,
        painting: c
      }
    ), m && /* @__PURE__ */ t.createElement(lt, null, /* @__PURE__ */ t.createElement("span", null, s ? "View Items" : "More Information")), l.length > 1 && s && /* @__PURE__ */ t.createElement(ot, { className: "clover-viewer-media-wrapper" }, /* @__PURE__ */ t.createElement(wo, { items: l, activeItem: 0 }))),
    (m || b) && s && /* @__PURE__ */ t.createElement(kn, null, /* @__PURE__ */ t.createElement(st, null, /* @__PURE__ */ t.createElement(
      _r,
      {
        activeCanvas: e,
        annotationResources: n,
        searchServiceUrl: r,
        setContentSearchResource: a,
        contentSearchResource: o
      }
    )))
  );
}, Qo = f(U.Trigger, {
  width: "30px",
  padding: "5px"
}), $t = f(U.Content, {
  display: "flex",
  flexDirection: "column",
  fontSize: "0.8333rem",
  border: "none",
  boxShadow: "2px 2px 5px #0003",
  zIndex: "2",
  button: {
    display: "flex",
    textDecoration: "none",
    marginBottom: "0.5em",
    color: "$accentAlt",
    cursor: "pointer",
    background: "$secondary",
    border: "none",
    "&:last-child": {
      marginBottom: "0"
    }
  }
}), ea = f("span", {
  fontSize: "1.33rem",
  alignSelf: "flex-start",
  flexGrow: "0",
  flexShrink: "1",
  padding: "1rem",
  "@sm": {
    fontSize: "1rem"
  },
  "&.visually-hidden": {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: "0"
  }
}), ta = f("header", {
  display: "flex",
  backgroundColor: "transparent !important",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  [`> ${Ct}`]: {
    flexGrow: "1",
    flexShrink: "0"
  },
  form: {
    flexGrow: "0",
    flexShrink: "1"
  }
}), na = f("div", {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  padding: "1rem",
  flexShrink: "0",
  flexGrow: "1"
}), ra = () => {
  var s;
  const e = z(), n = I(), { activeManifest: r, collection: a, configOptions: o, vault: i } = n, l = o == null ? void 0 : o.canvasHeight, c = (d) => {
    e({
      type: "updateActiveManifest",
      manifestId: d
    }), e({
      type: "updateViewerId",
      viewerId: ae()
    });
  };
  return /* @__PURE__ */ t.createElement("div", { style: { margin: "0.75rem" } }, /* @__PURE__ */ t.createElement(
    kt,
    {
      label: a.label,
      maxHeight: l,
      value: r,
      onValueChange: c
    },
    (s = a == null ? void 0 : a.items) == null ? void 0 : s.map((d) => /* @__PURE__ */ t.createElement(
      It,
      {
        value: d.id,
        key: d.id,
        thumbnail: d != null && d.thumbnail ? i.get(d == null ? void 0 : d.thumbnail) : void 0,
        label: d.label
      }
    ))
  ));
}, oa = (e, n = 2500) => {
  const [r, a] = C(), o = oe(() => {
    navigator.clipboard.writeText(e).then(
      () => a("copied"),
      () => a("failed")
    );
  }, [e]);
  return w(() => {
    if (!r)
      return;
    const i = setTimeout(() => a(void 0), n);
    return () => clearTimeout(i);
  }, [r]), [r, o];
}, aa = f("span", {
  display: "flex",
  alignContent: "center",
  alignItems: "center",
  padding: "0.125rem 0.25rem 0",
  marginTop: "-0.125rem",
  marginLeft: "0.5rem",
  backgroundColor: "$accent",
  color: "$secondary",
  borderRadius: "3px",
  fontSize: "0.6111rem",
  textTransform: "uppercase",
  lineHeight: "1em"
}), ia = ({ status: e }) => e ? /* @__PURE__ */ t.createElement(aa, { "data-copy-status": e }, e) : null, Pe = ({
  textPrompt: e,
  textToCopy: n
}) => {
  const [r, a] = oa(n);
  return /* @__PURE__ */ t.createElement("button", { onClick: a }, e, " ", /* @__PURE__ */ t.createElement(ia, { status: r }));
}, la = () => {
  const e = "#ed1d33", n = "#2873ab";
  return /* @__PURE__ */ t.createElement("svg", { viewBox: "0 0 493.35999 441.33334", id: "iiif-logo", version: "1.1" }, /* @__PURE__ */ t.createElement("title", null, "IIIF Manifest Options"), /* @__PURE__ */ t.createElement("g", { transform: "matrix(1.3333333,0,0,-1.3333333,0,441.33333)" }, /* @__PURE__ */ t.createElement("g", { transform: "scale(0.1)" }, /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: n },
      d: "M 65.2422,2178.75 775.242,1915 773.992,15 65.2422,276.25 v 1902.5"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: n },
      d: "m 804.145,2640.09 c 81.441,-240.91 -26.473,-436.2 -241.04,-436.2 -214.558,0 -454.511,195.29 -535.9527,436.2 -81.4335,240.89 26.4805,436.18 241.0387,436.18 214.567,0 454.512,-195.29 535.954,-436.18"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: e },
      d: "M 1678.58,2178.75 968.578,1915 969.828,15 1678.58,276.25 v 1902.5"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: e },
      d: "m 935.082,2640.09 c -81.437,-240.91 26.477,-436.2 241.038,-436.2 214.56,0 454.51,195.29 535.96,436.2 81.43,240.89 -26.48,436.18 -241.04,436.18 -214.57,0 -454.52,-195.29 -535.958,-436.18"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: n },
      d: "m 1860.24,2178.75 710,-263.75 -1.25,-1900 -708.75,261.25 v 1902.5"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: n },
      d: "m 2603.74,2640.09 c 81.45,-240.91 -26.47,-436.2 -241.03,-436.2 -214.58,0 -454.52,195.29 -535.96,436.2 -81.44,240.89 26.48,436.18 241.03,436.18 214.57,0 454.51,-195.29 535.96,-436.18"
    }
  ), /* @__PURE__ */ t.createElement(
    "path",
    {
      style: { fill: e },
      d: "m 3700.24,3310 v -652.5 c 0,0 -230,90 -257.5,-142.5 -2.5,-247.5 0,-336.25 0,-336.25 l 257.5,83.75 V 1690 l -258.61,-92.5 V 262.5 L 2735.24,0 v 2360 c 0,0 -15,850 965,950"
    }
  ))));
}, sa = f(je.Root, {
  all: "unset",
  height: "2rem",
  width: "3.236rem",
  backgroundColor: "#6663",
  borderRadius: "9999px",
  position: "relative",
  WebkitTapHighlightColor: "transparent",
  cursor: "pointer",
  "&:focus": {
    boxShadow: "0 0 0 2px $secondaryAlt"
  },
  '&[data-state="checked"]': {
    backgroundColor: "$accent",
    boxShadow: "inset 2px 2px 5px #0003"
  }
}), ca = f(je.Thumb, {
  display: "block",
  height: "calc(2rem - 12px)",
  width: "calc(2rem - 12px)",
  backgroundColor: "$secondary",
  borderRadius: "100%",
  boxShadow: "2px 2px 5px #0001",
  transition: "$all",
  transform: "translateX(6px)",
  willChange: "transform",
  '&[data-state="checked"]': {
    transform: "translateX(calc(1.236rem + 6px))"
  }
}), da = f("label", {
  fontSize: "0.8333rem",
  fontWeight: "400",
  lineHeight: "1em",
  userSelect: "none",
  cursor: "pointer",
  paddingRight: "0.618rem"
}), ma = f("form", {
  display: "flex",
  flexShrink: "0",
  flexGrow: "1",
  alignItems: "center",
  marginLeft: "1.618rem"
}), ua = () => {
  var i, l;
  const { configOptions: e } = I(), n = z(), [r, a] = C((i = e == null ? void 0 : e.informationPanel) == null ? void 0 : i.open), o = ((l = e == null ? void 0 : e.informationPanel) == null ? void 0 : l.toggleLabel) ?? "More information";
  return w(() => {
    n({
      type: "updateInformationOpen",
      isInformationOpen: r
    });
  }, [r, n]), /* @__PURE__ */ t.createElement(ma, null, /* @__PURE__ */ t.createElement(da, { htmlFor: "information-toggle", css: r ? { opacity: "1" } : {} }, o), /* @__PURE__ */ t.createElement(
    sa,
    {
      checked: r,
      onCheckedChange: () => a(!r),
      id: "information-toggle",
      "aria-label": "information panel toggle",
      name: "toggled?"
    },
    /* @__PURE__ */ t.createElement(ca, null)
  ));
}, pa = f(U.Trigger, {
  width: "30px",
  padding: "5px"
}), fa = f($t, {
  h3: {
    color: "$primaryAlt",
    fontSize: "$2",
    fontWeight: "700",
    margin: "$2 0"
  },
  button: {},
  "& ul li": {
    marginBottom: "$1"
  }
});
function ha(e) {
  const { vault: n } = I();
  try {
    const r = e && n.get(e);
    if (!r)
      throw new Error(`Vault entity ${e} not found.`);
    return (r == null ? void 0 : r["@id"]) || (r == null ? void 0 : r.id);
  } catch (r) {
    return console.error(r), e;
  }
}
function Ve(e, n) {
  const r = [];
  if (!e)
    return r;
  for (const a of e)
    if (a.id) {
      const o = n.get(a.id);
      o && r.push(o);
    }
  return r;
}
function ga() {
  const { activeCanvas: e, activeManifest: n, vault: r } = I(), [a, o] = C({
    root: [],
    canvas: []
  });
  return w(() => {
    const i = r.get(n), l = r.get(e), c = i == null ? void 0 : i.rendering, s = l == null ? void 0 : l.rendering, d = Ve(c, r), h = Ve(s, r);
    o({
      root: d,
      canvas: h
    });
  }, [e, n, r]), { ...a };
}
function He(e, n) {
  return e.map(({ format: r, id: a, label: o }) => {
    const i = ha(a);
    return {
      format: r,
      id: i,
      label: F(o) || n
    };
  });
}
function va() {
  const e = ga(), n = He(
    (e == null ? void 0 : e.root) || [],
    "Root Rendering Label"
  ), r = He(
    (e == null ? void 0 : e.canvas) || [],
    "Canvas Rendering Label"
  );
  return {
    allPages: n,
    individualPages: r
  };
}
const ya = () => {
  const { allPages: e, individualPages: n } = va(), r = e.length > 0 || n.length > 0, a = (o) => {
    window.open(o, "_blank");
  };
  return r ? /* @__PURE__ */ t.createElement(U, null, /* @__PURE__ */ t.createElement(pa, { "data-testid": "download-button" }, /* @__PURE__ */ t.createElement(L, null, /* @__PURE__ */ t.createElement(L.Download, null))), /* @__PURE__ */ t.createElement(fa, { "data-testid": "download-content" }, n.length > 0 && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("h3", null, "Individual Pages"), /* @__PURE__ */ t.createElement("ul", null, n.map(({ format: o, id: i, label: l }) => /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement("button", { onClick: () => a(i) }, l, " (", o, ")"))))), e.length > 0 && /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("h3", null, "All Pages"), /* @__PURE__ */ t.createElement("ul", null, e.map(({ format: o, id: i, label: l }) => /* @__PURE__ */ t.createElement("li", { key: l }, /* @__PURE__ */ t.createElement("button", { onClick: () => a(i) }, l, " (", o, ")"))))))) : null;
}, At = (e) => {
  const n = () => window.matchMedia ? window.matchMedia(e).matches : !1, [r, a] = C(n);
  return w(() => {
    const o = () => a(n);
    return window.addEventListener("resize", o), () => window.removeEventListener("resize", o);
  }), r;
}, ba = ({ manifestId: e, manifestLabel: n }) => {
  const r = I(), { collection: a, configOptions: o } = r, { informationPanel: i, showDownload: l, showIIIFBadge: c, showTitle: s } = o, d = l || c || (i == null ? void 0 : i.renderToggle), h = At(we.sm);
  return /* @__PURE__ */ t.createElement(ta, { className: "clover-viewer-header" }, a != null && a.items ? /* @__PURE__ */ t.createElement(ra, null) : /* @__PURE__ */ t.createElement(ea, { className: s ? "" : "visually-hidden" }, s && /* @__PURE__ */ t.createElement(j, { label: n, className: "label" })), d && /* @__PURE__ */ t.createElement(na, null, l && /* @__PURE__ */ t.createElement(ya, null), c && /* @__PURE__ */ t.createElement(U, null, /* @__PURE__ */ t.createElement(Qo, null, /* @__PURE__ */ t.createElement(la, null)), /* @__PURE__ */ t.createElement($t, null, (a == null ? void 0 : a.items) && /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (m) => {
        m.preventDefault(), window.open(a.id, "_blank");
      }
    },
    "View Collection"
  ), /* @__PURE__ */ t.createElement(
    "button",
    {
      onClick: (m) => {
        m.preventDefault(), window.open(e, "_blank");
      }
    },
    "View Manifest"
  ), " ", (a == null ? void 0 : a.items) && /* @__PURE__ */ t.createElement(
    Pe,
    {
      textPrompt: "Copy Collection URL",
      textToCopy: a.id
    }
  ), /* @__PURE__ */ t.createElement(
    Pe,
    {
      textPrompt: "Copy Manifest URL",
      textToCopy: e
    }
  ))), (i == null ? void 0 : i.renderToggle) && !h && /* @__PURE__ */ t.createElement(ua, null)));
}, xa = (e = !1) => {
  const [n, r] = C(e);
  return Ft(() => {
    if (!n)
      return;
    const a = document.documentElement.style.overflow;
    return document.documentElement.style.overflow = "hidden", () => {
      document.documentElement.style.overflow = a;
    };
  }, [n]), w(() => {
    n !== e && r(e);
  }, [e]), [n, r];
}, Ea = ({
  manifest: e,
  theme: n,
  iiifContentSearchQuery: r
}) => {
  var Y;
  const a = I(), o = z(), {
    activeCanvas: i,
    isInformationOpen: l,
    vault: c,
    contentSearchVault: s,
    configOptions: d,
    openSeadragonViewer: h
  } = a, m = ["100%", "auto"], b = (d == null ? void 0 : d.canvasHeight) && m.includes(d == null ? void 0 : d.canvasHeight), [g, v] = C(!1), [u, p] = C(!1), [y, x] = C([]), [k, A] = C([]), [R, $] = C(), [P, V] = xa(!1), S = At(we.sm), [T, H] = C(), D = oe(
    (E) => {
      o({
        type: "updateInformationOpen",
        isInformationOpen: E
      });
    },
    [o]
  );
  w(() => {
    var E;
    (E = d == null ? void 0 : d.informationPanel) != null && E.open && D(!S);
  }, [
    S,
    (Y = d == null ? void 0 : d.informationPanel) == null ? void 0 : Y.open,
    D
  ]), w(() => {
    if (!S) {
      V(!1);
      return;
    }
    V(l);
  }, [l, S, V]), w(() => {
    const E = re(c, i);
    E && (p(
      ["Sound", "Video"].indexOf(E[0].type) > -1
    ), x(E));
    const M = rn(c, i);
    M.length > 0 && o({
      type: "updateInformationOpen",
      isInformationOpen: !0
    }), A(M), v(M.length !== 0);
  }, [i, c, o]);
  const N = e.service.some(
    (E) => E.type === "SearchService2"
  );
  return w(() => {
    if (N) {
      const E = e.service.find(
        (M) => M.type === "SearchService2"
      );
      E && H(E.id);
    }
  }, [e, N]), w(() => {
    var E, M, W;
    T && ((E = d.informationPanel) == null ? void 0 : E.renderContentSearch) !== !1 && Je(
      s,
      T,
      (W = (M = d.localeText) == null ? void 0 : M.contentSearch) == null ? void 0 : W.tabLabel,
      r
    ).then((J) => {
      $(J);
    });
  }, [T]), w(() => {
    if (!h || !R)
      return;
    const E = c.get({
      id: i,
      type: "Canvas"
    });
    nt(h, "content-search-overlay"), xn(
      s,
      R,
      h,
      E,
      d
    );
  }, [h, R]), /* @__PURE__ */ t.createElement(_e, { FallbackComponent: rt }, /* @__PURE__ */ t.createElement(
    In,
    {
      className: `${n} clover-viewer`,
      css: { background: d == null ? void 0 : d.background },
      "data-body-locked": P,
      "data-absolute-position": b,
      "data-information-panel": g,
      "data-information-panel-open": l
    },
    /* @__PURE__ */ t.createElement(
      be.Root,
      {
        open: l,
        onOpenChange: D
      },
      /* @__PURE__ */ t.createElement(
        ba,
        {
          manifestLabel: e.label,
          manifestId: e.id
        }
      ),
      /* @__PURE__ */ t.createElement(
        Ko,
        {
          activeCanvas: i,
          painting: y,
          annotationResources: k,
          searchServiceUrl: T,
          setContentSearchResource: $,
          contentSearchResource: R,
          items: e.items,
          isAudioVideo: u
        }
      )
    )
  ));
}, Be = {
  ignoreCache: !1,
  headers: {
    Accept: "application/json, text/javascript, text/plain"
  },
  timeout: 5e3,
  withCredentials: !1
};
function wa(e) {
  return {
    ok: e.status >= 200 && e.status < 300,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: e.responseText,
    json: () => JSON.parse(e.responseText)
  };
}
function Oe(e, n = null) {
  return {
    ok: !1,
    status: e.status,
    statusText: e.statusText,
    headers: e.getAllResponseHeaders(),
    data: n || e.statusText,
    json: () => JSON.parse(n || e.statusText)
  };
}
function Sa(e, n = Be) {
  const r = n.headers || Be.headers;
  return new Promise((a, o) => {
    const i = new XMLHttpRequest();
    i.open("get", e), i.withCredentials = n.withCredentials, r && Object.keys(r).forEach(
      (l) => i.setRequestHeader(l, r[l])
    ), i.onload = () => {
      a(wa(i));
    }, i.onerror = () => {
      o(Oe(i, "Failed to make request."));
    }, i.ontimeout = () => {
      o(Oe(i, "Request took longer than expected."));
    }, i.send();
  });
}
const Ba = ({
  canvasIdCallback: e = () => {
  },
  customDisplays: n = [],
  plugins: r = [],
  customTheme: a,
  iiifContent: o,
  id: i,
  manifestId: l,
  options: c,
  iiifContentSearchQuery: s
}) => {
  var m, b, g;
  let d = o;
  i && (d = i), l && (d = l);
  const h = Ze(
    (b = (m = c == null ? void 0 : c.informationPanel) == null ? void 0 : m.vtt) == null ? void 0 : b.autoScroll
  );
  return /* @__PURE__ */ t.createElement(
    nn,
    {
      initialState: {
        ...ce,
        customDisplays: n,
        plugins: r,
        isAutoScrollEnabled: h.enabled,
        isInformationOpen: !!((g = c == null ? void 0 : c.informationPanel) != null && g.open),
        vault: new pe({
          customFetcher: (v) => Sa(v, {
            withCredentials: c == null ? void 0 : c.withCredentials,
            headers: c == null ? void 0 : c.requestHeaders
          }).then((u) => JSON.parse(u.data))
        })
      }
    },
    /* @__PURE__ */ t.createElement(
      Ca,
      {
        iiifContent: d,
        canvasIdCallback: e,
        customTheme: a,
        options: c,
        iiifContentSearchQuery: s
      }
    )
  );
}, Ca = ({
  canvasIdCallback: e,
  customTheme: n,
  iiifContent: r,
  options: a,
  iiifContentSearchQuery: o
}) => {
  const i = z(), l = I(), { activeCanvas: c, activeManifest: s, isLoaded: d, vault: h } = l, [m, b] = C(), [g, v] = C();
  let u = {};
  return n && (u = Ht("custom", n)), w(() => {
    e && e(c);
  }, [c, e]), w(() => {
    s && h.loadManifest(s).then((p) => {
      v(p), i({
        type: "updateActiveCanvas",
        canvasId: dn(r, p)
      });
    }).catch((p) => {
      console.error(`Manifest failed to load: ${p}`);
    }).finally(() => {
      i({
        type: "updateIsLoaded",
        isLoaded: !0
      });
    });
  }, [r, s, i, h]), w(() => {
    i({
      type: "updateConfigOptions",
      configOptions: a
    });
    const p = cn(r);
    h.load(p).then((y) => {
      b(y);
    }).catch((y) => {
      console.error(
        `The IIIF resource ${r} failed to load: ${y}`
      );
    });
  }, [i, r, a, h]), w(() => {
    if ((m == null ? void 0 : m.type) === "Collection") {
      i({
        type: "updateCollection",
        collection: m
      });
      const p = mn(
        r,
        m
      );
      p && i({
        type: "updateActiveManifest",
        manifestId: p
      });
    } else
      (m == null ? void 0 : m.type) === "Manifest" && i({
        type: "updateActiveManifest",
        manifestId: m.id
      });
  }, [i, r, m]), d ? !g || !g.items ? (console.log(`The IIIF manifest ${r} failed to load.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : g.items.length === 0 ? (console.log(`The IIIF manifest ${r} does not contain canvases.`), /* @__PURE__ */ t.createElement(t.Fragment, null)) : /* @__PURE__ */ t.createElement(
    Ea,
    {
      manifest: g,
      theme: u,
      key: g.id,
      iiifContentSearchQuery: o
    }
  ) : /* @__PURE__ */ t.createElement(t.Fragment, null, "Loading");
};
export {
  Ba as default
};
//# sourceMappingURL=index.mjs.map

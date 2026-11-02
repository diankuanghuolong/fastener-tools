/* Fastener reference tools — shared JS (no dependencies) */
(function () {
  "use strict";

  /* ---------- data: metric threads ----------
     d: nominal diameter (mm)
     pC: coarse pitch, pF: fine pitch (mm)
     s : hex head across flats (mm), k: hex head height (mm)
     As: tensile stress area (mm²) — ISO 898-1 formula 0.7854(d - 0.9743/n)²
  */
  var METRIC = [
    { d: 4,  pC: 0.7,  pF: 0.5,  s: 7,  k: 2.8, As: 8.78 },
    { d: 5,  pC: 0.8,  pF: 0.5,  s: 8,  k: 3.5, As: 14.2 },
    { d: 6,  pC: 1,    pF: 0.75, s: 10, k: 4,   As: 20.1 },
    { d: 8,  pC: 1.25, pF: 1,    s: 13, k: 5.3, As: 36.6 },
    { d: 10, pC: 1.5,  pF: 1.25, s: 17, k: 6.4, As: 58.0 },
    { d: 12, pC: 1.75, pF: 1.5,  s: 19, k: 7.5, As: 84.3 },
    { d: 14, pC: 2,    pF: 1.5,  s: 22, k: 8.8, As: 115 },
    { d: 16, pC: 2,    pF: 1.5,  s: 24, k: 10,  As: 157 },
    { d: 18, pC: 2.5,  pF: 1.5,  s: 27, k: 11.5,As: 192 },
    { d: 20, pC: 2.5,  pF: 1.5,  s: 30, k: 12.5,As: 245 },
    { d: 24, pC: 3,    pF: 2,    s: 36, k: 15,  As: 353 }
  ];

  /* property classes — ISO 898-1 proof strength Sp (MPa) used for preload */
  var GRADES = {
    "4.8": { sp: 310, rm: 420, rp: 340 },
    "5.8": { sp: 380, rm: 520, rp: 420 },
    "8.8": { sp: 580, rm: 800, rp: 640 },
    "10.9":{ sp: 830, rm: 1000,rp: 900 },
    "12.9":{ sp: 970, rm: 1200,rp: 1080 }
  };

  /* torque factor K */
  var KFACTORS = {
    "dry":     { k: 0.20, label: "Dry / as received" },
    "oiled":   { k: 0.15, label: "Lightly oiled" },
    "lubed":   { k: 0.12, label: "Lubricated (moly / anti-seize)" }
  };

  function $(id) { return document.getElementById(id); }
  function fmt(n, dp) {
    if (!isFinite(n)) return "—";
    var v = n.toFixed(dp === undefined ? 1 : dp);
    if (v === "-0" || v === "-0.0" || v === "-0.00") v = v.slice(1);
    return v;
  }

  /* ---------- torque calculator ---------- */
  function initTorque() {
    var selD = $("diameter"), selG = $("grade"), selK = $("kfactor"), selP = $("preload");
    if (!selD) return;

    METRIC.forEach(function (m) {
      var o = document.createElement("option");
      o.value = m.d; o.textContent = "M" + m.d + " (×" + m.pC + " coarse)";
      selD.appendChild(o);
    });
    selD.value = 10;

    function calc() {
      var m = METRIC.filter(function (x) { return x.d === +selD.value; })[0];
      var g = GRADES[selG.value];
      var kf = KFACTORS[selK.value];
      var pct = +selP.value / 100;

      var F = pct * g.sp * m.As;            // preload force, N
      var T = kf.k * F * (m.d / 1000);      // T = K · F · d  (N·m)
      var Tft = T * 0.737562;

      $("outTorque").firstChild.nodeValue = fmt(T, T < 20 ? 1 : 0);
      $("outTorqueUnit").textContent = "N·m";
      $("outForce").textContent = fmt(F / 1000, 1) + " kN";
      $("outFtLb").textContent = fmt(Tft, Tft < 20 ? 1 : 0) + " lb·ft";
      $("outProof").textContent = fmt(g.sp, 0) + " MPa";
      $("outAs").textContent = fmt(m.As, 1) + " mm²";
      $("outSpanner").textContent = m.s + " mm";
      $("outK").textContent = kf.k.toFixed(2) + " — " + kf.label;
      $("outFormula").textContent =
        "F = " + (pct * 100).toFixed(0) + "% × " + g.sp + " MPa × " + m.As +
        " mm² = " + fmt(F, 0) + " N      T = " + kf.k.toFixed(2) +
        " × " + fmt(F, 0) + " N × " + m.d + " mm = " + fmt(T, 1) + " N·m";
    }
    [selD, selG, selK, selP].forEach(function (el) { el.addEventListener("change", calc); });
    calc();
  }

  /* ---------- unit converter ---------- */
  function nearestFraction(inch, denom) {
    var n = Math.round(inch * denom);
    if (n === 0) return null;
    var g = gcd(n, denom);
    return (n / g) + "/" + (denom / g);
  }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }

  function initConverter() {
    var mmIn = $("mmIn"), inIn = $("inIn");
    if (!mmIn) return;

    function fromMm() {
      var mm = parseFloat(mmIn.value);
      if (!isFinite(mm)) { $("mmOut").textContent = "—"; $("mmFrac").textContent = "—"; return; }
      var inch = mm / 25.4;
      $("mmOut").textContent = fmt(inch, 4) + " in";
      var f = nearestFraction(inch, 64);
      $("mmFrac").textContent = f ? "≈ " + f + " in" : "< 1/64 in";
    }
    function fromIn() {
      var inch = parseFloat(inIn.value);
      if (!isFinite(inch)) { $("inOut").textContent = "—"; return; }
      $("inOut").textContent = fmt(inch * 25.4, 2) + " mm";
    }
    mmIn.addEventListener("input", fromMm);
    inIn.addEventListener("input", fromIn);
    fromMm(); fromIn();
  }

  /* ---------- year stamp ---------- */
  function initYear() {
    var els = document.querySelectorAll("[data-year]");
    for (var i = 0; i < els.length; i++) els[i].textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTorque();
    initConverter();
    initYear();
  });
})();

var GraphCreator = (function (t) {
  var e = {};
  function n(o) {
    if (e[o]) return e[o].exports;
    var i = (e[o] = { i: o, l: !1, exports: {} });
    return t[o].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  return (
    (n.m = t),
    (n.c = e),
    (n.d = function (t, e, o) {
      n.o(t, e) ||
        Object.defineProperty(t, e, {
          configurable: !1,
          enumerable: !0,
          get: o,
        });
    }),
    (n.r = function (t) {
      Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (n.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return n.d(e, "a", e), e;
    }),
    (n.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (n.p = ""),
    n((n.s = 9))
  );
})([
  function (t, e, n) {
    "use strict";
    n.r(e),
      n.d(e, "Edge", function () {
        return i;
      }),
      n.d(e, "EdgeContainer", function () {
        return r;
      });
    var o = n(1);
    function i(t, e, n, o, i, r) {
      (this.connectionPoints = n),
        (this.pathTextSrc = o[0]),
        (this.pathTextTarget = o[1]),
        (this.color = i || "#000"),
        (this.dotted = r || !1),
        (this.source = t),
        (this.target = e),
        (this.id = this.getUniqueIdentifier()),
        this.initColor(),
        this.initDotted();
    }
    function r() {
      (this.map = new Map()), (this[Symbol.iterator] = this.values);
    }
    (i.prototype.api = o.apiConnector),
      (i.prototype.settings = o.apiConnector.getSettings()),
      (i.prototype.initColor = function () {
        const t = this;
        if (!t.pathTextSrc && !t.pathTextTarget) return;
        const e = (e) => {
          const n = e.relations[t.pathTextSrc] || e.relations[t.pathTextTarget];
          n && (t.color = n.color);
        };
        t.api.hasInCache(t.api.entryPoints.settings)
          ? e(t.api.getFromCache(t.api.entryPoints.settings))
          : t.settings.then((t) => {
              e(t);
            });
      }),
      (i.prototype.initDotted = function () {
        const t = this;
        if (!t.pathTextSrc && !t.pathTextTarget) return;
        const e = (e) => {
          const n = e.relations[t.pathTextSrc] || e.relations[t.pathTextTarget];
          n && (t.dotted = n.dotted);
        };
        t.api.hasInCache(t.api.entryPoints.settings)
          ? e(t.api.getFromCache(t.api.entryPoints.settings))
          : t.settings.then((t) => {
              e(t);
            });
      }),
      (i.prototype.getUniqueIdentifier = function () {
        return this.source.id < this.target.id
          ? this.source.id + "|" + this.target.id
          : this.target.id + "|" + this.source.id;
      }),
      (r.prototype.add = function (t) {
        t && this.map.set(t.id, t);
      }),
      (r.prototype.values = function () {
        return this.map.values();
      }),
      (r.prototype.deleteNodeEdges = function (t) {
        let e = this;
        e.map.forEach((n) => {
          (n.source !== t && n.target !== t) || e.map.delete(n.id);
        });
      });
  },
  function (t, e, n) {
    "use strict";
    n.r(e),
      n.d(e, "apiConnector", function () {
        return i;
      });
    const o = function (t) {
      (this.url = "https://graph-slowosiec.clarin-pl.eu/wordnetloom/resources/"),
        (this.cache = new Map()),
        (this.possibleLangs = ["pl", "en"]),
        (this.lang = t || "pl");
    };
    (o.prototype.setLang = function (t) {
      const e = this;
      e.possibleLangs.indexOf(t) < 0
        ? console.error('Err, Language can only be chosen to be "pl" or "en"')
        : e.lang !== t && ((e.cache = new Map()), (e.lang = t));
    }),
      (o.prototype.entryPoints = {
        settings: "settings/",
        graph: "graphs/synsets/{id}",
        synsetFromSense: "senses/{id}/synset",
        synsetFromLemma: "synsets/search?lemma={lemma}",
        relationTypes: "relation-types/{id}",
      }),
      (o.prototype._getJson = function (t, e, n) {
        const o = this;
        if (((n |= !1), !e)) return o._getJsonPromise(t);
        if (o.cache.has(t)) e(o.cache.get(t));
        else {
          let i = o.url + t;
          n && (i = t),
            d3
              .request(i)
              .header("Content-Type", "application/json")
              .header("Accept-Language", o.lang)
              .get((n, i) => {
                (i = JSON.parse(i.response)), o.cache.set(t, i), e(i);
              });
        }
      }),
      (o.prototype._getJsonPromise = function (t) {
        const e = this;
        let n = new (class {
          constructor() {
            this.promise = new Promise((t, e) => {
              (this.reject = e), (this.resolve = t);
            });
          }
        })();
        return (
          e.cache.has(t)
            ? n.resolve(e.cache.get(t))
            : d3
                .request(e.url + t)
                .header("Content-Type", "application/json")
                .header("Accept-Language", e.lang)
                .get((o, i) => {
                  (i = JSON.parse(i.response)), e.cache.set(t, i), n.resolve(i);
                }),
          n.promise
        );
      }),
      (o.prototype.getRelationTypes = function (t, e) {
        return (
          (t = t || ""),
          this._getJson(this.entryPoints.relationTypes.replace("{id}", t), e)
        );
      }),
      (o.prototype.getSettings = function (t) {
        return this._getJson(this.entryPoints.settings, t);
      }),
      (o.prototype.hasInCache = function (t) {
        return this.cache.has(t);
      }),
      (o.prototype.getFromCache = function (t) {
        return this.cache.has(t) ? this.cache.get(t) : null;
      }),
      (o.prototype.getGraph = function (t, e) {
        this._getJson(this.entryPoints.graph.replace("{id}", t), function (t) {
          e(t || null);
        });
      }),
      (o.prototype.getSynsetFromSenseId = function (t, e) {
        const n = function (t) {
          e(t);
        };
        d3.json(
          this.url + this.entryPoints.synsetFromSense.replace("{id}", t),
          function (t, e) {
            n(e || null);
          }
        );
      }),
      (o.prototype.getSensesFromLemma = function (t, e) {
        d3.json(
          this.url + this.entryPoints.synsetFromLemma.replace("{lemma}", t),
          function (t, n) {
            e(n || null);
          }
        );
      });
    const i = new o();
  },
  function (t, e, n) {
    "use strict";
    n.r(e),
      n.d(e, "GraphCreator", function () {
        return u;
      }),
      n.d(e, "consts", function () {
        return h;
      });
    var o = n(1),
      r = n(0);
    n.d(e, "Edge", function () {
      return r.Edge;
    });
    var s = n(3),
      a = n(4);
    const d = ".inner-graph-container",
      l = ".possible-senses",
      c = ".graph-loader",
      p = {
        plWordNet: {
          appendLanguageInfo: function (t, e) {
            return this.append("circle")
              .attr("cx", -25)
              .attr("cy", -14)
              .attr("r", 7)
              .attr("fill", (t) => {
                return `url('#flag-${e.lexicons[t.lexicon].icon}')`;
              })
              .attr("stroke-width", 0.5)
              .attr("stroke", "#7f7f7f");
          },
          appendBasicNode: function (t) {
            return this.append("rect")
              .attr("id", "rect")
              .attr("height", "30")
              .attr("width", "100")
              .attr("x", "-50")
              .attr("y", "-15")
              .attr("rx", "15")
              .attr("ry", "45")
              .classed("inner-node", !0)
              .attr("stroke-width", "1px")
              .attr("stroke", "#555555")
              .attr("fill", function (t) {
                return t.type.color || "red";
              })
              .on("click", function (t) {
                let e = new CustomEvent("nodeClicked", { detail: { node: t } });
                document.dispatchEvent(e);
              });
          },
          appendTriangles: {
            top: function () {
              return this.append("circle")
                .attr("fill", "#354994")
                .attr("r", "10")
                .attr("cy", "-16")
                .attr("clip-path", "url(#clip)")
                .classed("expanded", function (t) {
                  return t.expandedTop;
                });
            },
            right: function () {
              return this.append("circle")
                .attr("fill", "#354994")
                .attr("r", "10")
                .attr("cx", "50")
                .attr("clip-path", "url(#clip)")
                .classed("expanded", function (t) {
                  return t.expandedRight;
                });
            },
            bottom: function () {
              return this.append("circle")
                .attr("fill", "#354994")
                .attr("r", "10")
                .attr("cy", "16")
                .attr("clip-path", "url(#clip)")
                .classed("expanded", function (t) {
                  return t.expandedBottom;
                });
            },
            left: function () {
              return this.append("circle")
                .attr("fill", "#354994")
                .attr("r", "10")
                .attr("cx", "-50")
                .attr("clip-path", "url(#clip)")
                .classed("expanded", function (t) {
                  return t.expandedLeft;
                });
            },
          },
          appendClipPath: function () {
            return this.append("clipPath")
              .attr("id", "clip")
              .append("use")
              .attr("xlink:href", "#rect");
          },
          setNodeTitle: function (t, e) {
            return (
              this.append("text")
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .text(e.length < 18 ? e : String(e).slice(0, 15) + "...")
                .attr("dy", "3"),
              this
            );
          },
        },
        yiddish: {
          appendLanguageInfo: function (t, e) {
            return (
              this.append("circle")
                .attr("cx", -25)
                .attr("cy", -14)
                .attr("r", 7)
                .attr("fill", "white")
                .attr("stroke-width", 0.5)
                .attr("stroke", "#7f7f7f"),
              this.append("text")
                .attr("x", -25)
                .attr("y", -12.5)
                .attr("text-anchor", "middle")
                .attr("font-size", "5px")
                .attr("fill", "#7f7f7f")
                .text((t) => {
                  return e.lexicons[t.lexicon].icon.toUpperCase();
                }),
              this
            );
          },
          appendBasicNode: function (t) {
            return this.append("rect")
              .attr("id", "rect")
              .attr("height", "30")
              .attr("width", "100")
              .attr("x", "-50")
              .attr("y", "-15")
              .attr("rx", "15")
              .attr("ry", "45")
              .classed("inner-node", !0)
              .attr("stroke-width", "1px")
              .attr("stroke", "#304F99")
              .attr("fill", function (t) {
                return "#d1daf5";
              });
          },
          appendTriangles: {
            top: function () {
              return this.append("circle")
                .attr("fill", "#304F99")
                .attr("r", "10")
                .attr("cy", "-16")
                .attr("clip-path", "url(#clip)")
                .classed("expanded", function (t) {
                  return t.expandedTop;
                });
            },
            right: function () {
              return this.append("circle")
                .attr("fill", "#304F99")
                .attr("r", "10")
                .attr("cx", "50")
                .attr("clip-path", "url(#clip)")
                .classed("expanded", function (t) {
                  return t.expandedRight;
                });
            },
            bottom: function () {
              return this.append("circle")
                .attr("fill", "#304F99")
                .attr("r", "10")
                .attr("cy", "16")
                .attr("clip-path", "url(#clip)")
                .classed("expanded", function (t) {
                  return t.expandedBottom;
                });
            },
            left: function () {
              return this.append("circle")
                .attr("fill", "#304F99")
                .attr("r", "10")
                .attr("cx", "-50")
                .attr("clip-path", "url(#clip)")
                .classed("expanded", function (t) {
                  return t.expandedLeft;
                });
            },
          },
          appendClipPath: function () {
            return this.append("clipPath")
              .attr("id", "clip")
              .append("use")
              .attr("xlink:href", "#rect");
          },
          setNodeTitle: function (t, e) {
            return (
              this.append("text")
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .text(e.length < 18 ? e : String(e).slice(0, 15) + "...")
                .attr("dy", "3")
                .attr("font-weight", "bold")
                .attr("fill", "#2b499e"),
              this
            );
          },
        },
      },
      h = {
        partOfSpeech: {
          1: { color: "#FED25C" },
          2: { color: "#ABFFAE" },
          3: { color: "#ABFFAE" },
          4: { color: "#ACFFEA" },
        },
      },
      u = function (t, e, n, i) {
        const s = this;
        (s.width = n), (s.height = i);
        let a =
          '<div class="graph-loader hidden"><div class="spin"></div></div><div class="inner-graph-container"></div>';
        e &&
          (a +=
            '<div id="toolbox"><form id="inspected-word-form"><button type="submit" value="Submit" id="inspected-word-btn">Szukaj</button><input type="text" id="inspected-word" placeholder="Słowo którego szukasz&hellip;"></form><ul class="possible-senses" style="display: none"></ul></div>'),
          (a += '<button id="download-picture"></button>');
        const p = d3.select("#" + t).html(a);
        (s.container = p), s.setVisualSettings("plWordNet");
        const u = p
          .select(d)
          .append("svg")
          .attr("width", n)
          .attr("height", i)
          .attr("id", "graph-svg");
        (s.hiddenList = d3
          .select(d)
          .append("div")
          .style("display", "none")
          .attr("pointer-events", "none")
          .attr("class", "hidden-list tooltip")
          .style("opacity", 1)),
          (s.filterHiddenListInput = s.hiddenList
            .append("div")
            .append("form")
            .append("input")
            .attr("id", "filter-search-bar")
            .attr("type", "text")
            .attr("placeholder", "Filter...")),
          s.filterHiddenListInput.on("keyup", (t, e, n) => {
            s.filterHiddenList(n[0].value);
          }),
          (s.hiddenListContent = s.hiddenList.append("div")),
          (s.sensesList = d3.select(l)),
          (s.tooltip = d3
            .select(d)
            .append("div")
            .attr("id", "node-tooltip")
            .style("opacity", 0)),
          (s.loadingAnimationHandle = d3.select(c)),
          (s.idct = 0),
          (s.nodes = new Map()),
          (s.edges = new r.EdgeContainer()),
          (s.transformed = { x: 0, y: 0, k: 1 }),
          (s.state = {
            selectedNode: null,
            selectedEdge: null,
            mouseDownNode: null,
            mouseDownLink: null,
            justDragged: !1,
            justScaleTransGraph: !1,
            lastKeyDown: -1,
            shiftNodeDrag: !1,
            selectedText: null,
            brushSelect: !1,
          }),
          (s.api = o.apiConnector),
          s.setLanguage("pl"),
          (s.settings = s.api.getSettings()),
          s.settings.then((t) => {
            h.partOfSpeech = t.partsOfSpeech;
          }),
          (s.relationTypes = s.api.getRelationTypes());
        const f = u.append("svg:defs");
        f
          .append("svg:marker")
          .attr("id", "end-arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", "8")
          .attr("markerWidth", 8)
          .attr("markerHeight", 8)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5L4,0"),
          f
            .append("svg:marker")
            .attr("id", "start-arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 2)
            .attr("refY", 5)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,5L10,0L7,5L10,10"),
          f
            .append("pattern")
            .attr("id", "flag-pl")
            .html(
              '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" id="Flag of Poland" viewBox="0 0 16 16"><rect width="16" height="20" fill="#fff"/><rect width="16" height="10" fill="#dc143c" y="4"/></svg>'
            )
            .attr("width", 16)
            .attr("height", 16),
          f
            .append("pattern")
            .attr("id", "flag-en")
            .attr("width", 16)
            .attr("height", 16)
            .html(
              '<svg x="-11" viewBox="0 0 60 60" width="36" height="28">\n    <clipPath id="t">\n        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>\n    </clipPath>\n    <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>\n    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>\n    <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4"/>\n    <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>\n    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" stroke-width="6"/>\n</svg>'
            ),
          (s.svg = u),
          (s.svgOuter = u
            .append("g")
            .classed("outer-zoom", !0)
            .attr("transform", "translate(0,0) scale(1)")),
          (s.svgG = s.svgOuter
            .append("g")
            .classed(s.consts.graphClass, !0)
            .attr("id", "wordnet-graph-g-element"));
        const g = s.svgG;
        (s.paths = g.append("g").attr("id", "all-paths-id").selectAll("g")),
          (s.pathsText = g
            .append("g")
            .attr("id", "all-paths-text-id")
            .selectAll("g")),
          (s.boats = g.append("g").attr("id", "all-boats-id").selectAll("g")),
          (s.drag = d3
            .drag()
            .subject(function (t) {
              return (
                (s.range.x.max = Math.max(t.x, s.range.x.max)),
                (s.range.y.max = Math.max(t.y, s.range.y.max)),
                (s.range.x.min = Math.min(t.x, s.range.x.min)),
                (s.range.y.min = Math.min(t.y, s.range.y.min)),
                { x: t.x, y: t.y }
              );
            })
            .on("drag", function (t) {
              (s.state.justDragged = !0), s.dragmove.call(s, t);
            })),
          d3
            .select(window)
            .on("keydown", function () {
              s.svgKeyDown.call(s);
            })
            .on("keyup", function () {
              s.svgKeyUp.call(s);
            }),
          u.on("mousedown", function (t) {
            s.svgMouseDown.call(s, t);
          }),
          u.on("mouseup", function (t) {
            s.svgMouseUp.call(s, t);
          });
        const y = d3
          .zoom()
          .on("zoom", function () {
            return !d3.event.sourceEvent.shiftKey && (s.zoomed.call(s), !0);
          })
          .on("start", function () {
            var t = d3.select("#" + s.consts.activeEditId).node();
            t && t.blur(),
              d3.event.sourceEvent.shiftKey ||
                d3.select("body").style("cursor", "move");
          })
          .on("end", function () {
            d3.select("body").style("cursor", "auto");
          });
        (s.zoom = y),
          u.call(y).on("dblclick.zoom", null),
          (window.onresize = function () {
            s.updateWindow(u);
          });
        (s.brush = d3.brush()),
          (s.brush.graph = this),
          s.brush.on("brush", function () {
            s.brushed();
          }),
          d3.select("#inspected-word-form").on("submit", function () {
            d3.event.preventDefault(), console.log("on submit");
            let t = d3.select("#inspected-word");
            s.loadNewWord(t.node().value);
          }),
          d3.select("#download-picture").on("click", function () {
            s.exportVisualization();
          }),
          (s.range = {
            x: { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER },
            y: { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER },
          });
      };
    (u.prototype.langDict = {
      colors_of_nodes: { pl: "Kolory synsetów:", en: "Synsets colors:" },
      verb: { pl: "Czasownik", en: "Verb" },
      noun: { pl: "Rzeczownik", en: "Noun" },
      adverb: { pl: "Przysłówek", en: "Adverb" },
      adjective: { pl: "Przymiotnik", en: "Adjective" },
    }),
      (u.prototype._ = function (t) {
        return this.langDict[t][this.lang];
      }),
      (u.prototype.setLanguage = function (t) {
        if (["pl", "en"].indexOf(t) < 0)
          throw {
            error: "Only 'pl' and 'en' language codes are possible",
            function: "GraphCreator.prototype.setLanguage",
          };
        (this.lang = t), this.api.setLang(t);
      }),
      (u.prototype.setVisualSettings = function (t) {
        const e = this,
          n = Object.keys(p);
        if (-1 === n.indexOf(t))
          throw (
            "Settings name '" +
            t +
            "' is invalid, please use value from [\"" +
            n.join('" or "') +
            '"]'
          );
        (e.selectedVisualSetitings = t),
          n.forEach((t) => {
            e.container.classed("style-" + t, !1);
          }),
          e.container.classed("style-" + t, !0);
      }),
      (u.prototype.withVisualSettings = function (t, e, ...n) {
        let o = p[this.selectedVisualSetitings][e];
        return (
          e instanceof Array &&
            ((o = p[this.selectedVisualSetitings]),
            e.forEach((t) => {
              o = o[t];
            })),
          o.bind(t)(this, ...n)
        );
      }),
      (u.prototype.showMiniMap = function (t, e, n, o, i, r) {
        (t = t || 0.25),
          (e = e || this.container) !== this.container && (e = d3.select(e)),
          n && i && (i = null),
          null === n && null === i && (n = 0),
          o && r && (r = null),
          null === o && null === r && (r = 0);
        let s = d3.select("#graph-svg"),
          a = t;
        this.minimap = d3
          .minimap()
          .host(this)
          .target(s)
          .targetShadowId("#all-boats-id")
          .targetShadowId("#all-paths-id")
          .minimapScale(a)
          .x(0)
          .y(0);
        let d = e
          .append("svg")
          .attr("class", "svg canvas clarin-graph-visualization")
          .attr("width", this.width * t)
          .attr("height", this.height * t)
          .attr("shape-rendering", "auto")
          .style("position", "absolute");
        null !== n && void 0 !== n && d.style("top", n),
          null !== o && void 0 !== o && d.style("right", o),
          null !== i && void 0 !== i && d.style("bottom", i),
          null !== r && void 0 !== r && d.style("left", r),
          d.call(this.minimap),
          this.minimap.render();
      }),
      (u.prototype.showLegend = function (t, e, n, o, i) {
        const r = this;
        (t = t || r.container) !== r.container && (t = d3.select(t)),
          e && o && (o = null),
          null === e && null === o && (e = 0),
          n && i && (i = null),
          null === n && null === i && (i = 0);
        let s = t
          .append("div")
          .attr("class", "legend-card clarin-graph-visualization")
          .style("position", "absolute")
          .style(
            "width",
            (r.scale ? r.scale * r.width : 0.25 * r.width) + "px"
          );
        r.settings.then((t) => {
          const e = r._.bind(r);
          s.html(
            `<h4>${e(
              "colors_of_nodes"
            )}</h4>\n        <ul>\n          <li><div class="color-demo" style="background-color: ${
              t.partsOfSpeech[1].color
            }"></div><span>${e(
              "verb"
            )}</span></li>\n          <li><div class="color-demo" style="background-color: ${
              t.partsOfSpeech[2].color
            }"></div><span>${e(
              "noun"
            )}</span></li>\n          <li><div class="color-demo" style="background-color: ${
              t.partsOfSpeech[3].color
            }"></div><span>${e(
              "adverb"
            )}</span></li>\n          <li><div class="color-demo" style="background-color: ${
              t.partsOfSpeech[4].color
            }"></div><span>${e("adjective")}</span></li>\n         </ul>`
          ),
            s
              .append("span")
              .text("x")
              .attr("class", "close-btn")
              .on("click", () => {
                s.style("display", "none");
              });
        }),
          null !== e && void 0 !== e && s.style("top", e),
          null !== n && void 0 !== n && s.style("right", n),
          null !== o && void 0 !== o && s.style("bottom", o),
          null !== i && void 0 !== i && s.style("left", i);
      }),
      (u.prototype.getHeight = function () {
        return this.height;
      }),
      (u.prototype.getWidth = function () {
        return this.width;
      }),
      (u.prototype.update = function (t) {
        this.zoom.transform(this.svg, t), this.svg.property("__zoom", t);
      }),
      (u.prototype.updateCanvasZoomExtents = function () {
        var t = this.svg.property("__zoom").k,
          e = this.svg.attr("width"),
          n = this.svg.attr("height"),
          o = this.width,
          i = this.height;
        this.zoom.translateExtent([
          [-o / t, -i / t],
          [o / t + e, i / t + n],
        ]);
      }),
      (u.prototype.showLoadingAnimation = function () {
        this.loadingAnimationHandle.classed("hidden", !1);
      }),
      (u.prototype.hideLoadingAnimation = function () {
        this.loadingAnimationHandle.classed("hidden", !0);
      }),
      (u.prototype.listPossibleSenses = function (t) {
        const e = this;
        if ((e.hideLoadingAnimation(), t)) {
          const n = function (t) {
            t && e.initializeFromSynsetId(t.id);
          };
          if (0 === t.length)
            e.sensesList
              .style("display", "block")
              .html("")
              .html("<li>nic nie znaleziono</li>");
          else if (1 === t.length) e.api.getSynsetFromSenseId(t[0].id, n);
          else {
            let o = "";
            for (let e = 0; e < t.length; e++)
              o +=
                '<li class="hidden-list-item" data-sense-id="' +
                t[e].id +
                '">' +
                t[e].lemma.word +
                "</li>\n";
            e.sensesList.style("display", "block").html("").html(o),
              d3.selectAll(".hidden-list-item").on("click", function () {
                let t = d3.select(this).attr("data-sense-id");
                e.api.getSynsetFromSenseId(t, n);
              });
          }
        }
      }),
      (u.prototype.loadNewWord = function (t) {
        this.showLoadingAnimation(),
          this.api.getSensesFromLemma(t, this.listPossibleSenses.bind(this));
      }),
      (u.prototype.initFromJson = function (t) {
        const e = this;
        try {
          const n = e.width / 2 - 25,
            o = e.height / 2 - 100,
            i = new s.GraphNode(t, n, o, {}, e, !0, !0, !0, !0);
          (i.childrenDownloaded = !0),
            e.nodes.set(i.id, i),
            e.updateWithChildrenNodes(i),
            e.rootNodeAsLastClickedAutomatically &&
              (e.updateGraph(),
              e.boats.classed("last-node-clicked", function (t) {
                return t.id === i.id;
              }));
        } catch (t) {
          console.log(t),
            window.alert("Error parsing json\nerror message: " + t.message);
        }
      }),
      (u.prototype.edgeNotExisting = function (t, e, n) {
        const o = this;
        for (let n = 0; n < o.edges.length; n++) {
          let i = o.edges[n];
          if (i.source === t && i.target === e) return !1;
          if (i.source === e && i.target === t) return !1;
        }
        if (void 0 !== n)
          for (i = 0; i < n.length; i++) {
            let o = n[i];
            if (o.source === t && o.target === e) return !1;
            if (o.source === e && o.target === t) return !1;
          }
        return !0;
      }),
      (u.prototype.addEdgesBetweenNewNodes = function (t) {
        const e = this;
        let n = function (t, n) {
          e.edges.add(t.getConnectionWithNode(n)),
            e.edges.add(n.getConnectionWithNode(t));
        };
        var o;
        (o = t).forEach((t) => {
          o.forEach((e) => {
            t !== e && n(t, e);
          });
        }),
          (function (t) {
            e.nodes.forEach((e) => {
              t.forEach((t) => {
                e !== t && n(e, t);
              });
            });
          })(t);
      }),
      (u.prototype.updateWithChildrenNodes = function (t) {
        const e = this;
        let n = [];
        function o(o, i, s) {
          o &&
            t[i].forEach((o, a) => {
              (o = t[i][a]),
                e.nodes.has(o.id) || (e.nodes.set(o.id, o), n.push(o)),
                o.isNodeCumulator() &&
                  e.edges.add(new r.Edge(t, o, s, o.parentRel));
            });
        }
        o(t.expandedTop, "childrenTopRef", [0, 2]),
          o(t.expandedRight, "childrenRightRef", [1, 3]),
          o(t.expandedBottom, "childrenBottomRef", [2, 0]),
          o(t.expandedLeft, "childrenLeftRef", [3, 1]),
          e.addEdgesBetweenNewNodes(n),
          e.updateGraph();
      }),
      (u.prototype.consts = {
        selectedClass: "selected",
        connectClass: "connect-node",
        boatGClass: "conceptG",
        graphClass: "graph",
        activeEditId: "active-editing",
        BACKSPACE_KEY: 8,
        DELETE_KEY: 46,
        ENTER_KEY: 13,
        CTRL_KEY: 17,
        nodeRadius: 50,
        nodeDistance: 225,
        nodeHeight: 35,
        nodeWidth: 50,
        maxDefaultNodesVertically: 6,
        maxDefaultNodesHorizontally: 6,
      }),
      (u.prototype.showBrush = function () {
        const t = this;
        (t.state.brushSelect = !0),
          t.brushHandle ||
            (t.brushHandle = t.svg
              .append("g")
              .attr("class", "brush")
              .call(t.brush));
      }),
      (u.prototype.destroyBrush = function () {
        const t = this;
        t.brushHandle && (t.brushHandle.remove(), (t.brushHandle = null));
      }),
      (u.prototype.exitBrushMode = function () {
        const t = this;
        t.state.brushSelect && (t.unmarkAllNodes(), (t.state.brushSelect = !1));
      }),
      (u.prototype.unmarkAllNodes = function () {
        this.nodes.forEach(function (t) {
          t.unmarkSelected();
        }),
          this.updateGraph();
      }),
      (u.prototype.getPointInvertedTranslation = function (t, e, n) {
        return (t - e * (1 - n)) / n - e;
      }),
      (u.prototype.getPointTransform = function (t, e, n) {
        return (t + e) * n + e * (1 - n);
      }),
      (u.prototype.getPointTransformX = function (t) {
        return this.getPointTransform(
          t,
          this.transformed.x,
          this.transformed.k
        );
      }),
      (u.prototype.getPointTransformY = function (t) {
        return this.getPointTransform(
          t,
          this.transformed.y,
          this.transformed.k
        );
      }),
      (u.prototype.markNodesSelectedInRange = function (t) {
        let e = t[0][0],
          n = t[1][0],
          o = t[0][1],
          i = t[1][1];
        const r = this.transformed.x,
          s = this.transformed.y,
          a = this.transformed.k;
        (e = this.getPointInvertedTranslation(e, r, a)),
          (n = this.getPointInvertedTranslation(n, r, a)),
          (o = this.getPointInvertedTranslation(o, s, a)),
          (i = this.getPointInvertedTranslation(i, s, a)),
          this.nodes.forEach(function (t) {
            t.x > e && t.x < n && t.y > o && t.y < i
              ? t.markSelected()
              : t.unmarkSelected();
          }),
          this.updateGraph();
      }),
      (u.prototype.brushed = function () {
        const t = this,
          e = d3.event.selection;
        null === e ? t.unmarkAllNodes() : t.markNodesSelectedInRange(e);
      }),
      (u.prototype.dragmove = function (t) {
        const e = this;
        e.state.shiftNodeDrag
          ? e.dragLine.attr(
              "d",
              "M" +
                t.x +
                "," +
                t.y +
                "L" +
                d3.mouse(e.svgG.node())[0] +
                "," +
                d3.mouse(this.svgG.node())[1]
            )
          : (t.selected || e.exitBrushMode(),
            e.state.brushSelect
              ? e.nodes.forEach(function (t) {
                  t.selected && ((t.x += d3.event.dx), (t.y += d3.event.dy));
                })
              : ((t.x += d3.event.dx), (t.y += d3.event.dy)),
            e.updateGraph());
      }),
      (u.prototype.deleteGraph = function (t) {
        const e = this;
        let n = !0;
        t || (n = window.confirm("Press OK to delete this graph")),
          n &&
            ((e.nodes = new Map()),
            (e.edges = new r.EdgeContainer()),
            e.resetZoom());
      }),
      (u.prototype.selectElementContents = function (t) {
        var e = document.createRange();
        e.selectNodeContents(t);
        var n = window.getSelection();
        n.removeAllRanges(), n.addRange(e);
      }),
      (u.prototype.getNodeTitle = function (t, e) {
        this.withVisualSettings(t, "setNodeTitle", e);
      }),
      (u.prototype.spliceLinksForNode = function (t) {
        const e = this;
        e.edges
          .filter(function (e) {
            return e.source === t || e.target === t;
          })
          .map(function (t) {
            e.edges.splice(e.edges.indexOf(t), 1);
          });
      }),
      (u.prototype.svgMouseDown = function () {
        (this.state.graphMouseDown = !0),
          (this.state.brushSelect = !1),
          this.sensesList.style("display", "none"),
          this.hideHiddenList(),
          this.unmarkAllNodes();
      }),
      (u.prototype.svgMouseUp = function () {
        const t = this,
          e = t.state;
        if (e.justScaleTransGraph) e.justScaleTransGraph = !1;
        else if (e.graphMouseDown && d3.event.shiftKey) {
          const e = d3.mouse(t.svgG.node()),
            n = { id: t.idct++, title: h.defaultTitle, x: e[0], y: e[1] };
          t.nodes.push(n), t.updateGraph();
        } else
          e.shiftNodeDrag &&
            ((e.shiftNodeDrag = !1), t.dragLine.classed("hidden", !0));
        e.graphMouseDown = !1;
      }),
      (u.prototype.svgKeyDown = function () {
        const t = this,
          e = t.state,
          n = t.consts;
        if (-1 !== e.lastKeyDown) return;
        e.lastKeyDown = d3.event.keyCode;
        const o = e.selectedNode,
          i = e.selectedEdge;
        switch (d3.event.keyCode) {
          case n.BACKSPACE_KEY:
            break;
          case n.CTRL_KEY:
            t.showBrush();
            break;
          case n.DELETE_KEY:
            o
              ? (t.nodes.splice(t.nodes.indexOf(o), 1),
                t.spliceLinksForNode(o),
                (e.selectedNode = null),
                t.updateGraph())
              : i &&
                (t.edges.splice(t.edges.indexOf(i), 1),
                (e.selectedEdge = null),
                t.updateGraph());
        }
      }),
      (u.prototype.svgKeyUp = function () {
        this.destroyBrush(), (this.state.lastKeyDown = -1);
      }),
      (u.prototype.removeNodeEdges = function (t) {
        this.edges.deleteNodeEdges(t);
      }),
      (u.prototype.removeNode = function (t) {
        const e = this;
        e.removeNodeEdges(t);
        const n = t.getAllChildrenRef();
        for (let t = 0; t < n.length; t++) e.removeNode(n[t]);
        t.reset(), e.nodes.delete(t.id);
      }),
      (u.prototype.removeNodeChildren = function (t, e) {
        const n = this;
        let o;
        o = void 0 !== e ? t.getChildrenAtPosition(e) : t.getAllChildrenRef();
        for (let t = 0; t < o.length; t++) n.removeNode(o[t]);
        n.updateGraph();
      }),
      (u.prototype.getXlinkHref = function (t) {
        return "#" + t;
      }),
      (u.prototype.firefoxAngularBaseXlinkHrefFix = function () {
        this.getXlinkHref = (t) => location.href + "#" + t;
      }),
      (u.prototype.updateGraph = function () {
        const t = this,
          e = t.consts,
          n = t.state,
          o = Array.from(t.nodes.values());
        (t.boats = d3
          .select("#all-boats-id")
          .selectAll("g")
          .data(o, function (t) {
            return t.id + t.label;
          })),
          t.boats
            .attr("transform", function (t) {
              return "translate(" + t.x + "," + t.y + ")";
            })
            .classed("node-selected", function (t) {
              return t.selected;
            })
            .on("mouseover", function (e) {
              const n = e.x,
                o = e.y,
                i = t.transformed;
              e.label.length >= 18 &&
                t.showTooltip(
                  t.getPointTransformX(n) + 70 * i.k,
                  t.getPointTransformY(o) - 15,
                  e.label
                );
            })
            .on("mouseout", function () {
              t.hideTooltip();
            });
        const i = t.boats.enter().append("g");
        i
          .classed(e.boatGClass, !0)
          .attr("transform", function (e) {
            return (
              (t.range.x.max = Math.max(e.x, t.range.x.max)),
              (t.range.y.max = Math.max(e.y, t.range.y.max)),
              (t.range.x.min = Math.min(e.x, t.range.x.min)),
              (t.range.y.min = Math.min(e.y, t.range.y.min)),
              "translate(" + e.x + "," + e.y + ")"
            );
          })
          .call(t.drag),
          i
            .filter((t) => t.isNodeCumulator())
            .append("circle")
            .attr("r", 25)
            .attr("stroke-width", "1px")
            .attr("stroke", "black")
            .attr("fill", "#aaffaf")
            .classed("inner-node", !0)
            .on("click", function (e) {
              d3.event.preventDefault(), (t.lastClickedNodeCumulator = e);
              let n = e.getHiddenListHtml();
              t.hiddenList
                .style("display", "block")
                .style(
                  "left",
                  t.transformed.x + (e.x + 30) * t.transformed.k + "px"
                )
                .style(
                  "top",
                  t.transformed.y + (e.y + 15) * t.transformed.k + "px"
                ),
                t.hiddenListContent.style("display", "block").html(n.html),
                e.addOnclickToCreatedNodes(t, n.createdIds, n.hiddenRef, this),
                t.addOnClickToCreatedRelGroups();
            });
        let r = i.filter((t) => !t.isNodeCumulator());
        t.withVisualSettings(r, "appendBasicNode").on("click", function (e) {
          t.boats.classed("last-node-clicked", function (t) {
            return t.id === e.id;
          });
          let n = new CustomEvent("nodeClicked", { detail: { node: e } });
          document.dispatchEvent(n);
        }),
          t.settings.then((t) => {
            (t.lexicons[4] = { icon: "Yi" }),
              (t.lexicons[5] = { icon: "Ge" }),
              this.withVisualSettings(r, "appendLanguageInfo", t);
          }),
          i.each(function (e) {
            t.appendChildrenButtons(d3.select(this), e);
          }),
          i.each(function (e) {
            t.getNodeTitle(d3.select(this), e.label);
          });
        try {
          t.boats.enter().merge(d3.select("#all-boats-id").selectAll("text"));
        } catch (t) {
          console.log(t);
        }
        t.boats.exit().remove();
        let s = Array.from(t.edges.values());
        const a = d3
          .select("#all-paths-id")
          .selectAll("path")
          .data(s, function (t) {
            return t.id;
          })
          .classed(e.selectedClass, function (t) {
            return t === n.selectedEdge;
          })
          .attr("d", function (t) {
            return (
              "M" +
              t.source.x +
              "," +
              t.source.y +
              "L" +
              t.target.x +
              "," +
              t.target.y
            );
          });
        a.exit().remove(),
          a
            .enter()
            .append("path")
            .merge(a)
            .style("marker-end", (t) =>
              t.pathTextSrc ? "url(#end-arrow)" : ""
            )
            .style("marker-start", (t) =>
              t.pathTextTarget ? "url(#start-arrow)" : ""
            )
            .style("stroke-width", "1.25")
            .classed("link", !0)
            .classed("dotted", function (t) {
              return t.dotted;
            })
            .attr("stroke", function (t) {
              return t.color;
            })
            .attr("d", function (e) {
              const n = t.getConnectionPoints(e);
              return e.target.isNodeCumulator()
                ? "M" +
                    n.source.x +
                    "," +
                    n.source.y +
                    "L" +
                    e.target.x +
                    "," +
                    e.target.y
                : "M" +
                    n.source.x +
                    "," +
                    n.source.y +
                    "L" +
                    n.target.x +
                    "," +
                    n.target.y;
            })
            .attr("id", function (t, e) {
              return "path_" + String(t.source.id) + "-" + String(t.target.id);
            });
        const d = d3
            .select("#all-paths-text-id")
            .selectAll("text")
            .data(s, function (t, e) {
              return String(t.source.id) + "-" + String(t.target.id);
            }),
          l = d
            .enter()
            .append("text")
            .classed("relation-text", !0)
            .attr("dy", -5);
        l.exit().remove(),
          l
            .append("textPath")
            .on("mouseover", (e) => {
              let n = t.getRelationTooltipCoordinates(
                e.source,
                e.connectionPoints[0]
              );
              t.relationTypes.then((o) => {
                let i = o.find((t) => t.short_name === e.pathTextSrc);
                i && t.showTooltip(n.x, n.y, i.description);
              });
            })
            .on("mouseout", function () {
              t.hideTooltip();
            })
            .attr("startOffset", "5%")
            .attr("xlink:href", (e) =>
              t.getXlinkHref(
                "path_" + String(e.source.id) + "-" + String(e.target.id)
              )
            )
            .append("tspan")
            .attr("data-text", function (t) {
              return (this.text = t.pathTextSrc || "__hidden__"), t.pathTextSrc;
            })
            .attr("fill", function (t) {
              return "__hidden__" === this.text ? "none" : "black";
            }),
          l
            .append("textPath")
            .on("mouseover", (e) => {
              let n = t.getRelationTooltipCoordinates(
                e.target,
                e.connectionPoints[1]
              );
              t.relationTypes.then((o) => {
                let i = o.find((t) => t.short_name === e.pathTextTarget);
                i && t.showTooltip(n.x, n.y, i.description);
              });
            })
            .on("mouseout", function () {
              t.hideTooltip();
            })
            .attr("startOffset", "95%")
            .attr("text-anchor", "end")
            .attr("xlink:href", (e) =>
              t.getXlinkHref(
                "path_" + String(e.source.id) + "-" + String(e.target.id)
              )
            )
            .append("tspan")
            .attr("dy", 15)
            .attr("data-text", function (t) {
              return (this.text = t.pathTextTarget || ""), t.pathTextTarget;
            }),
          d.exit().remove(),
          t.minimap && (t.minimap.updateMaxValues(t.range), t.minimap.render()),
          t.rotatePaths();
      }),
      (u.prototype.rotatePaths = function () {
        d3.select("#all-paths-text-id")
          .selectAll("text")
          .each((t, e, n) => {
            d3.select(n[e])
              .selectAll("tspan")
              .attr("data-rotate", (t, e, n) => {
                let o =
                    Math.atan2(
                      t.source.y - t.target.y,
                      t.source.x - t.target.x
                    ) *
                    (180 / Math.PI),
                  i = (o <= 0 && o >= -90) || (o >= 0 && o <= 90);
                return (t.rotate = i), i;
              })
              .attr("rotate", (t) => (t.rotate ? 180 : 0))
              .text(function (t) {
                return t.rotate
                  ? this.text.split("").reverse().join("")
                  : this.text;
              });
          });
      }),
      (u.prototype.showTooltip = function (t, e, n) {
        this.tooltip.transition().duration(100).style("opacity", 0.9),
          this.tooltip
            .html(n)
            .style("left", t + "px")
            .style("top", e + "px");
      }),
      (u.prototype.hideTooltip = function () {
        this.tooltip.transition().duration(200).style("opacity", 0);
      }),
      (u.prototype.getRelationTooltipCoordinates = function (t, e) {
        const n = this;
        let o = { x: n.getPointTransformX(t.x), y: n.getPointTransformY(t.y) };
        switch (e) {
          case 0:
            (o.x += 30 * n.transformed.k), (o.y -= 70 * n.transformed.k);
            break;
          case 1:
            (o.x += 70 * n.transformed.k), (o.y -= 15 * n.transformed.k);
            break;
          case 2:
            o.x += 30 * n.transformed.k;
            break;
          case 3:
            (o.x -= 30 * n.transformed.k), (o.y -= 15 * n.transformed.k);
        }
        return o;
      }),
      (u.prototype.appendChildrenButtons = function (t, e) {
        const n = this;
        n.withVisualSettings(t, "appendClipPath"),
          e.childrenTop.length > 0 &&
            n
              .withVisualSettings(t, ["appendTriangles", "top"])
              .on("click", function () {
                e.expandTriangleClick(n, this, 0);
              }),
          e.childrenRight.length > 0 &&
            n
              .withVisualSettings(t, ["appendTriangles", "right"])
              .on("click", function () {
                e.expandTriangleClick(n, this, 1);
              }),
          e.childrenBottom.length > 0 &&
            n
              .withVisualSettings(t, ["appendTriangles", "bottom"])
              .on("click", function () {
                e.expandTriangleClick(n, this, 2);
              }),
          e.childrenLeft.length > 0 &&
            n
              .withVisualSettings(t, ["appendTriangles", "left"])
              .on("click", function () {
                e.expandTriangleClick(n, this, 3);
              });
      }),
      (u.prototype.getConnectionPoints = function (t) {
        const e = this;
        try {
          return {
            source: e.getConnectionPoint(
              t.connectionPoints[0],
              t.source.x,
              t.source.y
            ),
            target: e.getConnectionPoint(
              t.connectionPoints[1],
              t.target.x,
              t.target.y
            ),
          };
        } catch (e) {
          console.log(t);
        }
      }),
      (u.prototype.getConnectionPoint = function (t, e, n) {
        const o = this,
          i = { x: e, y: n };
        switch (t) {
          case 0:
            i.y -= o.consts.nodeHeight / 2 - 1;
            break;
          case 1:
            i.x += 51;
            break;
          case 2:
            i.y += o.consts.nodeHeight / 2 - 1;
            break;
          case 3:
            i.x -= 51;
        }
        return i;
      }),
      (u.prototype.zoomed = function (t) {
        (t = t || d3.event.transform),
          (this.state.justScaleTransGraph = !0),
          d3.select("." + this.consts.graphClass).attr("transform", t),
          (this.transformed = t),
          this.hideHiddenList(),
          this.minimap && this.minimap.update(t);
      }),
      (u.prototype.updateWindow = function (t) {
        const e = document.documentElement,
          n = document.getElementsByTagName("body")[0],
          o = window.innerWidth || e.clientWidth || n.clientWidth,
          i = window.innerHeight || e.clientHeight || n.clientHeight;
        t.attr("width", o).attr("height", i);
      }),
      (u.prototype.initializeFromSynsetId = function (t) {
        const e = this;
        e.api.getGraph(t, function (t) {
          !(function (t) {
            t.length < 1
              ? window.alert("Sorry, could not display requested data.")
              : (e.deleteGraph(!0),
                e.firstInit ? e.updateGraph() : (e.firstInit = !0),
                e.initFromJson(t));
          })(t);
        });
      }),
      (u.prototype.exportVisualization = function () {
        const t = this.getSVGString(this.svg.node());
        this.svgString2Image(
          t,
          2 * this.width,
          2 * this.height,
          "png",
          function (t, e) {
            Object(a.saveAs)(t, "wordnet-graph.png");
          }
        );
      }),
      (u.prototype.getSVGString = function (t) {
        t.setAttribute("xlink", "http://www.w3.org/1999/xlink"),
          (function (t, e) {
            const n = document.createElement("style");
            n.setAttribute("type", "text/css"), (n.innerHTML = t);
            const o = e.hasChildNodes() ? e.children[0] : null;
            e.insertBefore(n, o);
          })(
            (function (t) {
              let e = [];
              e.push("#" + t.id);
              for (let n = 0; n < t.classList.length; n++)
                i("." + t.classList[n], e) || e.push("." + t.classList[n]);
              const n = t.getElementsByTagName("*");
              for (let t = 0; t < n.length; t++) {
                let o = n[t].id;
                i("#" + o, e) || e.push("#" + o);
                const r = n[t].classList;
                for (let t = 0; t < r.length; t++)
                  i("." + r[t], e) || e.push("." + r[t]);
              }
              let o = "";
              for (let t = 0; t < document.styleSheets.length; t++) {
                let n = document.styleSheets[t];
                try {
                  if (!n.cssRules) continue;
                } catch (t) {
                  if ("SecurityError" !== t.name) throw t;
                  continue;
                }
                let r = n.cssRules;
                for (let t = 0; t < r.length; t++)
                  i(r[t].selectorText, e) && (o += r[t].cssText);
              }
              return o;
              function i(t, e) {
                return !(-1 === e.indexOf(t));
              }
            })(t),
            t
          );
        let e = new XMLSerializer().serializeToString(t);
        return (e = (e = e.replace(/(\w+)?:?xlink=/g, "xmlns:xlink=")).replace(
          /NS\d+:href/g,
          "xlink:href"
        ));
      }),
      (u.prototype.svgString2Image = function (t, e, n, o, i) {
        o = o || "png";
        const r =
            "data:image/svg+xml;base64," +
            btoa(unescape(encodeURIComponent(t))),
          s = document.createElement("canvas"),
          a = s.getContext("2d");
        (s.width = e), (s.height = n);
        const d = new Image();
        (d.onload = function () {
          a.clearRect(0, 0, e, n),
            a.drawImage(d, 0, 0, e, n),
            s.toBlob(function (t) {
              const e = Math.round(t.length / 1024) + " KB";
              i && i(t, e);
            });
        }),
          (d.src = r);
      }),
      (u.prototype.resetZoom = function () {
        const t = this;
        let e = d3.zoomIdentity;
        t.zoomed(e),
          t.svg.property("__zoom", e),
          t.minimap && t.minimap.resetScale();
      }),
      (u.prototype.resizeSVG = function (t, e) {
        this.svg.attr("width", t).attr("height", e);
      }),
      (u.prototype.hideHiddenList = function () {
        (this.hiddenList.node().scrollTop = 0),
          this.hiddenList.style("display", "none"),
          (this.hiddenItems = null),
          (this.filterHiddenListInput.node().value = ""),
          this.hiddenList.style("display", "none");
      }),
      (u.prototype.initHiddenListItemsRefs = function () {
        this.hiddenItems = this.hiddenListContent.selectAll(".hidden-item");
      }),
      (u.prototype.filterHiddenList = function (t) {
        this.hiddenItems || this.initHiddenListItemsRefs(),
          this.hiddenItems.style("display", "list-item"),
          this.hiddenItems
            .filter((e, n, o) => {
              if (o[n].innerHTML.toLowerCase().indexOf(t.toLowerCase()) < 0)
                return !0;
            })
            .style("display", "none");
      }),
      (u.prototype.addOnClickToCreatedRelGroups = function () {
        this.hiddenListContent.selectAll(".rel-group").each((t, e, n) => {
          n[e].children[0].onclick = function () {
            n[e].classList.toggle("minified");
          };
        });
      }),
      (u.prototype.getRootNode = function () {
        const t = this;
        for (let [e, n] of t.nodes) if (n.isRootNode()) return n;
        return null;
      }),
      (u.prototype.setRootNodeAsLastClickedAutomatically = function (t) {
        this.rootNodeAsLastClickedAutomatically = t || !0;
      });
  },
  function (t, e, n) {
    "use strict";
    n.r(e),
      n.d(e, "GraphNode", function () {
        return a;
      });
    var o = n(1),
      i = n(2),
      r = n(0);
    let s = {
      calculateEllipseY: function (t, e, n, o, i, r) {
        return r
          ? o + Math.sqrt(e * e - (1 - (i - n) * (i - n)) / (t * t))
          : o - Math.sqrt(e * e - (1 - (i - n) * (i - n)) / (t * t));
      },
      calculateEllipseX: function (t, e, n, o, i, r) {
        return r
          ? n - Math.sqrt(e * e - (1 - (i - o) * (i - o)) / (t * t))
          : n + Math.sqrt(e * e - (1 - (i - o) * (i - o)) / (t * t));
      },
      distributeNode: function (t, e, n) {
        return -(n * t * 2) / 2 + 2 * t * (e + 1) - t;
      },
      assignPlace: function (t, e, n, o, r) {
        const a = i.GraphCreator.prototype.consts;
        switch (
          ((r =
            r >= a.maxDefaultNodesHorizontally
              ? a.maxDefaultNodesHorizontally
              : r),
          t)
        ) {
          case "top":
            (n.x = e.x + s.distributeNode(a.nodeWidth + 2, o, r)),
              (n.y = -200 + s.calculateEllipseY(8, 1, e.x, e.y, n.x, !0));
            break;
          case "right":
            (n.y = e.y + s.distributeNode(a.nodeHeight - 15, o, r)),
              (n.x = 200 + s.calculateEllipseX(3, 1, e.x, e.y, n.y, !0));
            break;
          case "bottom":
            (n.x = e.x + s.distributeNode(a.nodeWidth + 10, o, r)),
              (n.y = e.y + a.nodeDistance),
              (n.y = 200 + s.calculateEllipseY(8, 1, e.x, e.y, n.x, !1));
            break;
          case "left":
            (n.x = e.x - a.nodeDistance),
              (n.y = e.y + s.distributeNode(a.nodeHeight - 15, o, r)),
              (n.x = -200 + s.calculateEllipseX(3, 1, e.x, e.y, n.y, !1));
        }
      },
    };
    const a = function (t, e, n, o, i, r, s, a, d) {
      let l = this;
      (l.graph = i),
        t &&
          ((l.parentId = o.id || null),
          (l.parent = o || null),
          (t = l.prepareJson(t)),
          (l.id = t.id),
          (l.label = t.label),
          (l.partOfSpeechId = t.pos),
          (l.lexicon = t.lex),
          l.assignColorBasedFromPartOfSpeech(),
          (l.x = e || 0),
          (l.y = n || 0),
          (l.childrenTop = t.top.expanded.concat(t.top.hidden)),
          (l.childrenRight = t.right.expanded.concat(t.right.hidden)),
          (l.childrenBottom = t.bottom.expanded.concat(t.bottom.hidden)),
          (l.childrenLeft = t.left.expanded.concat(t.left.hidden)),
          (l.parentRel = t.rel),
          (l.childrenTopRef = []),
          (l.childrenRightRef = []),
          (l.childrenBottomRef = []),
          (l.childrenLeftRef = []),
          (l.cumulativeNodes = {}),
          l.addCumulativeChildren(t),
          l.initChildren(
            t.top.expanded,
            t.right.expanded,
            t.bottom.expanded,
            t.left.expanded
          )),
        (l.selected = !1),
        (l.expandedTop = r || !1),
        (l.expandedRight = s || !1),
        (l.expandedLeft = d || !1),
        (l.expandedBottom = a || !1),
        (l.childrenDownloaded = !1);
    };
    (a.prototype.reset = function () {
      (this.expandedTop = !1),
        (this.expandedRight = !1),
        (this.expandedLeft = !1),
        (this.expandedBottom = !1);
    }),
      (a.prototype.assignPlace = function (t, e, n) {
        s.assignPlace(t, this.parent, this, e, n);
      }),
      (a.prototype.initChildren = function (t, e, n, o) {
        const i = this;
        function r(t, e, n) {
          let o,
            r = t.length + i[e].length;
          for (let s = 0; s < t.length; s++)
            (o = i.graph.nodes.get(t[s].id)) ||
              ((o = new a(t[s], 0, 0, i, i.graph)).assignPlace(n, s, r),
              i[e].push(o));
          i.childrenDownloaded = !0;
        }
        r(t, "childrenTopRef", "top"),
          r(e, "childrenRightRef", "right"),
          r(n, "childrenBottomRef", "bottom"),
          r(o, "childrenLeftRef", "left");
      }),
      (a.prototype.prepareJson = function (t) {
        function e(t, e) {
          t[e] || (t[e] = { expanded: [], hidden: [] }),
            t[e].expanded || (t[e].expanded = []),
            t[e].hidden || (t[e].hidden = []);
        }
        return e(t, "top"), e(t, "right"), e(t, "bottom"), e(t, "left"), t;
      }),
      (a.prototype.addCumulativeChildren = function (t) {
        const e = this;
        function n(n) {
          let o;
          (e.cumulativeNodes[n] = null),
            t[n].hidden.length > 0 &&
              0 !== t[n].expanded.length &&
              ((o = new d(
                {
                  id: "-" + t[n].hidden[0].id,
                  type: { color: "green" },
                  rel: [null, null],
                },
                e,
                t[n].hidden,
                n
              )).assignPlace(
                n,
                e["children" + n.charAt(0).toUpperCase() + n.slice(1) + "Ref"]
                  .length + 1,
                e["children" + n.charAt(0).toUpperCase() + n.slice(1) + "Ref"]
                  .length - 2
              ),
              e[
                "children" + n.charAt(0).toUpperCase() + n.slice(1) + "Ref"
              ].push(o)),
            (e.cumulativeNodes[n] = o);
        }
        n("top"), n("right"), n("bottom"), n("left");
      }),
      (a.prototype.addChildrenAtPosIfNotParent = function (t, e) {
        let n = this;
        n[e] = n[e].concat(t.filter((t) => t.id !== n.parentId));
      }),
      (a.prototype.addToCumulativeNode = function (t, e) {
        const n = this;
        (e = ["top", "right", "bottom", "left"][e]),
          t.forEach((t) => {
            n.cumulativeNodes[e].addHiddenNode(t);
          });
      }),
      (a.prototype.updateChildrenPosition = function (t) {
        let e = this,
          n = ["Top", "Right", "Bottom", "Left"][t],
          o = e["children" + n + "Ref"],
          i = o.slice(5);
        i.length > 0 && e.addToCumulativeNode(i, t),
          (o = o.slice(0, 5)),
          (e["children" + n + "Ref"] = o),
          o.forEach((t, e) => {
            t.assignPlace(n.toLowerCase(), e, o.length);
          });
      }),
      (a.prototype.updateChildren = function (t, e) {
        this.childrenDownloaded ||
          ((t = this.prepareJson(t)),
          this.addChildrenAtPosIfNotParent(t.top.hidden, "childrenTop"),
          this.addChildrenAtPosIfNotParent(t.right.hidden, "childrenRight"),
          this.addChildrenAtPosIfNotParent(t.bottom.hidden, "childrenBottom"),
          this.addChildrenAtPosIfNotParent(t.left.hidden, "childrenLeft"),
          (this.childrenTopRef = []),
          (this.childrenRightRef = []),
          (this.childrenBottomRef = []),
          (this.childrenLeftRef = []),
          this.addCumulativeChildren(t),
          this.initChildren(
            t.top.expanded,
            t.right.expanded,
            t.bottom.expanded,
            t.left.expanded
          ),
          (this.expandedTop = 0 === e),
          (this.expandedRight = 1 === e),
          (this.expandedBottom = 2 === e),
          (this.expandedLeft = 3 === e),
          (this.childrenDownloaded = !0));
      }),
      (a.prototype.markSelected = function () {
        this.selected = !0;
      }),
      (a.prototype.unmarkSelected = function () {
        this.selected = !1;
      }),
      (a.prototype.assignColorBasedFromPartOfSpeech = function () {
        let t;
        (t = i.consts.partOfSpeech[this.partOfSpeechId]
          ? i.consts.partOfSpeech[this.partOfSpeechId].color
          : "#F0E68C"),
          (this.type = { color: t });
      }),
      (a.prototype.nodeType = "ordinary"),
      (a.prototype.getType = function () {
        return "ordinary";
      }),
      (a.prototype.api = o.apiConnector),
      (a.prototype.consts = {
        DIRECTIONS: { TOP: 0, RIGHT: 1, BOTTOM: 2, LEFT: 3 },
      }),
      (a.prototype.getChildrenWithCallback = function (t) {
        const e = this;
        e.childrenDownloaded
          ? t(e.apiData)
          : e.api.getGraph(e.id, function (n) {
              (e.apiData = n), t(n);
            });
      }),
      (a.prototype.expandTopClick = function (t, e) {
        (this.expandedTop = !0),
          this.findNewPlace(t),
          this.getChildrenWithCallback(e);
      }),
      (a.prototype.expandRightClick = function (t, e) {
        (this.expandedRight = !0),
          this.findNewPlace(t),
          this.getChildrenWithCallback(e);
      }),
      (a.prototype.expandBottomClick = function (t, e) {
        (this.expandedBottom = !0),
          this.findNewPlace(t),
          this.getChildrenWithCallback(e);
      }),
      (a.prototype.expandLeftClick = function (t, e) {
        (this.expandedLeft = !0),
          this.findNewPlace(t),
          this.getChildrenWithCallback(e);
      }),
      (a.prototype.moveChildren = function (t) {
        const e = this.getAllChildrenRef();
        for (let n = 0; n < e.length; n++) {
          let o = [e[n].x - t[0], e[n].y - t[1]];
          e[n].assignNewPosition(o), e[n].moveChildren(t);
        }
      }),
      (a.prototype.getChildrenAtPosition = function (t) {
        const e = this;
        switch (t) {
          case 0:
            return e.childrenTopRef;
          case 1:
            return e.childrenRightRef;
          case 2:
            return e.childrenBottomRef;
          case 3:
            return e.childrenLeftRef;
        }
      }),
      (a.prototype.connectionPointTypes = {
        0: [0, 2],
        1: [1, 3],
        2: [2, 0],
        3: [3, 1],
        top: [0, 2],
        right: [1, 3],
        bottom: [2, 0],
        left: [3, 1],
      }),
      (a.prototype.getConnectionWithNode = function (t) {
        const e = this;
        for (let [n, o] of [
          "childrenTop",
          "childrenRight",
          "childrenBottom",
          "childrenLeft",
        ].entries()) {
          let i = e[o].filter((e) => e.id === t.id)[0];
          if (i) return new r.Edge(e, t, e.connectionPointTypes[n], i.rel);
        }
        return null;
      }),
      (a.prototype.getAllChildren = function () {
        return this.childrenTop.concat(
          this.childrenRight,
          this.childrenBottom,
          this.childrenLeft
        );
      }),
      (a.prototype.getAllChildrenRef = function () {
        return this.childrenTopRef.concat(
          this.childrenRightRef,
          this.childrenBottomRef,
          this.childrenLeftRef
        );
      }),
      (a.prototype.assignNewPosition = function (t) {
        (this.x = t[0]), (this.y = t[1]);
      }),
      (a.prototype.findNewPlace = function (t) {
        const e = this;
        let n = [e.x, e.y],
          o = 20,
          i = 10;
        for (; !e.checkIfSpaceInRegion(n, t) && i > 0; )
          (n = e.calculatePossibleNewPosition(o)), (o += 20), i--;
        return (
          e.moveChildren([e.x - n[0], e.y - n[1]]), e.assignNewPosition(n), n
        );
      }),
      (a.prototype.checkIfSpaceInRegion = function (t, e) {
        const n = this,
          o = t[0],
          i = t[1],
          r = n.getAllChildrenRef();
        for (let [t, s] of e) {
          if (r.indexOf(s) > -1) continue;
          const t = s.x,
            e = s.y;
          if (
            n.expandedTop &&
            n.checkIfPointInRange(t, e, o - 500, o + 500, i - 500, i)
          )
            return !1;
          if (
            n.expandedRight &&
            n.checkIfPointInRange(t, e, o, o + 1e3, i - 250, i + 250)
          )
            return !1;
          if (
            n.expandedBottom &&
            n.checkIfPointInRange(t, e, o - 500, o + 500, i, i + 500)
          )
            return !1;
          if (
            n.expandedLeft &&
            n.checkIfPointInRange(t, e, o - 1e3, o, i - 250, i + 250)
          )
            return !1;
        }
        return !0;
      }),
      (a.prototype.checkIfPointInRange = function (t, e, n, o, i, r) {
        return t > n && t < o && e > i && e < r;
      }),
      (a.prototype.calculatePossibleNewPosition = function (t) {
        const e = this,
          n = e.parent,
          o = n.x - e.x,
          i = n.y - e.y;
        let r = e.x,
          s = e.y;
        if (!e.parent.x || !e.parent.y) return [r, s];
        const a = i / o;
        return (
          0 === o || Math.abs(o) < 50
            ? (s = i > 0 ? e.y - t : e.y + t)
            : 0 === i && o < 0
            ? (r = e.x + t)
            : i < 0
            ? a < 0
              ? ((r = e.x - t), (s = e.y - t * a))
              : ((r = e.x + t), (s = e.y + t * a))
            : a < 0
            ? ((r = e.x + t), (s = e.y + t * a))
            : ((r = e.x - t), (s = e.y - t * a)),
          [r, s]
        );
      }),
      (a.prototype.isNodeCumulator = function () {
        return !1;
      }),
      (a.prototype.expandTriangleClick = function (t, e, n) {
        const o = this,
          i = [
            "expandedTop",
            "expandedRight",
            "expandedBottom",
            "expandedLeft",
          ][n],
          r = [
            "expandTopClick",
            "expandRightClick",
            "expandBottomClick",
            "expandLeftClick",
          ][n];
        o[i]
          ? ((o[i] = !1),
            t.removeNodeChildren(o, n),
            d3.select(e).classed("expanded", !1),
            o.graph.hideLoadingAnimation())
          : (o.graph.showLoadingAnimation(),
            o[r](t.nodes, function (i) {
              o.updateChildren(i, n),
                o.updateChildrenPosition(n),
                t.updateWithChildrenNodes(o),
                d3.select(e).classed("expanded", !0),
                o.graph.hideLoadingAnimation();
            }));
      }),
      (a.prototype.isRootNode = function () {
        return null === this.parent;
      });
    const d = function (t, e, n, o) {
      a.call(this, t, 100, 100, e, e.graph),
        (this.hiddenNodes = n || []),
        (this.grouppedHiddenNodes = this.groupHiddenNodes()),
        (this.positionRelativeToParent = o),
        (this.label = this.hiddenNodes.length),
        (this.hiddenButVisible = 0),
        (this.childrenTop = []),
        (this.childrenRight = []),
        (this.childrenBottom = []),
        (this.childrenLeft = []);
    };
    (d.prototype = new a()),
      (d.prototype.constructor = d),
      (d.prototype.nodeType = "cumulator"),
      (d.prototype.groupHiddenNodes = function () {
        const t = this;
        let e = [];
        t.hiddenNodes = t.hiddenNodes.reduce(
          (t, e) => (t.findIndex((t) => t.id === e.id) < 0 ? [...t, e] : t),
          []
        );
        for (let n of t.hiddenNodes) {
          let t = n.rel.filter((t) => !!t).join(" - ");
          e[t] || (e[t] = []), e[t].push(n);
        }
        return e;
      }),
      (d.prototype.getType = function () {
        return "cumulator";
      }),
      (d.prototype.getHiddenNodes = function () {
        return this.hiddenNodes;
      }),
      (d.prototype.updateCount = function () {
        this.label = this.hiddenNodes.length - this.hiddenButVisible;
      }),
      (d.prototype.decrementTitle = function (t) {
        const e = this;
        (e.label -= 1),
          d3
            .select(t.parentNode)
            .select("text")
            .text(e.label + "..."),
          0 === e.label && this.graph.removeNode(e);
      }),
      (d.prototype.expandHiddenNode = function (t, e, n) {
        const o = this;
        o.graph.hideHiddenList();
        let i = t[1];
        o.api.getGraph(i.id, function (e) {
          e.rel = i.rel;
          let s = new a(
            e,
            o.x + 100 + Math.floor(20 * Math.random() - 10),
            o.y + 100 + +Math.floor(20 * Math.random() - 10),
            o.parent,
            o.graph
          );
          (s.childrenDownloaded = !0),
            o.parent[
              "children" +
                o.positionRelativeToParent.charAt(0).toUpperCase() +
                o.positionRelativeToParent.slice(1) +
                "Ref"
            ].push(s),
            o.graph.nodes.set(s.id, s);
          let d = o.connectionPointTypes[o.positionRelativeToParent];
          o.hiddenNodes.splice(o.hiddenNodes.indexOf(i), 1),
            o.grouppedHiddenNodes[t[0]].splice(
              o.grouppedHiddenNodes[t[0]].indexOf(i),
              1
            ),
            o.decrementTitle(n),
            o.graph.edges.add(new r.Edge(o.parent, s, d, s.parentRel)),
            o.graph.addEdgesBetweenNewNodes([s]),
            o.graph.updateGraph();
        });
      }),
      (d.prototype.addOnclickToCreatedNodes = function (t, e, n, o) {
        const i = this;
        for (let t = 0; t < e.length; t++)
          !(function (t) {
            let r = e[t];
            d3.select(r).on("click", function () {
              i.expandHiddenNode(n[t], i, o);
            });
          })(t);
      }),
      (d.prototype.isNodeCumulator = function () {
        return !0;
      }),
      (d.prototype.getHiddenListHtml = function () {
        const t = this;
        let e = { html: "", createdIds: [], hiddenRef: [] };
        (e.html = ""), (t.hiddenButVisible = 0);
        for (let n in t.grouppedHiddenNodes) {
          let o = t.grouppedHiddenNodes[n],
            i = "";
          i += `\n    <div class="rel-group">\n    <h5 class="rel-group-name"><i>${n}:</i> <span class="not-expanded">▲</span><span class="expanded">▼</span></h5>\n    <ul class='hidden-nodes-list' style='max-height:${
            44 * o.length
          }px;'>`;
          let r = !1;
          o.forEach((o, s) => {
            t.graph.nodes.has(o.id)
              ? t.hiddenButVisible++
              : ((i +=
                  "\n<li class='hidden-item' id='hidden-" +
                  o.id +
                  "'>" +
                  o.label +
                  "</li>"),
                (r = !0),
                e.createdIds.push("#hidden-" + o.id),
                e.hiddenRef.push([n, o]));
          }),
            (i += "</div></ul>"),
            r && (e.html += i);
        }
        return t.updateCount(), e;
      }),
      (d.prototype.addHiddenNode = function (t) {
        this.hiddenNodes.push({
          id: t.id,
          label: t.label,
          rel: t.parentRel,
          pos: t.partOfSpeechId,
        }),
          (this.label += 1);
      });
  },
  function (t, e, n) {
    "use strict";
    n.r(e),
      function (t) {
        n.d(e, "saveAs", function () {
          return o;
        });
        /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
        var o =
          o ||
          (function (t) {
            if (
              "undefined" == typeof navigator ||
              !/MSIE [1-9]\./.test(navigator.userAgent)
            ) {
              var e = function () {
                  return t.URL || t.webkitURL || t;
                },
                n = t.document.createElementNS(
                  "http://www.w3.org/1999/xhtml",
                  "a"
                ),
                o = "download" in n,
                i = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
                r = t.webkitRequestFileSystem,
                s = t.requestFileSystem || r || t.mozRequestFileSystem,
                a = function (e) {
                  (t.setImmediate || t.setTimeout)(function () {
                    throw e;
                  }, 0);
                },
                d = "application/octet-stream",
                l = 0,
                c = function (t) {
                  setTimeout(function () {
                    "string" == typeof t ? e().revokeObjectURL(t) : t.remove();
                  }, 4e4);
                },
                p = function (t, e, n) {
                  for (var o = (e = [].concat(e)).length; o--; ) {
                    var i = t["on" + e[o]];
                    if ("function" == typeof i)
                      try {
                        i.call(t, n || t);
                      } catch (t) {
                        a(t);
                      }
                  }
                },
                h = function (t) {
                  return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
                    t.type
                  )
                    ? new Blob(["\ufeff", t], { type: t.type })
                    : t;
                },
                u = function (a, u, f) {
                  f || (a = h(a));
                  var g,
                    y,
                    m,
                    x = this,
                    v = a.type,
                    w = !1,
                    b = function () {
                      p(x, "writestart progress write writeend".split(" "));
                    },
                    k = function () {
                      if (y && i && "undefined" != typeof FileReader) {
                        var n = new FileReader();
                        return (
                          (n.onloadend = function () {
                            var t = n.result;
                            (y.location.href =
                              "data:attachment/file" +
                              t.slice(t.search(/[,;]/))),
                              (x.readyState = x.DONE),
                              b();
                          }),
                          n.readAsDataURL(a),
                          void (x.readyState = x.INIT)
                        );
                      }
                      ((w || !g) && (g = e().createObjectURL(a)), y)
                        ? (y.location.href = g)
                        : void 0 === t.open(g, "_blank") &&
                          i &&
                          (t.location.href = g);
                      (x.readyState = x.DONE), b(), c(g);
                    },
                    C = function (t) {
                      return function () {
                        return x.readyState !== x.DONE
                          ? t.apply(this, arguments)
                          : void 0;
                      };
                    },
                    T = { create: !0, exclusive: !1 };
                  return (
                    (x.readyState = x.INIT),
                    u || (u = "download"),
                    o
                      ? ((g = e().createObjectURL(a)),
                        void setTimeout(function () {
                          var t, e;
                          (n.href = g),
                            (n.download = u),
                            (t = n),
                            (e = new MouseEvent("click")),
                            t.dispatchEvent(e),
                            b(),
                            c(g),
                            (x.readyState = x.DONE);
                        }))
                      : (t.chrome &&
                          v &&
                          v !== d &&
                          ((m = a.slice || a.webkitSlice),
                          (a = m.call(a, 0, a.size, d)),
                          (w = !0)),
                        r && "download" !== u && (u += ".download"),
                        (v === d || r) && (y = t),
                        s
                          ? ((l += a.size),
                            void s(
                              t.TEMPORARY,
                              l,
                              C(function (t) {
                                t.root.getDirectory(
                                  "saved",
                                  T,
                                  C(function (t) {
                                    var e = function () {
                                      t.getFile(
                                        u,
                                        T,
                                        C(function (t) {
                                          t.createWriter(
                                            C(function (e) {
                                              (e.onwriteend = function (e) {
                                                (y.location.href = t.toURL()),
                                                  (x.readyState = x.DONE),
                                                  p(x, "writeend", e),
                                                  c(t);
                                              }),
                                                (e.onerror = function () {
                                                  var t = e.error;
                                                  t.code !== t.ABORT_ERR && k();
                                                }),
                                                "writestart progress write abort"
                                                  .split(" ")
                                                  .forEach(function (t) {
                                                    e["on" + t] = x["on" + t];
                                                  }),
                                                e.write(a),
                                                (x.abort = function () {
                                                  e.abort(),
                                                    (x.readyState = x.DONE);
                                                }),
                                                (x.readyState = x.WRITING);
                                            }),
                                            k
                                          );
                                        }),
                                        k
                                      );
                                    };
                                    t.getFile(
                                      u,
                                      { create: !1 },
                                      C(function (t) {
                                        t.remove(), e();
                                      }),
                                      C(function (t) {
                                        t.code === t.NOT_FOUND_ERR ? e() : k();
                                      })
                                    );
                                  }),
                                  k
                                );
                              }),
                              k
                            ))
                          : void k())
                  );
                },
                f = u.prototype;
              return "undefined" != typeof navigator &&
                navigator.msSaveOrOpenBlob
                ? function (t, e, n) {
                    return (
                      n || (t = h(t)),
                      navigator.msSaveOrOpenBlob(t, e || "download")
                    );
                  }
                : ((f.abort = function () {
                    var t = this;
                    (t.readyState = t.DONE), p(t, "abort");
                  }),
                  (f.readyState = f.INIT = 0),
                  (f.WRITING = 1),
                  (f.DONE = 2),
                  (f.error =
                    f.onwritestart =
                    f.onprogress =
                    f.onwrite =
                    f.onabort =
                    f.onerror =
                    f.onwriteend =
                      null),
                  function (t, e, n) {
                    return new u(t, e, n);
                  });
            }
          })(
            ("undefined" != typeof self && self) ||
              ("undefined" != typeof window && window) ||
              (void 0).content
          );
        void 0 !== t && t.exports
          ? (t.exports.saveAs = o)
          : "undefined" != typeof define &&
            null !== define &&
            null !== n(6) &&
            define([], function () {
              return o;
            });
      }.call(this, n(7)(t));
  },
  function (t, e) {
    d3.minimap = function () {
      "use strict";
      var t = 0.15,
        e = 0.15,
        n = null,
        o = null,
        i = 100,
        r = 100,
        s = 100,
        a = 100,
        d = 0,
        l = 0,
        c = [];
      function p(h) {
        h;
        var u = d3.zoom().scaleExtent([0.5, 5]),
          f = function () {
            var t = g.property("__zoom").k,
              e = parseInt(o.attr("width")),
              i = parseInt(o.attr("height")),
              r = n.getWidth(),
              s = n.getHeight();
            u.translateExtent([
              [-r / t, -s / t],
              [r / t + e, s / t + i],
            ]);
          };
        u.on("zoom", function () {
          if (
            (y.attr("transform", d3.event.transform),
            d3.event.sourceEvent instanceof MouseEvent ||
              d3.event.sourceEvent instanceof WheelEvent)
          ) {
            var t = d3.event.transform,
              e = d3.zoomIdentity.scale(1 / t.k).translate(-t.x, -t.y);
            n.update(e);
          }
          f();
        });
        var g = h
          .append("g")
          .attr("class", "minimap clarin-graph-visualization");
        g.call(u), (p.node = g.node());
        var y = g.append("g").attr("class", "frame");
        y
          .append("rect")
          .attr("class", "background")
          .attr("width", i)
          .attr("height", r),
          c.forEach((t) => {
            g.append("use").attr("xlink:href", t);
          }),
          (p.update = function (t) {
            var e = d3.zoomIdentity.scale(1 / t.k).translate(-t.x, -t.y);
            u.transform(y, e), g.property("__zoom", e), f();
          });
        let m = {
          x: null,
          y: null,
          xRatio: null,
          yRatio: null,
          widthRatio: null,
          heightRatio: null,
        };
        (p.resetScale = function () {
          (m = {
            x: null,
            y: null,
            xRatio: null,
            yRatio: null,
            widthRatio: null,
            heightRatio: null,
          }),
            (t = e),
            (d = 0),
            (l = 0),
            (i = s),
            (r = a);
        }),
          (p.render = function () {
            g.attr(
              "transform",
              "translate(" + d + "," + l + ")scale(" + t + ")"
            ),
              y.select(".background").attr("width", i).attr("height", r),
              y.node().parentNode.appendChild(y.node());
          }),
          (p.updateMaxValues = function (n) {
            let o = n.x.max - n.x.min,
              s = n.y.max - n.y.min;
            if (!m.x || !m.y)
              return (
                (m.x = o),
                (m.y = s),
                (m.xRatio = o * t),
                void (m.yRatio = s * t)
              );
            let a = Math.min(m.xRatio / o, m.yRatio / s);
            a < t &&
              ((d = (i * e - i * a) / 2), (l = (r * e - r * a) / 2), (t = a));
          }),
          f();
      }
      return (
        (p.targetShadowId = function (t) {
          return c.push(t), this;
        }),
        (p.width = function (t) {
          return arguments.length ? ((i = parseInt(t, 10)), this) : i;
        }),
        (p.height = function (t) {
          return arguments.length ? ((r = parseInt(t, 10)), this) : r;
        }),
        (p.x = function (t) {
          return arguments.length ? ((d = parseInt(t, 10)), this) : d;
        }),
        (p.y = function (t) {
          return arguments.length ? ((l = parseInt(t, 10)), this) : l;
        }),
        (p.host = function (t) {
          return arguments.length ? ((n = t), this) : n;
        }),
        (p.minimapScale = function (n) {
          return arguments.length ? ((e = t = n), this) : t;
        }),
        (p.target = function (t) {
          return arguments.length
            ? ((o = t),
              (s = i = parseInt(o.attr("width"), 10)),
              (a = r = parseInt(o.attr("height"), 10)),
              this)
            : o;
        }),
        p
      );
    };
  },
  function (t, e) {
    (function (e) {
      t.exports = e;
    }.call(this, {}));
  },
  function (t, e) {
    t.exports = function (t) {
      if (!t.webpackPolyfill) {
        var e = Object.create(t);
        e.children || (e.children = []),
          Object.defineProperty(e, "loaded", {
            enumerable: !0,
            get: function () {
              return e.l;
            },
          }),
          Object.defineProperty(e, "id", {
            enumerable: !0,
            get: function () {
              return e.i;
            },
          }),
          Object.defineProperty(e, "exports", { enumerable: !0 }),
          (e.webpackPolyfill = 1);
      }
      return e;
    };
  },
  function (t, e) {
    /*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */
    !(function (t) {
      "use strict";
      var e,
        n = t.Uint8Array,
        o = t.HTMLCanvasElement,
        i = o && o.prototype,
        r = /\s*;\s*base64\s*(?:;|$)/i,
        s = "toDataURL";
      n &&
        (e = new n([
          62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1,
          -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
          15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1,
          26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
          43, 44, 45, 46, 47, 48, 49, 50, 51,
        ])),
        !o ||
          (i.toBlob && i.toBlobHD) ||
          (i.toBlob ||
            (i.toBlob = function (t, o) {
              if ((o || (o = "image/png"), this.mozGetAsFile))
                t(this.mozGetAsFile("canvas", o));
              else if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(o))
                t(this.msToBlob());
              else {
                var i,
                  a = Array.prototype.slice.call(arguments, 1),
                  d = this[s].apply(this, a),
                  l = d.indexOf(","),
                  c = d.substring(l + 1),
                  p = r.test(d.substring(0, l));
                Blob.fake
                  ? (((i = new Blob()).encoding = p ? "base64" : "URI"),
                    (i.data = c),
                    (i.size = c.length))
                  : n &&
                    (i = p
                      ? new Blob(
                          [
                            (function (t) {
                              for (
                                var o,
                                  i,
                                  r = t.length,
                                  s = new n(((r / 4) * 3) | 0),
                                  a = 0,
                                  d = 0,
                                  l = [0, 0],
                                  c = 0,
                                  p = 0;
                                r--;

                              )
                                (i = t.charCodeAt(a++)),
                                  255 !== (o = e[i - 43]) &&
                                    void 0 !== o &&
                                    ((l[1] = l[0]),
                                    (l[0] = i),
                                    (p = (p << 6) | o),
                                    4 == ++c &&
                                      ((s[d++] = p >>> 16),
                                      61 !== l[1] && (s[d++] = p >>> 8),
                                      61 !== l[0] && (s[d++] = p),
                                      (c = 0)));
                              return s;
                            })(c),
                          ],
                          { type: o }
                        )
                      : new Blob([decodeURIComponent(c)], { type: o })),
                  t(i);
              }
            }),
          !i.toBlobHD && i.toDataURLHD
            ? (i.toBlobHD = function () {
                s = "toDataURLHD";
                var t = this.toBlob();
                return (s = "toDataURL"), t;
              })
            : (i.toBlobHD = i.toBlob));
    })(
      ("undefined" != typeof self && self) ||
        ("undefined" != typeof window && window) ||
        this.content ||
        this
    );
  },
  function (t, e, n) {
    n(8), n(4), n(1), n(0), n(3), n(5), (t.exports = n(2));
  },
]);

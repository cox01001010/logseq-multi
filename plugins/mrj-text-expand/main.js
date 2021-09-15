'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function formatContent(content) {
    return content.split('\n');
}
function getAllExpandersQuery(content) {
    var accum = [];
    for (var i = 0; i < content.length; i++) {
        var line = content[i];
        if (line === '```expander') {
            for (var e = 0; e < content.length - i; e++) {
                var nextline = content[i + e];
                if (nextline === '```') {
                    accum.push({
                        start: i,
                        end: i + e,
                        query: content[i + 1],
                        template: e > 2 ? content.slice(i + 2, i + e).join('\n') : ''
                    });
                    break;
                }
            }
        }
    }
    return accum;
}
function getClosestQuery(queries, lineNumber) {
    if (queries.length === 0) {
        return undefined;
    }
    return queries.reduce(function (a, b) {
        return Math.abs(b.start - lineNumber) < Math.abs(a.start - lineNumber) ? b : a;
    });
}
function getLastLineToReplace(content, query, endline) {
    var lineFrom = query.end;
    for (var i = lineFrom + 1; i < content.length; i++) {
        if (content[i] === endline) {
            return i;
        }
    }
    return lineFrom + 1;
}

var TextExpander = /** @class */ (function (_super) {
    __extends(TextExpander, _super);
    function TextExpander(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.delay = 2000;
        _this.lineEnding = '<--->';
        _this.defaultTemplate = '- [[$filename]]';
        _this.search = _this.search.bind(_this);
        _this.initExpander = _this.initExpander.bind(_this);
        _this.reformatLinks = _this.reformatLinks.bind(_this);
        return _this;
    }
    TextExpander.prototype.reformatLinks = function (links, mapFunc) {
        var _a, _b, _c, _d;
        if (mapFunc === void 0) { mapFunc = function (s) { return '[[' + s + ']]'; }; }
        var currentView = this.app.workspace.activeLeaf.view;
        if (currentView instanceof obsidian.FileView) {
            return (_b = (_a = links === null || links === void 0 ? void 0 : links.map(function (e) { return e.basename; }).filter(function (e) { return currentView.file.basename !== e; })) === null || _a === void 0 ? void 0 : _a.map(mapFunc)) === null || _b === void 0 ? void 0 : _b.join('\n');
        }
        return (_d = (_c = links === null || links === void 0 ? void 0 : links.map(function (e) { return e.basename; })) === null || _c === void 0 ? void 0 : _c.map(mapFunc)) === null || _d === void 0 ? void 0 : _d.join('\n');
    };
    TextExpander.prototype.search = function (s) {
        // @ts-ignore
        var globalSearchFn = this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch.bind(this);
        var search = function (query) { return globalSearchFn(query); };
        search(s);
    };
    TextExpander.prototype.getFoundAfterDelay = function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchLeaf, view;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchLeaf = this.app.workspace.getLeavesOfType('search')[0];
                        return [4 /*yield*/, searchLeaf.open(searchLeaf.view)];
                    case 1:
                        view = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) {
                                // @ts-ignore
                                setTimeout(function () { return resolve(Array.from(view.dom.resultDomLookup.keys())); }, _this.delay);
                            })];
                }
            });
        });
    };
    TextExpander.prototype.startTemplateMode = function (query, lastLine) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var files, currentView, currentFileName, templateContent, heading, footer, repeatableContent, filesWithoutCurrent, getFrontMatter, format, changed, result;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getFoundAfterDelay()];
                    case 1:
                        files = _b.sent();
                        currentView = this.app.workspace.activeLeaf.view;
                        currentFileName = '';
                        templateContent = query.template.split('\n');
                        heading = templateContent.filter(function (e) { return e[0] === '^'; }).map(function (s) { return s.slice(1); });
                        footer = templateContent.filter(function (e) { return e[0] === '>'; }).map(function (s) { return s.slice(1); });
                        repeatableContent = templateContent.filter(function (e) { return e[0] !== '^' && e[0] !== '>'; }).filter(function (e) { return e; }).length === 0
                            ? [this.defaultTemplate]
                            : templateContent.filter(function (e) { return e[0] !== '^' && e[0] !== '>'; }).filter(function (e) { return e; });
                        if (currentView instanceof obsidian.FileView) {
                            currentFileName = currentView.file.basename;
                        }
                        filesWithoutCurrent = files.filter(function (file) { return file.basename !== currentFileName; });
                        getFrontMatter = function (s, r) {
                            var _a = _this.app.metadataCache.getCache(r.path).frontmatter, frontmatter = _a === void 0 ? null : _a;
                            if (frontmatter) {
                                return frontmatter[s.split(':')[1]] || '';
                            }
                            return '';
                        };
                        format = function (r, template) { return __awaiter(_this, void 0, void 0, function () {
                            var fileContent, _a;
                            var _this = this;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(/\$letters|\$lines/.test(template))) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.app.vault.cachedRead(r)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = '';
                                        _b.label = 3;
                                    case 3:
                                        fileContent = _a;
                                        return [2 /*return*/, template
                                                .replace(/\$filename/g, r.basename)
                                                .replace(/\$letters:\d+/g, function (str) { return fileContent
                                                .split('')
                                                .filter(function (_, i) { return i < Number(str.split(':')[1]); })
                                                .join(''); })
                                                .replace(/\$lines:\d+/g, function (str) { return fileContent
                                                .split('\n')
                                                .filter(function (_, i) { return i < Number(str.split(':')[1]); })
                                                .join('\n')
                                                .replace(new RegExp(_this.lineEnding, 'g'), ''); })
                                                .replace(/\$frontmatter:[a-zA-Z0-9_-]+/g, function (s) { return getFrontMatter(s, r); })
                                                .replace(/\$letters+/g, function (_) { return fileContent.replace(new RegExp(_this.lineEnding, 'g'), ''); })
                                                .replace(/\$lines+/g, function (_) { return fileContent.replace(new RegExp(_this.lineEnding, 'g'), ''); })
                                                .replace(/\$ext/g, r.extension)
                                                .replace(/\$created/g, String(r.stat.ctime))
                                                .replace(/\$size/g, String(r.stat.size))
                                                .replace(/\$path/g, r.path)
                                                .replace(/\$parent/g, r.parent.name)];
                                }
                            });
                        }); };
                        return [4 /*yield*/, Promise.all(filesWithoutCurrent
                                .map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(repeatableContent.map(function (s) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, format(file, s)];
                                                    case 1: return [2 /*return*/, (_a.sent()) + '\n'];
                                                }
                                            }); }); }))];
                                        case 1:
                                            result = _a.sent();
                                            return [2 /*return*/, result.join('')];
                                    }
                                });
                            }); }))];
                    case 2:
                        changed = _b.sent();
                        result = heading.join('\n') + '\n' +
                            changed.join('\n') + '\n' +
                            footer.join('\n') +
                            '\n\n' +
                            this.lineEnding;
                        this.cm.replaceRange(result, { line: query.end + 1, ch: 0 }, { line: lastLine, ch: ((_a = this.cm.getLine(lastLine)) === null || _a === void 0 ? void 0 : _a.length) || 0 });
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpander.prototype.initExpander = function () {
        var currentView = this.app.workspace.activeLeaf.view;
        if (!(currentView instanceof obsidian.MarkdownView)) {
            return;
        }
        var cmDoc = this.cm = currentView.sourceMode.cmEditor;
        var curNum = cmDoc.getCursor().line;
        var content = cmDoc.getValue();
        var formatted = formatContent(content);
        var findQueries = getAllExpandersQuery(formatted);
        var closestQuery = getClosestQuery(findQueries, curNum);
        if (!closestQuery) {
            new Notification('Expand query not found');
            return;
        }
        this.search(closestQuery.query);
        this.startTemplateMode(closestQuery, getLastLineToReplace(formatted, closestQuery, this.lineEnding));
    };
    TextExpander.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.addSettingTab(new SettingTab(this.app, this));
                        this.addCommand({
                            id: 'editor-expand',
                            name: 'expand',
                            callback: this.initExpander,
                            hotkeys: []
                        });
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        data = _a.sent();
                        this.delay = (data === null || data === void 0 ? void 0 : data.delay) || 2000;
                        this.lineEnding = (data === null || data === void 0 ? void 0 : data.lineEnding) || '<--->';
                        this.defaultTemplate = (data === null || data === void 0 ? void 0 : data.defaultTemplate) || '- [[$filename]]';
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpander.prototype.onunload = function () {
        console.log('unloading plugin');
    };
    return TextExpander;
}(obsidian.Plugin));
var SettingTab = /** @class */ (function (_super) {
    __extends(SettingTab, _super);
    function SettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.app = app;
        _this.plugin = plugin;
        return _this;
    }
    SettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Text Expander' });
        new obsidian.Setting(containerEl)
            .setName('Delay')
            .setDesc('Text expander don\' wait until search completed. It waits for a delay and paste result after that.')
            .addSlider(function (slider) {
            slider.setLimits(1000, 10000, 1000);
            slider.setValue(_this.plugin.delay);
            slider.onChange(function (value) {
                _this.plugin.delay = value;
                _this.plugin.saveData({ delay: value, lineEnding: _this.plugin.lineEnding, defaultTemplate: _this.plugin.defaultTemplate });
            });
            slider.setDynamicTooltip();
        });
        new obsidian.Setting(containerEl)
            .setName('Line ending')
            .setDesc('You can specify the text which will appear at the bottom of the generated text.')
            .addText(function (text) {
            text.setValue(_this.plugin.lineEnding)
                .onChange(function (val) {
                _this.plugin.lineEnding = val;
                _this.plugin.saveData({ delay: _this.plugin.delay, lineEnding: val, defaultTemplate: _this.plugin.defaultTemplate });
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Default template')
            .setDesc('You can specify default template')
            .addText(function (text) {
            text.setValue(_this.plugin.defaultTemplate)
                .onChange(function (val) {
                _this.plugin.defaultTemplate = val;
                _this.plugin.saveData({ delay: _this.plugin.delay, lineEnding: _this.plugin.lineEnding, defaultTemplate: val });
            });
        });
    };
    return SettingTab;
}(obsidian.PluginSettingTab));

module.exports = TextExpander;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL2hlbHBlcnMudHMiLCIuLi9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kZXJRdWVyeSB7XHJcbiAgICBzdGFydDogbnVtYmVyXHJcbiAgICBlbmQ6IG51bWJlclxyXG4gICAgdGVtcGxhdGU6IHN0cmluZ1xyXG4gICAgcXVlcnk6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Q29udGVudChjb250ZW50OiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gY29udGVudC5zcGxpdCgnXFxuJylcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbEV4cGFuZGVyc1F1ZXJ5KGNvbnRlbnQ6IHN0cmluZ1tdKTogRXhwYW5kZXJRdWVyeVtdIHtcclxuICAgIGxldCBhY2N1bTogRXhwYW5kZXJRdWVyeVtdID0gW11cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udGVudC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGxpbmUgPSBjb250ZW50W2ldXHJcblxyXG4gICAgICAgIGlmIChsaW5lID09PSAnYGBgZXhwYW5kZXInKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgY29udGVudC5sZW5ndGggLSBpOyBlKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRsaW5lID0gY29udGVudFtpICsgZV0gXHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dGxpbmUgPT09ICdgYGAnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWNjdW0ucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGkgKyBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6IGNvbnRlbnRbaSArIDFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IGUgPiAyID8gY29udGVudC5zbGljZShpICsgMiwgaSArIGUpLmpvaW4oJ1xcbicpIDogJydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2N1bVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xvc2VzdFF1ZXJ5KHF1ZXJpZXM6IEV4cGFuZGVyUXVlcnlbXSwgbGluZU51bWJlcjogbnVtYmVyKTogRXhwYW5kZXJRdWVyeSB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAocXVlcmllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHF1ZXJpZXMucmVkdWNlKChhLCBiKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGIuc3RhcnQgLSBsaW5lTnVtYmVyKSA8IE1hdGguYWJzKGEuc3RhcnQgLSBsaW5lTnVtYmVyKSA/IGIgOiBhO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXN0TGluZVRvUmVwbGFjZShjb250ZW50OiBzdHJpbmdbXSwgcXVlcnk6IEV4cGFuZGVyUXVlcnksIGVuZGxpbmU6IHN0cmluZykge1xyXG4gICAgY29uc3QgbGluZUZyb20gPSBxdWVyeS5lbmRcclxuXHJcbiAgICBmb3IgKHZhciBpID0gbGluZUZyb20gKyAxOyBpIDwgY29udGVudC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChjb250ZW50W2ldID09PSBlbmRsaW5lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsaW5lRnJvbSArIDFcclxufSIsImltcG9ydCB7IEV4cGFuZGVyUXVlcnksIGZvcm1hdENvbnRlbnQsIGdldEFsbEV4cGFuZGVyc1F1ZXJ5LCBnZXRDbG9zZXN0UXVlcnksIGdldExhc3RMaW5lVG9SZXBsYWNlIH0gZnJvbSAnaGVscGVycyc7XG5pbXBvcnQge1xuICAgIEFwcCxcbiAgICBWaWV3LFxuICAgIFBsdWdpbixcbiAgICBQbHVnaW5TZXR0aW5nVGFiLFxuICAgIFNldHRpbmcsXG4gICAgVEZpbGUsXG4gICAgRmlsZVZpZXcsXG4gICAgTWFya2Rvd25WaWV3LFxuICAgIFBsdWdpbk1hbmlmZXN0XG59IGZyb20gJ29ic2lkaWFuJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dEV4cGFuZGVyIGV4dGVuZHMgUGx1Z2luIHtcbiAgICBkZWxheSA9IDIwMDA7XG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yXG4gICAgbGluZUVuZGluZyA9ICc8LS0tPidcbiAgICBkZWZhdWx0VGVtcGxhdGUgPSAnLSBbWyRmaWxlbmFtZV1dJ1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUGx1Z2luTWFuaWZlc3QpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuXG4gICAgICAgIHRoaXMuc2VhcmNoID0gdGhpcy5zZWFyY2guYmluZCh0aGlzKVxuICAgICAgICB0aGlzLmluaXRFeHBhbmRlciA9IHRoaXMuaW5pdEV4cGFuZGVyLmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5yZWZvcm1hdExpbmtzID0gdGhpcy5yZWZvcm1hdExpbmtzLmJpbmQodGhpcylcbiAgICB9XG5cbiAgICByZWZvcm1hdExpbmtzKGxpbmtzOiBURmlsZVtdLCBtYXBGdW5jID0gKHM6IHN0cmluZykgPT4gJ1tbJyArIHMgKyAnXV0nKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlld1xuXG4gICAgICAgIGlmIChjdXJyZW50VmlldyBpbnN0YW5jZW9mIEZpbGVWaWV3KSB7XG4gICAgICAgICAgICByZXR1cm4gbGlua3M/Lm1hcChlID0+IGUuYmFzZW5hbWUpXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+IGN1cnJlbnRWaWV3LmZpbGUuYmFzZW5hbWUgIT09IGUpXG4gICAgICAgICAgICAgICAgPy5tYXAobWFwRnVuYyk/LmpvaW4oJ1xcbicpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlua3M/Lm1hcChlID0+IGUuYmFzZW5hbWUpPy5tYXAobWFwRnVuYyk/LmpvaW4oJ1xcbicpXG4gICAgfVxuXG4gICAgc2VhcmNoKHM6IHN0cmluZykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IGdsb2JhbFNlYXJjaEZuID0gdGhpcy5hcHAuaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoJ2dsb2JhbC1zZWFyY2gnKS5pbnN0YW5jZS5vcGVuR2xvYmFsU2VhcmNoLmJpbmQodGhpcylcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gKHF1ZXJ5OiBzdHJpbmcpID0+IGdsb2JhbFNlYXJjaEZuKHF1ZXJ5KVxuXG4gICAgICAgIHNlYXJjaChzKVxuICAgIH1cblxuICAgIGFzeW5jIGdldEZvdW5kQWZ0ZXJEZWxheSgpIHtcbiAgICAgICAgY29uc3Qgc2VhcmNoTGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3NlYXJjaCcpWzBdXG4gICAgICAgIGNvbnN0IHZpZXcgPSBhd2FpdCBzZWFyY2hMZWFmLm9wZW4oc2VhcmNoTGVhZi52aWV3KVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUoQXJyYXkuZnJvbSh2aWV3LmRvbS5yZXN1bHREb21Mb29rdXAua2V5cygpKSksIHRoaXMuZGVsYXkpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXN5bmMgc3RhcnRUZW1wbGF0ZU1vZGUocXVlcnk6IEV4cGFuZGVyUXVlcnksIGxhc3RMaW5lOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB0aGlzLmdldEZvdW5kQWZ0ZXJEZWxheSgpIGFzIFRGaWxlW11cbiAgICAgICAgY29uc3QgY3VycmVudFZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3XG4gICAgICAgIGxldCBjdXJyZW50RmlsZU5hbWUgPSAnJ1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlQ29udGVudCA9IHF1ZXJ5LnRlbXBsYXRlLnNwbGl0KCdcXG4nKVxuXG4gICAgICAgIGNvbnN0IGhlYWRpbmcgPSB0ZW1wbGF0ZUNvbnRlbnQuZmlsdGVyKGUgPT4gZVswXSA9PT0gJ14nKS5tYXAoKHMpID0+IHMuc2xpY2UoMSkpXG4gICAgICAgIGNvbnN0IGZvb3RlciA9IHRlbXBsYXRlQ29udGVudC5maWx0ZXIoZSA9PiBlWzBdID09PSAnPicpLm1hcCgocykgPT4gcy5zbGljZSgxKSlcbiAgICAgICAgY29uc3QgcmVwZWF0YWJsZUNvbnRlbnQgPSBcbiAgICAgICAgICAgIHRlbXBsYXRlQ29udGVudC5maWx0ZXIoZSA9PiBlWzBdICE9PSAnXicgJiYgZVswXSAhPT0gJz4nKS5maWx0ZXIoZSA9PiBlKS5sZW5ndGggPT09IDBcbiAgICAgICAgICAgICAgICA/IFt0aGlzLmRlZmF1bHRUZW1wbGF0ZV1cbiAgICAgICAgICAgICAgICA6IHRlbXBsYXRlQ29udGVudC5maWx0ZXIoZSA9PiBlWzBdICE9PSAnXicgJiYgZVswXSAhPT0gJz4nKS5maWx0ZXIoZSA9PiBlKVxuXG4gICAgICAgIGlmIChjdXJyZW50VmlldyBpbnN0YW5jZW9mIEZpbGVWaWV3KSB7XG4gICAgICAgICAgICBjdXJyZW50RmlsZU5hbWUgPSBjdXJyZW50Vmlldy5maWxlLmJhc2VuYW1lXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlc1dpdGhvdXRDdXJyZW50ID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS5iYXNlbmFtZSAhPT0gY3VycmVudEZpbGVOYW1lKVxuXG4gICAgICAgIGNvbnN0IGdldEZyb250TWF0dGVyID0gKHM6IHN0cmluZywgcjogVEZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZnJvbnRtYXR0ZXIgPSBudWxsIH0gPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldENhY2hlKHIucGF0aClcblxuICAgICAgICAgICAgaWYgKGZyb250bWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb250bWF0dGVyW3Muc3BsaXQoJzonKVsxXV0gfHwgJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9ybWF0ID0gYXN5bmMgKHI6IFRGaWxlLCB0ZW1wbGF0ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9ICgvXFwkbGV0dGVyc3xcXCRsaW5lcy8udGVzdCh0ZW1wbGF0ZSkpXG4gICAgICAgICAgICAgICAgPyBhd2FpdCB0aGlzLmFwcC52YXVsdC5jYWNoZWRSZWFkKHIpXG4gICAgICAgICAgICAgICAgOiAnJ1xuXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwkZmlsZW5hbWUvZywgci5iYXNlbmFtZSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwkbGV0dGVyczpcXGQrL2csXG4gICAgICAgICAgICAgICAgICAgIHN0ciA9PiBmaWxlQ29udGVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoXzogc3RyaW5nLCBpOiBudW1iZXIpID0+IGkgPCBOdW1iZXIoc3RyLnNwbGl0KCc6JylbMV0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJycpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRsaW5lczpcXGQrL2csXG4gICAgICAgICAgICAgICAgICAgIHN0ciA9PiBmaWxlQ29udGVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoXzogc3RyaW5nLCBpOiBudW1iZXIpID0+IGkgPCBOdW1iZXIoc3RyLnNwbGl0KCc6JylbMV0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKHRoaXMubGluZUVuZGluZywgJ2cnKSwgJycpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRmcm9udG1hdHRlcjpbYS16QS1aMC05Xy1dKy9nLCBzID0+IGdldEZyb250TWF0dGVyKHMsIHIpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRsZXR0ZXJzKy9nLCAoXykgPT4gZmlsZUNvbnRlbnQucmVwbGFjZShuZXcgUmVnRXhwKHRoaXMubGluZUVuZGluZywgJ2cnKSwgJycpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRsaW5lcysvZywgKF8pID0+IGZpbGVDb250ZW50LnJlcGxhY2UobmV3IFJlZ0V4cCh0aGlzLmxpbmVFbmRpbmcsICdnJyksICcnKSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwkZXh0L2csIHIuZXh0ZW5zaW9uKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRjcmVhdGVkL2csIFN0cmluZyhyLnN0YXQuY3RpbWUpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRzaXplL2csIFN0cmluZyhyLnN0YXQuc2l6ZSkpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcJHBhdGgvZywgci5wYXRoKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRwYXJlbnQvZywgci5wYXJlbnQubmFtZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoYW5nZWQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIGZpbGVzV2l0aG91dEN1cnJlbnRcbiAgICAgICAgICAgICAgICAubWFwKGFzeW5jIChmaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFByb21pc2UuYWxsKCByZXBlYXRhYmxlQ29udGVudCAubWFwKGFzeW5jIChzKSA9PiBhd2FpdCBmb3JtYXQoZmlsZSwgcykgKyAnXFxuJykgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgKVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgICAgICBoZWFkaW5nLmpvaW4oJ1xcbicpICsgJ1xcbicgK1xuICAgICAgICAgICAgY2hhbmdlZC5qb2luKCdcXG4nKSArICdcXG4nICtcbiAgICAgICAgICAgIGZvb3Rlci5qb2luKCdcXG4nKSArXG4gICAgICAgICAgICAnXFxuXFxuJyArXG4gICAgICAgICAgICB0aGlzLmxpbmVFbmRpbmdcblxuICAgICAgICB0aGlzLmNtLnJlcGxhY2VSYW5nZShyZXN1bHQsXG4gICAgICAgICAgICB7bGluZTogcXVlcnkuZW5kICsgMSwgY2g6IDB9LFxuICAgICAgICAgICAge2xpbmU6IGxhc3RMaW5lLCBjaDogdGhpcy5jbS5nZXRMaW5lKGxhc3RMaW5lKT8ubGVuZ3RoIHx8IDB9KVxuICAgIH1cblxuICAgIGluaXRFeHBhbmRlcigpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3XG5cbiAgICAgICAgaWYgKCEoY3VycmVudFZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNtRG9jID0gdGhpcy5jbSA9IGN1cnJlbnRWaWV3LnNvdXJjZU1vZGUuY21FZGl0b3JcbiAgICAgICAgY29uc3QgY3VyTnVtID0gY21Eb2MuZ2V0Q3Vyc29yKCkubGluZVxuICAgICAgICBjb25zdCBjb250ZW50ID0gY21Eb2MuZ2V0VmFsdWUoKVxuXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IGZvcm1hdENvbnRlbnQoY29udGVudClcbiAgICAgICAgY29uc3QgZmluZFF1ZXJpZXMgPSBnZXRBbGxFeHBhbmRlcnNRdWVyeShmb3JtYXR0ZWQpXG4gICAgICAgIGNvbnN0IGNsb3Nlc3RRdWVyeSA9IGdldENsb3Nlc3RRdWVyeShmaW5kUXVlcmllcywgY3VyTnVtKVxuXG4gICAgICAgIGlmICghY2xvc2VzdFF1ZXJ5KSB7XG4gICAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uKCdFeHBhbmQgcXVlcnkgbm90IGZvdW5kJylcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VhcmNoKGNsb3Nlc3RRdWVyeS5xdWVyeSlcbiAgICAgICAgdGhpcy5zdGFydFRlbXBsYXRlTW9kZShjbG9zZXN0UXVlcnksIGdldExhc3RMaW5lVG9SZXBsYWNlKGZvcm1hdHRlZCwgY2xvc2VzdFF1ZXJ5LCB0aGlzLmxpbmVFbmRpbmcpKVxuICAgIH1cblxuICAgIGFzeW5jIG9ubG9hZCgpIHtcbiAgICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiAnZWRpdG9yLWV4cGFuZCcsXG4gICAgICAgICAgICBuYW1lOiAnZXhwYW5kJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmluaXRFeHBhbmRlcixcbiAgICAgICAgICAgIGhvdGtleXM6IFtdXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMubG9hZERhdGEoKVxuICAgICAgICB0aGlzLmRlbGF5ID0gZGF0YT8uZGVsYXkgfHwgMjAwMFxuICAgICAgICB0aGlzLmxpbmVFbmRpbmcgPSBkYXRhPy5saW5lRW5kaW5nIHx8ICc8LS0tPidcbiAgICAgICAgdGhpcy5kZWZhdWx0VGVtcGxhdGUgPSBkYXRhPy5kZWZhdWx0VGVtcGxhdGUgfHwgJy0gW1skZmlsZW5hbWVdXSdcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VubG9hZGluZyBwbHVnaW4nKTtcbiAgICB9XG59XG5cbmNsYXNzIFNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgICBwbHVnaW46IFRleHRFeHBhbmRlclxuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogVGV4dEV4cGFuZGVyKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcblxuICAgICAgICB0aGlzLmFwcCA9IGFwcFxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpblxuICAgIH1cblxuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIGxldCB7Y29udGFpbmVyRWx9ID0gdGhpcztcblxuICAgICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiAnU2V0dGluZ3MgZm9yIFRleHQgRXhwYW5kZXInfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnRGVsYXknKVxuICAgICAgICAgICAgLnNldERlc2MoJ1RleHQgZXhwYW5kZXIgZG9uXFwnIHdhaXQgdW50aWwgc2VhcmNoIGNvbXBsZXRlZC4gSXQgd2FpdHMgZm9yIGEgZGVsYXkgYW5kIHBhc3RlIHJlc3VsdCBhZnRlciB0aGF0LicpXG4gICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiB7XG4gICAgICAgICAgICAgICAgc2xpZGVyLnNldExpbWl0cygxMDAwLCAxMDAwMCwgMTAwMClcbiAgICAgICAgICAgICAgICBzbGlkZXIuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGVsYXkpXG4gICAgICAgICAgICAgICAgc2xpZGVyLm9uQ2hhbmdlKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGVsYXkgPSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh7IGRlbGF5OiB2YWx1ZSwgbGluZUVuZGluZzogdGhpcy5wbHVnaW4ubGluZUVuZGluZywgZGVmYXVsdFRlbXBsYXRlOiB0aGlzLnBsdWdpbi5kZWZhdWx0VGVtcGxhdGUgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHNsaWRlci5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0xpbmUgZW5kaW5nJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdZb3UgY2FuIHNwZWNpZnkgdGhlIHRleHQgd2hpY2ggd2lsbCBhcHBlYXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgZ2VuZXJhdGVkIHRleHQuJylcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4ge1xuICAgICAgICAgICAgICAgIHRleHQuc2V0VmFsdWUodGhpcy5wbHVnaW4ubGluZUVuZGluZylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5saW5lRW5kaW5nID0gdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh7IGRlbGF5OiB0aGlzLnBsdWdpbi5kZWxheSwgbGluZUVuZGluZzogdmFsLCBkZWZhdWx0VGVtcGxhdGU6IHRoaXMucGx1Z2luLmRlZmF1bHRUZW1wbGF0ZSB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdEZWZhdWx0IHRlbXBsYXRlJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdZb3UgY2FuIHNwZWNpZnkgZGVmYXVsdCB0ZW1wbGF0ZScpXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICB0ZXh0LnNldFZhbHVlKHRoaXMucGx1Z2luLmRlZmF1bHRUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kZWZhdWx0VGVtcGxhdGUgPSB2YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHsgZGVsYXk6IHRoaXMucGx1Z2luLmRlbGF5LCBsaW5lRW5kaW5nOiB0aGlzLnBsdWdpbi5saW5lRW5kaW5nLCBkZWZhdWx0VGVtcGxhdGU6IHZhbCB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiRmlsZVZpZXciLCJNYXJrZG93blZpZXciLCJQbHVnaW4iLCJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUcsb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENB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

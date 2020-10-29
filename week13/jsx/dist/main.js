/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/**\n * 创建真实 DOM\n * @param {*} type DOM 类型 \n * @param {*} attributes 属性列表\n * @param  {...any} children 子元素\n */\nfunction createElement(type, attributes) {\n  // 创建 Node\n  var element = \"\";\n\n  if (typeof type === 'string') {\n    element = new ElementWrapper(type);\n  } else {\n    // 非字符串类型会被识别为 class\n    element = new type();\n  } // 添加属性\n\n\n  for (var name in attributes) {\n    element.setAttribute(name, attributes[name]);\n  } // 添加子元素\n\n\n  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    children[_key - 2] = arguments[_key];\n  }\n\n  for (var _i = 0, _children = children; _i < _children.length; _i++) {\n    var child = _children[_i];\n\n    if (typeof child === 'string') {\n      child = new TextWrapper(child);\n    }\n\n    element.appendChild(child);\n  }\n\n  return element;\n} // 将普通标签转化为 class \n\n\nvar ElementWrapper = /*#__PURE__*/function () {\n  function ElementWrapper(type) {\n    _classCallCheck(this, ElementWrapper);\n\n    this.root = document.createElement(type);\n  }\n\n  _createClass(ElementWrapper, [{\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      parent.appendChild(this.root);\n    }\n  }, {\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this.root.setAttribute(name, value);\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      // 反向设置\n      child.mountTo(this.root);\n    }\n  }]);\n\n  return ElementWrapper;\n}();\n\nvar TextWrapper = /*#__PURE__*/function () {\n  function TextWrapper(child) {\n    _classCallCheck(this, TextWrapper);\n\n    this.root = document.createTextNode(child);\n  }\n\n  _createClass(TextWrapper, [{\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      parent.appendChild(this.root);\n    }\n  }, {\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this.root.setAttribute(name, value);\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      // 反向设置\n      child.mountTo(this.root);\n    }\n  }]);\n\n  return TextWrapper;\n}();\n\nvar Div = /*#__PURE__*/function () {\n  function Div() {\n    _classCallCheck(this, Div);\n\n    this.root = document.createElement(\"div\");\n  }\n\n  _createClass(Div, [{\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      parent.appendChild(this.root);\n    }\n  }, {\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this.root.setAttribute(name, value);\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      child.mountTo(this.root);\n    }\n  }]);\n\n  return Div;\n}();\n\nvar a = createElement(\"div\", {\n  id: \"a\"\n}, createElement(\"span\", null), createElement(\"span\", null), createElement(\"span\", null)); // document.body.appendChild(a)\n\na.mountTo(document.body);\n\n//# sourceURL=webpack://jsx/./main.js?");
/******/ })()
;
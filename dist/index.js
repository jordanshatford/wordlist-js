"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,r,i){void 0===i&&(i=r);var a=Object.getOwnPropertyDescriptor(t,r);a&&!("get"in a?!t.__esModule:a.writable||a.configurable)||(a={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,i,a)}:function(e,t,r,i){void 0===i&&(i=r),e[i]=t[r]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&__createBinding(t,e,r);return __setModuleDefault(t,e),t},__exportStar=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||__createBinding(t,e,r)};Object.defineProperty(exports,"__esModule",{value:!0});const english=__importStar(require("./english"));__exportStar(require("./english"),exports);const american=__importStar(require("./american"));__exportStar(require("./american"),exports);const australian=__importStar(require("./australian"));__exportStar(require("./australian"),exports);const british=__importStar(require("./british"));__exportStar(require("./british"),exports);const canadian=__importStar(require("./canadian"));__exportStar(require("./canadian"),exports);const britishZ=__importStar(require("./britishZ"));__exportStar(require("./britishZ"),exports),exports.default=Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},english),american),australian),british),canadian),britishZ);
(this.webpackJsonpextension=this.webpackJsonpextension||[]).push([[0],{172:function(e,t,n){},173:function(e,t,n){},174:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n.n(c),s=n(90),r=n.n(s),i=n(2),o=n(94),l=(n(153),n(1)),u=function(){return Object(l.jsx)("header",{className:"px-3 py-2 rounded-b-lg bg-gray-200 shadow",children:Object(l.jsxs)("div",{className:"flex justify-between",children:[Object(l.jsx)("h1",{className:"text-md text-xl text-blue-700 font-bold",children:"Youtube-converter"}),Object(l.jsx)("div",{className:"text-xs opacity-60 text-opacity-70 mt-2",children:"v2.2.1"})]})})},d=function(){var e=Object(c.useContext)(_),t=Object(i.a)(e,3),n=t[0],a=t[1],s=t[2],r=function(e){var t=e.route;return Object(l.jsx)("div",{onClick:function(){return a(t)},className:"cursor-pointer text-center ".concat(n===t&&"border-b-2 border-white"),children:t.libelle})};return Object(l.jsx)("footer",{className:"bg-gradient-to-bl from-blue-900 to-gray-900 text-white py-2 rounded-t-md",children:Object(l.jsx)("nav",{className:"flex justify-evenly",children:s.map((function(e){return Object(l.jsx)(r,{route:e},e.id)}))})})},b=n(11),j=n.n(b),m=n(23),x=n(3),h=n(36),O=n(17),v=["color","loading","onClick","children"],f=function(e){var t=e.color,n=e.loading,a=e.onClick,s=e.children,r=Object(h.a)(e,v),i=Object(c.useMemo)((function(){return n?"bg-gradient-to-bl from-gray-300 to-gray-400 shadow":"bg-gradient-to-bl from-".concat(t,"-600 to-").concat(t,"-900 shadow hover:shadow-xl transform transition duration-75 hover:scale-105")}),[t,n]);return Object(l.jsx)("button",Object(x.a)(Object(x.a)({},r),{},{onClick:a,disabled:n,className:"".concat(i," rounded text-white text-center text-lg w-full py-1"),children:n?Object(l.jsxs)("span",{className:"flex justify-center w-full",children:["Chargement",Object(l.jsx)("i",{className:"my-auto ml-3",children:Object(l.jsx)(O.c,{size:20,className:"animate-spin"})})]}):Object(l.jsx)(l.Fragment,{children:s})}))};f.defaultProps={color:"blue",loading:!1};var p=f,g=function(){var e=Object(c.useState)(null),t=Object(i.a)(e,2),n=t[0],a=t[1],s=Object(c.useState)(null),r=Object(i.a)(s,2),o=r[0],u=r[1],d=Object(c.useState)(!1),b=Object(i.a)(d,2),x=b[0],h=b[1];Object(c.useEffect)((function(){chrome.tabs?chrome.tabs.query({active:!0,lastFocusedWindow:!0},(function(e){a(new URL(e[0].url))})):a(new URL("https://www.youtube.com/watch?v=q783rNIwc70"))}),[]),Object(c.useEffect)((function(){if(n){var e=n.hostname,t=n.searchParams,c=n.pathname;"www.youtube.com"===e&&"/watch"===c&&t.get("v")?u(t.get("v")):u(null)}else u(null)}),[n]);var O=function(){var e=Object(m.a)(j.a.mark((function e(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:h(!0),console.log("id",o),chrome.tabs.query({active:!0,lastFocusedWindow:!0},(function(e){var t=e[0];chrome.tabs.sendMessage(t.id,{action:"download",videoId:o},(function(e){e.success&&h(!1)}))}));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(l.jsxs)("div",{className:"w-full py-2",children:[o&&Object(l.jsxs)("div",{className:"mb-3 mx-2 text-md",children:["Video id : ",Object(l.jsx)("span",{children:o})]}),Object(l.jsx)("div",{className:"text-center mx-3",children:o?Object(l.jsx)(p,{loading:x,onClick:O,color:"blue",children:"Convertir"}):Object(l.jsx)("h2",{className:"text-lg text-yellow-500 text-center my-2 font-semibold",children:"Aucun video d\xe9t\xe9cter"})})]})},w=(n(95),n(0).useState),y=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=w(e),n=Object(i.a)(t,2),c=n[0],a=n[1],s=function(){return a(!c)};return[c,s]},N=function(e){var t=Object(c.useState)(null),n=Object(i.a)(t,2),a=n[0],s=n[1],r=Object(c.useCallback)((function(t){t&&JSON.stringify(t)!==JSON.stringify(a)&&(s(t),e&&e(t))}),[a]);return[a,r]},C=n(9),k=n.n(C),S=function(e){var t=e.size,n=e.className;return Object(l.jsx)(O.c,{size:t,className:"animate-spin mx-auto ".concat(n)})};S.prototype={size:k.a.number,className:k.a.string},S.defaultProps={size:20,className:"my-4"};var M=S,F=n(92),E=function(e){var t=e.innerRef,n=e.title,a=e.children,s=e.defaultOpen,r=y(s),o=Object(i.a)(r,2),u=o[0],d=o[1];return Object(c.useImperativeHandle)(t,(function(){return{open:u,toggle:d}})),Object(l.jsxs)("div",{"data-open":u,className:"border mb-2 rounded-lg shadow-md",children:[Object(l.jsxs)("div",{className:"px-2 py-1 flex justify-between",children:[Object(l.jsx)("h2",{className:"text-lg",children:n}),Object(l.jsx)("button",{onClick:d,className:"transition transform hover:text-blue-700 hover:scale-105 duration-150 p-1.5",children:u?Object(l.jsx)(O.a,{}):Object(l.jsx)(O.b,{})})]}),Object(l.jsx)(F.a,{show:u,enter:"transition transform duration-1000",enterFrom:"opacity-0 -translate-y-10",enterTo:"opacity-100 translate-y-0",leave:"transition-opacity duration-400",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:Object(l.jsx)("div",{className:"border-t bg-white",children:a})})]})};E.defaultProps={defaultOpen:!0};var I=E,q=["title","children"],P=function(e){var t=e.title,n=e.children,c=Object(h.a)(e,q);return Object(l.jsxs)("li",Object(x.a)(Object(x.a)({},c),{},{children:[Object(l.jsxs)("span",{className:"font-semibold text-gray-800",children:[t," : "]}),n]}))},z=function(e){var t,n,c,a,s,r,i=e.video;return Object(l.jsx)(I,{title:"Metadata",children:Object(l.jsxs)("ul",{className:"text-xs p-2",children:[Object(l.jsx)(P,{title:"Youtube id",children:i.id}),Object(l.jsx)(P,{title:"Titre",children:(null===(t=i.media)||void 0===t?void 0:t.song)||i.title}),Object(l.jsx)(P,{title:(null===(n=i.media)||void 0===n?void 0:n.artist)?"Artiste":"Auteur",children:(null===(c=i.media)||void 0===c?void 0:c.artist)||(null===(a=i.author)||void 0===a?void 0:a.name)}),(null===(s=i.media)||void 0===s?void 0:s.album)&&Object(l.jsx)(P,{title:"Album",children:null===(r=i.media)||void 0===r?void 0:r.album}),Object(l.jsxs)("li",{className:"flex justify-between",children:[Object(l.jsxs)("span",{children:[Object(l.jsx)("span",{className:"font-semibold text-gray-800",children:"Dur\xe9e : "}),Object(l.jsxs)("span",{className:i.lengthSeconds>480?"text-red-600":"",children:[i.lengthSeconds,"s"]})]}),Object(l.jsx)("span",{className:"text-xs opacity-30",children:"max: 480s"})]})]})})},R=function(e){var t,n,a=e.video,s=Object(c.useContext)(Y),r=Object(i.a)(s,2),o=r[0],u=r[1],d=Object(c.useState)(null),b=Object(i.a)(d,2),j=b[0],m=b[1];return Object(c.useEffect)((function(){return a.thumbnails&&m(a.thumbnails[a.thumbnails.length-1])}),[a.thumbnails]),Object(c.useEffect)((function(){var e;return u(Object(x.a)(Object(x.a)({},o),{},{cover:null===(e=a.thumbnails)||void 0===e?void 0:e.findIndex((function(e){return e===j}))}))}),[j]),Object(l.jsx)(I,{title:"Couverture",defaultOpen:!0,children:Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)("div",{className:"py-1",children:a.thumbnails&&Object(l.jsx)("img",{width:130,className:"mx-auto shadow",src:null===(t=a.thumbnails[a.thumbnails.length-1])||void 0===t?void 0:t.url,alt:"cover"})}),Object(l.jsx)("div",{className:"grid grid-cols-2 px-0.5 py-1",children:null===(n=a.thumbnails)||void 0===n?void 0:n.map((function(e,t){return Object(l.jsx)("div",{className:"my-0.5 w-11/12 mx-auto",children:Object(l.jsxs)("button",{onClick:function(){return m(e)},className:"border w-full rounded text-sm shadow-sm transform transform hover:scale-105 hover:shadow-md duration-75 ".concat(j===e?"text-white bg-gradient-to-bl from-blue-600 to-blue-800":"bg-gray-100"),children:[null===e||void 0===e?void 0:e.width,"x",null===e||void 0===e?void 0:e.height]})},t)}))})]})})},T=n(93),D=n.n(T),A=(n(171),function(e){return Object(l.jsx)(D.a,Object(x.a)({},e))}),W=480,H=function(e){var t=e.video,n=parseInt(t.lengthSeconds),a=Object(c.useState)({min:0,max:n}),s=Object(i.a)(a,2),r=s[0],o=s[1],u=Object(c.useContext)(Y),d=Object(i.a)(u,2),b=d[0],j=d[1],m=N(),h=Object(i.a)(m,2),O=h[0],v=h[1],f=Object(c.useMemo)((function(){return r.max-r.min>W}),[r,n]);Object(c.useEffect)((function(){return o({min:0,max:n})}),[n]),Object(c.useEffect)((function(){var e=document.querySelector(".input-range__track--active");e&&(r.max-r.min>W?e.style.backgroundColor="#DC2626":e.style.backgroundColor="#10B981")}),[f,r,O]),Object(c.useEffect)((function(){return j(Object(x.a)(Object(x.a)({},b),{},{begin:r.min,end:r.max}))}),[r,O]);var p=Object(c.useMemo)((function(){return r.max-r.min-W}),[r,O]);return Object(l.jsxs)(I,{innerRef:v,title:"Timeline",defaultOpen:!1,children:[Object(l.jsxs)("ul",{className:"text-xs p-2",children:[Object(l.jsx)(P,{title:"Dur\xe9e",children:Object(l.jsxs)("span",{className:f?"text-red-600":"",children:[r.max-r.min," secondes"]})}),Object(l.jsxs)(P,{title:"Max",children:[" ",W," secondes"]}),Object(l.jsx)(P,{title:"Delta",children:Object(l.jsxs)("span",{className:f?"text-red-600":"text-green-600",children:[p>0?"+".concat(p):p," secondes"]})})]}),Object(l.jsx)("div",{className:"p-6",children:Object(l.jsx)(A,{minValue:0,maxValue:n,formatLabel:function(e){return"".concat(parseInt(e/60),":").concat(e%60>=10?e%60:"0".concat(e%60))},value:r,onChange:function(e){return o(e)}})})]})},J="ready",L="waiting",U="error",V="null",Y=Object(c.createContext)({}),B=function(){var e=Object(c.useState)({}),t=Object(i.a)(e,2),n=t[0],a=t[1],s=Object(c.useState)(L),r=Object(i.a)(s,2),o=r[0],u=r[1],d=Object(c.useState)(!1),b=Object(i.a)(d,2),h=b[0],O=b[1],v=Object(c.useState)({}),f=y(),g=Object(i.a)(f,2),w=g[0],N=g[1];Object(c.useEffect)((function e(){var t,n;(null===(t=chrome)||void 0===t||null===(n=t.tabs)||void 0===n?void 0:n.query)?chrome.tabs.query({active:!0,lastFocusedWindow:!0},(function(t){var n=new URL(t[0].url),c=n.hostname,s=n.pathname,r=n.searchParams;"www.youtube.com"===c&&"/watch"===s&&r.get("v")?chrome.tabs.sendMessage(t[0].id,{action:"ask"},(function(t){var n=null===t||void 0===t?void 0:t.status;if(n===J){var c=t.videoDetails,s=t.videoId;a(Object(x.a)({id:s},c)),u(t.status)}else n===U||n===V?u(t.status):setTimeout(e,300)})):u(V)})):fetch("http://localhost:8000/info/SnG4tNibrkY").then((function(e){return e.json()})).then((function(e){u(J),a(Object(x.a)({id:"0zvN2Vu5HMw"},e.details))}))}),[w]);var C=function(){var e=Object(m.a)(j.a.mark((function e(){var t,c,a;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(O(!0),t=Object(i.a)(v,1),c=t[0],a=n.id,!chrome.tabs){e.next=7;break}chrome.tabs.query({active:!0,lastFocusedWindow:!0},(function(e){return chrome.tabs.sendMessage(e[0].id,{action:"download2",videoId:a,params:c},(function(e){e.success&&O(!1)}))})),e.next=10;break;case 7:return e.next=9,new Promise((function(e){return setTimeout(e,4e3)}));case 9:O(!1);case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(l.jsx)(l.Fragment,{children:o===J?Object(l.jsx)(Y.Provider,{value:v,children:Object(l.jsxs)("div",{className:"p-2",children:[Object(l.jsx)(z,{video:n}),Object(l.jsx)(R,{video:n}),Object(l.jsx)(H,{video:n}),Object(l.jsx)("div",{className:"mt-2",children:Object(l.jsx)(p,{onClick:C,loading:h,children:"Convertir"})})]})}):"loading"===o||o===L?Object(l.jsx)(M,{size:30,className:"my-4 text-blue-600"}):o===V?Object(l.jsx)("div",{children:Object(l.jsx)("h2",{className:"text-lg text-yellow-500 text-center my-2 font-semibold",children:"Aucun video d\xe9tecter"})}):o===U?Object(l.jsxs)("div",{children:[Object(l.jsx)("h2",{className:"text-lg text-red-500 text-center my-2 font-semibold",children:"Une erreur est survenue"}),Object(l.jsx)("div",{className:"w-10/12 mx-auto my-2",children:Object(l.jsx)("button",{onClick:function(){var e;(null===(e=chrome)||void 0===e?void 0:e.tabs)&&chrome.tabs.query({active:!0,lastFocusedWindow:!0},(function(e){return chrome.tabs.sendMessage(e[0].id,{action:"reload"})})),u(L),setTimeout(N,3e3)},className:"rounded text-white text-center text-lg w-full py-1 bg-gradient-to-br from-yellow-600 to-yellow-400 shadow hover:shadow-xl transform transition duration-75 hover:scale-105",children:"Recharger"})})]}):null})},_=Object(c.createContext)({}),G=[{id:0,libelle:"Rapide",Component:g},{id:1,libelle:"Detailer",Component:B}],K=function(){var e=Object(c.useState)(G[1]),t=Object(i.a)(e,2),n=t[0],a=t[1],s=Object(c.useMemo)((function(){return n.Component}),[n]);return Object(l.jsx)(_.Provider,{value:[n,a,G],children:Object(l.jsxs)("div",{style:{maxHeight:"600px"},className:"w-full bg-white border-2 border-gray-900",children:[Object(l.jsx)(u,{}),Object(l.jsx)("main",{children:Object(l.jsx)(o.a,{style:{maxHeight:"512px"},children:Object(l.jsx)("div",{className:"pr-1",children:Object(l.jsx)(s,{})})})}),Object(l.jsx)(d,{})]})})};n(172),n(173);r.a.render(Object(l.jsx)(a.a.StrictMode,{children:Object(l.jsx)(K,{})}),document.getElementById("root"))}},[[174,1,2]]]);
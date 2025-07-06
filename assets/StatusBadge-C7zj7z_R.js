import{c as l,j as t}from"./index-BHdtNLGV.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=l("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r=l("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);function s({status:n,size:a="md"}){const e={pending:{bg:"bg-yellow-100",text:"text-yellow-800",label:"Pending"},"in-transit":{bg:"bg-blue-100",text:"text-blue-800",label:"In Transit"},delivered:{bg:"bg-green-100",text:"text-green-800",label:"Delivered"},cancelled:{bg:"bg-red-100",text:"text-red-800",label:"Cancelled"},active:{bg:"bg-green-100",text:"text-green-800",label:"Active"},blocked:{bg:"bg-red-100",text:"text-red-800",label:"Blocked"},open:{bg:"bg-blue-100",text:"text-blue-800",label:"Open"},closed:{bg:"bg-gray-100",text:"text-gray-800",label:"Closed"},Confirmed:{bg:"bg-green-100",text:"text-green-800",label:"Confirmed"},failed:{bg:"bg-red-100",text:"text-red-800",label:"Failed"}}[n];return t.jsxs("span",{className:`inline-flex items-center rounded-full ${e.bg} ${e.text} ${a==="sm"?"px-2 py-0.5 text-xs":"px-3 py-1 text-sm"} font-medium`,children:[t.jsx("span",{className:`w-1.5 h-1.5 rounded-full mr-1.5 ${e.text.replace("text","bg")}`}),e.label]})}export{x as D,r as F,s as S};

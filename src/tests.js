import palette from'image-palette';import pixels from'image-pixels';import{launchBrowser,hasElementBySelectors}from'lib-verstka-tests';import{getStyle,sortColors,compareColors}from'./utils.js';const colorScheme=async a=>{const b=await hasElementBySelectors(a,'meta[name=color-scheme]:is([content~="dark"]):is([content~="light"])');return!b&&{id:'notColorScheme'}},switchScheme=async a=>{const{browser:b,page:c}=await launchBrowser(a,{viewport:{width:1024,height:768}}),d=await hasElementBySelectors(c,'.header__theme-menu-button.header__theme-menu-button_type_dark');if(!d)return{id:'switchButtonsChanged'};await c.click('.header__theme-menu-button.header__theme-menu-button_type_dark'),await c.evaluate(()=>{const a=document.querySelectorAll('img');a.forEach(a=>a.remove())}),await c.screenshot({path:'layout-dark.jpg',fullPage:!0});const{colors:e}=palette((await pixels('./layout-canonical-dark.jpg')),4),{colors:f}=palette((await pixels('./layout-dark.jpg')),4),g=sortColors(e),h=sortColors(f),i=g.every((a,b)=>compareColors(a,h[b],20));return await b.close(),!i&&{id:'notDarkColorScheme'}},blockFullScreen=async(a,b)=>{const c=await hasElementBySelectors(a,b);if(!c)return!1;const d=await a.evaluate(a=>{const b=document.querySelector(a);return window.innerHeight-b.clientHeight},b);return 0!==d&&{id:'blockNotFullScreen',values:{name:b}}},semanticTags=async(a,b)=>{const c=await Promise.all(b.map(async b=>{const c=await hasElementBySelectors(a,b);return{tagName:b,isMissing:!c}})),d=c.filter(({isMissing:a})=>a),e=d.map(({tagName:a})=>a);return e.length?[{id:'semanticTagsMissing',values:{tagNames:e.join(', ')}}]:[]},resetMargins=async(a,b)=>{const c=['margin','padding'],d=await Promise.all(b.map(async b=>{const d=await getStyle(a,b,c);return{tagName:b,isNotReset:d.some(a=>'0px'!==a)}})),e=d.filter(({isNotReset:a})=>a),f=e.map(({tagName:a})=>a);return f.length?[{id:'notResetMargins',values:{tagNames:f.join(', ')}}]:[]};export{colorScheme,switchScheme,blockFullScreen,semanticTags,resetMargins};
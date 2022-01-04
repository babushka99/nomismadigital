const searchResults=[];var current_url=window.location.origin;var static_url=document.querySelector("meta[name='ssp-url']").getAttribute("content");if(static_url.includes(current_url)){var baseurl=document.querySelector("meta[name='ssp-config-url']").getAttribute("content");var host_name=window.location.hostname;let index_url=baseurl+host_name.split('.').join('-')+'-index.json';let index;function loadIndex(callback){var xobj=new XMLHttpRequest();xobj.overrideMimeType("application/json");xobj.open('GET',index_url,false);xobj.onreadystatechange=function(){if(xobj.readyState==4&&xobj.status=="200"){callback(xobj.responseText);}};xobj.send(null);}
loadIndex(function(response){var json=JSON.parse(response);const index=Object.values(json);for(const value of index){var result={url:value.url,title:value.title,excerpt:value.excerpt,content:value.content,};searchResults.push(result);}});const searchFormNode=document.querySelector('.search-form');const searchInputNode=document.querySelector('.search-input');const autoCompleteNode=document.querySelector('.search-auto-complete');const resultNode=document.querySelector('.result');let input='';let results=[];let selected=-1;let showAutoComplete=false;const fuse=new Fuse(searchResults,{keys:['title','content'],shouldSort:true,threshold:0.5,maxPatternLength:50});function renderAutoComplete(){if(!showAutoComplete||input.length<3||results.length===0){autoCompleteNode.classList.remove('show');return '';}else{autoCompleteNode.classList.add('show');}
return `
    <ul>
      ${results.map((result,index)=>`
      <a href="${result.item.url}" style="text-decoration:none;color:#000000">
        <li class='auto-complete-item${index===selected?' selected':''}'>
          <p><b>${result.item.title}</b></br>
            <small>${result.item.excerpt}</small>
          </p>
        </li>
      </a>
    `).join('')}
    </ul>
  `;}
function handleSearchInput(event){input=event.target.value;results=[];if(input.length>=3){results=fuse.search(input).slice(0,7);}
showAutoComplete=true;autoCompleteNode.innerHTML=renderAutoComplete();}
function updateSearchInput(){if(selected===-1){searchInputNode.value=input;}else{searchInputNode.value=results[selected].title;}
autoCompleteNode.innerHTML=renderAutoComplete();}
function handleSearchKeyDown(event){switch(event.which){case 38:selected=Math.max(--selected,-1);updateSearchInput();break;case 40:selected=Math.min(++selected,results.length-1);showAutoComplete=true;updateSearchInput();break;case 9:showAutoComplete=false;updateSearchInput();break;case 27:selected=-1;showAutoComplete=false;updateSearchInput();break;}}
function handleWindowClick(event){showAutoComplete=false;autoCompleteNode.innerHTML=renderAutoComplete();}
if(document.getElementsByClassName('search-input-container').length>0){document.querySelector('.search-input-container').addEventListener('keydown',handleSearchKeyDown);searchInputNode.addEventListener('input',handleSearchInput);window.addEventListener('click',handleWindowClick);}}
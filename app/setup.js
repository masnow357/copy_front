const _setUp = (page) => {
    const button = document.getElementById('setUp')

    button.addEventListener('click', () => {
        document.querySelector('body').innerHTML = `
        <nav>
            <a href="/copywriting.html">Copywriting</a>
            <a href="/topics.html">Topics</a>
            <a href="/index.html">Sentence</a>
            <button id="setUp">Set up</button>
        </nav>
        <div id="setUp"></div>
        `;
        insert(page)
    })  
}

const getWords = async(choices, page) => {
    const fetchData = await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${choices[page][1]}`)
    const data = await fetchData.json();
    return data
}

const insert = async (page) => {
    console.log(page)
    const choices = [
        ['copywriting', 'words'],
        ['topics', 'key_ideas']
    ];

    try {

        await render(choices, page, false)

    } catch (error) {
        console.log(error);
        throw error;
    }
}

const events = (choices, page, fetchData) => {
    document.querySelectorAll(`ul.${choices[page][0]} > li > a.delete`).forEach(item => {
        item.addEventListener('click', (event) => {
            toDelete(event.target.classList[0], choices, page, false);
        })
    })
    document.querySelectorAll(`ul.${choices[page][0]} > li > a.edit`).forEach(item => {
        item.addEventListener('click', (event) => {
            const even = event
            _formToEdit(even.target, choices, page, false);
        })
    })

    document.querySelectorAll(`ul.words > li > a.delete`).forEach(item => {
        item.addEventListener('click', (event) => {
            toDelete(event.target.classList[0], choices, page, true);
        })
    })
    document.querySelectorAll(`ul.words > li > a.edit`).forEach(item => {
        item.addEventListener('click', (event) => {
            const even = event
            _formToEdit(even.target, choices, page, true, fetchData);
        })
    })
}

const render = async(choices, page, after) => {
    const noProcessData = await fetch(`https://18.218.26.119:4000/${choices[page][0]}`);
    let processData = await noProcessData.json();
    let _fetchData = [...processData]
    if(after){
        let htmlToInsert = '<li id="add"><button>...</button></li>';
        if(page){
            await processData.forEach(data => {
                htmlToInsert += `<li> ${data.topic_name} <a class="${data.id} edit">Edit</a> <a class="${data.id} delete">Delete</a> </li>`
            })
        }else{
            await processData.forEach(data => {
                htmlToInsert += `<li> ${data.cw_name} <a class="${data.id} edit">Edit</a> <a class="${data.id} delete">Delete</a> </li>`
            })
        }
        document.querySelector('body > div#setUp > ul').innerHTML = htmlToInsert;

        htmlToInsert = '<li id="addWord"><button>...</button></li>';

        processData = await getWords(choices, page);

        if(page){
            await processData.forEach(data => {
                htmlToInsert += `<li> <p class="${choices[page][0]}"> ${data.tp} </p> <p class="${choices[page][1]}"> ${data.idea} </p> <a class="${data.id} ${data.ki_id} edit">Edit</a> <a class="${data.id} delete">Delete</a> </li>`
            })
        }else{
            await processData.forEach(data => {
                htmlToInsert += `<li> <p class="${choices[page][0]}"> ${data.cw} </p> <p class="${choices[page][1]}"> ${data.word} </p> <a class="${data.id} ${data.cw_id} edit">Edit</a> <a class="${data.id} delete">Delete</a> </li>`
            })
        }

        document.querySelector('body > div#setUp > ul.words').innerHTML = htmlToInsert;

    }else{
        let htmlToInsert = `<ul class="${choices[page][0]}"><li id="add"><button>...</button></li>`
    
        if(page){
            await processData.forEach(data => {
                htmlToInsert += `<li> ${data.topic_name} <a class="${data.id} edit">Edit</a> <a class="${data.id} delete">Delete</a> </li>`
            })
        }else{
            await processData.forEach(data => {
                htmlToInsert += `<li> ${data.cw_name} <a class="${data.id} edit">Edit</a> <a class="${data.id} delete">Delete</a> </li>`
            })
        }
    
        htmlToInsert += '</ul>';
    
        document.querySelector('body > div#setUp').insertAdjacentHTML('beforeend', htmlToInsert);

        htmlToInsert = `<ul class="words"><li id="addWord"><button>...</button></li>`

        processData = await getWords(choices, page);
    
        if(page){
            await processData.forEach(data => {
                htmlToInsert += `<li> <p class="${choices[page][0]}"> ${data.tp} </p> <p class="${choices[page][1]}"> ${data.idea} </p> <a class="${data.id} ${data.ki_id} edit">Edit</a> <a class="${data.id} delete">Delete</a> </li>`
            })
        }else{
            await processData.forEach(data => {
                htmlToInsert += `<li> <p class="${choices[page][0]}"> ${data.cw} </p> <p class="${choices[page][1]}"> ${data.word} </p> <a class="${data.id} ${data.cw_id} edit">Edit</a> <a class="${data.id} delete">Delete</a> </li>`
            })
        }
    
        htmlToInsert += '</ul>';
    
        document.querySelector('body > div#setUp').insertAdjacentHTML('beforeend', htmlToInsert);
    }

    document.querySelector('li#add > button').addEventListener('click', (event) => {
        _formToAdd(event.target.parentElement, page, choices)
    })
    document.querySelector('li#addWord > button').addEventListener('click', (event) => {
        console.log('Perro', event.target.parentElement)
        _formToAdd(event.target.parentElement, page, choices, _fetchData);
    })
    events(choices, page, _fetchData)
}

const _formToAdd = (event, page, choices, fetchData) => {
    let htmlInput = ''
    if(fetchData){
        htmlInput += '<select name="selectword">'
        if (page){
            fetchData.forEach(item => {
                htmlInput += `<option value="${item.id}">${item.topic_name}</option>`
            })
        }else{
            fetchData.forEach(item => {
                htmlInput += `<option value="${item.id}">${item.cw_name}</option>`
            })
        }
        htmlInput += `
            </select>
            <input type="text" placeholder="Write new field" id="inputAddWords">
            <input type="button" value="Add new field">
            `

    }else{
        htmlInput += `
            <input type="text" placeholder="Write new field" id="inputAdd">
            <input type="button" value="Add new field">`;
    }
    
    event.innerHTML = htmlInput;
    event.lastElementChild.addEventListener('click', (e) => {
        toAdd(page, choices, true);
    })

}

const _formToEdit = (target, choices, page, word, fetchData) => {
    let htmlInput = ''
    if(word){
        htmlInput = '<select name="select">'
        if (page){
            fetchData.forEach(item => {
                if(target.parentElement.children[0].textContent.trim() == item.topic_name){
                    htmlInput += `<option value="${item.id}" selected>${item.topic_name}</option>`
                }else{
                    htmlInput += `<option value="${item.id}">${item.topic_name}</option>`
                }
            })
        }else{
            fetchData.forEach(item => {
                if(target.parentElement.children[0].textContent.trim() == item.cw_name){
                    htmlInput += `<option value="${item.id}" selected>${item.cw_name}</option>`
                }else{
                    htmlInput += `<option value="${item.id}">${item.cw_name}</option>`
                }
            })
        }

        htmlInput += `
            </select>
            <input type="text" placeholder="Write new field" value="${target.previousElementSibling.textContent.trim()}">
            <input type="button" value="Edit field">
            `;

    }else{
        htmlInput = `
            <input type="text" placeholder="Write new field" value="${target.parentElement.firstChild.textContent.trim()}">
            <input type="button" value="Edit field">`;
    }

    const _li = target.parentElement;
    
    _li.innerHTML = htmlInput;

    if(word){
        _li.children[2].addEventListener('click', (e) => {
            console.log(e.target)
            toEdit(page, choices, target.classList[0], _li, word)
        })
    }else{
        _li.lastChild.addEventListener('click', (e) => {
            console.log(e.target)
            toEdit(page, choices, target.classList[0], _li, word)
        })
    }
}

const toAdd = async(page, choices, word) => {
    let includes = false;
    if(word){
        const noProcessData = await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${choices[page][1]}`);
        const processData = await noProcessData.json();

        const selected = document.querySelector('li#addWord > select').value;
        const textInput = document.getElementById('inputAddWords').value;

        for (let i = 0; i < processData.length; i++) {
            const element = processData[i];
            if(page){
                if(element.ki_id == selected && element.idea == textInput){
                    includes = true;
                    break;
                }
            }else{
                if(element.cw_id == selected && element.word == textInput){
                    includes = true;
                    break;
                }
            }
            
        }

        if(textInput && !includes){
            await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${choices[page][1]}/${selected}/${textInput}`, {
                method: 'POST'
            })
    
            await render(choices, page, true)
        }

    }else{
        const textInput = document.getElementById('inputAdd');

        const noProcessData = await fetch(`https://18.218.26.119:4000/${choices[page][0]}`);
        const processData = await noProcessData.json();

        let includes = false;

        for (let i = 0; i < processData.length; i++) {
            const element = processData[i];

            if(page){
                if(element.topic_name == textInput.value){
                    includes = true;
                    break;
                }
            }else{
                if(element.cw_name == textInput.value){
                    includes = true;
                    break;
                }
            }
            
        }

        if (textInput.value && !includes){
            await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${textInput.value}`, {
                method: 'POST'
            })

            await render(choices, page, true)
        }else{
            console.log('NOPE')
        }
    }
}

const toEdit = async (page, choices, target, li, word) => {
    let includes = false;
    if(word){
        const noProcessData = await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${choices[page][1]}`);
        const processData = await noProcessData.json();

        for (let i = 0; i < processData.length; i++) {
            const element = processData[i];
            if(page){
                if(element.ki_id == li.children[0].value && element.idea == li.children[1].value){
                    includes = true;
                    break;
                }
            }else{
                if(element.cw_id == li.children[0].value && element.word == li.children[1].value){
                    includes = true;
                    break;
                }
            }
            
        }

        if(!includes){
            await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${choices[page][1]}/${target}/${li.children[0].value}/${li.children[1].value}`, {
                method: 'PUT'
            })
    
            await render(choices, page, true)
        }

    }else{
        const noProcessData = await fetch(`https://18.218.26.119:4000/${choices[page][0]}`);
        const processData = await noProcessData.json();

        console.log(li.children[0], 'li.children[0]')

        for (let i = 0; i < processData.length; i++) {
            const element = processData[i];
            if(page){
                if(element.topic_name == li.children[0].value){
                    includes = true;
                    break;
                }
            }else{
                if(element.cw_name == li.children[0].value){
                    includes = true;
                    break;
                }
            }
            
        }

        if(!includes){
            await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${target}/${li.children[0].value}`, {
                method: 'PUT'
            })
    
            await render(choices, page, true)
        }
    }
}

const toDelete = async (id, choices, page, word) => {
    if(!word){
        await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${id}`, {
            method: 'DELETE'
        })
    }else{
        await fetch(`https://18.218.26.119:4000/${choices[page][0]}/${choices[page][1]}/${id}`, {
            method: 'DELETE'
        })
    }

    await render(choices, page, true)

}
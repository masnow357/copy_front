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

const events = (choices, page) => {
    document.querySelectorAll(`ul.${choices[page][0]} > li > a.delete`).forEach(item => {
        item.addEventListener('click', (event) => {
            console.log(event.target.classList[0])
            toDelete(event.target.classList[0], choices, page);
        })
    })
    document.querySelectorAll(`ul.${choices[page][0]} > li > a.edit`).forEach(item => {
        item.addEventListener('click', (event) => {
            const even = event
            _formToEdit(even.target, choices, page);
        })
    })
}

const render = async(choices, page, after) => {
    const noProcessData = await fetch(`http://localhost:4000/${choices[page][0]}`);
    const processData = await noProcessData.json();

    if(after){
        let htmlToInsert = '<li id="add">...</li>';
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

    }else{
        let htmlToInsert = `<ul class="${choices[page][0]}"><li id="add">...</li>`
    
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
    }

    document.getElementById('add').addEventListener('click', (event) => {
        _formToAdd(event.target, page, choices)
    })
    events(choices, page)
}

const _formToAdd = (event, page, choices) => {
    const htmlInput = `
        <input type="text" placeholder="Write new field" id="inputAdd">
        <input type="button" value="Add new field">`;
    
    event.innerHTML = htmlInput;

    event.lastChild.addEventListener('click', (e) => {
        toAdd(page, choices)
    })

}

const _formToEdit = (target, choices, page) => {
    console.log(target, 'target')
    const htmlInput = `
        <input type="text" placeholder="Write new field" value="${target.parentElement.firstChild.textContent.trim()}">
        <input type="button" value="Edit field">`;

    const _li = target.parentElement;
    
    _li.innerHTML = htmlInput;

    _li.lastChild.addEventListener('click', (e) => {
        toEdit(page, choices, target.classList[0], _li)
    })
}

const toAdd = async(page, choices) => {
    const textInput = document.getElementById('inputAdd');

    const noProcessData = await fetch(`http://localhost:4000/${choices[page][0]}`);
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
        await fetch(`http://localhost:4000/${choices[page][0]}/${textInput.value}`, {
            method: 'POST'
        })

        await render(choices, page, true)
    }else{
        console.log('NOPE')
    }
}

const toEdit = async (page, choices, target, li) => {
    const noProcessData = await fetch(`http://localhost:4000/${choices[page][0]}`);
    const processData = await noProcessData.json();

    let includes = false;

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
        await fetch(`http://localhost:4000/${choices[page][0]}/${target}/${li.children[0].value}`, {
            method: 'PUT'
        })

        await render(choices, page, true)
    }
}

const toDelete = async (id, choices, page) => {
    await fetch(`http://localhost:4000/${choices[page][0]}/${id}`, {
        method: 'DELETE'
    })

    await render(choices, page, true)

}
const getCopyWords = async(page) => {

    const choices = [
        ['copywriting', 'words'],
        ['topics', 'key_ideas']
    ];

    try {
        const noProcessData = await fetch(`http://18.218.26.119:4000/${choices[page][0]}`);
        const processData = await noProcessData.json();

        let htmlToInsert = `<ul class="${choices[page][0]}">`

        if(page){
            await processData.forEach(data => {
                htmlToInsert += `<li id="${data.id}"> ${data.topic_name} </li>`
            })
        }else{
            await processData.forEach(data => {
                htmlToInsert += `<li id="${data.id}"> ${data.cw_name} </li>`
            })
        }

        htmlToInsert += '</ul>';

        document.querySelector(`body > div#${choices[page][0]}`).insertAdjacentHTML('beforeend', htmlToInsert);

        const _li = document.querySelectorAll(`ul.${choices[page][0]} > li`)

        _li.forEach(item =>{
            item.addEventListener('click', (event) => {
                getWords(event)
            })
        })

        const getWords = async(e) => {
            const dataWords = await fetch(`http://18.218.26.119:4000/${choices[page][0]}/${choices[page][1]}/${e.target.id}`);
            const words = await dataWords.json();
            
            let wordsToInsert = `<ul class="${choices[page][1]}">`
            
            if(words.length){

                if(page){
                    await words.forEach(data => {
                        wordsToInsert += `<li id="${data.id}"> ${data.idea} </li>`
                    })  
                }else{
                    await words.forEach(data => {
                        wordsToInsert += `<li id="${data.id}"> ${data.word} </li>`
                    })  
                }              
                
            }else{

                wordsToInsert += `<li> No ${choices[page][1]} </li>`

            }
            
            wordsToInsert += '</ul>';
            
            document.querySelector(`body > div#${choices[page][1]}`).innerHTML = wordsToInsert;
        }
    } catch (error) {
        console.log(error.message, error)
    }
}
const getCopyWords = async() => {
    try {
        const noProcessData = await fetch('localhost:4000/copywriting');
        const processData = await noProcessData.json();

        console.log(processData)
    } catch (error) {
        console.log(error.message, 'perro', error)
    }
}

getCopyWords()
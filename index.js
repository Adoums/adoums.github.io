const ws = new WebSocket("ws://message.adoums.repl.co/")
const ifStored = () => {return window.sessionStorage.getItem("username")}
if(ifStored()) ws.onopen = () => ws.send(`{"author":"${ifStored()}"}`)
else ws.onopen = () => ws.send("[]")
function createMessage(author, content) {
    const div = document.createElement("div")
    const authorElement = document.createElement("div")
    const contentElement = document.createElement("div")
    div.classList.add("message")
    authorElement.classList.add("author")
    contentElement.classList.add("content")
    authorElement.innerText = author
    contentElement.innerText = `> ${content}`
    div.append(authorElement, contentElement)
    document.getElementsByTagName("section")[0].append(div)
}
ws.onmessage = m => {
    m = JSON.parse(m.data)
    if(m.success) {
        window.sessionStorage.setItem("username", m.author)
    } else {
        if(m instanceof Array) {
            m = m.reverse()
            for(let i = 0; i < m.length; i++) createMessage(m[i].author, m[i].content)
        } else createMessage(m.author, m.content)
        document.getElementsByTagName("section")[0].scrollTop = document.getElementsByTagName("section")[0].scrollHeight
        new Audio('sound.mp3').play()
    }
}
const textarea = document.getElementsByTagName("textarea")[0]
textarea.onkeyup = e => {
    if(!textarea.value.replace(/[^A-Za-z0-9]+/g, "").length) return
    if(e.key == "Enter") {
        const value = textarea.value.replace(/("|\n)/g, "")
        textarea.value = ""
        if(ifStored()) ws.send(`{"content":"${value}"}`)
        else ws.send(`{"author":"${value}"}`)
    }
}

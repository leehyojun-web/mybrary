import { useState, useEffect } from "react";

const ADMIN_EMAIL = "admin@mybrary.com";
const ADMIN_PASSWORD = "1234";

export default function App() {

const [user,setUser] = useState(null)
const [page,setPage] = useState("login")

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const [query,setQuery] = useState("")
const [books,setBooks] = useState([])

const [library,setLibrary] = useState([])

useEffect(()=>{

const savedUser = localStorage.getItem("user")
if(savedUser){
setUser(JSON.parse(savedUser))
setPage("home")
}

const savedLibrary = localStorage.getItem("library")
if(savedLibrary){
setLibrary(JSON.parse(savedLibrary))
}

},[])

const saveLibrary=(data)=>{
setLibrary(data)
localStorage.setItem("library",JSON.stringify(data))
}

const signup=()=>{

const users = JSON.parse(localStorage.getItem("users") || "[]")

users.push({email,password})

localStorage.setItem("users",JSON.stringify(users))

alert("회원가입 완료")

setPage("login")

}

const login=()=>{

if(email===ADMIN_EMAIL && password===ADMIN_PASSWORD){

const adminUser={email,role:"admin"}

setUser(adminUser)

localStorage.setItem("user",JSON.stringify(adminUser))

setPage("home")

return
}

const users = JSON.parse(localStorage.getItem("users") || "[]")

const found = users.find(u=>u.email===email && u.password===password)

if(found){

setUser(found)

localStorage.setItem("user",JSON.stringify(found))

setPage("home")

}else{

alert("로그인 실패")

}

}

const logout=()=>{

setUser(null)

localStorage.removeItem("user")

setPage("login")

}

const search=async()=>{

if(!query) return

const res = await fetch(
`https://www.googleapis.com/books/v1/volumes?q=${query}`
)

const data = await res.json()

setBooks(data.items || [])

}

const addBook=(book)=>{

const info = book.volumeInfo

const poster = info.imageLinks?.thumbnail || ""

const newItem = {
id:book.id,
title:info.title,
poster
}

if(library.find(i=>i.id===book.id)){
alert("이미 추가됨")
return
}

const newLibrary=[...library,newItem]

saveLibrary(newLibrary)

alert("내 서재에 추가됨")

}

const removeBook=(id)=>{

const newLibrary = library.filter(i=>i.id!==id)

saveLibrary(newLibrary)

}

if(page==="login"){

return(

<div style={styles.center}>

<h1>MYBRARY 로그인</h1>

<input
placeholder="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>로그인</button>

<p onClick={()=>setPage("signup")} style={{cursor:"pointer"}}>
회원가입
</p>

</div>

)

}

if(page==="signup"){

return(

<div style={styles.center}>

<h1>회원가입</h1>

<input
placeholder="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={signup}>가입</button>

<p onClick={()=>setPage("login")} style={{cursor:"pointer"}}>
로그인
</p>

</div>

)

}

if(page==="library"){

return(

<div style={styles.page}>

<h1>📚 내 서재</h1>

<button onClick={()=>setPage("home")}>홈</button>

<div style={styles.grid}>

{library.map(item=>(

<div key={item.id} style={styles.card}>

<img src={item.poster} width="100"/>

<p>{item.title}</p>

<button onClick={()=>removeBook(item.id)}>
삭제
</button>

</div>

))}

</div>

</div>

)

}

return(

<div style={styles.page}>

<h1>📚 MYBRARY</h1>

<p>{user.email}</p>

<button onClick={()=>setPage("library")}>
내 서재
</button>

<button onClick={logout}>
로그아웃
</button>

<div style={{marginTop:20}}>

<input
placeholder="책 검색"
value={query}
onChange={(e)=>setQuery(e.target.value)}
/>

<button onClick={search}>검색</button>

</div>

<h2>검색 결과</h2>

<div style={styles.grid}>

{books.map(book=>{

const info = book.volumeInfo

const poster = info.imageLinks?.thumbnail || ""

return(

<div key={book.id} style={styles.card}>

<img src={poster} width="100"/>

<p>{info.title}</p>

<button onClick={()=>addBook(book)}>
추가
</button>

</div>

)

})}

</div>

</div>

)

}

const styles={

page:{
padding:40,
fontFamily:"sans-serif"
},

center:{
display:"flex",
flexDirection:"column",
gap:10,
width:300,
margin:"100px auto"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",
gap:20,
marginTop:20
},

card:{
border:"1px solid #ddd",
padding:10
}

}

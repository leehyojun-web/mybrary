import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

/* ---------------- STORAGE ---------------- */

const load = (k, f) => {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : f
  } catch {
    return f
  }
}

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))

/* ---------------- STYLES ---------------- */

const styles = {

  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0c0a04,#181008)",
    color: "white",
    fontFamily: "system-ui",
    padding: 30
  },

  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #555",
    background: "#111",
    color: "white"
  },

  button: {
    padding: "10px 14px",
    borderRadius: 6,
    border: "none",
    background: "#c4a45a",
    cursor: "pointer",
    fontWeight: "bold"
  },

  card: {
    background: "#1b150a",
    border: "1px solid #3a2a10",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  tag: {
    fontSize: 12,
    padding: "2px 8px",
    borderRadius: 12,
    background: "#3a2a10"
  }

}

/* ---------------- LOGIN ---------------- */

function Login({ onLogin }) {

  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ id: "", pw: "", name: "" })

  const auth = () => {

    const users = load("myb_users", [])

    if (mode === "signup") {

      if (users.find(u => u.id === form.id)) {
        alert("이미 존재하는 ID")
        return
      }

      users.push(form)
      save("myb_users", users)

      alert("회원가입 완료")
      setMode("login")
      return
    }

    const user = users.find(
      u => u.id === form.id && u.pw === form.pw
    )

    if (user) {
      save("myb_current", user)
      onLogin(user)
    } else {
      alert("로그인 실패")
    }

  }

  return (

    <div style={{ ...styles.page, ...styles.center, justifyContent: "center" }}>

      <h1 style={{ fontSize: 42 }}>MYBRARY</h1>

      <input
        style={styles.input}
        placeholder="ID"
        onChange={e => setForm({ ...form, id: e.target.value })}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, pw: e.target.value })}
      />

      {mode === "signup" &&
        <input
          style={styles.input}
          placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      }

      <button style={styles.button} onClick={auth}>
        {mode === "login" ? "로그인" : "회원가입"}
      </button>

      <p
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        style={{ cursor: "pointer", opacity: .7 }}
      >
        {mode === "login" ? "회원가입" : "로그인"}
      </p>

    </div>
  )
}

/* ---------------- HALL ---------------- */

function Hall({ user }) {

  return (

    <div style={{ ...styles.page, ...styles.center, justifyContent: "center" }}>

      <h1 style={{ fontSize: 50 }}>MYBRARY</h1>

      <p style={{ opacity: .7 }}>{user.name}님의 문화 기록</p>

      <Link to="/library">
        <button style={styles.button}>
          서재 들어가기
        </button>
      </Link>

    </div>

  )
}

/* ---------------- LIBRARY ---------------- */

function Library({ user }) {

  const [records, setRecords] = useState([])
  const [title, setTitle] = useState("")
  const [type, setType] = useState("book")
  const [stars, setStars] = useState(5)
  const [search, setSearch] = useState("")

  useEffect(() => {

    const data = load(`records_${user.id}`, [])
    setRecords(data)

  }, [])

  const saveRecords = (list) => {
    setRecords(list)
    save(`records_${user.id}`, list)
  }

  const add = () => {

    if (!title.trim()) return

    const rec = {
      id: Date.now(),
      title,
      type,
      stars,
      date: new Date().toLocaleDateString()
    }

    saveRecords([rec, ...records])

    setTitle("")
  }

  const del = id => {

    saveRecords(records.filter(r => r.id !== id))

  }

  const filtered = records.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  const icons = {
    book: "📚",
    movie: "🎬",
    drama: "📺",
    game: "🎮"
  }

  return (

    <div style={styles.page}>

      <Link to="/">
        <button style={{ ...styles.button, marginBottom: 20 }}>
          ← 돌아가기
        </button>
      </Link>

      <h2>나의 문화 기록</h2>

      {/* 입력 */}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>

        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목"
        />

        <select
          style={styles.input}
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="book">📚 책</option>
          <option value="movie">🎬 영화</option>
          <option value="drama">📺 드라마</option>
          <option value="game">🎮 게임</option>
        </select>

        <select
          style={styles.input}
          value={stars}
          onChange={e => setStars(e.target.value)}
        >
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>

        <button style={styles.button} onClick={add}>
          추가
        </button>

      </div>

      {/* 검색 */}

      <input
        style={{ ...styles.input, marginBottom: 20 }}
        placeholder="검색"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* 목록 */}

      {filtered.map(r => (

        <div key={r.id} style={styles.card}>

          <div>

            <div style={{ fontSize: 18 }}>
              {icons[r.type]} {r.title}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>

              <span style={styles.tag}>
                {"⭐".repeat(r.stars)}
              </span>

              <span style={styles.tag}>
                {r.date}
              </span>

            </div>

          </div>

          <button
            onClick={() => del(r.id)}
            style={{
              background: "#8b1a1a",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            삭제
          </button>

        </div>

      ))}

    </div>
  )
}

/* ---------------- APP ---------------- */

export default function App() {

  const [user, setUser] = useState(null)

  useEffect(() => {

    const u = load("myb_current", null)

    if (u) setUser(u)

  }, [])

  if (!user) return <Login onLogin={setUser} />

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Hall user={user} />}
        />

        <Route
          path="/library"
          element={<Library user={user} />}
        />

      </Routes>

    </BrowserRouter>

  )
}
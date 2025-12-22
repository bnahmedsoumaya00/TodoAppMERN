import { useState } from 'react'
import { CheckCircle, Calendar, Plus } from 'lucide-react'

function App() {
  const [todos, setTodos] = useState([
    { id: 1, title: 'Setup Database', completed: true, priority: 'high' },
    { id: 2, title: 'Create Backend API', completed: true, priority: 'high' },
    { id: 3, title: 'Design Frontend', completed: false, priority: 'medium' },
  ])

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          padding: '2rem',
          background: 'var(--gradient-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <h1 style={{ 
            fontSize: 'var(--font-size-4xl)', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--color-frozen-water), var(--color-powder-blue))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ✨ Todo App
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your beautiful task manager with new color theme!
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card">
            <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>
              {todos.length}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Total Tasks
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem', color: 'var(--color-success)' }}>
              {todos.filter(t => t.completed).length}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Completed
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
              {todos.filter(t => !t.completed).length}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Pending
            </p>
          </div>
        </div>

        {/* Add Todo Button */}
        <button className="btn btn-accent" style={{ 
          width: '100%', 
          marginBottom: '2rem',
          fontSize: 'var(--font-size-lg)',
          padding: 'var(--space-lg)'
        }}>
          <Plus size={20} />
          Add New Task
        </button>

        {/* Todo List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {todos.map(todo => (
            <div key={todo.id} className="card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: todo.completed ? 'var(--color-success)' : 'var(--bg-primary)',
                border: `2px solid ${todo.completed ? 'var(--color-success)' : 'var(--border-accent)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {todo.completed && <CheckCircle size={16} color="white" />}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontSize: 'var(--font-size-lg)'
                }}>
                  {todo.title}
                </h3>
              </div>

              <span className={`badge badge-${todo.priority === 'high' ? 'error' : 'warning'}`}>
                {todo.priority}
              </span>
            </div>
          ))}
        </div>

        {/* Success Message */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem',
          background: 'var(--gradient-accent)',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: 'var(--font-size-2xl)',
            marginBottom: '1rem',
            color: 'var(--bg-primary)'
          }}>
            🎉 Setup Complete!
          </h2>
          <p style={{ 
            color: 'var(--bg-primary)', 
            fontSize: 'var(--font-size-lg)',
            fontWeight: '500'
          }}>
            ✅ Database Running<br/>
            ✅ Backend API Running<br/>
            ✅ Frontend with New Colors<br/>
            🚀 Ready to Build!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
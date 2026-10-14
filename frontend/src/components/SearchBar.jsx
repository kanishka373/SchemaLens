import { Search } from 'lucide-react'

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <Search
        size={16}
        color="#64748b"
        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      />
      <input
        className="input-field"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search tables..."
        style={{ paddingLeft: '40px' }}
      />
    </div>
  )
}

export default SearchBar
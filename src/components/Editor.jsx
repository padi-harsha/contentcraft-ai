import { Check, Copy, Download, Eraser, Heart, RefreshCw, Undo2 } from 'lucide-react'
import { countChars, countWords } from '../utils/text.js'

export default function Editor({ value, onChange, onCopy, onDownload, onRegenerate, onClear, onToggleFavorite, isFavorite, canUndo, onUndo, saveState, busy }) {
  return (
    <div className="editor">
      <div className="editor-toolbar" role="toolbar" aria-label="Editor actions">
        <button className="btn btn-small" onClick={onCopy}><Copy size={15} aria-hidden="true" /> Copy</button>
        <button className="btn btn-small" onClick={onDownload}><Download size={15} aria-hidden="true" /> Download .txt</button>
        <button className="btn btn-small" onClick={onRegenerate} disabled={busy}><RefreshCw size={15} aria-hidden="true" /> Regenerate</button>
        <button className="btn btn-small" onClick={onClear}><Eraser size={15} aria-hidden="true" /> Clear formatting</button>
        {canUndo && <button className="btn btn-small btn-ghost" onClick={onUndo}><Undo2 size={15} aria-hidden="true" /> Undo</button>}
        <span className="toolbar-spacer" />
        <button className={`btn btn-small ${isFavorite ? 'btn-fav' : ''}`} onClick={onToggleFavorite} aria-pressed={isFavorite}>
          <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" /> {isFavorite ? 'Saved' : 'Save'}
        </button>
      </div>

      <textarea className="editor-area" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Generated content editor" spellCheck="true" />

      <div className="editor-foot">
        <span>{countWords(value)} words</span>
        <span>{countChars(value)} characters</span>
        <span className="toolbar-spacer" />
        {saveState === 'saved' && <span className="saved"><Check size={14} aria-hidden="true" /> Changes saved</span>}
        {saveState === 'saving' && <span>Saving…</span>}
      </div>
    </div>
  )
}

function LanguageSelector({ onLanguageChange, value, disabled }) {
  return (
    <select
      value={value || "en"}
      disabled={disabled}
      onChange={(e) => onLanguageChange(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: "8px",
        border: "var(--border-glass)",
        background: "var(--bg-glass)",
        color: "var(--text-main)",
        outline: "none",
        fontSize: "0.9rem",
        cursor: "pointer",
      }}
    >
      <option value="en" style={{ color: "black" }}>English</option>
      <option value="hi" style={{ color: "black" }}>Hindi</option>
      <option value="gu" style={{ color: "black" }}>Gujarati</option>
      <option value="fr" style={{ color: "black" }}>French</option>
      <option value="es" style={{ color: "black" }}>Spanish</option>
      <option value="zh-CN" style={{ color: "black" }}>Chinese</option>
    </select>
  );
}

export default LanguageSelector;

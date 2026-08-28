import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

// Map avatar IDs to their imported images
// Vite requires explicit static imports for assets to be bundled correctly
import av0  from "../assets/avatars/avatar-default.jpg";
import av1  from "../assets/avatars/avatar-1.jpg";
import av2  from "../assets/avatars/avatar-2.jpg";
import av3  from "../assets/avatars/avatar-3.jpg";
import av4  from "../assets/avatars/avatar-4.jpg";
import av5  from "../assets/avatars/avatar-5.jpg";
import av6  from "../assets/avatars/avatar-6.jpg";
import av7  from "../assets/avatars/avatar-7.jpg";
import av8  from "../assets/avatars/avatar-8.jpg";
import av9  from "../assets/avatars/avatar-9.jpg";
import av10 from "../assets/avatars/avatar-10.jpg";
import av11 from "../assets/avatars/avatar-11.jpg";
import av12 from "../assets/avatars/avatar-12.jpg";

export const AVATAR_MAP = {
  "avatar-default": av0,
  "avatar-1":  av1,
  "avatar-2":  av2,
  "avatar-3":  av3,
  "avatar-4":  av4,
  "avatar-5":  av5,
  "avatar-6":  av6,
  "avatar-7":  av7,
  "avatar-8":  av8,
  "avatar-9":  av9,
  "avatar-10": av10,
  "avatar-11": av11,
  "avatar-12": av12,
};

const AVATAR_IDS = Object.keys(AVATAR_MAP);

/** Returns the resolved image src for an avatar ID, falling back to default */
export function getAvatarSrc(avatarId) {
  return AVATAR_MAP[avatarId] ?? AVATAR_MAP["avatar-default"];
}

/**
 * Inline accordion avatar picker.
 * Renders a compact grid of 13 avatar options (including default).
 * The currently selected avatar gets a sage-green inset ring.
 */
export default function AvatarPicker({ onClose, value, onChange }) {
  const { user, updateUserAvatar } = useAuth();
  const isControlled = value !== undefined && onChange !== undefined;
  
  const [selected, setSelected] = useState(isControlled ? value : (user?.avatar || "avatar-default"));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = async (avatarId) => {
    if (saving) return;
    
    if (isControlled) {
      onChange(avatarId);
      return;
    }

    if (avatarId === selected) return;

    setSelected(avatarId);
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await updateUserAvatar(avatarId);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        if (onClose) onClose();
      }, 800);
    } catch (err) {
      setError(err.message || "Failed to update avatar");
      // Revert optimistic selection
      setSelected(user?.avatar || "avatar-default");
    } finally {
      setSaving(false);
    }
  };

  const currentSelected = isControlled ? value : selected;

  return (
    <div
      className="journal-paper p-6 space-y-4"
      style={{ animation: "fade-in 0.25s ease-out" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="stamp-label text-primary">Choose Your Emblem</p>
        {onClose && (
          <button
            onClick={onClose}
            className="font-sans text-label-sm text-outline hover:text-on-surface transition-colors duration-200 uppercase tracking-widest"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* Ruled divider */}
      <div className="w-full h-px bg-outline-variant/30" style={{ background: "color-mix(in srgb, var(--color-outline-variant) 30%, transparent)" }} />

      {/* Avatar grid — 4 columns */}
      <div className="grid grid-cols-4 gap-3">
        {AVATAR_IDS.map((id) => {
          const isSelected = id === currentSelected;
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              disabled={saving}
              title={id === "avatar-default" ? "Default Emblem" : `Emblem ${id.replace("avatar-", "")}`}
              style={{
                outline: "none",
                // Sage-green inset ring for selected; faint border otherwise
                boxShadow: isSelected
                  ? "inset 0 0 0 2px var(--color-primary), 0 0 12px color-mix(in srgb, var(--color-primary) 25%, transparent)"
                  : "inset 0 0 0 1px color-mix(in srgb, var(--color-outline-variant) 40%, transparent)",
                transition: "box-shadow 0.2s ease, opacity 0.2s ease",
                opacity: saving && !isSelected ? 0.5 : 1,
              }}
              className="relative aspect-square overflow-hidden bg-surface-container-low"
            >
              <img
                src={getAvatarSrc(id)}
                alt={id}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Ink-stamp "selected" overlay — a very subtle darkening top strip, mimicking a stamp impression */}
              {isSelected && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Status line */}
      <div className="h-4">
        {saving && (
          <p className="font-sans text-label-sm text-outline italic">
            Stamping your emblem...
          </p>
        )}
        {saved && (
          <p className="font-sans text-label-sm text-primary italic">
            ✓ Emblem saved
          </p>
        )}
        {error && (
          <p className="font-sans text-label-sm text-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

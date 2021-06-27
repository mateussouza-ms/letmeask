import "./styles.scss";

type ToggleButtonProps = {
  checked: boolean;
  onToggle: () => void;
};

export function ToggleButton({ checked, onToggle }: ToggleButtonProps) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span className="slider round" />
    </label>
  );
}

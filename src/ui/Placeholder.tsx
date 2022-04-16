import './Placeholder.css';

export default function Placeholder({ children, className }: { children: string; className?: string }) {
  return <div className={className || 'Placeholder__root'}>{children}</div>;
}

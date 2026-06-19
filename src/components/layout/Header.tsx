import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  backTo?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, backTo, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {backTo && (
          <Link to={backTo} className="text-gray-500 hover:text-gray-700">
            ← 返回
          </Link>
        )}
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

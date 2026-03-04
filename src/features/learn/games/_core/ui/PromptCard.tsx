type PromptCardProps = {
  text: string;
  subtitle?: string;
  className?: string;
};

export function PromptCard({ text, subtitle, className = "" }: PromptCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-8 text-center max-w-sm w-full ${className}`}>
      <div className="text-4xl font-bold text-gray-800 mb-2">{text}</div>
      {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
    </div>
  );
}

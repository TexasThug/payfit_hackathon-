import { useSalary, getShareUrl } from '@/contexts/SalaryContext';
import { toast } from 'sonner';

const ShareSection = () => {
  const { state } = useSalary();

  const copyLink = () => {
    navigator.clipboard.writeText(getShareUrl(state));
    toast.success('Lien copié !');
  };

  return (
    <div className="payfit-card max-w-xl mx-auto text-center">
      <p className="text-lg font-semibold text-foreground mb-4">📤 Partager cette simulation</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={copyLink}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-background-secondary transition-colors"
        >
          📋 Copier le lien
        </button>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl(state))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-background-secondary transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default ShareSection;

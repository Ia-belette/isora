/** @jsxImportSource preact */
interface ProviderButtonProps {
  provider: {
    provider_id: number;
    provider_name: string;
    logo_path: string;
    countries: string[];
  };
  isSelected: boolean;
  onSelect: (providerId: number) => void;
}

export default function ProviderButton({ provider, isSelected, onSelect }: ProviderButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(provider.provider_id)}
      class={`w-[7.5rem] flex-shrink-0 flex flex-col items-center gap-2 text-center py-2 px-2.5 rounded-xl hover:bg-[#0000000d] ${
        isSelected ? "bg-[#0000000d]" : ""
      }`}
    >
      <div class="w-16 h-16 flex items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
          alt={provider.provider_name}
          width={64}
          height={64}
          class="w-full h-full object-contain"
        />
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-center font-medium line-clamp-1">{provider.provider_name}</span>
        <span class="text-sm text-gray-500 text-center">
          {provider.countries.length} {provider.countries.length === 1 ? "country" : "countries"}
        </span>
      </div>
    </button>
  );
}


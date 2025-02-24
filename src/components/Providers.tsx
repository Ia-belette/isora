/** @jsxImportSource preact */
import { useState, useEffect, useMemo, useRef } from "preact/hooks";
import { transformProviders, } from "../lib/utils";
import ProviderButton from "./ProviderButton";
import CountryList from "./CountryList";


export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  countries: string[];
}

type ProviderData = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export type ProvidersResult = {
  [country: string]: {
    flatrate?: ProviderData[];
  };
}

type Props = {
  providers: ProvidersResult;
}

export default function ProviderList({ providers }: Props) {
  const [providerList, setProviderList] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  const [isScrolledLeft, setIsScrolledLeft] = useState(true);
  const [isScrolledRight, setIsScrolledRight] = useState(false);

  const searchProviderId = useMemo(() => searchParams.get("providerId"), [searchParams]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const providersArray = transformProviders(providers);
    setProviderList(providersArray);

    if (providersArray.length > 0) {
      if (searchProviderId) {
        selectProvider(Number.parseInt(searchProviderId, 10), providersArray);
      } else {
        selectProvider(providersArray[0].provider_id, providersArray);
      }
    }
  }, [providers, searchProviderId]);

  useEffect(() => {
    const handleSearchChange = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handleSearchChange);
    return () => window.removeEventListener("popstate", handleSearchChange);
  }, []);

  function selectProvider(providerId: number, providerListParam?: Provider[]) {
    const list = providerListParam || providerList;
    const provider = list.find((p) => p.provider_id === providerId);

    if (provider) {
      setSelectedProvider(provider);

      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set("providerId", providerId.toString());
      window.history.pushState({}, "", `?${newSearchParams.toString()}`);
    }
  }

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setIsScrolledLeft(scrollLeft === 0);
    setIsScrolledRight(scrollLeft + clientWidth >= scrollWidth);
  };

  return (
    <div>
      <div class="relative max-w-[400px] mx-auto h-full">
        {!isScrolledLeft && (
          <div class="absolute  h-full left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-white/0 pointer-events-none transition-opacity duration-300" />
        )}

        <div
          ref={scrollRef}
          class="flex gap-x-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          onScroll={handleScroll}
        >
          {providerList.map((provider) => (
            <ProviderButton
              key={provider.provider_id}
              provider={provider}
              isSelected={selectedProvider?.provider_id === provider.provider_id}
              onSelect={selectProvider}
            />
          ))}
        </div>

        {!isScrolledRight && (
          <div class="absolute h-full right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-white/0 pointer-events-none transition-opacity duration-300" />
        )}
      </div>

      {selectedProvider && <CountryList countries={selectedProvider.countries} />}
    </div>
  );
}

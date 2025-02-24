/** @jsxImportSource preact */
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(en);

const getCountryName = (code: string) => {
  return countries.getName(code, 'en') || code;
};

interface CountryListProps {
  countries: string[];
}

export default function CountryList({ countries }: CountryListProps) {
  return (
    <div class="max-w-[400px] mx-auto mt-5">
      <ul class="flex flex-col divide-y-2 divide-[#0000000d]">
        {countries.map((country) => (
          <li key={country} class="flex items-center gap-2 p-2">
            <span class="text-xl">{getUnicodeFlagIcon(country)}</span>
            <span class="text-sm">{getCountryName(country)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

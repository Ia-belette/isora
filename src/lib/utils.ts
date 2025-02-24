import type { Provider, ProvidersResult } from "../components/Providers";


export const formatRuntime = (min: number) => {
    const hours = Math.floor(min / 60);
    const mins = min % 60;
    return `${hours}h ${mins}m`;
}

export const transformProviders = (providers: ProvidersResult): Provider[] => {
    const providersData: { [key: number]: Provider } = {};

    for (const [country, data] of Object.entries(providers)) {
        if (Array.isArray(data.flatrate)) {
            for (const provider of data.flatrate) {
                if (!providersData[provider.provider_id]) {
                    providersData[provider.provider_id] = {
                        provider_id: provider.provider_id,
                        provider_name: provider.provider_name,
                        logo_path: provider.logo_path,
                        countries: [country],
                    };
                } else {
                    providersData[provider.provider_id].countries.push(country);
                }
            }
        }
    }

    return Object.values(providersData);
};

export const getOfficialTrailer = (videos: any) => {
    if (!videos?.results) return null;
    const trailer = videos.results.find(
        (video: any) =>
            video.type === "Trailer" &&

            video.iso_639_1 === "en"
    );

    return trailer ? trailer.key : null;
};

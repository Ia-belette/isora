import type { APIRoute } from 'astro';
import { XataClient } from "../xata";

export const GET: APIRoute = async (context) => {
    const { env } = context.locals.runtime;

    const xata = new XataClient({
        apiKey: env.XATA_API_KEY,
        branch: env.XATA_BRANCH,
    });

    const today = new Date().toISOString().split('T')[0];

    const dailyRecommendation = await xata.db.daily_recommendations
        .filter("date", today)
        .select(["movie"])
        .getFirst();

    if (dailyRecommendation) {
        const movie = await xata.db.contents
            .filter("id", dailyRecommendation.movie)
            .getFirst();
        if (movie) {
            return new Response(JSON.stringify(movie));
        }
    }

    const paginatedMovies = await xata.db.contents
        .select(["tmdb_id", "title", "recommendation_count"])
        .sort("recommendation_count", "asc")
        .getPaginated({ pagination: { size: 1 } });

    const movie = paginatedMovies.records[0];
    if (!movie) {
        throw new Error("Aucun film trouvé");
    }

    await xata.db.contents.update(movie.id, {
        recommendation_count: movie.recommendation_count + 1,
    });

    await xata.db.daily_recommendations.create({
        date: today,
        movie: movie.id,
    });

    return new Response(JSON.stringify(movie));
};

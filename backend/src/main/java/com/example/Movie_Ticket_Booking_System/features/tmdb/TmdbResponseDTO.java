package com.example.Movie_Ticket_Booking_System.features.tmdb;

import java.util.List;

public class TmdbResponseDTO {

    public static class MovieListResponse {
        private List<MovieResult> results;
        public List<MovieResult> getResults() { return results; }
        public void setResults(List<MovieResult> results) { this.results = results; }
    }

    public static class MovieResult {
        private Integer id;
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
    }

    public static class MovieDetailResponse {
        private Integer id;
        private String title;
        private String overview;
        private String release_date;
        private Integer runtime;
        private String poster_path;
        private List<GenreItem> genres;
        private Credits credits;
        private Videos videos;
        
        // Getters and Setters
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getOverview() { return overview; }
        public void setOverview(String overview) { this.overview = overview; }
        public String getRelease_date() { return release_date; }
        public void setRelease_date(String release_date) { this.release_date = release_date; }
        public Integer getRuntime() { return runtime; }
        public void setRuntime(Integer runtime) { this.runtime = runtime; }
        public String getPoster_path() { return poster_path; }
        public void setPoster_path(String poster_path) { this.poster_path = poster_path; }
        public List<GenreItem> getGenres() { return genres; }
        public void setGenres(List<GenreItem> genres) { this.genres = genres; }
        public Credits getCredits() { return credits; }
        public void setCredits(Credits credits) { this.credits = credits; }
        public Videos getVideos() { return videos; }
        public void setVideos(Videos videos) { this.videos = videos; }
    }

    public static class GenreItem {
        private String name;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class Credits {
        private List<CastItem> cast;
        private List<CrewItem> crew;
        public List<CastItem> getCast() { return cast; }
        public void setCast(List<CastItem> cast) { this.cast = cast; }
        public List<CrewItem> getCrew() { return crew; }
        public void setCrew(List<CrewItem> crew) { this.crew = crew; }
    }

    public static class CastItem {
        private String name;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class CrewItem {
        private String name;
        private String job;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getJob() { return job; }
        public void setJob(String job) { this.job = job; }
    }

    public static class Videos {
        private List<VideoItem> results;
        public List<VideoItem> getResults() { return results; }
        public void setResults(List<VideoItem> results) { this.results = results; }
    }

    public static class VideoItem {
        private String key;
        private String site;
        private String type;
        public String getKey() { return key; }
        public void setKey(String key) { this.key = key; }
        public String getSite() { return site; }
        public void setSite(String site) { this.site = site; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }
}

package com.example.Movie_Ticket_Booking_System.features.tmdb;

import com.example.Movie_Ticket_Booking_System.features.castmember.CastMember;
import com.example.Movie_Ticket_Booking_System.features.castmember.CastMemberRepository;
import com.example.Movie_Ticket_Booking_System.features.director.Director;
import com.example.Movie_Ticket_Booking_System.features.director.DirectorRepository;
import com.example.Movie_Ticket_Booking_System.features.genre.Genre;
import com.example.Movie_Ticket_Booking_System.features.genre.GenreRepository;
import com.example.Movie_Ticket_Booking_System.features.movie.Movie;
import com.example.Movie_Ticket_Booking_System.features.movie.MovieCast;
import com.example.Movie_Ticket_Booking_System.features.movie.MovieGenre;
import com.example.Movie_Ticket_Booking_System.features.movie.MovieRepository;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.MovieStatus;
import com.example.Movie_Ticket_Booking_System.features.moviestatus.MovieStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class TmdbServiceImpl implements TmdbService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.api.url}")
    private String apiUrl;

    @Value("${tmdb.api.image.url}")
    private String imageUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final MovieRepository movieRepository;
    private final DirectorRepository directorRepository;
    private final CastMemberRepository castMemberRepository;
    private final GenreRepository genreRepository;
    private final MovieStatusRepository movieStatusRepository;

    @Autowired
    @Lazy
    private TmdbService self;

    public TmdbServiceImpl(MovieRepository movieRepository,
                           DirectorRepository directorRepository,
                           CastMemberRepository castMemberRepository,
                           GenreRepository genreRepository,
                           MovieStatusRepository movieStatusRepository) {
        this.movieRepository = movieRepository;
        this.directorRepository = directorRepository;
        this.castMemberRepository = castMemberRepository;
        this.genreRepository = genreRepository;
        this.movieStatusRepository = movieStatusRepository;
    }

    public void handleSyncNowPlayingMovies() {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("TMDB API Key is not configured.");
        }

        MovieStatus nowShowingStatus = movieStatusRepository.findByName("Đang Chiếu")
                .orElseGet(() -> {
                    MovieStatus status = new MovieStatus();
                    status.setName("Đang Chiếu");
                    return movieStatusRepository.save(status);
                });

        String url = UriComponentsBuilder.fromUriString(apiUrl + "/movie/now_playing")
                .queryParam("api_key", apiKey)
                .queryParam("language", "vi-VN")
                .queryParam("page", 1)
                .toUriString();

        TmdbResponseDTO.MovieListResponse listResponse = restTemplate.getForObject(url, TmdbResponseDTO.MovieListResponse.class);
        List<String> syncedTitles = new java.util.ArrayList<>();
        if (listResponse != null && listResponse.getResults() != null) {
            for (TmdbResponseDTO.MovieResult result : listResponse.getResults()) {
                try {
                    Movie m = self.handleSyncMovieDetails(result.getId(), nowShowingStatus);
                    if (m != null) syncedTitles.add(m.getTitle());
                } catch (Exception e) {
                    System.err.println("Lỗi đồng bộ phim " + result.getId() + ": " + e.getMessage());
                }
            }
        }

        // Reconciliation: demote missing movies to Ngừng Chiếu
        MovieStatus stoppedStatus = movieStatusRepository.findByName("Ngừng Chiếu")
                .orElseGet(() -> {
                    MovieStatus status = new MovieStatus();
                    status.setName("Ngừng Chiếu");
                    return movieStatusRepository.save(status);
                });

        List<Movie> activeMovies = movieRepository.findByMovieStatus_Name("Đang Chiếu");

        for (Movie m : activeMovies) {
            if (!syncedTitles.contains(m.getTitle())) {
                m.setMovieStatus(stoppedStatus);
                movieRepository.save(m);
                System.out.println("Đã chuyển phim [" + m.getTitle() + "] sang Ngừng Chiếu");
            }
        }
    }

    public void handleSyncUpcomingMovies() {
        MovieStatus comingSoonStatus = movieStatusRepository.findByName("Sắp Chiếu")
                .orElseGet(() -> {
                    MovieStatus status = new MovieStatus();
                    status.setName("Sắp Chiếu");
                    return movieStatusRepository.save(status);
                });

        String url = UriComponentsBuilder.fromUriString(apiUrl + "/movie/upcoming")
                .queryParam("api_key", apiKey)
                .queryParam("language", "vi-VN")
                .queryParam("page", 1)
                .toUriString();

        TmdbResponseDTO.MovieListResponse listResponse = restTemplate.getForObject(url, TmdbResponseDTO.MovieListResponse.class);
        List<String> syncedTitles = new java.util.ArrayList<>();
        if (listResponse != null && listResponse.getResults() != null) {
            for (TmdbResponseDTO.MovieResult result : listResponse.getResults()) {
                try {
                    Movie m = self.handleSyncMovieDetails(result.getId(), comingSoonStatus);
                    if (m != null) syncedTitles.add(m.getTitle());
                } catch (Exception e) {
                    System.err.println("Lỗi đồng bộ phim " + result.getId() + ": " + e.getMessage());
                }
            }
        }

        // Reconciliation: demote missing upcoming movies to Ngừng Chiếu
        MovieStatus stoppedStatus = movieStatusRepository.findByName("Ngừng Chiếu")
                .orElseGet(() -> {
                    MovieStatus status = new MovieStatus();
                    status.setName("Ngừng Chiếu");
                    return movieStatusRepository.save(status);
                });

        List<Movie> upcomingMovies = movieRepository.findByMovieStatus_Name("Sắp Chiếu");

        for (Movie m : upcomingMovies) {
            if (!syncedTitles.contains(m.getTitle())) {
                m.setMovieStatus(stoppedStatus);
                movieRepository.save(m);
                System.out.println("Đã chuyển phim [" + m.getTitle() + "] sang Ngừng Chiếu");
            }
        }
    }

    @Transactional
    public Movie handleSyncMovieDetails(Integer tmdbMovieId, MovieStatus targetStatus) {
        String detailUrl = UriComponentsBuilder.fromUriString(apiUrl + "/movie/" + tmdbMovieId)
                .queryParam("api_key", apiKey)
                .queryParam("language", "vi-VN")
                .queryParam("append_to_response", "credits,videos")
                .toUriString();

        try {
            TmdbResponseDTO.MovieDetailResponse detail = restTemplate.getForObject(detailUrl, TmdbResponseDTO.MovieDetailResponse.class);
            if (detail == null) return null;

            // Kiểm tra xem phim đã có trong DB chưa (dựa vào title)
            Optional<Movie> existingOpt = movieRepository.findByTitleContainingIgnoreCase(detail.getTitle(), org.springframework.data.domain.PageRequest.of(0, 1))
                    .get().findFirst();
            
            Movie movie = existingOpt.orElse(new Movie());

            movie.setTitle(detail.getTitle());
            movie.setDescription(detail.getOverview());
            if (detail.getRelease_date() != null && !detail.getRelease_date().isEmpty()) {
                movie.setReleaseDate(LocalDate.parse(detail.getRelease_date()));
            }
            movie.setDurationMinutes(detail.getRuntime() != null && detail.getRuntime() > 0 ? detail.getRuntime() : 120);
            movie.setLanguage("vi-VN");
            if (detail.getPoster_path() != null) {
                movie.setPosterUrl(imageUrl + detail.getPoster_path());
            }
            movie.setMovieStatus(targetStatus);

            // Tìm trailer
            if (detail.getVideos() != null && detail.getVideos().getResults() != null) {
                for (TmdbResponseDTO.VideoItem video : detail.getVideos().getResults()) {
                    if ("YouTube".equalsIgnoreCase(video.getSite()) && "Trailer".equalsIgnoreCase(video.getType())) {
                        movie.setTrailerUrl("https://www.youtube.com/watch?v=" + video.getKey());
                        break;
                    }
                }
            }

            // Sync Đạo diễn
            if (detail.getCredits() != null && detail.getCredits().getCrew() != null) {
                String directorName = "Unknown Director";
                for (TmdbResponseDTO.CrewItem crew : detail.getCredits().getCrew()) {
                    if ("Director".equalsIgnoreCase(crew.getJob())) {
                        directorName = crew.getName();
                        break;
                    }
                }
                final String finalDirectorName = directorName;
                Director director = directorRepository.findByName(finalDirectorName)
                        .orElseGet(() -> {
                            Director d = new Director();
                            d.setName(finalDirectorName);
                            return directorRepository.save(d);
                        });
                movie.setDirector(director);
            }

            // Clear first and flush to avoid unique constraint violations
            movie.getMovieGenres().clear();
            movie.getMovieCasts().clear();
            movie = movieRepository.saveAndFlush(movie);

            // Sync Thể loại
            if (detail.getGenres() != null) {
                for (TmdbResponseDTO.GenreItem gItem : detail.getGenres()) {
                    Genre genre = genreRepository.findByName(gItem.getName())
                            .orElseGet(() -> {
                                Genre g = new Genre();
                                g.setName(gItem.getName());
                                return genreRepository.save(g);
                            });
                    MovieGenre mg = new MovieGenre();
                    mg.setMovie(movie);
                    mg.setGenre(genre);
                    movie.getMovieGenres().add(mg);
                }
            }

            // Sync Diễn viên (Top 5)
            if (detail.getCredits() != null && detail.getCredits().getCast() != null) {
                int limit = Math.min(5, detail.getCredits().getCast().size());
                for (int i = 0; i < limit; i++) {
                    TmdbResponseDTO.CastItem cItem = detail.getCredits().getCast().get(i);
                    CastMember cast = castMemberRepository.findByName(cItem.getName())
                            .orElseGet(() -> {
                                CastMember c = new CastMember();
                                c.setName(cItem.getName());
                                return castMemberRepository.save(c);
                            });
                    MovieCast mc = new MovieCast();
                    mc.setMovie(movie);
                    mc.setCastMember(cast);
                    movie.getMovieCasts().add(mc);
                }
            }

            return movieRepository.save(movie);

        } catch (Exception e) {
            System.err.println("Failed to sync movie " + tmdbMovieId + ": " + e.getMessage());
            throw new RuntimeException(e); // Cần ném lỗi ra ngoài để @Transactional rollback riêng cho phim này
        }
    }
}

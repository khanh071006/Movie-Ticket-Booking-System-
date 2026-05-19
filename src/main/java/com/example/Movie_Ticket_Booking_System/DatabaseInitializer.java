package com.example.Movie_Ticket_Booking_System;

import com.example.Movie_Ticket_Booking_System.features.account.Account;
import com.example.Movie_Ticket_Booking_System.features.account.AccountRepository;
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
import com.example.Movie_Ticket_Booking_System.features.role.AccountRole;
import com.example.Movie_Ticket_Booking_System.features.role.AccountRoleRepository;
import com.example.Movie_Ticket_Booking_System.features.role.Role;
import com.example.Movie_Ticket_Booking_System.features.role.RoleRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final PasswordEncoder passwordEncoder;
    
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final DirectorRepository directorRepository;
    private final CastMemberRepository castMemberRepository;
    private final MovieStatusRepository movieStatusRepository;

    public DatabaseInitializer(AccountRepository accountRepository,
                               RoleRepository roleRepository,
                               AccountRoleRepository accountRoleRepository,
                               PasswordEncoder passwordEncoder,
                               MovieRepository movieRepository,
                               GenreRepository genreRepository,
                               DirectorRepository directorRepository,
                               CastMemberRepository castMemberRepository,
                               MovieStatusRepository movieStatusRepository) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
        this.accountRoleRepository = accountRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.directorRepository = directorRepository;
        this.castMemberRepository = castMemberRepository;
        this.movieStatusRepository = movieStatusRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Roles
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ADMIN");
                    return roleRepository.save(role);
                });

        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("USER");
                    return roleRepository.save(role);
                });

        // 2. Seed Admin Account
        String adminEmail = "admin@gmail.com";
        if (!accountRepository.existsByEmail(adminEmail)) {
            Account admin = new Account();
            admin.setEmail(adminEmail);
            admin.setFullName("ADMIN");
            admin.setPhone("0123456789");
            admin.setPasswordHash(passwordEncoder.encode("admin")); // password: admin
            Account savedAdmin = accountRepository.save(admin);

            AccountRole accountRole = new AccountRole();
            accountRole.setAccount(savedAdmin);
            accountRole.setRole(adminRole);
            accountRoleRepository.save(accountRole);

            System.out.println(">>> SEED DATA SUCCESS: Created Admin account (admin@gmail.com / admin)");
        }

        // 3. Seed Movies from JSON
        if (movieRepository.count() == 0) {
            System.out.println(">>> SEED MOVIES: Parsing movies.json...");
            try (InputStream is = getClass().getResourceAsStream("/movies.json")) {
                if (is == null) {
                    System.err.println(">>> SEED MOVIES FAILED: movies.json not found in classpath.");
                    return;
                }

                ObjectMapper mapper = new ObjectMapper();
                List<MovieJson> moviesList = mapper.readValue(is, new TypeReference<List<MovieJson>>() {});
                System.out.println(">>> SEED MOVIES: Found " + moviesList.size() + " movies to seed.");

                // Seed a default MovieStatus
                MovieStatus defaultStatus = movieStatusRepository.findByName("Đang chiếu")
                        .orElseGet(() -> {
                            MovieStatus ms = new MovieStatus();
                            ms.setName("Đang chiếu");
                            return movieStatusRepository.save(ms);
                        });

                int seededCount = 0;
                for (MovieJson mj : moviesList) {
                    if (mj.title == null || mj.title.trim().isEmpty()) {
                        continue;
                    }

                    Movie movie = new Movie();
                    movie.setTitle(mj.title);
                    movie.setDescription(mj.description);
                    movie.setDurationMinutes(mj.duration_minutes);
                    movie.setLanguage(mj.language != null ? mj.language : "Vietnamese");
                    
                    String posterUrl = mj.poster_url;
                    if (posterUrl != null && posterUrl.startsWith("http")) {
                        if (posterUrl.contains("tmdb.org")) {
                            posterUrl = "https://images.weserv.nl/?url=" + posterUrl;
                        }
                    } else {
                        posterUrl = getFallbackPoster(mj.title, mj.genres);
                    }
                    movie.setPosterUrl(posterUrl);
                    
                    movie.setTrailerUrl("https://www.youtube.com/embed/dQw4w9WgXcQ"); // Default placeholder trailer



                    
                    // Release Date
                    int year = mj.release_year > 0 ? mj.release_year : 2024;
                    movie.setReleaseDate(LocalDate.of(year, 1, 1));

                    // Movie Status
                    movie.setMovieStatus(defaultStatus);

                    // Director
                    if (mj.director != null && !mj.director.trim().isEmpty()) {
                        Director director = directorRepository.findByName(mj.director.trim())
                                .orElseGet(() -> {
                                    Director d = new Director();
                                    d.setName(mj.director.trim());
                                    return directorRepository.save(d);
                                });
                        movie.setDirector(director);
                    }

                    // Genres
                    if (mj.genres != null && !mj.genres.isEmpty()) {
                        Set<MovieGenre> movieGenres = new HashSet<>();
                        for (String genreName : mj.genres) {
                            if (genreName.trim().isEmpty()) continue;
                            Genre genre = genreRepository.findByName(genreName.trim())
                                    .orElseGet(() -> {
                                        Genre g = new Genre();
                                        g.setName(genreName.trim());
                                        return genreRepository.save(g);
                                    });
                            movieGenres.add(new MovieGenre(movie, genre));
                        }
                        movie.setMovieGenres(movieGenres);
                    }

                    // Cast Members
                    if (mj.main_cast != null && !mj.main_cast.isEmpty()) {
                        Set<MovieCast> movieCasts = new HashSet<>();
                        for (String castName : mj.main_cast) {
                            if (castName.trim().isEmpty()) continue;
                            CastMember castMember = castMemberRepository.findByName(castName.trim())
                                    .orElseGet(() -> {
                                        CastMember cm = new CastMember();
                                        cm.setName(castName.trim());
                                        return castMemberRepository.save(cm);
                                    });
                            movieCasts.add(new MovieCast(movie, castMember));
                        }
                        movie.setMovieCasts(movieCasts);
                    }

                    movieRepository.save(movie);
                    seededCount++;
                }

                System.out.println(">>> SEED DATA SUCCESS: Successfully seeded " + seededCount + " movies!");

            } catch (Exception e) {
                System.err.println(">>> SEED MOVIES FAILED with error:");
                e.printStackTrace();
            }
        }
    }

    private String getFallbackPoster(String title, List<String> genres) {
        if (title != null) {
            String t = title.toLowerCase();
            if (t.contains("kẻ đánh cắp giấc mơ") || t.contains("inception")) {
                return "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg";
            }
            if (t.contains("kỵ sĩ bóng đêm") || t.contains("dark knight")) {
                return "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg";
            }
            if (t.contains("hố đen tử thần") || t.contains("interstellar")) {
                return "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/gEU2QpI6eAKkypibcsXKL2sOixV.jpg";
            }
            if (t.contains("joker")) {
                return "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg";
            }
            if (t.contains("thế thân") || t.contains("avatar")) {
                return "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg";
            }
            if (t.contains("kỷ sinh trùng") || t.contains("ký sinh trùng") || t.contains("parasite")) {
                return "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg";
            }
        }

        if (genres != null && !genres.isEmpty()) {
            for (String g : genres) {
                String genre = g.toLowerCase().trim();
                if (genre.contains("sci-fi") || genre.contains("viễn tưởng") || genre.contains("adventure") || genre.contains("phiêu lưu")) {
                    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600";
                }
                if (genre.contains("horror") || genre.contains("kinh dị") || genre.contains("mystery") || genre.contains("bí ẩn")) {
                    return "https://images.unsplash.com/photo-1505635330303-4b848c078fe5?q=80&w=600";
                }
                if (genre.contains("action") || genre.contains("hành động") || genre.contains("thriller") || genre.contains("giật gân")) {
                    return "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600";
                }
                if (genre.contains("romance") || genre.contains("lãng mạn") || genre.contains("tình cảm")) {
                    return "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600";
                }
                if (genre.contains("comedy") || genre.contains("hài") || genre.contains("animation") || genre.contains("hoạt hình")) {
                    return "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600";
                }
                if (genre.contains("documentary") || genre.contains("tài liệu") || genre.contains("history") || genre.contains("lịch sử")) {
                    return "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600";
                }
            }
        }

        return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600";
    }

    public static class MovieJson {
        public String movie_id;
        public String title;
        public String original_title;
        public int release_year;
        public int duration_minutes;
        public String age_rating;
        public List<String> genres;
        public String director;
        public List<String> main_cast;
        public String country;
        public String language;
        public List<String> subtitle_languages;
        public String description;
        public String poster_url;
    }
}

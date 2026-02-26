import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context.jsx";
import { MOODS } from "../constants.js";

export default function Music() {
  const { mood, toast } = useApp();
  const m = MOODS[mood];
  const [currentSong, setCurrentSong] = useState(null);
  const [songQueue, setSongQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const audioRef = useRef(null);

  // Mood-based song keywords for better matching
  const getMoodKeywords = useCallback(() => {
    const moodMap = {
      calm: ["peaceful", "relaxing", "soft", "soothing", "gentle"],
      happy: ["upbeat", "cheerful", "energetic", "joyful", "celebration"],
      sad: ["emotional", "heart", "sad", "romantic", "soulful"],
      energetic: ["dance", "party", "fast", "energy", "upbeat"],
      romantic: ["love", "romantic", "heart", "emotional", "ishq"],
      focused: ["instrumental", "ambient", "peaceful", "concentration"],
    };
    return moodMap[mood] || ["trending", "popular"];
  }, [mood]);

  const fetchMoodMatchedSong = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const keywords = getMoodKeywords();
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      // Indian music search terms with mood matching
      const searchTerms = [
        `bollywood ${randomKeyword}`,
        `hindi ${randomKeyword} song`,
        `indian ${randomKeyword}`,
        `desi ${randomKeyword}`,
        `bollywood ${m.genre}`,
      ];
      
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(randomTerm)}&media=music&limit=30&entity=song&country=in`
      );
      
      if (!response.ok) throw new Error();
      const data = await response.json();
      const filtered = (data.results || []).filter(s => s.previewUrl);
      
      if (!filtered.length) throw new Error();
      
      // Randomly pick a song for variety
      const randomSong = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentSong(randomSong);
      
      // Queue up next songs
      const remainingSongs = filtered.filter(s => s.trackId !== randomSong.trackId);
      setSongQueue(remainingSongs.slice(0, 5));
      
    } catch {
      setError(true);
      toast("Could not load song", "◬");
    }
    setLoading(false);
  }, [mood, m.genre, getMoodKeywords]);

  useEffect(() => {
    fetchMoodMatchedSong();
  }, [mood]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, [currentSong]);

  const togglePlay = () => {
    if (!currentSong) return;
    const audio = audioRef.current;
    
    if (playing) {
      audio?.pause();
      setPlaying(false);
    } else {
      if (audio) {
        audio.src = currentSong.previewUrl;
        audio.play().catch(() => toast("Playback blocked", "◬"));
        setPlaying(true);
      }
    }
  };

  const nextSong = useCallback(async () => {
    if (songQueue.length > 0) {
      // Use next song from queue
      setCurrentSong(songQueue[0]);
      setSongQueue(prev => prev.slice(1));
      setPlaying(false);
      setProgress(0);
      
      // If queue is running low, fetch more songs in background
      if (songQueue.length < 3) {
        setLoadingNext(true);
        try {
          const keywords = getMoodKeywords();
          const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
          const searchTerm = `bollywood ${randomKeyword}`;
          
          const response = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=20&entity=song&country=in`
          );
          
          if (response.ok) {
            const data = await response.json();
            const filtered = (data.results || []).filter(s => s.previewUrl);
            setSongQueue(prev => [...prev, ...filtered.slice(0, 5)]);
          }
        } catch (err) {
          // Silent fail for background loading
        }
        setLoadingNext(false);
      }
    } else {
      // Queue is empty, fetch new song
      fetchMoodMatchedSong();
    }
  }, [songQueue, getMoodKeywords, fetchMoodMatchedSong]);

  const onSongEnd = () => {
    setPlaying(false);
    setProgress(0);
    // Auto-play next song
    setTimeout(() => nextSong(), 500);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      maxHeight: "100vh",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: 24,
        animation: "fadeIn 0.6s ease",
      }}>
        <div style={{
          fontSize: 32,
          marginBottom: 8,
          filter: `drop-shadow(0 0 20px ${m.glow})`,
        }}>
        </div>
        <h2 style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(20px, 5vw, 28px)",
          fontWeight: 400,
          color: "var(--text)",
          letterSpacing: "-1px",
          marginBottom: 4,
        }}>
          {m.label} Vibes 
          {/* {m.emoji} */}
        </h2>
        <p style={{
          color: m.color,
          fontSize: 11,
          fontFamily: "var(--sans)",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          Bollywood • Hindi • Desi
        </p>
      </div>

      <audio
        ref={audioRef}
        onEnded={onSongEnd}
      />

      {loading ? (
        <div style={{
          width: "100%",
          maxWidth: 380,
          textAlign: "center",
        }}>
          <div className="shimmer-box" style={{
            width: 200,
            height: 200,
            borderRadius: 20,
            margin: "0 auto 10px",
          }} />
          <div className="shimmer-box" style={{
            width: "80%",
            height: 10,
            borderRadius: 8,
            margin: "0 auto 10px",
          }} />
          <div className="shimmer-box" style={{
            width: "60%",
            height: 16,
            borderRadius: 8,
            margin: "0 auto",
          }} />
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>😔</div>
          <p style={{
            color: "var(--muted)",
            fontFamily: "var(--sans)",
            fontSize: 14,
            marginBottom: 10,
          }}>
            Could not find the perfect song
          </p>
          <button
            onClick={fetchMoodMatchedSong}
            style={{
              padding: "10px 28px",
              borderRadius: 20,
              border: `2px solid ${m.color}`,
              background: m.dark,
              color: m.color,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--sans)",
              boxShadow: `0 0 20px ${m.glow}`,
              transition: "all 0.3s",
            }}
          >
            Try Again
          </button>
        </div>
      ) : currentSong ? (
        <div style={{
          width: "100%",
          maxWidth: 380,
          animation: "scaleIn 0.5s ease",
        }}>
          {/* Album Art */}
          <div style={{
            position: "relative",
            width: 150,
            height: 150,
            margin: "0 auto 20px",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: `0 16px 48px ${m.glow}, 0 0 0 1px ${m.color}20`,
            animation: playing ? "pulse 2s ease-in-out infinite" : "none",
          }}>
            <img
              src={currentSong.artworkUrl100?.replace("100x100", "600x600")}
              alt={currentSong.trackName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: playing
                ? `radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.7))`
                : "rgba(0,0,0,0.3)",
              transition: "all 0.3s",
            }} />
          </div>

          {/* Song Info */}
          <div style={{
            textAlign: "center",
            marginBottom: 10,
            padding: "0 16px",
          }}>
            <h3 style={{
              color: "var(--text)",
              fontWeight: 700,
              fontSize: 16,
              fontFamily: "var(--sans)",
              marginBottom: 6,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {currentSong.trackName}
            </h3>
            <p style={{
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--sans)",
              marginBottom: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {currentSong.artistName}
            </p>
            <p style={{
              color: m.color,
              fontSize: 11,
              fontFamily: "var(--sans)",
              fontWeight: 600,
              marginTop: 6,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {/* {currentSong.collectionName} */}
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{
            padding: "0 16px",
            marginBottom: 5,
          }}>
            <div style={{
              height: 5,
              borderRadius: 3,
              background: "var(--surface2)",
              overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${m.color}, ${m.color}cc)`,
                borderRadius: 3,
                transition: "width 0.3s linear",
                boxShadow: `0 0 10px ${m.glow}`,
              }} />
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: 10,
              color: "var(--faint)",
              fontFamily: "var(--mono)",
            }}>
              <span>
                {audioRef.current?.currentTime
                  ? new Date(audioRef.current.currentTime * 1000).toISOString().substr(14, 5)
                  : "0:00"}
              </span>
              <span>0:30</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginBottom: 16,
          }}>
            <button
              onClick={fetchMoodMatchedSong}
              disabled={loading}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${m.color}40`,
                background: "var(--surface)",
                color: m.color,
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.background = m.dark;
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 0 20px ${m.glow}`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              🔀
            </button>

            <button
              onClick={togglePlay}
              disabled={loading}
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                border: "none",
                background: `linear-gradient(135deg, ${m.color}, ${m.color}dd)`,
                color: "#000",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 28px ${m.glow}`,
                transition: "all 0.3s",
                fontWeight: "bold",
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = `0 12px 36px ${m.glow}`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 8px 28px ${m.glow}`;
              }}
            >
              {playing ? "⏸" : "▶"}
            </button>

            <button
              onClick={nextSong}
              disabled={loading || loadingNext}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${m.color}40`,
                background: "var(--surface)",
                color: m.color,
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                opacity: loading || loadingNext ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                if (!loading && !loadingNext) {
                  e.currentTarget.style.background = m.dark;
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 0 20px ${m.glow}`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              ⏭
            </button>
          </div>

          {/* Queue Info */}
          {songQueue.length > 0 && (
            <div style={{
              textAlign: "center",
              padding: "12px",
              background: `${m.dark}40`,
              borderRadius: 12,
              border: `1px solid ${m.color}20`,
            }}>
              <p style={{
                color: "var(--faint)",
                fontSize: 10,
                fontFamily: "var(--sans)",
                letterSpacing: "0.05em",
              }}>
                {songQueue.length} MORE SONGS IN QUEUE
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
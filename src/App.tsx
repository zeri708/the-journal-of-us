import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Gift, Play, Pause, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

const chapters = [
  {
    title: "Masa Putih Abu-abu (2023)",
    narasi: "Masih ingat hari itu? Kita masih pakai seragam SMA pas kelas 12, niat awalnya ke Gramedia mau cari buku belajar buat SBMPTN. Tapi, ada satu hal yang paling aku ingat dari momen itu...",
    question: "Menurut kamu, apa yang bikin aku saat itu mikir, 'Wah, dia nih orangnya'?",
    choices: [
      { text: "Pas lihat kamu bingung milih buku tebal.", isCorrect: false, wrongMessage: "Bukan itu sayang, coba ingat-ingat lagi rasanya waktu itu..." },
      { text: "Rasanya nyaman dan tentram banget pas kita ngobrol.", isCorrect: true }
    ],
    successMessage: "Bener banget. Ngobrol sama kamu hari itu ngasih aku rasa nyaman yang belum pernah aku rasain sebelumnya.",
    photoUrls: [
      "https://i.imgur.com/8NZYSBO.jpeg",
      "https://i.imgur.com/iolftAh.jpeg",
      "https://i.imgur.com/69woQnA.jpeg"
    ]
  },
  {
    title: "Kenal Luar Dalam (2024)",
    narasi: "Makin lama jalan bareng, makin kebongkar deh aslinya. Dari hal konyol kayak kamu yang selalu tahu kalau aku angkat pantat sedikit artinya mau buang angin... sampai perdebatan kecil kita.",
    question: "Ngomong-ngomong soal perdebatan, siapa sih yang sebenarnya paling sering bertingkah, ngambek, atau marah?",
    choices: [
      { text: "Ya jelas aku dong!", isCorrect: false, wrongMessage: "Masa sih? Yakin bukan aku yang sering bertingkah?" },
      { text: "Sebenernya kamu sih yang sering bertingkah, tapi kamu gengsi ngaku aja.", isCorrect: true }
    ],
    successMessage: "Hahaha, iya deh aku ngaku. Makasih ya udah selalu sabar ngadepin aku dan segala kelakuan absurdku selama ini.",
    photoUrls: [
      "https://i.imgur.com/tdmKxE4.jpeg",
      "https://i.imgur.com/QhUJETl.jpeg",
      "https://i.imgur.com/HNP7JcO.jpeg"
    ]
  },
  {
    title: "Tempat Pulang (2025 - 2026)",
    narasi: "Tiga tahun berlalu. Banyak yang berubah, tapi kamu selalu jadi tempat favoritku.",
    question: "Dari semua hal yang kita lewati, kapan aku merasa paling bersyukur dan tersentuh olehmu?",
    choices: [
      { text: "Saat aku menerima kamu sebagai tempat istirahatmu dengan manja.", isCorrect: true },
      { text: "Saat kita jalan-jalan tanpa arah.", isCorrect: false, wrongMessage: "Jalan-jalan emang seru, tapi ada momen yang lebih bikin aku tersentuh." }
    ],
    successMessage: "Tepat sekali. Walaupun aku tahu kamu juga butuh dimanja, tapi melihat kamu nyaman bersandar dan manja ke aku... itu rasanya luar biasa.",
    photoUrls: [
      "https://i.imgur.com/GW3Feef.jpeg",
      "https://i.imgur.com/stRgbmd.jpeg",
      "https://i.imgur.com/8tt6A2f.jpeg"
    ]
  }
];

const pageVariants = {
  initial: { x: "50%", opacity: 0, rotateY: -20, transformPerspective: 1200 },
  animate: { x: 0, opacity: 1, rotateY: 0, transformPerspective: 1200, transition: { duration: 0.8, type: "spring", bounce: 0.1 } },
  exit: { x: "-50%", opacity: 0, rotateY: 20, transformPerspective: 1200, transition: { duration: 0.6 } }
};

function TypewriterText({ text, speed = 40, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedLength(0);
    const interval = setInterval(() => {
      setDisplayedLength(prev => {
        if (prev >= text.length) {
          clearInterval(interval);
          return text.length;
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    if (displayedLength >= text.length && text.length > 0) {
      onCompleteRef.current?.();
    }
  }, [displayedLength, text.length]);

  const completeTyping = () => {
    if (displayedLength < text.length) {
      setDisplayedLength(text.length);
    }
  };

  return (
    <span 
      onClick={completeTyping} 
      className="cursor-pointer"
      title="Klik untuk mempercepat"
    >
      {text.substring(0, displayedLength)}
      {displayedLength < text.length && <span className="animate-pulse text-gray-400">|</span>}
    </span>
  );
}

function PolaroidStack({ photos, successMessage, onComplete }: { photos: string[], successMessage: string, onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMessageDone, setIsMessageDone] = useState(false);

  const handleSwipe = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 2 }}
      className="mt-4 flex flex-col items-center pb-8"
    >
      <div className="relative w-full max-w-[240px] h-[320px] mb-4">
        <AnimatePresence>
          {photos.map((photo, index) => {
            if (index < currentIndex) return null;
            const isTop = index === currentIndex;
            return (
              <motion.div
                key={index}
                initial={false}
                animate={{ 
                  scale: isTop ? 1 : 0.95 - (index - currentIndex) * 0.05,
                  y: (index - currentIndex) * 10,
                  rotate: isTop ? 0 : (index % 2 === 0 ? 2 : -2),
                  zIndex: photos.length - index
                }}
                exit={{ x: 200, opacity: 0, rotate: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute inset-0 polaroid cursor-pointer ${isTop ? 'hover:scale-105 transition-transform' : ''}`}
                onClick={isTop ? handleSwipe : undefined}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 washi-tape-2 z-10"></div>
                <img src={photo} alt={`Memory ${index + 1}`} className="w-full h-48 object-cover bg-gray-200 pointer-events-none" />
                {isTop && index < photos.length - 1 && (
                  <p className="font-handwriting text-sm text-center mt-2 text-gray-400 animate-pulse">Klik foto untuk melihat selanjutnya</p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="font-handwriting text-2xl text-center text-gray-800 min-h-[80px]">
        <TypewriterText text={successMessage} speed={40} onComplete={() => setIsMessageDone(true)} />
      </div>
      
      <AnimatePresence>
        {isMessageDone && currentIndex === photos.length - 1 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="mt-4 hand-drawn-border px-6 py-2 bg-pink-100 hover:bg-pink-200 text-gray-800 font-handwriting text-2xl transition-all hover:scale-105"
          >
            Balik Halaman &rarr;
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Prologue({ onNext }: { onNext: () => void; key?: string }) {
  const [isTypingDone, setIsTypingDone] = useState(false);
  const text = "Halo, Sayang... (atau di hari spesial ini, aku boleh panggil Dudut?). Selamat datang di mesin waktu kita. Sebelum merayakan pergantian usiamu hari ini, mari kita buka kembali tiga babak cerita yang sudah kita lewati bersama.";

  return (
    <motion.div
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative"
    >
      <div className="absolute top-8 left-8 w-24 h-8 washi-tape z-10"></div>
      <div className="absolute bottom-8 right-8 w-24 h-8 washi-tape-2 z-10"></div>

      <h1 className="font-handwriting text-6xl md:text-7xl text-pink-600 mb-6 transform -rotate-2">
        Untuk Dudut
      </h1>
      
      <p className="font-typewriter text-gray-700 leading-relaxed mb-12 text-lg md:text-xl max-w-md min-h-[150px]">
        <TypewriterText text={text} speed={40} onComplete={() => setIsTypingDone(true)} />
      </p>

      <AnimatePresence>
        {isTypingDone && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            className="hand-drawn-border px-8 py-3 bg-pink-50 hover:bg-pink-100 text-gray-800 font-handwriting text-2xl transition-all hover:scale-105 hover:-rotate-2 flex items-center gap-2 shadow-sm"
          >
            Buka Mesin Waktu <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Chapter({ data, onNext, chapterNumber }: { data: any, onNext: () => void, chapterNumber: number, key?: string }) {
  const [isNarasiDone, setIsNarasiDone] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [wrongAlert, setWrongAlert] = useState("");
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  const handleChoice = (choice: any, idx: number) => {
    if (choice.isCorrect) {
      setAnsweredCorrectly(true);
    } else {
      setShakingIndex(idx);
      setWrongAlert(choice.wrongMessage || "Yakin? Coba ingat-ingat lagi deh kelakuan siapa...");
      setTimeout(() => setShakingIndex(null), 500);
      setTimeout(() => setWrongAlert(""), 3500);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="w-full h-full flex flex-col p-6 md:p-10 relative overflow-y-auto"
    >
      <div className="absolute top-4 right-8 w-20 h-6 washi-tape z-10"></div>
      
      <div className="mb-6">
        <span className="font-handwriting text-2xl text-pink-500">Chapter {chapterNumber}</span>
        <h2 className="font-handwriting text-4xl md:text-5xl text-gray-800 mt-1 transform -rotate-1">{data.title}</h2>
      </div>
      
      <div className="font-typewriter text-gray-700 mb-8 leading-relaxed text-lg min-h-[120px]">
        <TypewriterText text={data.narasi} speed={40} onComplete={() => setIsNarasiDone(true)} />
      </div>

      {!answeredCorrectly ? (
        <AnimatePresence>
          {isNarasiDone && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-4 mt-auto"
            >
              <p className="font-handwriting text-3xl text-gray-800 mb-4">{data.question}</p>
              <div className="grid gap-4">
                {data.choices.map((choice: any, idx: number) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleChoice(choice, idx)}
                    animate={shakingIndex === idx ? { x: [-5, 5, -5, 5, 0], rotate: [-1, 1, -1, 1, 0] } : { x: 0, rotate: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`hand-drawn-border w-full p-4 text-left font-typewriter text-sm md:text-base transition-all ${
                      shakingIndex === idx 
                        ? 'bg-red-50 border-red-400 text-red-800' 
                        : 'bg-white hover:bg-pink-50 border-gray-400 text-gray-700 hover:-translate-y-1 hover:shadow-md'
                    }`}
                  >
                    {choice.text}
                  </motion.button>
                ))}
              </div>
              
              <AnimatePresence>
                {wrongAlert && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 font-handwriting text-2xl mt-4 text-center"
                  >
                    {wrongAlert}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <PolaroidStack photos={data.photoUrls} successMessage={data.successMessage} onComplete={onNext} />
      )}
    </motion.div>
  );
}

function Epilogue({ key }: { key?: string }) {
  const [isP1Done, setIsP1Done] = useState(false);
  const [isP2Done, setIsP2Done] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const p1Text = "Selamat bertambah usia, Sayang. Di hari yang spesial ini, aku cuma mau ngucapin terima kasih karena kamu udah jadi versi terbaik dari dirimu sendiri. Semoga di lembaran umur yang baru ini, kamu selalu dikelilingi kebahagiaan, apa yang kamu semogakan bisa tercapai, dan makin sabar ngadepin aku yang kadang suka bertingkah. Kalau sehari-hari aku sibuk ngurusin kerjaan yang ga ada abisnya, hari ini, mesin waktu dan semua jepretan memori ini eksklusif 100% VIP cuma buat kamu.";
  const p2Text = "Sekalian merayakan perjalanan panjang kita... Happy 3rd Anniversary juga untuk kita! Terima kasih sudah menjadikan aku sebagai tempat istirahatmu yang nyaman, dan memilih untuk terus berjalan bersamaku.";

  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#fbcfe8', '#f9a8d4', '#f472b6']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#fbcfe8', '#f9a8d4', '#f472b6']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleClaim = () => {
    const message = encodeURIComponent("Halo Sayang! Aku mau klaim Voucher Spesial Anniversary & Ulang Tahun nih! 🥰");
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="w-full h-full flex flex-col items-center justify-center p-6 md:p-10 text-center relative overflow-y-auto"
    >
      <div className="absolute top-6 left-10 w-20 h-6 washi-tape z-10"></div>
      <div className="absolute bottom-10 right-10 w-20 h-6 washi-tape-2 z-10"></div>

      <h2 className="font-handwriting text-4xl md:text-5xl text-pink-600 mb-4 transform -rotate-2">
        🎂 Selamat Ulang Tahun, Dudut! 🎂
      </h2>

      <div className="mb-6 flex flex-col items-center">
        <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop />
        <button 
          onClick={toggleAudio}
          className="hand-drawn-border flex items-center gap-2 px-4 py-2 bg-white hover:bg-pink-50 text-pink-600 transition-all shadow-sm"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span className="font-handwriting text-xl">Pesan Suara Spesial</span>
          <Music className="w-4 h-4 ml-1 opacity-50" />
        </button>
      </div>
      
      <div className="font-typewriter text-gray-700 leading-relaxed mb-8 text-sm md:text-base max-w-lg text-left space-y-4">
        <p className="min-h-[140px]">
          <TypewriterText text={p1Text} speed={40} onComplete={() => setIsP1Done(true)} />
        </p>
        {isP1Done && (
          <p className="min-h-[80px]">
            <TypewriterText text={p2Text} speed={40} onComplete={() => setIsP2Done(true)} />
          </p>
        )}
      </div>

      <AnimatePresence>
        {isP2Done && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-2 transform rotate-2 hover:rotate-0 transition-transform"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 washi-tape z-10"></div>
            <div className="hand-drawn-border bg-[#fffdf0] p-6 max-w-sm mx-auto border-dashed border-2 border-gray-400 shadow-md">
              <p className="font-typewriter text-sm text-gray-800 mb-6 font-bold leading-relaxed">
                🎟️ VOUCHER SPESIAL 18 MARET: Bebas Minta Apapun Selama 1 Hari! (S&K: Selama masih dalam kapasitas dan kemampuanku ya, hehe).
              </p>
              <button
                onClick={handleClaim}
                className="hand-drawn-border w-full py-3 bg-pink-100 hover:bg-pink-200 text-gray-800 font-handwriting text-2xl transition-colors shadow-sm"
              >
                Klaim ke WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);

  const nextScreen = () => {
    if (currentScreen <= chapters.length) {
      setCurrentScreen(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* The Book Container */}
      <div className="relative w-full max-w-2xl h-[85vh] md:h-[750px] paper-bg rounded-r-2xl rounded-l-md overflow-hidden">
        {/* Book binding spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-300 via-gray-100 to-transparent z-50 pointer-events-none opacity-40 border-r border-gray-300/30"></div>
        
        <AnimatePresence mode="wait">
          {currentScreen === 0 && <Prologue key="prologue" onNext={nextScreen} />}
          {currentScreen > 0 && currentScreen <= chapters.length && (
            <Chapter 
              key={`chapter-${currentScreen}`} 
              data={chapters[currentScreen - 1]} 
              chapterNumber={currentScreen}
              onNext={nextScreen} 
            />
          )}
          {currentScreen > chapters.length && <Epilogue key="epilogue" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

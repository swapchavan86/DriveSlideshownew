import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, EffectCube, EffectFlip, EffectCreative, Autoplay } from 'swiper/modules';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-creative';

export interface ImageFile {
    id: string;
    name: string;
}

export type SlideshowEffect = 'slide' | 'fade' | 'cube' | 'flip' | 'creative';

interface SlideshowPlayerProps {
    accountId: string;
    images: ImageFile[];
    effect: SlideshowEffect;
    musicEnabled: boolean;
    apiBaseUrl: string;
}

const SlideshowPlayer = ({ accountId, images, effect, musicEnabled, apiBaseUrl }: SlideshowPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (musicEnabled) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [musicEnabled]);


    if (!images || images.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-muted">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    // Shuffle the images array for a different order each time
    const shuffledImages = [...images].sort(() => Math.random() - 0.5);

    return (
        <div className="relative h-full w-full bg-black">
            <Swiper
                modules={[Navigation, Pagination, EffectFade, EffectCube, EffectFlip, EffectCreative, Autoplay]}
                effect={effect}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                creativeEffect={ effect === 'creative' ? {
                    prev: {
                      shadow: true,
                      translate: [0, 0, -400],
                    },
                    next: {
                      translate: ['100%', 0, 0],
                    },
                } : {}}
                cubeEffect={ effect === 'cube' ? {
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                } : {}}
                className="h-full w-full"
            >
                {shuffledImages.map(image => (
                    <SwiperSlide key={image.id} className="flex items-center justify-center">
                        <img
                           src={`${apiBaseUrl}/drive/image/${image.id}?accountId=${accountId}`}
                           alt={image.name}
                           className="block max-h-full max-w-full object-contain"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <audio ref={audioRef} src="/soothing-music.mp3" loop />
        </div>
    );
};

export default SlideshowPlayer;

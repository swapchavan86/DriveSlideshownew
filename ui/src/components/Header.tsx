import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { Moon, Sun, Music, VolumeX, HelpCircle, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlideshowEffect } from "./SlideshowPlayer";
import HowToUseDialog from "./HowToUseDialog";

interface HeaderProps {
    apiBaseUrl: string;
    musicEnabled: boolean;
    onMusicToggle: () => void;
    effect: SlideshowEffect;
    onEffectChange: (effect: SlideshowEffect) => void;
    showSlideshowControls: boolean;
    onExitSlideshow: () => void;
}

const Header = ({
    musicEnabled,
    onMusicToggle,
    effect,
    onEffectChange,
    showSlideshowControls,
    onExitSlideshow
}: HeaderProps) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-8 shrink-0">
            <div className="text-2xl font-bold tracking-tighter">
                Drive <span className="text-primary">Slideshow</span>
            </div>
            <div className="flex items-center gap-2">
                {showSlideshowControls && (
                    <>
                         <Select value={effect} onValueChange={(value: SlideshowEffect) => onEffectChange(value)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Effect" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="slide">Slide</SelectItem>
                                <SelectItem value="fade">Fade</SelectItem>
                                <SelectItem value="cube">Cube</SelectItem>
                                <SelectItem value="flip">Flip</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" size="icon" onClick={onMusicToggle}>
                            {musicEnabled ? <Music className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                        </Button>
                        <Button variant="destructive" size="icon" onClick={onExitSlideshow}>
                             <X className="h-5 w-5" />
                        </Button>
                    </>
                )}
                
                <HowToUseDialog>
                    <Button variant="ghost" size="icon">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                </HowToUseDialog>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    );
};

export default Header;
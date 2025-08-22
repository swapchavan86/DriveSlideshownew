import { useState, useEffect } from 'react';
import { ThemeProvider } from "@/lib/theme";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Welcome from "@/components/Welcome";
import DriveExplorer, { Folder } from "@/components/DriveExplorer";
import SlideshowPlayer, { ImageFile, SlideshowEffect } from "@/components/SlideshowPlayer";
import { Account } from './components/Sidebar';
import { AlertCircle } from 'lucide-react';

const App = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
    const [selectedFolders, setSelectedFolders] = useState<Folder[]>([]);
    const [images, setImages] = useState<ImageFile[]>([]);
    const [appState, setAppState] = useState<'welcome' | 'explorer' | 'slideshow'>('welcome');

    // Slideshow settings
    const [effect, setEffect] = useState<SlideshowEffect>('slide');
    const [musicEnabled, setMusicEnabled] = useState(true);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Critical configuration check. If the .env file is missing, show an error.
    if (!apiBaseUrl) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-destructive p-8 text-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="h-12 w-12" />
                    <h1 className="text-2xl font-bold">Configuration Error</h1>
                    <p className="max-w-md">
                        The <code className="bg-destructive/20 p-1 rounded-sm">VITE_API_BASE_URL</code> environment variable is not set. Please create a <code className="bg-destructive/20 p-1 rounded-sm">.env</code> file in the <code className="bg-destructive/20 p-1 rounded-sm">ui</code> directory and set this variable to your API's URL.
                    </p>
                    <p className="text-sm">Refer to the <code className="bg-destructive/20 p-1 rounded-sm">ui/.env.example</code> file for an example.</p>
                </div>
            </div>
        );
    }

    const fetchAccounts = async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/auth/accounts`, {credentials: 'include'});
            const data: Account[] = await res.json();
            setAccounts(data);
            if (data.length > 0) {
                setAppState('explorer');
                if (!activeAccountId) {
                    setActiveAccountId(data[0].id);
                }
            } else {
                setAppState('welcome');
                setActiveAccountId(null);
            }
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
            setAppState('welcome');
        }
    };
    
    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleStartSlideshow = (imgs: ImageFile[], selFolders: Folder[]) => {
        setImages(imgs);
        setSelectedFolders(selFolders);
        setAppState('slideshow');
    };

    const handleExitSlideshow = () => {
        setImages([]);
        setAppState('explorer');
    };
    
    const handleAccountSwitched = (accountId: string) => {
        setActiveAccountId(accountId);
        setSelectedFolders([]);
        setImages([]);
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex h-screen w-full bg-background text-foreground font-sans antialiased">
                <Sidebar
                    accounts={accounts}
                    activeAccountId={activeAccountId}
                    onAccountSwitched={handleAccountSwitched}
                    onAccountsChanged={fetchAccounts}
                    isVisible={appState !== 'welcome'}
                />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Header
                        apiBaseUrl={apiBaseUrl}
                        musicEnabled={musicEnabled}
                        onMusicToggle={() => setMusicEnabled(!musicEnabled)}
                        effect={effect}
                        onEffectChange={setEffect}
                        showSlideshowControls={appState === 'slideshow'}
                        onExitSlideshow={handleExitSlideshow}
                    />
                    <main className="flex-1 overflow-y-auto p-4 md:p-8">
                        {appState === 'welcome' && <Welcome apiBaseUrl={apiBaseUrl}/>}
                        {appState === 'explorer' && activeAccountId && (
                            <DriveExplorer
                                accountId={activeAccountId}
                                onStartSlideshow={handleStartSlideshow}
                                apiBaseUrl={apiBaseUrl}
                            />
                        )}
                        {appState === 'slideshow' && activeAccountId && (
                            <SlideshowPlayer
                                accountId={activeAccountId}
                                images={images}
                                effect={effect}
                                musicEnabled={musicEnabled}
                                apiBaseUrl={apiBaseUrl}
                            />
                        )}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;

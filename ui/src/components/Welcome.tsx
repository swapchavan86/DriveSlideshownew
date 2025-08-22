import { Button } from '@/components/ui/button';
import { GoogleIcon } from './Icons';

interface WelcomeProps {
    apiBaseUrl: string;
}

const Welcome = ({apiBaseUrl}: WelcomeProps) => {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="max-w-md space-y-4">
                 <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl">
                    Welcome to Drive Slideshow
                </h1>
                <p className="text-lg text-muted-foreground">
                    Turn your Google Drive photos into beautiful, animated slideshows with music. 
                    Connect your account to get started.
                </p>
                <a href={`${apiBaseUrl}/auth/google`}>
                    <Button size="lg" className="text-lg">
                        <GoogleIcon className="mr-2 h-6 w-6" />
                        Connect Google Drive
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default Welcome;

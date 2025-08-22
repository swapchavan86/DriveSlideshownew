import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Play, FolderIcon as FolderIconLucide } from 'lucide-react';
import { ImageFile } from './SlideshowPlayer';

export interface Folder {
    id: string;
    name: string;
    iconLink: string;
}

interface DriveExplorerProps {
    accountId: string;
    apiBaseUrl: string;
    onStartSlideshow: (images: ImageFile[], selectedFolders: Folder[]) => void;
}

const DriveExplorer = ({ accountId, onStartSlideshow, apiBaseUrl }: DriveExplorerProps) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolderIds, setSelectedFolderIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        const fetchFolders = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${apiBaseUrl}/drive/folders?accountId=${accountId}`, {credentials: 'include'});
                if (!res.ok) {
                    throw new Error(`Failed to fetch folders: ${res.statusText}`);
                }
                const data: Folder[] = await res.json();
                setFolders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        if (accountId) {
            fetchFolders();
            setSelectedFolderIds(new Set()); // Reset selection on account change
        }
    }, [accountId, apiBaseUrl]);

    const handleSelectFolder = (folderId: string) => {
        setSelectedFolderIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    const handleStartClick = async () => {
        if (selectedFolderIds.size === 0) return;
        setIsStarting(true);
        setError(null);
        try {
            const folderIdsQuery = Array.from(selectedFolderIds).join(',');
            const res = await fetch(`${apiBaseUrl}/drive/images?accountId=${accountId}&folderIds=${folderIdsQuery}`, {credentials: 'include'});
            if (!res.ok) throw new Error('Failed to fetch images.');
            
            const images = await res.json();
            if (images.length === 0) {
                 setError("No images found in the selected folder(s). Please select different folders.");
                 setIsStarting(false);
                 return;
            }
            const selectedFolders = folders.filter(f => selectedFolderIds.has(f.id));
            onStartSlideshow(images, selectedFolders);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-primary">Select Folders</h1>
                <Button onClick={handleStartClick} disabled={selectedFolderIds.size === 0 || isStarting}>
                    {isStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                    Start Slideshow ({selectedFolderIds.size})
                </Button>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive-foreground p-4 rounded-md mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-3" />
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : folders.length === 0 ? (
                 <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    No folders found in this Google Drive account.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {folders.map(folder => (
                        <Label key={folder.id} htmlFor={folder.id} className="cursor-pointer">
                            <Card className={`transition-all hover:shadow-lg hover:border-primary ${selectedFolderIds.has(folder.id) ? 'border-primary border-2' : ''}`}>
                                <CardHeader className="p-4 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium leading-none break-all">
                                        {folder.name}
                                    </CardTitle>
                                    <Checkbox
                                        id={folder.id}
                                        checked={selectedFolderIds.has(folder.id)}
                                        onCheckedChange={() => handleSelectFolder(folder.id)}
                                    />
                                </CardHeader>
                                <CardContent className="p-4 pt-0 flex items-center justify-center">
                                    <FolderIconLucide className="h-16 w-16 text-primary/50" />
                                </CardContent>
                            </Card>
                        </Label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DriveExplorer;

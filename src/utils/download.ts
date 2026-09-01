import { isBrowser } from './environment';

export const downloadFile = (url: string, filename?: string) => {
    if (!isBrowser) return;

    const link = document.createElement('a');
    link.href = url;
    if (filename) {
        link.setAttribute('download', filename);
    }
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

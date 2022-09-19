import QuickLRU from 'quick-lru';

export const cache = new QuickLRU<string, string>({maxSize: 10000});

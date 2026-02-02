import React, { createContext, useContext, type ReactNode } from 'react';
import homeContent from '../content/home.json';
import aboutContent from '../content/about.json';
import commonContent from '../content/common.json';

type HomeContent = typeof homeContent;
type AboutContent = typeof aboutContent;
type CommonContent = typeof commonContent;

interface Content {
    home: HomeContent;
    about: AboutContent;
    common: CommonContent;
}

const content: Content = {
    home: homeContent,
    about: aboutContent,
    common: commonContent,
};

interface ContentContextType {
    content: Content;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ContentContext.Provider value={{ content }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};

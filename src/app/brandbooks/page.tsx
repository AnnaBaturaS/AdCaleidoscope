'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus,
  Book,
  Palette,
  Target,
  Smartphone,
  Edit3,
  Trash2,
  Eye,
  Star,
  Calendar,
  Tag,
  Upload,
  X,
  Image,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface BrandBook {
  id: string;
  appName: string;
  logo?: string; // Base64 encoded image or URL
  genre: string[];
  platform: string[];
  appStore?: {
    description: string;
    url: string;
    appId: string;
    bundleId: string;
    category: string;
    pricing: string;
    releaseDate: string;
    screenshot?: string; // Base64 encoded screenshot
  };
  googlePlay?: {
    description: string;
    url: string;
    packageName: string;
    category: string;
    pricing: string;
    releaseDate: string;
    targetSdk: string;
    screenshot?: string; // Base64 encoded screenshot
  };
  screenshots?: string[]; // Array of screenshot URLs
  targetAudience: {
    ageRange: string;
    demographics: string[];
    interests: string[];
  };
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  monetizationModel: string[];
  targetMarkets: string[];
  visualStyle: string;
  tone: string;
  keywords: string[];
  competitors: string[];
  createdAt: string;
  updatedAt: string;
  starred: boolean;
}

export default function BrandbooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedBrandbook, setSelectedBrandbook] = useState<BrandBook | null>(null);
  const [previewTab, setPreviewTab] = useState('appstore');
  
  const [formData, setFormData] = useState({
    appName: '',
    logo: '' as string,
    genre: [] as string[],
    platform: [] as string[],
    appStore: {
      description: '',
      url: '',
      appId: '',
      bundleId: '',
      category: '',
      pricing: '',
      releaseDate: '',
      screenshot: ''
    },
    googlePlay: {
      description: '',
      url: '',
      packageName: '',
      category: '',
      pricing: '',
      releaseDate: '',
      targetSdk: '',
      screenshot: ''
    },
    targetAudience: {
      ageRange: '',
      demographics: [] as string[],
      interests: [] as string[]
    },
    brandColors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#f59e0b'
    },
    visualStyle: '',
    tone: '',
    keywords: [] as string[],
    competitors: [] as string[]
  });
  
  // Extended mock data with more companies and detailed brand information
  const [brandbooks, setBrandbooks] = useState<BrandBook[]>([
    {
      id: '8',
      appName: 'Solitaire - Classic Card Games',
      logo: 'https://play-lh.googleusercontent.com/uMfsu3LiCkhB1qm-1mvumNQoKAvg9YTxM8HtMwFTwZYvWmZY7Cjuf61D0Ip_OMfTeA=w480-h960-rw',
      genre: ['Card', 'Solitaire', 'Casual', 'Single player'],
      platform: ['iOS', 'Android'],
      appStore: {
        description: 'The Most Relaxing & Addictive FREE Classic Solitaire Card Games, original Solitaire or Patience, is just for you! Enjoy the best free and popular original Solitaire card games in the world for free at any time and place!',
        url: 'https://apps.apple.com/us/app/solitaire-classic-card-games/id479280326',
        appId: '479280326',
        bundleId: 'com.guru.solitaire',
        category: 'Games',
        pricing: 'Free',
        releaseDate: '2012-03-15'
      },
      googlePlay: {
        description: 'The Most Relaxing & Addictive FREE Classic Solitaire Card Games, original Solitaire or Patience, is just for you! Enjoy the best free and popular original Solitaire card games in the world for free at any time and place! It\'s time to train your brain, challenge yourself and be a Solitaire or Patience master, try this original, classic and free Patience Solitaire card game!',
        url: 'https://play.google.com/store/apps/details?id=solitaire.patience.card.games.klondike.free&hl=en&gl=US',
        packageName: 'solitaire.patience.card.games.klondike.free',
        category: 'Card',
        pricing: 'Free',
        releaseDate: '2012-03-15',
        targetSdk: '34'
      },
      screenshots: [
        'https://play-lh.googleusercontent.com/pse40J5ruLWCl9UfcvJLKdVlvP6Nl3pOzmjqWI2_WRtvgsIid3AVWbGtm3HD-ugRErg=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/Lp807Qji2hbDqKlFC2Pw6Tk9kDPDvLYc0_300BYtHwFkc7IXd72fs5afeRn_5YTnhDk=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/iWmhFMcVSIVzxh0vvRiM2LYdfSDTkqj2MqO2o-4lIN7_NvfHXGtVnBwxUZ941xT0ymI=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/ArTExF6G5n0_GZPk_2T2_Sr0aKh16SlH--UL1aObj88vlqag1uNp4MWS8XLn4vm0ZXY=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/ppYIX3omEId7j1oAk5j2ReGz2KcZc-mrvgYaeOgQLJxty7XZIoCHFDVmWxLsWI7_XKU=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/w61dAZ30YXZpPSKCEt0LTzXzzwRT5gu95DWi0ALcx6dvplKpVzVHU0NzYfYDrt1iuvLo=w1052-h592-rw'
      ],
      targetAudience: {
        ageRange: 'Everyone',
        demographics: ['Card game enthusiasts', 'Casual gamers', 'Brain training seekers', 'Relaxation seekers'],
        interests: ['Card games', 'Puzzles', 'Relaxation', 'Brain training', 'Classic games']
      },
      brandColors: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        accent: '#FFC107',
        background: '#E8F5E8',
        text: '#1B5E20'
      },
      monetizationModel: ['In-app purchases', 'Ads'],
      targetMarkets: ['Global', 'All regions', 'Family-friendly'],
      visualStyle: 'Classic card game aesthetics with green felt background, traditional card designs, clean and minimalist interface focusing on gameplay',
      tone: 'Relaxing, classic, traditional, peaceful',
      keywords: ['solitaire', 'patience', 'card', 'classic', 'relaxing', 'brain', 'puzzle', 'offline'],
      competitors: ['Microsoft Solitaire Collection', 'FreeCell Solitaire', 'Spider Solitaire', 'Klondike Solitaire'],
      createdAt: '2012-03-15',
      updatedAt: '2024-01-26',
      starred: false
    },
    {
      id: '7',
      appName: 'Business Empire: RichMan',
      logo: 'https://play-lh.googleusercontent.com/5p5R79o9wVz4HS1duEDvN-H0T6Os023GAeussNks_2oBVfsp7JzNfz7otpYXyXx7DVJrUVLR8KRtEYz5OseyMw=s96-rw',
      genre: ['Simulation', 'Management', 'Tycoon', 'Casual'],
      platform: ['Android'],
      googlePlay: {
        description: 'Business Empire: RichMan is more than just a passive business game simulation where players make investments and watch their earnings grow. It\'s an interactive online or offline business game simulator that allows players to make strategic business decisions and take calculated risks to build their business empire.',
        url: 'https://play.google.com/store/apps/details?id=com.ttterbagames.businesssimulator&hl=en&gl=US',
        packageName: 'com.ttterbagames.businesssimulator',
        category: 'Simulation',
        pricing: 'Free',
        releaseDate: '2020-06-15',
        targetSdk: '33'
      },
      screenshots: [
        'https://play-lh.googleusercontent.com/878PgALT8oINM6FNSpL0YRd4haByo_OiSqdBSTcmjgYZGu-ze1OcS_Z_FImDocSQSw=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/BPvlJE167Egq-JDjLrwDG_YbkQGonZkLld8U0nPvKcmbpOv1eZZhsOIvy-iIT3dJDuM=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/OLDNhw7HeGE_OiQwubRPY0pk020GxEz1EsC3-_EDkVtW3UmdCIkTXUzNnEoFOO7G5DM=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/tXz0EnJx1Z8xXvp63yoGCGu9xrQkpIANK-40i6D5Z3V4Il3Ygi3WcE6YrfCvmpyFZw=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/u1Wmduwt8dZn3sAbdCn_oNeFvT-wOYN2fSRnD3Vuw6yOy4wonFP5c-TsJLnNbIBtIB0=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/tqOGxu0K9kgsJuddkxSwOfSGowL8b_bFR1AS-1DgMCLbeN2HjIK_qz1_7HN6E3msrZs=w1052-h592-rw',
        'https://play-lh.googleusercontent.com/hELuLygHGHT72lJjkXTB3hwb4ooStuoxyzeqZFXgz0fXjITlPoNWvN4V-fSCISf5Zqc=w1052-h592-rw'
      ],
      targetAudience: {
        ageRange: '13+',
        demographics: ['Business enthusiasts', 'Strategy gamers', 'Entrepreneurs', 'Casual players'],
        interests: ['Business strategy', 'Economics', 'Investment', 'Management games', 'Empire building']
      },
      brandColors: {
        primary: '#3CA5E6',
        secondary: '#388E3C',
        accent: '#FAB58D',
        background: '#F5F5F5',
        text: '#212121'
      },
      monetizationModel: ['In-app purchases', 'Ads', 'Premium upgrades'],
      targetMarkets: ['United States', 'Europe', 'Asia-Pacific', 'Global'],
      visualStyle: 'Rich business aesthetics with gold and green colors, luxury imagery, corporate design elements, money and success symbols',
      tone: 'Ambitious, success-driven, professional, motivational',
      keywords: ['business', 'empire', 'rich', 'money', 'investment', 'strategy', 'tycoon'],
      competitors: ['RollerCoaster Tycoon', 'SimCity', 'AdVenture Capitalist', 'Idle Miner Tycoon'],
      createdAt: '2020-06-15',
      updatedAt: '2024-01-25',
      starred: false
    },
    {
      id: '1',
      appName: 'Instagram',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y1OEY4RiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGMkNDNkMiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
      genre: ['Social', 'Photography', 'Entertainment'],
      platform: ['iOS', 'Android', 'Web'],
      appStore: {
        description: 'Bring your life to life with Instagram. Share photos and videos, connect with friends, and explore what\'s happening around the world.',
        url: 'https://apps.apple.com/app/instagram/id389801252',
        appId: '389801252',
        bundleId: 'com.burbn.instagram',
        category: 'Social Networking',
        pricing: 'Free',
        releaseDate: '2010-10-06'
      },
      googlePlay: {
        description: 'Connect with friends, share what you\'re up to, or see what\'s new from others all over the world. Explore our community where you can feel free to be yourself.',
        url: 'https://play.google.com/store/apps/details?id=com.instagram.android',
        packageName: 'com.instagram.android',
        category: 'Social',
        pricing: 'Free',
        releaseDate: '2012-04-03',
        targetSdk: '34'
      },
      targetAudience: {
        ageRange: '13-45',
        demographics: ['Content creators', 'Social media users', 'Artists', 'Influencers'],
        interests: ['Photography', 'Art', 'Fashion', 'Travel', 'Food', 'Lifestyle']
      },
      brandColors: {
        primary: '#E4405F',
        secondary: '#F56040',
        accent: '#FCCC63',
        background: '#FAFAFA',
        text: '#262626'
      },
      monetizationModel: ['Ads', 'Creator monetization', 'Shopping'],
      targetMarkets: ['Global', 'North America', 'Europe', 'Latin America'],
      visualStyle: 'Vibrant gradient backgrounds, clean typography, focus on visual content, modern and youthful aesthetic',
      tone: 'Creative, expressive, inclusive, inspiring',
      keywords: ['share', 'connect', 'express', 'discover', 'creative', 'community'],
      competitors: ['TikTok', 'Snapchat', 'Twitter', 'Pinterest'],
      createdAt: '2010-10-06',
      updatedAt: '2024-01-20',
      starred: true
    },
    {
      id: '2',
      appName: 'Spotify',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMxREI5NTQiLz4KPC9zdmc+',
      genre: ['Music', 'Entertainment', 'Audio'],
      platform: ['iOS', 'Android', 'Web', 'Desktop'],
      appStore: {
        description: 'Spotify is a digital music service that gives you access to millions of songs, podcasts and videos from artists all over the world.',
        url: 'https://apps.apple.com/app/spotify-music-and-podcasts/id324684580',
        appId: '324684580',
        bundleId: 'com.spotify.client',
        category: 'Music',
        pricing: 'Freemium',
        releaseDate: '2009-07-14'
      },
      googlePlay: {
        description: 'Spotify gives you instant access to millions of songs – from old favorites to the latest hits. Just hit play to stream anything you like.',
        url: 'https://play.google.com/store/apps/details?id=com.spotify.music',
        packageName: 'com.spotify.music',
        category: 'Music & Audio',
        pricing: 'Freemium',
        releaseDate: '2011-05-17',
        targetSdk: '33'
      },
      targetAudience: {
        ageRange: '16-55',
        demographics: ['Music lovers', 'Podcast listeners', 'Students', 'Commuters'],
        interests: ['Music', 'Podcasts', 'Entertainment', 'Discovery']
      },
      brandColors: {
        primary: '#1DB954',
        secondary: '#191414',
        accent: '#FFFFFF',
        background: '#121212',
        text: '#FFFFFF'
      },
      monetizationModel: ['Premium subscriptions', 'Ads', 'Family plans'],
      targetMarkets: ['Global', 'North America', 'Europe', 'Latin America'],
      visualStyle: 'Dark theme with bright green accents, bold typography, album art focused, modern and sleek',
      tone: 'Passionate, energetic, accessible, music-focused',
      keywords: ['music', 'discovery', 'streaming', 'playlist', 'audio', 'entertainment'],
      competitors: ['Apple Music', 'YouTube Music', 'Amazon Music', 'Pandora'],
      createdAt: '2008-10-07',
      updatedAt: '2024-01-22',
      starred: true
    },
    {
      id: '3',
      appName: 'Airbnb',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiNGRjVBNUYiLz4KPC9zdmc+',
      genre: ['Travel', 'Hospitality', 'Lifestyle'],
      platform: ['iOS', 'Android', 'Web'],
      appStore: {
        description: 'Find unique places to stay and things to do. Book homes, experiences, and places to go that feel like home anywhere in the world.',
        url: 'https://apps.apple.com/app/airbnb/id401626263',
        appId: '401626263',
        bundleId: 'com.airbnb.app',
        category: 'Travel',
        pricing: 'Free',
        releaseDate: '2010-11-16'
      },
      googlePlay: {
        description: 'Unforgettable trips start with Airbnb. Find adventures nearby or in faraway places and access unique homes, experiences, and places around the world.',
        url: 'https://play.google.com/store/apps/details?id=com.airbnb.android',
        packageName: 'com.airbnb.android',
        category: 'Travel & Local',
        pricing: 'Free',
        releaseDate: '2011-09-20',
        targetSdk: '34'
      },
      targetAudience: {
        ageRange: '25-55',
        demographics: ['Travelers', 'Digital nomads', 'Vacation planners', 'Experience seekers'],
        interests: ['Travel', 'Culture', 'Adventure', 'Local experiences', 'Accommodation']
      },
      brandColors: {
        primary: '#FF5A5F',
        secondary: '#00A699',
        accent: '#FC642D',
        background: '#FFFFFF',
        text: '#484848'
      },
      monetizationModel: ['Commission fees', 'Service fees', 'Host fees'],
      targetMarkets: ['Global', 'North America', 'Europe', 'Asia-Pacific'],
      visualStyle: 'Photography-heavy, warm and welcoming colors, clean layouts, travel-inspired imagery',
      tone: 'Welcoming, adventurous, authentic, community-driven',
      keywords: ['belong', 'unique', 'local', 'experience', 'travel', 'home'],
      competitors: ['Booking.com', 'Expedia', 'VRBO', 'Hotels.com'],
      createdAt: '2008-08-11',
      updatedAt: '2024-01-21',
      starred: false
    },
    {
      id: '4',
      appName: 'Uber',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMwMDAwMDAiLz4KPC9zdmc+',
      genre: ['Transportation', 'Travel', 'Utility'],
      platform: ['iOS', 'Android'],
      appStore: {
        description: 'Uber is the smartest way to get around. One tap and a car comes directly to you. Your driver knows exactly where to go.',
        url: 'https://apps.apple.com/app/uber/id368677368',
        appId: '368677368',
        bundleId: 'com.ubercab.UberClient',
        category: 'Travel',
        pricing: 'Free',
        releaseDate: '2010-05-21'
      },
      googlePlay: {
        description: 'Request a ride on demand or schedule one ahead of time. Choose from multiple ride options to get where you need to go.',
        url: 'https://play.google.com/store/apps/details?id=com.ubercab',
        packageName: 'com.ubercab',
        category: 'Maps & Navigation',
        pricing: 'Free',
        releaseDate: '2010-12-17',
        targetSdk: '34'
      },
      targetAudience: {
        ageRange: '18-65',
        demographics: ['Urban commuters', 'Business travelers', 'City dwellers'],
        interests: ['Transportation', 'Convenience', 'Technology', 'Urban mobility']
      },
      brandColors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#1FBAD3',
        background: '#F7F7F7',
        text: '#000000'
      },
      monetizationModel: ['Commission per ride', 'Surge pricing', 'Delivery fees'],
      targetMarkets: ['Global', 'Urban markets', 'North America', 'Latin America'],
      visualStyle: 'Minimalist black and white design, clean typography, map-focused interface, high contrast',
      tone: 'Reliable, efficient, professional, straightforward',
      keywords: ['ride', 'transportation', 'convenient', 'reliable', 'fast', 'mobility'],
      competitors: ['Lyft', 'Taxi services', 'Public transport apps'],
      createdAt: '2009-03-01',
      updatedAt: '2024-01-19',
      starred: false
    },
    {
      id: '5',
      appName: 'WhatsApp',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMyNUM5NjQiLz4KPC9zdmc+',
      genre: ['Communication', 'Social', 'Messaging'],
      platform: ['iOS', 'Android', 'Web', 'Desktop'],
      appStore: {
        description: 'WhatsApp Messenger is a cross-platform mobile messaging app which allows you to exchange messages without having to pay for SMS.',
        url: 'https://apps.apple.com/app/whatsapp-messenger/id310633997',
        appId: '310633997',
        bundleId: 'net.whatsapp.WhatsApp',
        category: 'Social Networking',
        pricing: 'Free',
        releaseDate: '2009-08-03'
      },
      googlePlay: {
        description: 'WhatsApp from Meta is a fast, simple, secure and reliable messaging and calling app that\'s used by over 2 billion people around the world.',
        url: 'https://play.google.com/store/apps/details?id=com.whatsapp',
        packageName: 'com.whatsapp',
        category: 'Communication',
        pricing: 'Free',
        releaseDate: '2009-08-03',
        targetSdk: '34'
      },
      targetAudience: {
        ageRange: '13-70',
        demographics: ['Global users', 'Families', 'Business users', 'International communicators'],
        interests: ['Communication', 'Staying connected', 'International messaging', 'Group chats']
      },
      brandColors: {
        primary: '#25D366',
        secondary: '#128C7E',
        accent: '#34B7F1',
        background: '#FFFFFF',
        text: '#1F2937'
      },
      monetizationModel: ['Business API', 'WhatsApp Business'],
      targetMarkets: ['Global', 'International messaging', 'Emerging markets'],
      visualStyle: 'Clean green and white interface, simple icons, conversation-focused design, bubble chat layout',
      tone: 'Simple, reliable, secure, accessible',
      keywords: ['message', 'secure', 'simple', 'connect', 'reliable', 'global'],
      competitors: ['Telegram', 'Signal', 'iMessage', 'Facebook Messenger'],
      createdAt: '2009-02-24',
      updatedAt: '2024-01-23',
      starred: true
    },
    {
      id: '6',
      appName: 'Netflix',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiNFNTA5MTQiLz4KPC9zdmc+',
      genre: ['Entertainment', 'Video', 'Streaming'],
      platform: ['iOS', 'Android', 'TV', 'Web'],
      appStore: {
        description: 'Netflix is the leading subscription service for watching TV episodes and movies. Start your free month today.',
        url: 'https://apps.apple.com/app/netflix/id363590051',
        appId: '363590051',
        bundleId: 'com.netflix.Netflix',
        category: 'Entertainment',
        pricing: 'Free',
        releaseDate: '2010-04-01'
      },
      googlePlay: {
        description: 'Looking for the most talked about TV shows and movies from around the world? They\'re all on Netflix. We\'ve got award-winning series, movies, documentaries and stand-up specials.',
        url: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient',
        packageName: 'com.netflix.mediaclient',
        category: 'Entertainment',
        pricing: 'Free',
        releaseDate: '2010-08-26',
        targetSdk: '33'
      },
      targetAudience: {
        ageRange: '16-65',
        demographics: ['Entertainment seekers', 'Families', 'Binge watchers', 'Movie lovers'],
        interests: ['Movies', 'TV shows', 'Documentaries', 'International content', 'Original series']
      },
      brandColors: {
        primary: '#E50914',
        secondary: '#221F1F',
        accent: '#FFFFFF',
        background: '#000000',
        text: '#FFFFFF'
      },
      monetizationModel: ['Monthly subscriptions', 'Premium tiers', 'Mobile plans'],
      targetMarkets: ['Global', 'North America', 'Europe', 'Asia-Pacific', 'Latin America'],
      visualStyle: 'Dark background with red accents, cinematic imagery, content-focused design, poster thumbnails',
      tone: 'Entertaining, bold, cinematic, diverse',
      keywords: ['stream', 'watch', 'entertainment', 'original', 'unlimited', 'anywhere'],
      competitors: ['Disney+', 'Amazon Prime Video', 'HBO Max', 'Hulu', 'Apple TV+'],
      createdAt: '1997-08-29',
      updatedAt: '2024-01-24',
      starred: true
    }
  ]);

  const genres = ['all', 'Card', 'Solitaire', 'Single player', 'Simulation', 'Management', 'Tycoon', 'Casual', 'RPG', 'Health', 'Fitness', 'Fantasy', 'Adventure', 'Lifestyle', 'Wellness', 'Meditation', 'Social', 'Photography', 'Entertainment', 'Music', 'Travel', 'Communication'];

  const filteredBrandbooks = brandbooks.filter(book => {
    const description = book.appStore?.description || book.googlePlay?.description || '';
    const allText = [
      book.appName,
      description,
      ...book.keywords,
      ...book.genre,
      ...book.platform,
      ...book.targetAudience.demographics,
      ...book.targetAudience.interests,
      book.visualStyle,
      book.tone,
      ...book.competitors,
      book.targetAudience.ageRange
    ].join(' ').toLowerCase();
    
    const matchesSearch = searchTerm === '' || allText.includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre.includes(selectedGenre);
    
    return matchesSearch && matchesGenre;
  });

  const toggleStar = (id: string) => {
    setBrandbooks(prev => prev.map(book => 
      book.id === id ? { ...book, starred: !book.starred } : book
    ));
  };

  const openBrandbook = (brandbook: BrandBook) => {
    setSelectedBrandbook(brandbook);
    // Set initial preview tab based on available URLs
    if (brandbook.appStore?.url) {
      setPreviewTab('appstore');
    } else if (brandbook.googlePlay?.url) {
      setPreviewTab('googleplay');
    }
  };


  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Brand Books
            </h1>
            <p className="text-gray-600">Manage brand guidelines and visual identity for your apps</p>
          </div>
          
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search brand books by name, description, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          {/* Filter Tags */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="capitalize">
                  <Tag className="mr-2 h-4 w-4" />
                  {selectedGenre === 'all' ? 'All Genres' : selectedGenre}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {genres.map(genre => (
                  <DropdownMenuItem
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className="capitalize"
                  >
                    {genre === 'all' ? 'All Genres' : genre}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {selectedGenre !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGenre('all')}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>


        {/* Brand Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrandbooks.map(book => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {book.logo && (
                      <img
                        src={book.logo}
                        alt={`${book.appName} logo`}
                        className="w-12 h-12 object-contain rounded-lg border border-gray-200 bg-white"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {book.appName}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStar(book.id)}
                          className="p-1 h-auto"
                        >
                          <Star className={`h-4 w-4 ${book.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {book.appStore?.description || book.googlePlay?.description || ''}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                
                {/* Color Palette */}
                <div className="flex items-center gap-2 mt-3">
                  <Palette className="h-4 w-4 text-gray-500" />
                  <div className="flex gap-1">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: book.brandColors.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: book.brandColors.secondary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: book.brandColors.accent }}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Genres */}
                <div className="flex flex-wrap gap-1">
                  {book.genre.map(genre => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Target Audience */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{book.targetAudience.ageRange} • {book.targetAudience.demographics.join(', ')}</span>
                </div>

                {/* Platforms */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Smartphone className="h-4 w-4" />
                  <span>{book.platform.join(', ')}</span>
                </div>

                {/* Store Links */}
                {(book.appStore?.url || book.googlePlay?.url) && (
                  <div className="flex items-center gap-2">
                    {book.appStore?.url && (
                      <a
                        href={book.appStore.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        App Store
                      </a>
                    )}
                    {book.googlePlay?.url && (
                      <a
                        href={book.googlePlay.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Google Play
                      </a>
                    )}
                  </div>
                )}

                {/* Updated Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {new Date(book.updatedAt).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openBrandbook(book)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBrandbooks.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brand books found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedGenre !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Browse existing brand books above'
              }
            </p>
          </div>
        )}

        {/* Brandbook Preview Modal */}
        {selectedBrandbook && (
          <Dialog open={!!selectedBrandbook} onOpenChange={() => setSelectedBrandbook(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedBrandbook.appName} Brandbook</DialogTitle>
              </DialogHeader>
              {/* Header */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-3">
                  {selectedBrandbook.logo && (
                    <img
                      src={selectedBrandbook.logo}
                      alt={`${selectedBrandbook.appName} logo`}
                      className="w-12 h-12 rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <h1 className="text-lg font-bold">{selectedBrandbook.appName}</h1>
                    <div className="text-sm text-gray-500">
                      {selectedBrandbook.googlePlay?.category || selectedBrandbook.appStore?.category}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>★ 4.3</span>
                      <span>•</span>
                      <span>144K reviews</span>
                      <span>•</span>
                      <span>10M+ downloads</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Links */}
              <div className="px-2 py-1 border-b">
                <div className="grid grid-cols-1 gap-1">
                  {selectedBrandbook.appStore?.url && (
                    <a
                      href={selectedBrandbook.appStore.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
                    >
                      <span>🍎</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">App Store</div>
                        <div className="text-xs text-gray-500">iOS • {selectedBrandbook.appStore.pricing}</div>
                      </div>
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </a>
                  )}
                  {selectedBrandbook.googlePlay?.url && (
                    <a
                      href={selectedBrandbook.googlePlay.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
                    >
                      <span>🤖</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Google Play</div>
                        <div className="text-xs text-gray-500">Android • {selectedBrandbook.googlePlay.pricing}</div>
                      </div>
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </a>
                  )}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[65vh] p-3 space-y-3">
                
                {/* Screenshots */}
                {selectedBrandbook.screenshots && selectedBrandbook.screenshots.length > 0 && (
                  <div className="border rounded p-2">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedBrandbook.screenshots.map((screenshot, index) => (
                        <img
                          key={index}
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="h-24 object-contain rounded border cursor-pointer flex-shrink-0"
                          onClick={() => window.open(screenshot, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating & Description in one row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="border rounded p-2 text-center">
                    <div className="text-lg font-bold">4.3</div>
                    <div className="text-yellow-500 text-xs">★★★★☆</div>
                    <div className="text-xs text-gray-500">144K ratings</div>
                  </div>
                  <div className="col-span-2 border rounded p-2">
                    <div className="font-medium text-sm mb-1">About</div>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {selectedBrandbook.googlePlay?.description || selectedBrandbook.appStore?.description}
                    </p>
                  </div>
                </div>

                {/* App Info */}
                <div className="border rounded p-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updated</span>
                      <span>{new Date(selectedBrandbook.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size</span>
                      <span>150 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Installs</span>
                      <span>10M+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age</span>
                      <span>{selectedBrandbook.targetAudience.ageRange}</span>
                    </div>
                  </div>
                </div>

                {/* Brand Colors */}
                <div className="border rounded p-2">
                  <div className="font-medium text-sm mb-1">Brand Colors</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Primary', color: selectedBrandbook.brandColors.primary },
                      { name: 'Secondary', color: selectedBrandbook.brandColors.secondary },
                      { name: 'Accent', color: selectedBrandbook.brandColors.accent },
                      { name: 'Background', color: selectedBrandbook.brandColors.background },
                      { name: 'Text', color: selectedBrandbook.brandColors.text }
                    ].map(({ name, color }) => (
                      <div key={name} className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded border flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{name}</div>
                          <div className="text-xs text-gray-400 font-mono truncate">{color}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monetization Model & Target Markets */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded p-2">
                    <div className="font-medium text-sm mb-1">Monetization Model</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedBrandbook.monetizationModel.map(model => (
                        <Badge key={model} variant="secondary" className="text-xs px-2 py-0 bg-green-100 text-green-800">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border rounded p-2">
                    <div className="font-medium text-sm mb-1">Target Markets</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedBrandbook.targetMarkets.map(market => (
                        <Badge key={market} variant="outline" className="text-xs px-2 py-0">
                          {market}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Categories & Demographics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded p-2">
                    <div className="font-medium text-sm mb-1">Categories</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedBrandbook.genre.slice(0, 4).map(genre => (
                        <Badge key={genre} variant="secondary" className="text-xs px-2 py-0">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border rounded p-2">
                    <div className="font-medium text-sm mb-1">Demographics</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedBrandbook.targetAudience.demographics.slice(0, 3).map(demo => (
                        <Badge key={demo} variant="outline" className="text-xs px-2 py-0">
                          {demo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Brand Style & Keywords */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded p-2">
                    <div className="font-medium text-sm mb-1">Visual Style</div>
                    <p className="text-xs text-gray-600 line-clamp-2">{selectedBrandbook.visualStyle}</p>
                  </div>
                  <div className="border rounded p-2">
                    <div className="font-medium text-sm mb-1">Brand Tone</div>
                    <p className="text-xs text-gray-600">{selectedBrandbook.tone}</p>
                  </div>
                </div>

                {/* Keywords */}
                <div className="border rounded p-2">
                  <div className="font-medium text-sm mb-1">Keywords</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedBrandbook.keywords.map(keyword => (
                      <Badge key={keyword} className="text-xs px-2 py-0 bg-blue-100 text-blue-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Similar Apps */}
                <div className="border rounded p-2">
                  <div className="font-medium text-sm mb-1">Competitors</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedBrandbook.competitors.map(competitor => (
                      <span key={competitor} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {competitor}
                      </span>
                    ))}
                  </div>
                </div>


              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}